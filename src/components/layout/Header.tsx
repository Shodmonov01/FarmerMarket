import { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, LogIn, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { AuthContext } from '@/context/AuthContext';
import { motion } from 'framer-motion';

export default function Header() {
  const { isAuthenticated,  logout } = useContext(AuthContext);
  const location = useLocation();

  // Определяем, нужно ли показывать кнопку "Назад" на основе текущего маршрута
  const showBackButton = location.pathname !== '/';
  
  // Получаем заголовок страницы на основе маршрута
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Фермерский рынок';
      case '/register':
        return 'Регистрация';
      case '/subscribe':
        return 'Тарифные планы';
      case '/new-listing':
        return 'Новое объявление';
      case '/admin':
        return 'Панель администратора';
      default:
        if (location.pathname.startsWith('/seller/')) {
          return 'Профиль продавца';
        }
        return 'Фермерский рынок';
    }
  };

  return (
    <header className="sticky top-0 z-10 bg-background border-b border-border">
      <div className="telegram-container">
        <div className="flex items-center justify-between h-14" >
          <div className="flex items-center">
            {/* {showBackButton ? (
              <Link to="/\" className="mr-3">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
            ) : null} */}
            <motion.h1
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-lg font-semibold"
            >
              {getPageTitle()}
            </motion.h1>

          </div>
          <div className="mr-1">
  {isAuthenticated ? (
    <Button 
      variant="destructive" 
      onClick={logout} 
      className="w-full gap-2"
    >
      <LogOut className="h-4 w-4" />
      Выйти
    </Button>
  ) : (
    <Link to="/register">
      <Button className="w-full gap-2">
        <LogIn className="h-4 w-4" />
        Войти
      </Button>
    </Link>
  )}
</div>
          
       
        </div>
      </div>
    </header>
  );
}