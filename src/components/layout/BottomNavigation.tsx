import { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Plus, User, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AuthContext } from '@/context/AuthContext';
import { motion } from 'framer-motion';

export default function BottomNavigation() {
  const location = useLocation();
  const { isAuthenticated, user } = useContext(AuthContext);

  const NavItem = ({ to, icon, label, requireAuth = false }: { 
    to: string; 
    icon: JSX.Element; 
    label: string;
    requireAuth?: boolean;
  }) => {
    const isActive = location.pathname === to;
    
    // Если элемент требует аутентификации и пользователь не аутентифицирован, не показывать его
    if (requireAuth && !isAuthenticated) return null;
    
    return (
      <Link to={to} className={cn(
        "flex flex-col items-center justify-center",
        "w-full py-1 text-xs mb-3",
        isActive ? "text-primary" : "text-muted-foreground"
      )}>
        <motion.div
          whileTap={{ scale: 0.9 }}
          className={cn(
            "flex items-center justify-center rounded-full p-1",
            isActive && "bg-primary/10"
          )}
        >
          {icon}
        </motion.div>
        <span className="mt-0.5">{label}</span>
        {isActive && (
          <motion.div
            layoutId="bottomNavIndicator"
            className="absolute bottom-1 bg-primary"
          />
        )}
      </Link>
    );
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border h-16 z-10">
      <div className="h-full flex items-center justify-around max-w-md mx-auto">
        <NavItem
          to="/"
          icon={<Home className="h-5 w-5" />}
          label="Главная"
          requireAuth
        />
        
        <NavItem
          to="/new-listing"
          icon={<Plus className="h-5 w-5" />}
          label="Продать"
          requireAuth
        />
        
        <NavItem
          to="/subscribe"
          icon={<Tag className="h-5 w-5" />}
          label="Подписка"
          requireAuth
        />
        
        {isAuthenticated && user ? (
          <NavItem
            to={`/seller/${user.id}`}
            icon={<User className="h-5 w-5" />}
            label="Профиль"
          />
        ) : (
          <NavItem
            to="/register"
            icon={<User className="h-5 w-5" />}
            label="Регистрация"
          />
        )}
      </div>
    </div>
  );
}