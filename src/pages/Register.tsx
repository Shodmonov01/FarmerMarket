import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AuthContext } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import TelegramWebApp from '@twa-dev/sdk';
import { authTelegram, getProfile } from '@/api/auth';

// Тип для данных пользователя
interface User {
  name: string;
  location: string;
  phone: string;
  isVerified: boolean;
  avatarUrl: string;
  telegramUsername: string;
  id?: number;
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [initData, setInitData] = useState<string | null>(null);

  // Инициализация Telegram Web App и получение initData
  useEffect(() => {
    TelegramWebApp.ready();
    const currentInitData = TelegramWebApp.initData;
    console.log('Telegram initData:', currentInitData || 'initData is empty or undefined');
    setInitData(currentInitData || null);
    TelegramWebApp.expand();
  }, []);

  const handleTelegramLogin = async () => {
    if (!initData) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось получить данные Telegram',
        variant: 'destructive',
      });
      return;
    }
  
    setLoading(true);
  
    try {
      const response = await authTelegram(initData);
      console.log('Full response:', response); // Для отладки
  
      // Проверяем структуру ответа
      const { access_token, refresh_token } = response || {};
      if (!access_token || !refresh_token) {
        throw new Error('Токены не найдены в ответе сервера');
      }
  
      // Сохраняем токены в localStorage
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
  
      // Получаем данные профиля
      const profileResponse = await getProfile();
      const userData = profileResponse;
  
      const user: User = {
        id: userData?.id,
        telegramId: userData?.telegram_id, // Сохраняем telegram_id
        name: userData?.first_name || 'Пользователь Telegram', // Используем first_name
        telegramUsername: userData?.username || `user_${Date.now()}`, // Используем username
        avatarUrl: userData?.avatar_url || `https://i.pravatar.cc/300?u=${Date.now()}`, // Используем avatar
        location: userData?.location || 'Не указан', // Если location null, используем дефолт
        phone: userData?.phone_number || 'Не указан', // Если phone_number null, используем дефолт
        isVerified: userData?.verified || false, // Используем verified
      };
  
      login(user);
  
      toast({
        title: 'Успешная регистрация',
        description: 'Добро пожаловать на Фермерский рынок! Теперь вы можете продавать свои товары.',
      });
  
      navigate('/');
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: error instanceof Error ? error.message : 'Не удалось авторизоваться',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="flex justify-center mb-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src="https://images.pexels.com/photos/2084611/pexels-photo-2084611.jpeg" />
            <AvatarFallback>ФР</AvatarFallback>
          </Avatar>
        </div>
        <h1 className="text-2xl font-bold mb-2">Фермерский рынок</h1>
        <p className="text-muted-foreground">
          Войдите через Telegram, чтобы начать продавать свои товары
        </p>
      </motion.div>

      <Button
        onClick={handleTelegramLogin}
        className="w-full"
        disabled={loading}
      >
        {loading ? 'Обработка...' : 'Войти через Telegram'}
      </Button>

      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          Входя, вы соглашаетесь с нашими Условиями использования и Политикой конфиденциальности
        </p>
      </div>
    </div>
  );
}