import { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AuthContext } from '@/context/AuthContext';
import { motion } from 'framer-motion';

export default function Header() {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
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
            {showBackButton ? (
              <Link to="/\" className="mr-3">
                <Button variant="ghost\" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
            ) : null}
            <motion.h1
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-lg font-semibold"
            >
              {getPageTitle()}
            </motion.h1>
          </div>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex flex-col h-full">
                <div className="py-6">
                  {isAuthenticated && user ? (
                    <div className="flex items-center space-x-4 mb-6">
                      <Avatar>
                        <AvatarImage src={user.avatarUrl} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{user.name}</h3>
                        <p className="text-sm text-muted-foreground">{user.location}</p>
                        {user.isVerified && (
                          <span className="verified-badge text-xs">Проверенный продавец</span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <Link to="/register" className="block mb-6">
                      <Button className="w-full">Зарегистрироваться как продавец</Button>
                    </Link>
                  )}
                  
                  <nav className="space-y-2">
                    <Link to="/" className="block py-2 px-3 rounded-md hover:bg-secondary">
                      Главная
                    </Link>
                    {isAuthenticated && (
                      <>
                        <Link to="/new-listing" className="block py-2 px-3 rounded-md hover:bg-secondary">
                          Добавить объявление
                        </Link>
                        <Link to="/subscribe" className="block py-2 px-3 rounded-md hover:bg-secondary">
                          Тарифные планы
                        </Link>
                      </>
                    )}
                    {isAuthenticated && user?.isAdmin && (
                      <Link to="/admin" className="block py-2 px-3 rounded-md hover:bg-secondary">
                        Админ-панель
                      </Link>
                    )}
                  </nav>
                </div>
                
                <div className="mt-auto pb-6">
                  {isAuthenticated ? (
                    <Button variant="destructive\" onClick={logout} className="w-full">
                      Выйти
                    </Button>
                  ) : (
                    <Link to="/register">
                      <Button className="w-full">Войти</Button>
                    </Link>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}