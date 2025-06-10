import { User, Listing, Category, Unit } from '@/types';

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Anna Petrova',
    location: 'Moscow Region',
    phone: '+7 (999) 123-4567',
    isVerified: true,
    avatarUrl: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg',
    subscriptionEnd: new Date('2025-12-31'),
    subscriptionPlan: '6 months',
    telegramUsername: 'anna_petrova',
  },
  {
    id: '2',
    name: 'Ivan Smirnov',
    location: 'Saint Petersburg',
    phone: '+7 (999) 765-4321',
    isVerified: true,
    avatarUrl: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
    subscriptionEnd: new Date('2025-09-15'),
    subscriptionPlan: '3 months',
    telegramUsername: 'ivan_smirnov',
  },
  {
    id: '3',
    name: 'Olga Ivanova',
    location: 'Krasnodar',
    phone: '+7 (999) 555-1234',
    isVerified: false,
    avatarUrl: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
    telegramUsername: 'olga_ivanova',
  },
  {
    id: '4',
    name: 'Dmitry Kozlov',
    location: 'Novosibirsk',
    phone: '+7 (999) 333-7890',
    isVerified: true,
    avatarUrl: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg',
    subscriptionEnd: new Date('2025-10-01'),
    subscriptionPlan: '1 month',
    telegramUsername: 'dmitry_kozlov',
  },
  {
    id: '5',
    name: 'Admin User',
    location: 'Moscow',
    phone: '+7 (999) 000-0000',
    isVerified: true,
    isAdmin: true,
    telegramUsername: 'admin_user',
  },
];

// Mock Listings
export const mockListings: Listing[] = [
  {
    id: '1',
    sellerId: '1',
    title: 'Fresh Organic Strawberries',
    description: 'Freshly picked organic strawberries. Sweet and juicy, perfect for desserts or eating fresh.',
    price: 350,
    unit: 'kg',
    category: 'Berries',
    images: [
      'https://images.pexels.com/photos/46174/strawberries-berries-fruit-freshness-46174.jpeg',
      'https://images.pexels.com/photos/70746/strawberries-red-fruit-royalty-free-70746.jpeg',
    ],
    createdAt: new Date('2025-06-01'),
    location: 'Moscow Region',
  },
  {
    id: '2',
    sellerId: '1',
    title: 'Red Apples',
    description: 'Delicious red apples from our family garden. No pesticides used.',
    price: 120,
    unit: 'kg',
    category: 'Fruits',
    images: [
      'https://images.pexels.com/photos/1510392/pexels-photo-1510392.jpeg',
      'https://images.pexels.com/photos/206959/pexels-photo-206959.jpeg',
    ],
    createdAt: new Date('2025-05-29'),
    location: 'Moscow Region',
  },
  {
    id: '3',
    sellerId: '2',
    title: 'Fresh Cucumbers',
    description: 'Crisp, fresh cucumbers. Great for salads or pickling.',
    price: 90,
    unit: 'kg',
    category: 'Vegetables',
    images: [
      'https://images.pexels.com/photos/2329440/pexels-photo-2329440.jpeg',
      'https://images.pexels.com/photos/3568039/pexels-photo-3568039.jpeg',
    ],
    createdAt: new Date('2025-06-02'),
    location: 'Saint Petersburg',
  },
  {
    id: '4',
    sellerId: '2',
    title: 'Organic Tomatoes',
    description: 'Vine-ripened organic tomatoes. Full of flavor and nutritious.',
    price: 150,
    unit: 'kg',
    category: 'Vegetables',
    images: [
      'https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg',
      'https://images.pexels.com/photos/2284166/pexels-photo-2284166.jpeg',
    ],
    createdAt: new Date('2025-06-01'),
    location: 'Saint Petersburg',
  },
  {
    id: '5',
    sellerId: '3',
    title: 'Fresh Blueberries',
    description: 'Hand-picked wild blueberries. Rich in antioxidants and delicious.',
    price: 500,
    unit: 'kg',
    category: 'Berries',
    images: [
      'https://images.pexels.com/photos/1153655/pexels-photo-1153655.jpeg',
      'https://images.pexels.com/photos/131047/pexels-photo-131047.jpeg',
    ],
    createdAt: new Date('2025-05-30'),
    location: 'Krasnodar',
  },
  {
    id: '6',
    sellerId: '4',
    title: 'Organic Carrots',
    description: 'Fresh organic carrots from our farm. Sweet and crunchy.',
    price: 80,
    unit: 'kg',
    category: 'Vegetables',
    images: [
      'https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg',
      'https://images.pexels.com/photos/37641/carrots-basket-vegetables-market-37641.jpeg',
    ],
    createdAt: new Date('2025-05-31'),
    location: 'Novosibirsk',
  },
  {
    id: '7',
    sellerId: '4',
    title: 'Juicy Watermelons',
    description: 'Sweet and juicy watermelons. Perfect for hot summer days.',
    price: 25,
    unit: 'piece',
    category: 'Fruits',
    images: [
      'https://images.pexels.com/photos/5946081/pexels-photo-5946081.jpeg',
      'https://images.pexels.com/photos/1313267/pexels-photo-1313267.jpeg',
    ],
    createdAt: new Date('2025-06-02'),
    location: 'Novosibirsk',
  },
  {
    id: '8',
    sellerId: '1',
    title: 'Fresh Raspberries',
    description: 'Delicate and flavorful raspberries freshly picked from our garden.',
    price: 450,
    unit: 'kg',
    category: 'Berries',
    images: [
      'https://images.pexels.com/photos/695644/pexels-photo-695644.jpeg',
      'https://images.pexels.com/photos/3030490/pexels-photo-3030490.jpeg',
    ],
    createdAt: new Date('2025-05-28'),
    location: 'Moscow Region',
  },
];

// Categories with colors for UI
export const categories: { value: Category; label: string; color: string }[] = [
  { value: 'Berries', label: 'Berries', color: 'category-pill-berries' },
  { value: 'Fruits', label: 'Fruits', color: 'category-pill-fruits' },
  { value: 'Vegetables', label: 'Vegetables', color: 'category-pill-vegetables' },
];

// Units for dropdown
export const units: { value: Unit; label: string }[] = [
  { value: 'kg', label: 'Kilogram (kg)' },
  { value: 'liter', label: 'Liter (l)' },
  { value: 'piece', label: 'Piece' },
];

// Subscription plans
export const subscriptionPlans = [
  {
    id: '1month',
    name: '1 месяц',
    price: 300,
    description: 'Идеально для сезонных продавцов',
    features: [
      'До 10 объявлений',
      'Базовый профиль продавца',
      'Поддержка по email'
    ],
  },
  {
    id: '3months',
    name: '3 месяца',
    price: 800,
    description: 'Самый популярный вариант',
    features: [
      'До 30 объявлений',
      'Расширенный профиль продавца',
      'Приоритетная поддержка по email'
    ],
  },
  {
    id: '6months',
    name: '6 месяцев',
    price: 1500,
    description: 'Лучшее предложение для активных продавцов',
    features: [
      'Неограниченное количество объявлений',
      'Премиум профиль продавца',
      'Приоритетная поддержка',
      'Выделенные объявления'
    ],
  },
];

// Helper to get a user by ID
export const getUserById = (id: string): User | undefined => {
  return mockUsers.find(user => user.id === id);
};