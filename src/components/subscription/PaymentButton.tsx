import React, { useState, useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '../ui/button';

// Типы для данных от API
interface PaymentResponse {
  confirmation_token: string;
  payment_id: string;
}

interface PaymentStatusResponse {
  status: string;
}

interface PaymentButtonProps {
  tariffId: number;
  buttonText: string;
  onSuccess: () => void;
}

// Объявление глобального типа для YooKassa
declare global {
  interface Window {
    YooMoneyCheckoutWidget: new (config: {
      confirmation_token: string;
      return_url: string;
      error_callback: (error: { message: string }) => void;
      success_callback: () => void;
    }) => { render: (containerId: string) => void; destroy: () => void };
  }
}

const PaymentButton: React.FC<PaymentButtonProps> = ({ tariffId, buttonText, onSuccess }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const { toast } = useToast();
  const checkoutRef = useRef<any>(null);

  const startPayment = async () => {
    setIsLoading(true);
    setError(null);
    setIsDialogOpen(true); // Открываем модалку до загрузки

    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      showError('Токен авторизации не найден');
      return;
    }

    try {
      const response = await fetch('https://shop2.ibosh-dev.uz/api/auth/create/yookassa/payment/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ tariff_id: tariffId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Noma'lum xatolik");
      }

      const data: PaymentResponse = await response.json();
      const { confirmation_token, payment_id } = data;
      setPaymentId(payment_id);

      const checkout = new window.YooMoneyCheckoutWidget({
        confirmation_token,
        error_callback: (e) => {
          console.error('YooKassa ошибка:', e);
          showError(`Xatolik: ${e.message}`);
        },
        success_callback: async () => {
          console.log('Успешный платёж:', payment_id);
          await checkPaymentStatus(payment_id);
          setTimeout(() => setIsDialogOpen(false), 3000);
        },
      });

      checkoutRef.current = checkout;
      setTimeout(() => {
        checkout.render('card-container');
      }, 1000);
    } catch (err) {
      showError((err as Error).message);
    }
  };

  const checkPaymentStatus = async (payment_id: string) => {
    setIsLoading(true);

    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      showError('Токен авторизации не найден');
      return;
    }

    try {
      const response = await fetch('https://shop2.ibosh-dev.uz/api/auth/check/payment/status/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ payment_id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "To‘lov holatini tekshirishda xatolik yuz berdi");
      }

      const result: PaymentStatusResponse = await response.json();

      if (['succeeded', 'success'].includes(result.status.toLowerCase())) {
        console.log('✅ Платёж прошёл успешно, вызываем onSuccess()');
        toast({ title: 'Успех', description: 'Оплата прошла!' });
        setPaymentId(null);
        onSuccess(); // ← здесь!
        if (checkoutRef.current) checkoutRef.current.destroy();
      } else if (result.status.toLowerCase() !== 'pending') {
        showError(`To‘lov holati: ${result.status}`);
      }
    } catch (err) {
      showError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const showError = (message: string) => {
    console.error('Ошибка:', message);
    setError(message);
    toast({
      title: 'Ошибка',
      description: message,
      variant: 'destructive',
    });
    setIsLoading(false);
    setIsDialogOpen(false);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (paymentId) {
      interval = setInterval(() => {
        checkPaymentStatus(paymentId);
      }, 5000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [paymentId]);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={startPayment}
          disabled={isLoading}
         className="w-full"
        >
          {isLoading ? 'Оплата...' : buttonText}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-xl w-full">
        <DialogHeader>
          <DialogTitle>Оплата через YooKassa</DialogTitle>
          <DialogDescription>Пожалуйста, завершите оплату в открывшемся окне.</DialogDescription>
        </DialogHeader>

        {error && <p className="text-red-600">{error}</p>}
        <div id="card-container" className="mt-4 w-full" />
      </DialogContent>
    </Dialog>
  );
};

export default PaymentButton;
