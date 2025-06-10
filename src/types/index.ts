export type Category = 'Berries' | 'Fruits' | 'Vegetables';
export type Unit = 'kg' | 'liter' | 'piece';
export type SubscriptionPlan = '1 month' | '3 months' | '6 months';

export interface User {
  id: string;
  name: string;
  location: string;
  phone: string;
  isVerified: boolean;
  avatarUrl?: string;
  subscriptionEnd?: Date | null;
  subscriptionPlan?: SubscriptionPlan | null;
  isAdmin?: boolean;
  telegramUsername?: string;
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