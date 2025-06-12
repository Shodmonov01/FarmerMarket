export type Category = 'Berries' | 'Fruits' | 'Vegetables';
export type Unit = 'kg' | 'liter' | 'piece';
export type SubscriptionPlan = '1 month' | '3 months' | '6 months';

export interface Tariff {
  id: number;
  name: string;
  price: number;
  duration: number;
  listing_limit: number;
  description: string;
  enhanced_profile: boolean;
  featured_listings: boolean;
  priority_support: boolean;
}

export interface User {
  id?: number;
  telegramId: number;
  name: string;
  lastName?: string;
  telegramUsername: string;
  avatarUrl: string;
  location: string;
  phone: string;
  email?: string | null;
  isVerified: boolean;
  tariff?: Tariff | null;
  description?: string;
}

export interface Listing {
  id: string;
  sellerId: string;
  title: string;
  description: string;
  price: number;
  unit: Unit;
  category: Category;
  images: string[];
  createdAt: Date;
  location: string;
}

export interface AuthContextType {
  user: User | null;
  login: (userData: Omit<User, 'id'>) => void;
  logout: () => void;
  isAuthenticated: boolean;
  updateUser: (userData: Partial<User>) => void;
}

export interface ListingContextType {
  listings: Listing[];
  setListings: (listings: Listing[]) => void; // Добавлено
  addListing: (listing: Omit<Listing, 'id' | 'createdAt'>) => void;
  updateListing: (id: string, listing: Partial<Listing>) => void;
  deleteListing: (id: string) => void;
  getSellerListings: (sellerId: string) => Listing[];
  getListingById: (id: string) => Listing | undefined;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        ready: () => void;
        expand: () => void;
        close: () => void;
        MainButton: {
          text: string;
          show: () => void;
          hide: () => void;
          onClick: (callback: () => void) => void;
        };
      };
    };
  }
}