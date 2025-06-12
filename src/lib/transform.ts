import { Listing } from '@/types';

export const productToListing = (product): Listing => ({
  id: product.id.toString(),
  title: product.name,
  description: product.description || 'Нет описания',
  price: product.price,
  unit: product.unit_type,
  category: product.category?.name || 'Неизвестно',
  images: product.images.map(img => img.image_url),
  sellerId: product.owner.id.toString(),
  sellerName: product.owner.first_name || product.owner.username,
  sellerTelegramUsername: product.owner.username || '',
  sellerVerified: product.owner.verified,
  location: product.owner.location || 'Не указано',
  createdAt: product.created_at || new Date().toISOString(),
});
