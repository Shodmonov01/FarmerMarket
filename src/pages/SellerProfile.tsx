import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ListingContext } from '@/context/ListingContext';
import { AuthContext } from '@/context/AuthContext';
import SellerInfo from '@/components/sellers/SellerInfo';
import ListingCard from '@/components/listings/ListingCard';
import { User } from '@/types';
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

export default function SellerProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { getSellerListings, deleteListing } = useContext(ListingContext);
  const { user: currentUser } = useContext(AuthContext);
  const { toast } = useToast();
  
  const [seller, setSeller] = useState<User | null>(null);
  const [listingToDelete, setListingToDelete] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('');
  
  useEffect(() => {
    // Отладочная информация
    const debug = `URL id: ${id || 'нет'}, CurrentUser: ${currentUser ? 'есть' : 'нет'}, CurrentUser.id: ${currentUser?.id || 'нет'}`;
    setDebugInfo(debug);
    
    // Если id не указан в URL, показываем профиль текущего пользователя
    if (!id) {
      setSeller(currentUser);
    } 
    // Если id указан и совпадает с текущим пользователем
    else if (currentUser && String(currentUser.id) === String(id)) {
      setSeller(currentUser);
    } 
    // Если id указан, но не совпадает с текущим пользователем
    else {
      // Для мини-приложения пока показываем текущего пользователя в любом случае
      // так как нет системы просмотра чужих профилей
      setSeller(currentUser);
    }
  }, [id, currentUser]);
  
  // Get seller's listings
  const sellerListings = seller ? getSellerListings(seller.id) : [];
  
  // Check if current user is viewing their own profile
  const isOwnProfile = currentUser?.id === seller?.id;
  
  const handleDeleteListing = (listingId: string) => {
    setListingToDelete(listingId);
  };
  
  const confirmDeleteListing = () => {
    if (listingToDelete) {
      deleteListing(listingToDelete);
      setListingToDelete(null);
      
      toast({
        title: "Объявление удалено",
        description: "Ваше объявление успешно удалено.",
      });
    }
  };
  
  // Если пользователь не авторизован
  if (!currentUser) {
    return (
      <div className="py-10 text-center">
        <h2 className="text-xl font-semibold">Необходима авторизация</h2>
        <p className="text-muted-foreground">
          Войдите в систему, чтобы просмотреть профиль.
        </p>
        <div className="mt-4 p-4 bg-gray-100 rounded text-sm">
          <p>Debug: {debugInfo}</p>
        </div>
      </div>
    );
  }

  // Если продавец не найден (не должно происходить в текущей логике)
  if (!seller) {
    return (
      <div className="py-10 text-center">
        <h2 className="text-xl font-semibold">Загрузка профиля...</h2>
        <p className="text-muted-foreground">
          Подождите, загружаем данные профиля.
        </p>
        <div className="mt-4 p-4 bg-gray-100 rounded text-sm">
          <p>Debug: {debugInfo}</p>
          <p>Seller state: {seller ? 'есть' : 'нет'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-4">
      <SellerInfo seller={seller} listings={sellerListings} />
      
      <Tabs defaultValue="listings" className="w-full">
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="listings">Объявления ({sellerListings.length})</TabsTrigger>
          <TabsTrigger value="about">О продавце</TabsTrigger>
        </TabsList>
        
        <TabsContent value="listings" className="mt-4">
          {sellerListings.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-muted-foreground">
                {isOwnProfile ? "У вас пока нет объявлений." : "У этого продавца пока нет объявлений."}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {sellerListings.map(listing => (
                <ListingCard 
                  key={listing.id} 
                  listing={listing}
                  isEditable={isOwnProfile}
                  onDelete={() => handleDeleteListing(listing.id)}
                  onEdit={() => {
                    toast({
                      title: "Редактирование недоступно",
                      description: "Функция редактирования недоступна в этой демонстрации.",
                    });
                  }}
                />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="about" className="mt-4">
          <div className="bg-secondary rounded-lg p-4">
            <h3 className="font-medium mb-2">О продавце {seller.name}</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {/* Здесь можно добавить поле description в User интерфейс или использовать заглушку */}
              Добро пожаловать на мой профиль! Я продаю качественные фермерские продукты. 
              Свяжитесь со мной для получения дополнительной информации о товарах.
            </p>
            
            <h3 className="font-medium mb-2">Контактная информация</h3>
            <div className="text-sm">
              <p><span className="text-muted-foreground">Местоположение:</span> {seller.location}</p>
              <p><span className="text-muted-foreground">Телефон:</span> {seller.phone}</p>
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
              {seller.isVerified && (
                <p className="text-green-600 text-sm mt-2">
                  ✓ Верифицированный продавец
                </p>
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
            <AlertDialogAction onClick={confirmDeleteListing} className="bg-destructive text-destructive-foreground">
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}