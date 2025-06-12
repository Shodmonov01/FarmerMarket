// import { createContext, useState, useEffect, ReactNode } from 'react';
// import { Listing, ListingContextType } from '@/types';
// import { getProducts, getCategories } from '@/api/products';
// import { v4 as uuidv4 } from '@/lib/utils';

// const defaultListingContext: ListingContextType = {
//   listings: [],
//   addListing: () => {},
//   updateListing: () => {},
//   deleteListing: () => {},
//   getSellerListings: () => [],
//   getListingById: () => undefined,
// };

// export const ListingContext = createContext<ListingContextType>(defaultListingContext);

// export const ListingProvider = ({ children }: { children: ReactNode }) => {
//   const [listings, setListings] = useState<Listing[]>([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // Получаем категории
//         const categories = await getCategories();
//         const categoryMap = new Map(categories.map(cat => [cat.id, cat.name]));

//         // Получаем продукты
//         const productsResponse = await getProducts();
//         const products = productsResponse.results; // Берем results из ответа

//         // Маппим продукты в формат Listing
//         const mappedListings: Listing[] = products.map(product => ({
//           id: product.id.toString(), // Преобразуем id в строку
//           title: product.name,
//           description: product.description || 'Описание отсутствует',
//           price: product.price,
//           unit: product.unit_type,
//           category: product.category ? categoryMap.get(product.category.id) || 'Неизвестно' : 'Неизвестно',
//           images: product.images.map(img => img.image_url),
//           sellerId: product.owner.id.toString(),
//           location: 'Не указано', // Если местоположение есть в API, добавьте его
//           sellerName: product.owner.first_name || product.owner.username,
//           sellerTelegramUsername: product.owner.username || '',
//           sellerVerified: false, // Логика верификации, если есть в API
//           createdAt: new Date().toISOString(), // Если есть поле created_at, используйте его
//         }));

//         setListings(mappedListings);
//       } catch (error) {
//         console.error('Failed to fetch listings:', error);
//       }
//     };

//     fetchData();
//   }, []);

//   const addListing = (listing: Omit<Listing, 'id' | 'createdAt'>) => {
//     const newListing: Listing = {
//       id: uuidv4(),
//       ...listing,
//       createdAt: new Date(),
//     };
//     const updatedListings = [newListing, ...listings];
//     setListings(updatedListings);
//     // Если есть API для добавления, вызовите его здесь
//   };

//   const updateListing = (id: string, updatedData: Partial<Listing>) => {
//     const updatedListings = listings.map(listing =>
//       listing.id === id ? { ...listing, ...updatedData } : listing
//     );
//     setListings(updatedListings);
//     // Если есть API для обновления, вызовите его здесь
//   };

//   const deleteListing = (id: string) => {
//     const updatedListings = listings.filter(listing => listing.id !== id);
//     setListings(updatedListings);
//     // Если есть API для удаления, вызовите его здесь
//   };

//   const getSellerListings = (sellerId: string) => {
//     return listings.filter(listing => listing.sellerId === sellerId);
//   };

//   const getListingById = (id: string) => {
//     return listings.find(listing => listing.id === id);
//   };

//   return (
//     <ListingContext.Provider
//       value={{
//         listings,
//         addListing,
//         updateListing,
//         deleteListing,
//         getSellerListings,
//         getListingById,
//       }}
//     >
//       {children}
//     </ListingContext.Provider>
//   );
// };


// ListingContext.tsx
import { createContext, useState, useEffect, ReactNode } from 'react';
import { Listing, ListingContextType } from '@/types';
import { getProducts, getCategories } from '@/api/products';
import { v4 as uuidv4 } from '@/lib/utils';

const defaultListingContext: ListingContextType = {
  listings: [],
  addListing: () => {},
  updateListing: () => {},
  deleteListing: () => {},
  getSellerListings: () => [],
  getListingById: () => undefined,
  nextPageUrl: null,
  loadMoreListings: async () => {},
  loading: false,
};

export const ListingContext = createContext<ListingContextType>(defaultListingContext);

export const ListingProvider = ({ children }: { children: ReactNode }) => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [nextPageUrl, setNextPageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [categoryMap, setCategoryMap] = useState<Map<number, string>>(new Map());

  const fetchCategories = async () => {
    try {
      const categories = await getCategories();
      const map = new Map(categories.map(cat => [cat.id, cat.name]));
      setCategoryMap(map);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchData = async (url?: string, append = false) => {
    try {
      setLoading(true);
      const response = await getProducts(url);
      const { results: products, next } = response;

      const mappedListings: Listing[] = products.map(product => ({
        id: product.id.toString(),
        title: product.name,
        description: product.description || 'Описание отсутствует',
        price: product.price,
        unit: product.unit_type,
        category: product.category ? categoryMap.get(product.category.id) || 'Неизвестно' : 'Неизвестно',
        images: product.images.map(img => img.image_url),
        sellerId: product.owner.id.toString(),
        location: 'Не указано',
        sellerName: product.owner.first_name || product.owner.username,
        sellerTelegramUsername: product.owner.username || '',
        sellerVerified: false,
        createdAt: new Date().toISOString(),
      }));

      setListings(prev => (append ? [...prev, ...mappedListings] : mappedListings));
      setNextPageUrl(next);
    } catch (err) {
      console.error('Ошибка при получении объявлений:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (categoryMap.size > 0) fetchData();
  }, [categoryMap]);

  const loadMoreListings = async () => {
    if (nextPageUrl) await fetchData(nextPageUrl, true);
  };

  const addListing = (listing: Omit<Listing, 'id' | 'createdAt'>) => {
    const newListing: Listing = {
      id: uuidv4(),
      ...listing,
      createdAt: new Date().toISOString(),
    };
    setListings(prev => [newListing, ...prev]);
  };

  const updateListing = (id: string, updatedData: Partial<Listing>) => {
    setListings(prev => prev.map(listing => listing.id === id ? { ...listing, ...updatedData } : listing));
  };

  const deleteListing = (id: string) => {
    setListings(prev => prev.filter(listing => listing.id !== id));
  };

  const getSellerListings = (sellerId: string) => listings.filter(listing => listing.sellerId === sellerId);

  const getListingById = (id: string) => listings.find(listing => listing.id === id);

  return (
    <ListingContext.Provider
      value={{
        listings,
        addListing,
        updateListing,
        deleteListing,
        getSellerListings,
        getListingById,
        nextPageUrl,
        loadMoreListings,
        loading,
      }}
    >
      {children}
    </ListingContext.Provider>
  );
};
