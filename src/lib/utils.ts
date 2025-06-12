import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
  }).format(amount);
}

// Format date
export function formatDate(date: Date): string {
  return format(date, 'dd MMM yyyy');
}

// Generate UUID for mock data
export function v4(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Calculate days remaining for subscription
export function getDaysRemaining(endDate: Date | null | undefined): number {
  if (!endDate) return 0;
  
  const now = new Date();
  const diffTime = endDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays > 0 ? diffDays : 0;
}

// Truncate text with ellipsis
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

// Generate Telegram link for a username
export function getTelegramLink(username: string): string {
  return `https://t.me/${username}`;
}

// Get class for category pill
export function getCategoryClass(category: string): string {
  switch (category) {
    case 'Дикоросы':
      return 'category-pill-wild';
    case 'Ягоды':
      return 'category-pill-berries';
    case 'Фрукты':
      return 'category-pill-fruits';
    case 'Овощи':
      return 'category-pill-vegetables';
    default:
      return '';
  }
}