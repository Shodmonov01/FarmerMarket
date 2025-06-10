import apiRequest from ".";


// Типы для данных пользователя
interface User {
  id: number;
  first_name: string;
  username?: string;
  avatarUrl?: string;
  isVerified?: boolean;
  location?: string;
  phone?: string;
}

// Эндпоинт для авторизации через Telegram
export const authTelegram = async (initData: string) => {
  return apiRequest<User>('/api/auth/auth/telegram/', 'POST', {
    body: { initData },
  });
};

// Получение профиля
// export const getProfile = async () => {
//   return apiRequest<User>('/api/auth/profile/', 'GET');
// };

// Получение профиля
export const getProfile = async () => {
  const accessToken = localStorage.getItem('access_token');
  if (!accessToken) {
    throw new Error('Access token not found in localStorage');
  }

  return apiRequest<User>('/api/auth/profile/', 'GET', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

// Обновление профиля
export const updateProfile = async (profileData: Partial<User>) => {
  return apiRequest<User>('/auth/profile/', 'PUT', {
    body: profileData,
  });
};

// Удаление профиля
export const deleteProfile = async () => {
  return apiRequest<null>('/auth/profile/', 'DELETE');
};

// Получение тарифов
export const getTariffs = async () => {
  const accessToken = localStorage.getItem('access_token');
  if (!accessToken) {
    throw new Error('Access token not found in localStorage');
  }

  return apiRequest<any>('/api/auth/tariffs/', 'GET', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};