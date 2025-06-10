// import { createContext, useState, useEffect, ReactNode } from 'react';
// import { User, AuthContextType } from '@/types';
// import { mockUsers } from '@/mock/data';
// import { v4 as uuidv4 } from '@/lib/utils';
// import TelegramWebApp from '@twa-dev/sdk';

// const defaultAuthContext: AuthContextType = {
//   user: null,
//   login: () => {},
//   logout: () => {},
//   isAuthenticated: false,
//   updateUser: () => {},
// };

// export const AuthContext = createContext<AuthContextType>(defaultAuthContext);

// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   useEffect(() => {
//     // Инициализация Telegram Web App и получение initData
//     TelegramWebApp.ready();
//     const initData = TelegramWebApp.initData;

//     // Вывод initData в консоль
//     console.log('Telegram initData:', initData);

//     // Если initData есть, можно извлечь данные пользователя
//     if (initData) {
//       const initDataUnsafe = TelegramWebApp.initDataUnsafe;
//       console.log('initDataUnsafe:', initDataUnsafe);

//       // Пример: можно автоматически авторизовать пользователя на основе initData
//       // Это опционально, зависит от вашей логики
//       if (initDataUnsafe.user) {
//         const telegramUser = initDataUnsafe.user;
//         const potentialUser: Omit<User, 'id'> = {
//           name: telegramUser.first_name || 'Telegram User',
//           location: 'Не указан',
//           phone: 'Не указан',
//           isVerified: false,
//           avatarUrl: telegramUser.photo_url || `https://i.pravatar.cc/300?u=${Date.now()}`,
//           telegramUsername: telegramUser.username || `user_${Date.now()}`,
//         };

//         // Проверяем, есть ли пользователь в mockUsers или localStorage
//         const storedUser = localStorage.getItem('user');
//         if (storedUser) {
//           try {
//             const parsedUser = JSON.parse(storedUser);
//             if (parsedUser.subscriptionEnd) {
//               parsedUser.subscriptionEnd = new Date(parsedUser.subscriptionEnd);
//             }
//             setUser(parsedUser);
//             setIsAuthenticated(true);
//           } catch (error) {
//             console.error('Failed to parse stored user:', error);
//             localStorage.removeItem('user');
//           }
//         } else {
//           // Если пользователя нет, можно автоматически "зарегистрировать" его
//           login(potentialUser);
//         }
//       }
//     }
//   }, []);

//   const login = (userData: Omit<User, 'id'>) => {
//     const existingUser = mockUsers.find(u => u.phone === userData.phone);

//     if (existingUser) {
//       setUser(existingUser);
//       setIsAuthenticated(true);
//       localStorage.setItem('user', JSON.stringify(existingUser));
//     } else {
//       const newUser: User = {
//         id: uuidv4(),
//         ...userData,
//       };
//       setUser(newUser);
//       setIsAuthenticated(true);
//       localStorage.setItem('user', JSON.stringify(newUser));
//     }
//   };

//   const logout = () => {
//     setUser(null);
//     setIsAuthenticated(false);
//     localStorage.removeItem('user');
//   };

//   const updateUser = (userData: Partial<User>) => {
//     if (user) {
//       const updatedUser = { ...user, ...userData };
//       setUser(updatedUser);
//       localStorage.setItem('user', JSON.stringify(updatedUser));
//     }
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout, isAuthenticated, updateUser }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

import { createContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from '@/types';
import { mockUsers } from '@/mock/data';
import { v4 as uuidv4 } from '@/lib/utils';
import TelegramWebApp from '@twa-dev/sdk';

const defaultAuthContext: AuthContextType = {
  user: null,
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
  updateUser: () => {},
};

export const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Инициализация Telegram Web App и получение initData только для отладки
    TelegramWebApp.ready();
    const initData = TelegramWebApp.initData;
    console.log('Telegram initData:', initData);

    // Проверяем сохранённого пользователя из localStorage при загрузке
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.subscriptionEnd) {
          parsedUser.subscriptionEnd = new Date(parsedUser.subscriptionEnd);
        }
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = (userData: Omit<User, 'id'>) => {
    const existingUser = mockUsers.find(u => u.phone === userData.phone);

    if (existingUser) {
      setUser(existingUser);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(existingUser));
    } else {
      const newUser: User = {
        id: uuidv4(),
        ...userData,
      };
      setUser(newUser);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(newUser));
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};