// import { useContext, useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { ListingContext } from '@/context/ListingContext';
// import { AuthContext } from '@/context/AuthContext';
// import SellerInfo from '@/components/sellers/SellerInfo';
// import ListingCard from '@/components/listings/ListingCard';
// import { User } from '@/types';
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
// import { getProfile } from '@/api/auth';
// import { checkSubscription, getSubscriptionDaysRemaining } from '@/lib/subscription';
// import { getProductsByOwner } from '@/api/products';

// export default function SellerProfilePage() {
//   const { id } = useParams<{ id: string }>();
//   const { getSellerListings, deleteListing } = useContext(ListingContext);
//   const { user: currentUser, isAuthenticated } = useContext(AuthContext);
//   const { toast } = useToast();
  
//   const [seller, setSeller] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [listingToDelete, setListingToDelete] = useState<string | null>(null);
//   const [sellerListings, setSellerListings] = useState<Listing[]>([]);
//   // Загрузка данных продавца
//   // useEffect(() => {
//   //   const loadSellerAndListings = async () => {
//   //     try {
//   //       setLoading(true);
//   //       setError(null);
  
//   //       // Если это профиль текущего пользователя
//   //       if (!id || (currentUser && String(currentUser.id) === id)) {
//   //         setSeller(currentUser);
//   //         const listings = getSellerListings(currentUser.id);
//   //         setSellerListings(listings); // добавим состояние для чужих listings
//   //         return;
//   //       }
  
//   //       // Иначе это чужой профиль — загружаем через getProductsByOwner
//   //       const response = await getProductsByOwner(Number(id));
//   //       if (response?.results?.length > 0) {
//   //         const firstProduct = response.results[0];
//   //         const owner = firstProduct.owner;
//   //         setSeller({
//   //           ...owner,
//   //           id: owner.id,
//   //           name: `${owner.first_name} ${owner.last_name}`,
//   //           isVerified: owner.verified,
//   //           telegramUsername: owner.username,
//   //           avatarUrl: owner.avatar_url,
//   //           phone: owner.phone_number,
//   //           email: owner.email,
//   //           tariff: owner.tariff,
//   //         } as User);
//   //         setSellerListings(response.results); // продукты как объявления
//   //       } else {
//   //         setError("У продавца нет продуктов.");
//   //       }
  
//   //     } catch (err) {
//   //       console.error('Ошибка при загрузке данных продавца:', err);
//   //       setError('Не удалось загрузить данные продавца');
//   //     } finally {
//   //       setLoading(false);
//   //     }
//   //   };
  
//   //   loadSellerAndListings();
//   // }, [id, currentUser]);

//   useEffect(() => {
//     const loadSellerAndListings = async () => {
//       try {
//         setLoading(true);
//         setError(null);
  
//         // Проверяем, чей это профиль
//         const isOwn = !id || (currentUser && String(currentUser.id) === id);
//         const sellerId = isOwn ? currentUser.id : Number(id);
  
//         const response = await getProductsByOwner(sellerId);
  
//         if (response?.results?.length > 0) {
//           const firstProduct = response.results[0];
//           const owner = firstProduct.owner;
  
//           setSeller({
//             ...owner,
//             id: owner.id,
//             name: `${owner.first_name} ${owner.last_name}`,
//             isVerified: owner.verified,
//             telegramUsername: owner.username,
//             avatarUrl: owner.avatar_url,
//             phone: owner.phone_number,
//             email: owner.email,
//             tariff: owner.tariff,
//           } as User);
  
//           // Здесь маппим продукты в объявления (если используешь ListingCard)
//           // Желательно: response.results.map(productToListing)
//           setSellerListings(response.results);
//         } else {
//           setError("У продавца нет продуктов.");
//         }
  
//       } catch (err) {
//         console.error('Ошибка при загрузке данных продавца:', err);
//         setError('Не удалось загрузить данные продавца');
//       } finally {
//         setLoading(false);
//       }
//     };
  
//     loadSellerAndListings();
//   }, [id, currentUser]);
  
  
  
//   // Проверяем активность подписки (если продавец уже загружен)
//   const isOwnProfile = currentUser?.id === seller?.id;

// const hasActiveSubscription = seller ? checkSubscription(seller) : false;
// const daysRemaining = seller ? getSubscriptionDaysRemaining(seller) : 0;
// const handleDeleteListing = (listingId: string) => {
//   setListingToDelete(listingId);
// };
// const confirmDeleteListing = () => {
//   if (listingToDelete) {
//     deleteListing(listingToDelete);
//     setListingToDelete(null);

//     toast({
//       title: "Объявление удалено",
//       description: "Ваше объявление успешно удалено.",
//     });
//   }
// };


//   // Если пользователь не авторизован
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

//   // Загрузка данных
//   if (loading || !seller) {
//     return (
//       <div className="py-10 text-center">
//         <h2 className="text-xl font-semibold">Загрузка профиля...</h2>
//       </div>
//     );
//   }

//   // Ошибка загрузки
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
//                 {isOwnProfile ? "У вас пока нет объявлений." : "У этого продавца пока нет объявлений."}
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
//                       title: "Редактирование",
//                       description: "Редактирование объявления.",
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


import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Listing } from '@/types';
import { AuthContext } from '@/context/AuthContext';
import SellerInfo from '@/components/sellers/SellerInfo';
import ListingCard from '@/components/listings/ListingCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { checkSubscription, getSubscriptionDaysRemaining } from '@/lib/subscription';
import { getProductsByOwner,  } from '@/api/products';
import { productToListing } from '@/lib/transform'; // см. ниже
import { User } from '@/types';
import { getOwnerProducts } from '@/api/productsByOwners';

export default function SellerProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { user: currentUser, isAuthenticated } = useContext(AuthContext);
  const { toast } = useToast();

  const [seller, setSeller] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [listingToDelete, setListingToDelete] = useState<string | null>(null);
  const [sellerListings, setSellerListings] = useState<Listing[]>([]);

  const isOwnProfile = !id || (currentUser && String(currentUser.id) === id);

  useEffect(() => {
    const loadProfileAndListings = async () => {
      try {
        setLoading(true);
        setError(null);

        if (isOwnProfile && currentUser) {
          setSeller(currentUser);
          const res = await getOwnerProducts();
          const mapped = res.results.map(productToListing);
          setSellerListings(mapped);
        } else {
          const res = await getProductsByOwner(Number(id));
          if (res?.results?.length > 0) {
            const owner = res.results[0].owner;

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

            const mapped = res.results.map(productToListing);
            setSellerListings(mapped);
          } else {
            setError('У продавца нет продуктов.');
          }
        }
      } catch (err) {
        console.error('Ошибка при загрузке профиля:', err);
        setError('Не удалось загрузить данные продавца.');
      } finally {
        setLoading(false);
      }
    };

    loadProfileAndListings();
  }, [id, currentUser]);

  const hasActiveSubscription = seller ? checkSubscription(seller) : false;
  const daysRemaining = seller ? getSubscriptionDaysRemaining(seller) : 0;

  const handleDeleteListing = (listingId: string) => {
    setListingToDelete(listingId);
  };

  const confirmDeleteListing = () => {
    if (listingToDelete) {
      // Реализуй удаление через API если нужно
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
        <p className="text-muted-foreground">
          Войдите в систему, чтобы просмотреть профиль.
        </p>
      </div>
    );
  }

  if (loading || !seller) {
    return (
      <div className="py-10 text-center">
        <h2 className="text-xl font-semibold">Загрузка профиля...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-10 text-center">
        <h2 className="text-xl font-semibold">{error}</h2>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-4">
      <SellerInfo
        seller={seller}
        listings={sellerListings}
        hasActiveSubscription={hasActiveSubscription}
        daysRemaining={daysRemaining}
      />

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
                  onDelete={isOwnProfile ? () => handleDeleteListing(listing.id) : undefined}
                  onEdit={isOwnProfile ? () => {
                    toast({
                      title: 'Редактирование',
                      description: 'Редактирование объявления.',
                    });
                  } : undefined}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="about" className="mt-4">
          <div className="bg-secondary rounded-lg p-4">
            <h3 className="font-medium mb-2">О продавце {seller.name}</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {seller.description || 'Добро пожаловать на мой профиль! Я продаю качественные фермерские продукты.'}
            </p>

            <h3 className="font-medium mb-2">Контактная информация</h3>
            <div className="text-sm space-y-1">
              {seller.location && (
                <p><span className="text-muted-foreground">Местоположение:</span> {seller.location}</p>
              )}
              {seller.phone && (
                <p><span className="text-muted-foreground">Телефон:</span> {seller.phone}</p>
              )}
              {seller.telegramUsername && (
                <p>
                  <span className="text-muted-foreground">Телеграм:</span>{' '}
                  <a
                    href={`https://t.me/${seller.telegramUsername}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    @{seller.telegramUsername}
                  </a>
                </p>
              )}
              {seller.email && (
                <p><span className="text-muted-foreground">Email:</span> {seller.email}</p>
              )}
              {seller.isVerified && (
                <p className="text-green-600 text-sm mt-2">
                  ✓ Верифицированный продавец
                </p>
              )}
              {isOwnProfile && seller.tariff && (
                <div className="mt-4 p-3 bg-background rounded-lg">
                  <h4 className="font-medium mb-1">Ваш тариф</h4>
                  <p>{seller.tariff.name}</p>
                  {hasActiveSubscription && (
                    <p className="text-sm text-muted-foreground">
                      {daysRemaining === Infinity
                        ? 'Бессрочная подписка'
                        : `Осталось ${daysRemaining} дней`}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
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
