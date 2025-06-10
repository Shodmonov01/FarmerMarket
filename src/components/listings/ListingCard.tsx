import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Listing } from '@/types';
import { formatCurrency, formatDate, getCategoryClass, getTelegramLink } from '@/lib/utils';
import { ExternalLink, MapPin } from 'lucide-react';
import { AuthContext } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

interface ListingCardProps {
  listing: Listing;
  onEdit?: () => void;
  onDelete?: () => void;
  isEditable?: boolean;
}

export default function ListingCard({ listing, onEdit, onDelete, isEditable = false }: ListingCardProps) {
  const { user } = useContext(AuthContext);
  const { toast } = useToast();

  const handleContactSeller = () => {
    if (!listing.sellerTelegramUsername) {
      toast({
        title: 'Информация для контакта недоступна',
        description: 'Информация для контакта продавца отсутствует.',
        variant: 'destructive',
      });
      return;
    }
    window.open(getTelegramLink(listing.sellerTelegramUsername), '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
      className="mb-4"
    >
      <Card className="overflow-hidden">
        <Carousel className="w-full">
          <CarouselContent>
            {listing.images.length > 0 ? (
              listing.images.map((image, index) => (
                <CarouselItem key={index}>
                  <AspectRatio ratio={4 / 3}>
                    <img
                      src={image}
                      alt={`${listing.title} - изображение ${index + 1}`}
                      className="object-cover w-full h-full"
                    />
                  </AspectRatio>
                </CarouselItem>
              ))
            ) : (
              <CarouselItem>
                <AspectRatio ratio={4 / 3}>
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    Нет изображений
                  </div>
                </AspectRatio>
              </CarouselItem>
            )}
          </CarouselContent>
          {listing.images.length > 1 && (
            <>
              <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" />
            </>
          )}
        </Carousel>

        <CardContent className="pt-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold">{listing.title}</h3>
            <span className="price-tag">{formatCurrency(listing.price)}/{listing.unit}</span>
          </div>

          <div className="flex items-center text-sm text-muted-foreground mb-2">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{listing.location}</span>
          </div>

          <div className="mb-3">
            <span className={`category-pill ${getCategoryClass(listing.category)}`}>
              {listing.category}
            </span>
          </div>

          <p className="text-sm text-foreground/80 mb-2">{listing.description}</p>

          <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
            <Link to={`/seller/${listing.sellerId}`} className="hover:underline flex items-center">
              От {listing.sellerName}
              {listing.sellerVerified && <span className="verified-badge ml-1">✓</span>}
            </Link>
            <span>{formatDate(listing.createdAt)}</span>
          </div>
        </CardContent>

        <CardFooter className="pt-0 pb-4 flex-col">
          {isEditable && user?.id === listing.sellerId ? (
            <div className="flex gap-2 w-full">
              <Button variant="outline" className="flex-1" onClick={onEdit}>
                Редактировать
              </Button>
              <Button variant="destructive" className="flex-1" onClick={onDelete}>
                Удалить
              </Button>
            </div>
          ) : (
            <Button
              className="w-full mt-2 flex items-center gap-2"
              onClick={handleContactSeller}
            >
              Связаться с продавцом
              <ExternalLink className="h-4 w-4" />
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}