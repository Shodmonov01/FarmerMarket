import { useState, useContext, useMemo, useEffect } from 'react';
import { ListingContext } from '@/context/ListingContext';
import ListingCard from '@/components/listings/ListingCard';
import ListingFilter, { FilterValues } from '@/components/listings/ListingFilter';
import { Category, Listing } from '@/types';
import { getCategories } from '@/api/products';

export default function HomePage() {
  const { listings } = useContext(ListingContext);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filters, setFilters] = useState<FilterValues>({
    search: '',
    category: 'all',
    priceRange: [0, 1000],
    location: '',
  });

  // Загружаем категории
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const fetchedCategories = await getCategories();
        setCategories(fetchedCategories);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };
    fetchCategories();
  }, []);

  // Применяем фильтры к объявлениям
  const filteredListings = useMemo(() => {
    return listings.filter(listing => {
      // Фильтр по тексту поиска
      if (
        filters.search &&
        !listing.title.toLowerCase().includes(filters.search.toLowerCase()) &&
        !listing.description.toLowerCase().includes(filters.search.toLowerCase())
      ) {
        return false;
      }

      // Фильтр по категории
      if (filters.category !== 'all' && listing.category !== filters.category) {
        return false;
      }

      // Фильтр по ценовому диапазону
      if (listing.price < filters.priceRange[0] || listing.price > filters.priceRange[1]) {
        return false;
      }

      // Фильтр по местоположению
      if (filters.location && listing.location !== filters.location) {
        return false;
      }

      return true;
    });
  }, [listings, filters]);

  const handleFilterChange = (newFilters: FilterValues) => {
    setFilters(newFilters);
  };

  return (
    <div className="mt-4">
      <ListingFilter categories={categories} onFilterChange={handleFilterChange} />

      {filteredListings.length === 0 ? (
        <div className="text-center py-10">
          <h3 className="text-lg font-semibold mb-2">Объявления не найдены</h3>
          <p className="text-muted-foreground">
            Попробуйте изменить параметры поиска или фильтры.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredListings.map(listing => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
}