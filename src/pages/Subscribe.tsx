// import { useState, useContext, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import SubscriptionPlan from '@/components/subscription/SubscriptionPlan';
// import { Button } from '@/components/ui/button';
// import { AuthContext } from '@/context/AuthContext';
// import { SubscriptionPlan as PlanType } from '@/types';
// import { useToast } from '@/hooks/use-toast';
// import { addMonths } from 'date-fns';
// import { AlertCircle, CheckCircle, Timer } from 'lucide-react';
// import { 
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from '@/components/ui/alert-dialog';
// import { Progress } from '@/components/ui/progress';
// import { getDaysRemaining } from '@/lib/utils';
// import { getTariffs } from '@/api/auth';
// import PaymentButton from '@/components/subscription/PaymentButton';

// export default function SubscribePage() {
//   const { user, isAuthenticated, updateUser } = useContext(AuthContext);
//   const { toast } = useToast();
//   const navigate = useNavigate();
  
//   const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
//   const [paymentOpen, setPaymentOpen] = useState(false);
//   const [paymentProgress, setPaymentProgress] = useState(0);
//   const [paymentSuccess, setPaymentSuccess] = useState(false);
  
//   // Состояния для API тарифов
//   const [apiTariffs, setApiTariffs] = useState<any[]>([]);
//   const [tarifsLoading, setTarifsLoading] = useState(false);
//   const [tarifsError, setTarifsError] = useState<string | null>(null);
//   const [debugInfo, setDebugInfo] = useState<string[]>([]);
  
//   // Функция для добавления отладочной информации
//   const addDebugInfo = (info: string) => {
//     setDebugInfo(prev => [...prev, `${new Date().toLocaleTimeString()}: ${info}`]);
//   };
  
//   // Загрузка тарифов с API
//   const loadTariffs = async () => {
//     setTarifsLoading(true);
//     setTarifsError(null);
//     addDebugInfo('Начинаем загрузку тарифов...');
    
//     const accessToken = localStorage.getItem('access_token');
//     addDebugInfo(`Access token: ${accessToken ? 'найден' : 'НЕ найден'}`);
    
//     try {
//       addDebugInfo('Отправляем запрос к API...');
//       const response = await getTariffs();
//       addDebugInfo('Ответ получен успешно');
//       setApiTariffs(response);
//       addDebugInfo(`Количество тарифов: ${Array.isArray(response) ? response.length : 'не массив'}`);
//     } catch (error) {
//       const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
//       setTarifsError(errorMessage);
//       addDebugInfo(`Ошибка: ${errorMessage}`);
//     } finally {
//       setTarifsLoading(false);
//       addDebugInfo('Загрузка завершена');
//     }
//   };
  
//   // Перенаправление на регистрацию, если пользователь не авторизован
//   useEffect(() => {
//     if (!isAuthenticated) {
//       toast({
//         title: "Требуется авторизация",
//         description: "Для оформления подписки необходимо войти в систему.",
//         variant: "destructive",
//       });
//       navigate('/register');
//       return;
//     }
    
//     addDebugInfo('Компонент загружен, пользователь авторизован');
//     loadTariffs();
//   }, [isAuthenticated, navigate, toast]);
  
//   // Получаем оставшиеся дни текущей подписки
//   const daysRemaining = user?.subscriptionEnd ? getDaysRemaining(user.subscriptionEnd) : 0;
  
//   const handleSelectPlan = (planId: string) => {
//     setSelectedPlan(planId);
//     addDebugInfo(`Выбран план: ${planId}`);
//   };
  
//   const handleSubscribe = () => {
//     if (!selectedPlan) {
//       toast({
//         title: "План не выбран",
//         description: "Пожалуйста, выберите тарифный план.",
//         variant: "destructive",
//       });
//       return;
//     }
    
//     setPaymentOpen(true);
//     simulatePayment();
//   };
  
//   const simulatePayment = () => {
//     const interval = setInterval(() => {
//       setPaymentProgress(prev => {
//         const newProgress = prev + 5;
//         if (newProgress >= 100) {
//           clearInterval(interval);
//           setTimeout(() => {
//             setPaymentSuccess(true);
//           }, 500);
//           return 100;
//         }
//         return newProgress;
//       });
//     }, 150);
//   };
  
//   const completeSubscription = () => {
//     if (!selectedPlan || !user) return;
    
//     const plan = apiTariffs.find(p => p.id.toString() === selectedPlan);
//     if (!plan) return;
    
//     // Рассчитываем новую дату окончания подписки на основе duration
//     const monthsToAdd = plan.duration;
//     const now = new Date();
//     const baseDate = (user.subscriptionEnd && getDaysRemaining(user.subscriptionEnd) > 0) 
//       ? user.subscriptionEnd 
//       : now;
      
//     const newEndDate = addMonths(baseDate, monthsToAdd);
    
//     updateUser({
//       subscriptionEnd: newEndDate,
//       subscriptionPlan: `${plan.duration} month${plan.duration > 1 ? 's' : ''}` as PlanType,
//     });
    
//     toast({
//       title: "Подписка оформлена",
//       description: `Вы успешно подключили тариф на ${plan.duration} месяц${plan.duration > 1 ? 'а' : ''}.`,
//     });
    
//     setPaymentOpen(false);
//     setPaymentSuccess(false);
//     setPaymentProgress(0);
    
//     navigate('/');
//   };

//   // Преобразование тарифов из API в формат, подходящий для SubscriptionPlan
//   const formattedTariffs = apiTariffs.map(plan => ({
//     id: plan.id.toString(),
//     name: `${plan.duration} месяц${plan.duration > 1 ? 'а' : ''}` as PlanType,
//     price: plan.price,
//     description: plan.description || `Тариф на ${plan.duration} месяц${plan.duration > 1 ? 'а' : ''}`,
//     features: [
//       plan.listing_limit ? `Лимит объявлений: ${plan.listing_limit}` : 'Без лимита объявлений',
//       plan.enhanced_profile ? 'Расширенный профиль' : 'Базовый профиль',
//       plan.priority_support ? 'Приоритетная поддержка' : 'Стандартная поддержка',
//       plan.featured_listings ? 'Выделенные объявления' : 'Стандартные объявления',
//     ],
//   }));

//   return (
//     <div className="max-w-lg mx-auto py-4">

      
//       <div className="text-center mb-8">
//         <h1 className="text-2xl font-bold mb-2">Выберите тарифный план</h1>
//         <p className="text-muted-foreground">
//           Подписка позволит вам продавать свои товары на нашей платформе
//         </p>
        
//         {user?.subscriptionEnd && daysRemaining > 0 && (
//           <div className="mt-4 p-3 bg-secondary rounded-lg flex items-center gap-2">
//             <Timer className="h-5 w-5 text-primary" />
//             <span className="text-sm">
//               У вас осталось <span className="font-semibold">{daysRemaining} дней</span> по тарифу "{user.subscriptionPlan}"
//             </span>
//           </div>
//         )}
//       </div>
      
//       <div className="space-y-4">
//         {tarifsLoading ? (
//           <div className="text-center">Загрузка тарифов...</div>
//         ) : tarifsError ? (
//           <div className="text-center text-red-600">Ошибка загрузки тарифов: {tarifsError}</div>
//         ) : apiTariffs.length === 0 ? (
//           <div className="text-center">Тарифы не найдены</div>
//         ) : (
//           formattedTariffs.map((plan) => (
//             <SubscriptionPlan
//               key={plan.id}
//               plan={plan}
//               isSelected={selectedPlan === plan.id}
//               onSelect={() => handleSelectPlan(plan.id)}
//             />
//           ))
//         )}
//       </div>
      
//       {/* <Button
//         className="w-full mt-6"
//         disabled={!selectedPlan || tarifsLoading || !!tarifsError}
//         onClick={handleSubscribe}
//       >
//         Оформить подписку
//       </Button> */}

//       <PaymentButton />
      
//       <AlertDialog open={paymentOpen} onOpenChange={setPaymentOpen}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             {paymentSuccess ? (
//               <div className="text-center mb-4">
//                 <div className="flex justify-center mb-2">
//                   <CheckCircle className="h-16 w-16 text-success" />
//                 </div>
//                 <AlertDialogTitle>Оплата прошла успешно!</AlertDialogTitle>
//                 <AlertDialogDescription>
//                   Ваша подписка активирована. Теперь вы можете размещать свои товары.
//                 </AlertDialogDescription>
//               </div>
//             ) : (
//               <>
//                 <AlertDialogTitle>Обработка платежа</AlertDialogTitle>
//                 <AlertDialogDescription>
//                   Пожалуйста, подождите, пока мы обрабатываем ваш платеж...
//                 </AlertDialogDescription>
//                 <div className="my-4">
//                   <Progress value={paymentProgress} className="h-2" />
//                 </div>
//                 <div className="text-center text-sm text-muted-foreground">
//                   <AlertCircle className="inline-block h-4 w-4 mr-1" />
//                   Это имитация платежа для демонстрации
//                 </div>
//               </>
//             )}
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             {paymentSuccess ? (
//               <AlertDialogAction onClick={completeSubscription}>
//                 Продолжить
//               </AlertDialogAction>
//             ) : (
//               <Button variant="outline" disabled>Отмена</Button>
//             )}
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </div>
//   );
// }


import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SubscriptionPlan from '@/components/subscription/SubscriptionPlan';
import { AuthContext } from '@/context/AuthContext';
import { SubscriptionPlan as PlanType } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { addMonths } from 'date-fns';
import { Timer } from 'lucide-react';
import { getDaysRemaining } from '@/lib/utils';
import { getTariffs } from '@/api/auth';
import PaymentButton from '@/components/subscription/PaymentButton';

export default function SubscribePage() {
  const { user, isAuthenticated, updateUser } = useContext(AuthContext);
  const { toast } = useToast();
  const navigate = useNavigate();

  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [apiTariffs, setApiTariffs] = useState<any[]>([]);
  const [tarifsLoading, setTarifsLoading] = useState(false);
  const [tarifsError, setTarifsError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  const [tariffs, setTariffs] = useState<Tariff[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Функция для добавления отладочной информации
  const addDebugInfo = (info: string) => {
    setDebugInfo(prev => [...prev, `${new Date().toLocaleTimeString()}: ${info}`]);
  };

  // Загрузка тарифов с API
  const loadTariffs = async () => {
    setTarifsLoading(true);
    setTarifsError(null);
    addDebugInfo('Начинаем загрузку тарифов...');

    const accessToken = localStorage.getItem('access_token');
    addDebugInfo(`Access token: ${accessToken ? 'найден' : 'НЕ найден'}`);

    try {
      addDebugInfo('Отправляем запрос к API...');
      const response = await getTariffs();
      addDebugInfo('Ответ получен успешно');
      setApiTariffs(response);
      addDebugInfo(`Количество тарифов: ${Array.isArray(response) ? response.length : 'не массив'}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
      setTarifsError(errorMessage);
      addDebugInfo(`Ошибка: ${errorMessage}`);
    } finally {
      setTarifsLoading(false);
      addDebugInfo('Загрузка завершена');
    }
  };

  // Перенаправление на регистрацию, если пользователь не авторизован
  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Требуется авторизация",
        description: "Для оформления подписки необходимо войти в систему.",
        variant: "destructive",
      });
      navigate('/register');
      return;
    }

    const fetchTariffs = async () => {
      setLoading(true);
      try {
        const data = await getTariffs();
        setTariffs(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
      } finally {
        setLoading(false);
      }
    };

    fetchTariffs();
  }, [isAuthenticated, navigate, toast]);

  // Оставшиеся дни подписки
  const daysRemaining = user?.subscriptionEnd ? getDaysRemaining(user.subscriptionEnd) : 0;

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
  };

  const completeSubscription = (tariff: Tariff) => {
    if (!user) return;

    // Рассчитываем новую дату окончания подписки
    const now = new Date();
    const baseDate = user.subscriptionEnd && daysRemaining > 0 ? user.subscriptionEnd : now;
    const newEndDate = addMonths(baseDate, tariff.duration);

    // Обновляем пользователя
    updateUser({
      tariff, // Сохраняем весь объект тарифа
      subscriptionEnd: newEndDate,
    });

    toast({
      title: "Подписка оформлена",
      description: `Вы успешно подключили тариф "${tariff.name}".`,
    });

    // navigate('/');
  };


  // Преобразование тарифов из API в формат, подходящий для SubscriptionPlan
 

  return (
    <div className="max-w-lg mx-auto py-4">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">Выберите тарифный план</h1>
        <p className="text-muted-foreground">
          Подписка позволит вам продавать свои товары на нашей платформе
        </p>

        {user?.tariff && daysRemaining > 0 && (
          <div className="mt-4 p-3 bg-secondary rounded-lg flex items-center gap-2">
            <Timer className="h-5 w-5 text-primary" />
            <span className="text-sm">
              У вас активен тариф "{user.tariff.name}" ({daysRemaining} дней осталось)
            </span>
          </div>
        )}
      </div>

      {loading && <div className="text-center">Загрузка тарифов...</div>}
      {error && <div className="text-center text-red-600">{error}</div>}

      <div className="space-y-4">
        {tariffs.map((tariff) => (
          <SubscriptionPlan
            key={tariff.id}
            plan={{
              id: tariff.id.toString(),
              name: tariff.name,
              price: tariff.price,
              //@ts-expect-error скоро исправим
              duration: tariff.duration,
              description: tariff.description,
              features: [
                tariff.listing_limit > 2000
                ? 'Безлимит товаров'
                : `Лимит объявлений: ${tariff.listing_limit}`,
                ...(tariff.enhanced_profile ? ['Расширенный профиль'] : ['Базовый профиль']),
                ...(tariff.priority_support ? ['Приоритетная поддержка'] : []),
                ...(tariff.featured_listings ? ['Выделенные объявления'] : []),
              ],
            }}
            isSelected={selectedPlan === tariff.id.toString()}
            onSelect={() => handleSelectPlan(tariff.id.toString())}
          />
        ))}
      </div>

      {selectedPlan && (
        <div className="mt-6">
          <PaymentButton
            tariffId={Number(selectedPlan)}
            buttonText="Оформить подписку"
            onSuccess={() => {
              const selectedTariff = tariffs.find(t => t.id.toString() === selectedPlan);
              if (selectedTariff) completeSubscription(selectedTariff);
            }}
          />
        </div>
      )}
    </div>
  );
}