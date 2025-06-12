import { useState, useContext, useMemo, useEffect } from 'react';
import { ListingContext } from '@/context/ListingContext';
import ListingCard from '@/components/listings/ListingCard';
import ListingFilter, { FilterValues } from '@/components/listings/ListingFilter';
import { Category, Listing } from '@/types';
import { getCategories } from '@/api/products';

const Loading = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

export default function HomePage() {
  const { listings, loading } = useContext(ListingContext); // Assume ListingContext provides a loading state
  const [categories, setCategories] = useState<Category[]>([]);
  const [filters, setFilters] = useState<FilterValues>({
    // search: '',
    category: 'all',
    // location: '',
  });

  // Load categories
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

  // Apply filters to listings
  const filteredListings = useMemo(() => {
    return listings.filter(listing => {
      // Search filter
      if (
        filters.search &&
        !listing.title.toLowerCase().includes(filters.search.toLowerCase()) &&
        !listing.description.toLowerCase().includes(filters.search.toLowerCase())
      ) {
        return false;
      }

      // // Category filter
      if (filters.category !== 'all' && listing.category !== filters.category) {
        return false;
      }

      // Price range filter
      // if (listing.price < filters.priceRange[0] || listing.price > filters.priceRange[1]) {
      //   return false;
      // }

      // Location filter
      if (filters.location && listing.location !== filters.location) {
        return false;
      }

      return true;
    });
  }, [listings, filters]);

  const handleFilterChange = (newFilters: FilterValues) => {
    setFilters(newFilters);
  };
  console.log('Фильтры:', filters);
  console.log('Фильтруемые категории:', listings.map(l => l.category));
  
  return (
    <div className="mt-4">
      <ListingFilter categories={categories} onFilterChange={handleFilterChange} />

      {loading ? (
        <Loading />
      ) : filteredListings.length === 0 ? (
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