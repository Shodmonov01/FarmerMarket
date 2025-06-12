import { User, Listing } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Phone, ExternalLink } from 'lucide-react';
import { getDaysRemaining, getTelegramLink } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
interface SellerInfoProps {
  seller: User;
  listings: Listing[];
  isOwnProfile?: boolean;
  hasActiveSubscription?: boolean;
  daysRemaining?: number;
}

export default function SellerInfo({
  seller,
  listings,
  isOwnProfile = false,
  hasActiveSubscription,
  daysRemaining = 0,
}: SellerInfoProps) {
  const { toast } = useToast();

  const handleContactSeller = () => {
    if (!seller.telegramUsername) {
      toast({
        title: "Информация для контакта недоступна",
        description: "У продавца не указан Telegram.",
        variant: "destructive",
      });
      return;
    }

    window.open(getTelegramLink(seller.telegramUsername), '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={seller.avatarUrl} />
          <AvatarFallback>{seller.name?.charAt(0)}</AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold">{seller.name}</h2>
            {seller.isVerified && (
              <Badge variant="outline" className="text-primary border-primary">
                Подтверждён
              </Badge>
            )}
          </div>

          {seller.location && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
              <MapPin className="h-4 w-4" />
              <span>{seller.location}</span>
            </div>
          )}

          {seller.phone && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
              <Phone className="h-4 w-4" />
              <span>{seller.phone}</span>
            </div>
          )}

          {seller.subscriptionPlan && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
              <Calendar className="h-4 w-4" />
              <span>
                Подписка: {seller.subscriptionPlan}
                {hasActiveSubscription && daysRemaining !== Infinity && ` (${daysRemaining} дней осталось)`}
                {daysRemaining === Infinity && ' (Бессрочная)'}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="text-center px-4 py-2 bg-secondary rounded-lg min-w-[100px]">
          <div className="text-2xl font-bold">{listings.length}</div>
          <div className="text-xs text-muted-foreground">Объявления</div>
        </div>

        {!isOwnProfile && (
          <Button
            onClick={handleContactSeller}
            className="flex items-center gap-2"
          >
            Связаться через Telegram
            <ExternalLink className="h-4 w-4" />
          </Button>
        )}

        {isOwnProfile && (
          <div className="space-y-1 text-sm text-muted-foreground">
            {seller.tariff && (
              <>
                <p>
                  Ваш тариф: <strong>{seller.tariff.name}</strong>
                </p>
                <p>
                  {hasActiveSubscription
                    ? daysRemaining === Infinity
                      ? 'Бессрочная подписка'
                      : `Подписка активна, осталось ${daysRemaining} дней`
                    : 'Подписка неактивна'}
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
