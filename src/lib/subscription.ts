import { User } from '@/types';

export const checkSubscription = (user: User): boolean => {
  if (!user.tariff) return false;
  
  // Если есть дата окончания, проверяем ее
  if (user.subscriptionEnd) {
    const now = new Date();
    return user.subscriptionEnd > now;
  }
  
  // Если тариф есть, но нет даты окончания - считаем активным
  return true;
};

export const getSubscriptionDaysRemaining = (user: User): number => {
  if (!user.tariff) return 0;
  
  if (user.subscriptionEnd) {
    const now = new Date();
    const diff = user.subscriptionEnd.getTime() - now.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }
  
  // Если тариф есть, но нет даты окончания - считаем бессрочным
  return Infinity;
};