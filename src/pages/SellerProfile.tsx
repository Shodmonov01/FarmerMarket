// import { useContext, useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { Listing } from '@/types';
// import { AuthContext } from '@/context/AuthContext';
// import SellerInfo from '@/components/sellers/SellerInfo';
// import ListingCard from '@/components/listings/ListingCard';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from '@/components/ui/alert-dialog';
// import { useToast } from '@/hooks/use-toast';
// import { checkSubscription, getSubscriptionDaysRemaining } from '@/lib/subscription';
// import { getProductsByOwner,  } from '@/api/products';
// import { productToListing } from '@/lib/transform'; // см. ниже
// import { User } from '@/types';
// import { getOwnerProducts } from '@/api/productsByOwners';

// export default function SellerProfilePage() {
//   const { id } = useParams<{ id: string }>();
//   const { user: currentUser, isAuthenticated } = useContext(AuthContext);
//   const { toast } = useToast();

//   const [seller, setSeller] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [listingToDelete, setListingToDelete] = useState<string | null>(null);
//   const [sellerListings, setSellerListings] = useState<Listing[]>([]);

//   const isOwnProfile = !id || (currentUser && String(currentUser.id) === id);

//   useEffect(() => {
//     const loadProfileAndListings = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         if (isOwnProfile && currentUser) {
//           setSeller(currentUser);
//           const res = await getOwnerProducts();
//           const mapped = res.results.map(productToListing);
//           setSellerListings(mapped);
//         } else {
//           const res = await getProductsByOwner(Number(id));
//           if (res?.results?.length > 0) {
//             const owner = res.results[0].owner;

//             setSeller({
//               ...owner,
//               id: owner.id,
//               name: `${owner.first_name} ${owner.last_name}`,
//               isVerified: owner.verified,
//               telegramUsername: owner.username,
//               avatarUrl: owner.avatar_url,
//               phone: owner.phone_number,
//               email: owner.email,
//               tariff: owner.tariff,
//             } as User);

//             const mapped = res.results.map(productToListing);
//             setSellerListings(mapped);
//           } else {
//             setError('У продавца нет продуктов.');
//           }
//         }
//       } catch (err) {
//         console.error('Ошибка при загрузке профиля:', err);
//         setError('Не удалось загрузить данные продавца.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadProfileAndListings();
//   }, [id, currentUser]);

//   const hasActiveSubscription = seller ? checkSubscription(seller) : false;
//   const daysRemaining = seller ? getSubscriptionDaysRemaining(seller) : 0;

//   const handleDeleteListing = (listingId: string) => {
//     setListingToDelete(listingId);
//   };

//   const confirmDeleteListing = () => {
//     if (listingToDelete) {
//       // Реализуй удаление через API если нужно
//       setSellerListings(prev => prev.filter(l => l.id !== listingToDelete));
//       setListingToDelete(null);
//       toast({
//         title: 'Объявление удалено',
//         description: 'Ваше объявление успешно удалено.',
//       });
//     }
//   };

//   if (!isAuthenticated) {
//     return (
//       <div className="py-10 text-center">
//         <h2 className="text-xl font-semibold">Необходима авторизация</h2>
//         <p className="text-muted-foreground">
//           Войдите в систему, чтобы просмотреть профиль.
//         </p>
//       </div>
//     );
//   }

//   if (loading || !seller) {
//     return (
//       <div className="py-10 text-center">
//         <h2 className="text-xl font-semibold">Загрузка профиля...</h2>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="py-10 text-center">
//         <h2 className="text-xl font-semibold">{error}</h2>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6 py-4">
//       <SellerInfo
//         seller={seller}
//         listings={sellerListings}
//         hasActiveSubscription={hasActiveSubscription}
//         daysRemaining={daysRemaining}
//       />

//       <Tabs defaultValue="listings" className="w-full">
//         <TabsList className="grid grid-cols-2 w-full">
//           <TabsTrigger value="listings">Объявления ({sellerListings.length})</TabsTrigger>
//           <TabsTrigger value="about">О продавце</TabsTrigger>
//         </TabsList>

//         <TabsContent value="listings" className="mt-4">
//           {sellerListings.length === 0 ? (
//             <div className="text-center py-6">
//               <p className="text-muted-foreground">
//                 {isOwnProfile ? 'У вас пока нет объявлений.' : 'У этого продавца пока нет объявлений.'}
//               </p>
//               {isOwnProfile && !hasActiveSubscription && (
//                 <p className="text-destructive mt-2">
//                   Для создания объявлений необходима активная подписка.
//                 </p>
//               )}
//             </div>
//           ) : (
//             <div className="space-y-4">
//               {sellerListings.map(listing => (
//                 <ListingCard
//                   key={listing.id}
//                   listing={listing}
//                   isEditable={isOwnProfile}
//                   onDelete={isOwnProfile ? () => handleDeleteListing(listing.id) : undefined}
//                   onEdit={isOwnProfile ? () => {
//                     toast({
//                       title: 'Редактирование',
//                       description: 'Редактирование объявления.',
//                     });
//                   } : undefined}
//                 />
//               ))}
//             </div>
//           )}
//         </TabsContent>

//         <TabsContent value="about" className="mt-4">
//           <div className="bg-secondary rounded-lg p-4">
//             <h3 className="font-medium mb-2">О продавце {seller.name}</h3>
//             <p className="text-sm text-muted-foreground mb-4">
//               {seller.description || 'Добро пожаловать на мой профиль! Я продаю качественные фермерские продукты.'}
//             </p>

//             <h3 className="font-medium mb-2">Контактная информация</h3>
//             <div className="text-sm space-y-1">
//               {seller.location && (
//                 <p><span className="text-muted-foreground">Местоположение:</span> {seller.location}</p>
//               )}
//               {seller.phone && (
//                 <p><span className="text-muted-foreground">Телефон:</span> {seller.phone}</p>
//               )}
//               {seller.telegramUsername && (
//                 <p>
//                   <span className="text-muted-foreground">Телеграм:</span>{' '}
//                   <a
//                     href={`https://t.me/${seller.telegramUsername}`}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="text-primary hover:underline"
//                   >
//                     @{seller.telegramUsername}
//                   </a>
//                 </p>
//               )}
//               {seller.email && (
//                 <p><span className="text-muted-foreground">Email:</span> {seller.email}</p>
//               )}
//               {seller.isVerified && (
//                 <p className="text-green-600 text-sm mt-2">
//                   ✓ Верифицированный продавец
//                 </p>
//               )}
//               {isOwnProfile && seller.tariff && (
//                 <div className="mt-4 p-3 bg-background rounded-lg">
//                   <h4 className="font-medium mb-1">Ваш тариф</h4>
//                   <p>{seller.tariff.name}</p>
//                   {hasActiveSubscription && (
//                     <p className="text-sm text-muted-foreground">
//                       {daysRemaining === Infinity
//                         ? 'Бессрочная подписка'
//                         : `Осталось ${daysRemaining} дней`}
//                     </p>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>
//         </TabsContent>
//       </Tabs>

//       <AlertDialog open={!!listingToDelete} onOpenChange={() => setListingToDelete(null)}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>Удалить объявление</AlertDialogTitle>
//             <AlertDialogDescription>
//               Вы уверены, что хотите удалить это объявление? Это действие нельзя отменить.
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel>Отмена</AlertDialogCancel>
//             <AlertDialogAction
//               onClick={confirmDeleteListing}
//               className="bg-destructive text-destructive-foreground"
//             >
//               Удалить
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </div>
//   );
// }


import { useContext, useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Listing } from '@/types';
import { AuthContext } from '@/context/AuthContext';
import SellerInfo from '@/components/sellers/SellerInfo';
import ListingCard from '@/components/listings/ListingCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { checkSubscription, getSubscriptionDaysRemaining } from '@/lib/subscription';
import { getProductsByOwner } from '@/api/products';
import { productToListing } from '@/lib/transform';
import { User } from '@/types';
import { getOwnerProducts } from '@/api/productsByOwners';

export default function SellerProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { user: currentUser, isAuthenticated } = useContext(AuthContext);
  const { toast } = useToast();

  const [seller, setSeller] = useState<User | null>(null);
  const [sellerListings, setSellerListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [nextPageExists, setNextPageExists] = useState(true);
  const [listingToDelete, setListingToDelete] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(false);


  const isOwnProfile = !id || (currentUser && String(currentUser.id) === id);

  // const fetchListings = useCallback(async (page: number) => {

  //   try {
  //     let response;

  //     if (isOwnProfile && currentUser) {
  //       setSeller(currentUser);
  //       response = await getOwnerProducts(page);
  //     } else {
  //       response = await getProductsByOwner(Number(id), page);
  //       if (page === 1 && response.results.length > 0) {
  //         const owner = response.results[0].owner;
  //         setSeller({
  //           ...owner,
  //           id: owner.id,
  //           name: `${owner.first_name} ${owner.last_name}`,
  //           isVerified: owner.verified,
  //           telegramUsername: owner.username,
  //           avatarUrl: owner.avatar_url,
  //           phone: owner.phone_number,
  //           email: owner.email,
  //           tariff: owner.tariff,
  //         } as User);
  //       }
  //     }

  //     const mapped = response.results.map(productToListing);
  //     setSellerListings(prev => [...prev, ...mapped]);
  //     // setNextPageExists(!!response.next);
  //     setNextPageExists(!!response.next && response.results.length > 0);

  //   } catch (err) {
  //     console.error('Ошибка при загрузке продуктов:', err);
  //     setError('Не удалось загрузить данные продавца.');
  //   } finally {
  //     setLoading(false);
  //   }
  // }, [isOwnProfile, id, currentUser]);

  const fetchListings = useCallback(async (page: number) => {
    if (isFetching) return; // ⛔ Пропуск, если уже идёт загрузка
    setIsFetching(true);
  
    try {
      let response;
  
      if (isOwnProfile && currentUser) {
        setSeller(currentUser);
        response = await getOwnerProducts(page);
      } else {
        response = await getProductsByOwner(Number(id), page);
        if (page === 1 && response.results.length > 0) {
          const owner = response.results[0].owner;
          setSeller({
            ...owner,
            id: owner.id,
            name: `${owner.first_name} ${owner.last_name}`,
            isVerified: owner.verified,
            telegramUsername: owner.username,
            avatarUrl: owner.avatar_url,
            phone: owner.phone_number,
            email: owner.email,
            tariff: owner.tariff,
          } as User);
        }
      }
  
      const mapped = response.results.map(productToListing);
      setSellerListings(prev => [...prev, ...mapped]);
  
      // 🔐 Защита: нет next или пустой результат
      if (!response.next || response.results.length === 0) {
        setNextPageExists(false);
      }
  
    } catch (err) {
      console.error('Ошибка при загрузке:', err);
      setError('Не удалось загрузить данные продавца.');
    } finally {
      setLoading(false);
      setIsFetching(false); // ✅ Разрешить следующий fetch
    }
  }, [isOwnProfile, id, currentUser, isFetching]);
  
  

  useEffect(() => {
    setSellerListings([]);
    setPage(1);
    setNextPageExists(true);
    setLoading(true);
    fetchListings(1);
  }, [id, currentUser]);

  useEffect(() => {
    const handleScroll = () => {
      const bottomReached = window.innerHeight + window.scrollY >= document.body.offsetHeight - 200;
      if (bottomReached && !loading && nextPageExists) {
        setPage(prev => prev + 1);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, nextPageExists]);

  useEffect(() => {
    if (page > 1) {
      fetchListings(page);
    }
  }, [page]);

  const confirmDeleteListing = () => {
    if (listingToDelete) {
      setSellerListings(prev => prev.filter(l => l.id !== listingToDelete));
      setListingToDelete(null);
      toast({
        title: 'Объявление удалено',
        description: 'Ваше объявление успешно удалено.',
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="py-10 text-center">
        <h2 className="text-xl font-semibold">Необходима авторизация</h2>
        <p className="text-muted-foreground">Войдите в систему, чтобы просмотреть профиль.</p>
      </div>
    );
  }

  if (loading && sellerListings.length === 0) {
    return <div className="py-10 text-center">Загрузка...</div>;
  }

  if (error) {
    return <div className="py-10 text-center">{error}</div>;
  }

  const hasActiveSubscription = seller ? checkSubscription(seller) : false;
  const daysRemaining = seller ? getSubscriptionDaysRemaining(seller) : 0;

  return (
    <div className="space-y-6 py-4">
      {seller && (
        <SellerInfo
          seller={seller}
          listings={sellerListings}
          hasActiveSubscription={hasActiveSubscription}
          daysRemaining={daysRemaining}
        />
      )}

      <Tabs defaultValue="listings" className="w-full">
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="listings">Объявления ({sellerListings.length})</TabsTrigger>
          <TabsTrigger value="about">О продавце</TabsTrigger>
        </TabsList>

        <TabsContent value="listings" className="mt-4">
          {sellerListings.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-muted-foreground">
                {isOwnProfile ? 'У вас пока нет объявлений.' : 'У этого продавца пока нет объявлений.'}
              </p>
              {isOwnProfile && !hasActiveSubscription && (
                <p className="text-destructive mt-2">
                  Для создания объявлений необходима активная подписка.
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {sellerListings.map(listing => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  isEditable={isOwnProfile}
                  onDelete={isOwnProfile ? () => setListingToDelete(listing.id) : undefined}
                  onEdit={isOwnProfile ? () => {
                    toast({
                      title: 'Редактирование',
                      description: 'Редактирование объявления.',
                    });
                  } : undefined}
                />
              ))}
              {loading && <div className="text-center py-4 text-sm text-muted-foreground">Загрузка еще...</div>}
            </div>
          )}
        </TabsContent>

        <TabsContent value="about" className="mt-4">
          {/* Информация о продавце (оставим как есть) */}
        </TabsContent>
      </Tabs>

      <AlertDialog open={!!listingToDelete} onOpenChange={() => setListingToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить объявление</AlertDialogTitle>
            <AlertDialogDescription>
              Вы уверены, что хотите удалить это объявление? Это действие нельзя отменить.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteListing}
              className="bg-destructive text-destructive-foreground"
            >
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
