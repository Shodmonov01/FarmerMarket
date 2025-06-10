// import { useState } from 'react';
// import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { Input } from '@/components/ui/input';
// import { Slider } from '@/components/ui/slider';
// import { Search, SlidersHorizontal } from 'lucide-react';

// import { Category } from '@/types';
// import { categories } from '@/mock/data';
// import { motion, AnimatePresence } from 'framer-motion';

// interface ListingFilterProps {
//   onFilterChange: (filters: FilterValues) => void;
// }

// export interface FilterValues {
//   search: string;
//   category: Category | 'all';
//   priceRange: [number, number];
//   location: string;
// }

// export default function ListingFilter({ onFilterChange }: ListingFilterProps) {
//   const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
//   const [filters, setFilters] = useState<FilterValues>({
//     search: '',
//     category: 'all',
//     priceRange: [0, 1000],
//     location: '',
//   });

//   const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const updatedFilters = { ...filters, search: e.target.value };
//     setFilters(updatedFilters);
//     onFilterChange(updatedFilters);
//   };

//   const handleCategoryChange = (value: string) => {
//     const updatedFilters = { 
//       ...filters, 
//       category: value as Category | 'all'
//     };
//     setFilters(updatedFilters);
//     onFilterChange(updatedFilters);
//   };

//   const handlePriceChange = (value: number[]) => {
//     const updatedFilters = { 
//       ...filters, 
//       priceRange: [value[0], value[1]] as [number, number]
//     };
//     setFilters(updatedFilters);
//     onFilterChange(updatedFilters);
//   };

//   const handleLocationChange = (value: string) => {
//     const updatedFilters = { ...filters, location: value };
//     setFilters(updatedFilters);
//     onFilterChange(updatedFilters);
//   };

//   const handleReset = () => {
//     const resetFilters = {
//       search: '',
//       category: 'all',
//       priceRange: [0, 1000],
//       location: '',
//     };
//     setFilters(resetFilters);
//     onFilterChange(resetFilters);
//   };

//   return (
//     <div className="mb-6 space-y-4">
//       <div className="relative">
//         <Input
//           placeholder="Поиск товаров..."
//           value={filters.search}
//           onChange={handleSearchChange}
//           className="pl-10"
//         />
//         <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//       </div>

//       <Tabs 
//         defaultValue="all" 
//         value={filters.category}
//         onValueChange={handleCategoryChange}
//         className="w-full"
//       >
//         <TabsList className="grid grid-cols-4 w-full">
//           <TabsTrigger value="all">Все</TabsTrigger>
//           <TabsTrigger value="Berries">Ягоды</TabsTrigger>
//           <TabsTrigger value="Fruits">Фрукты</TabsTrigger>
//           <TabsTrigger value="Vegetables">Овощи</TabsTrigger>
//         </TabsList>
//       </Tabs>
//     </div>
//   );
// }

import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { Category } from '@/types';

interface ListingFilterProps {
  categories: Category[];
  onFilterChange: (filters: FilterValues) => void;
}

export interface FilterValues {
  search: string;
  category: Category['name'] | 'all';
  priceRange: [number, number];
  location: string;
}

export default function ListingFilter({ categories, onFilterChange }: ListingFilterProps) {
  const [filters, setFilters] = useState<FilterValues>({
    search: '',
    category: 'all',
    priceRange: [0, 1000],
    location: '',
  });



  // Обработчик изменения категории
  const handleCategoryChange = (value: string) => {
    const updatedFilters = { ...filters, category: value as Category['name'] | 'all' };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  // Перевод названий категорий
  const getCategoryDisplayName = (name: string) => {
    switch (name) {
      case 'Дикоросы':
        return 'Дико-ие';
      case 'Ягоды':
        return 'Ягоды';
      case 'Фрукты':
        return 'Фрукты';
      case 'Овощи':
        return 'Овощи';
      default:
        return name;
    }
  };

  return (
    <div className="mb-6 space-y-4 p-4 bg-white rounded-lg shadow-sm">
      <Tabs 
        defaultValue="all" 
        value={filters.category}
        onValueChange={handleCategoryChange}
        className="w-full"
      >
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="all" >Все</TabsTrigger>
        {categories.map((cat) => (
          <TabsTrigger key={cat.id}
          value={cat.name} >{getCategoryDisplayName(cat.name)}</TabsTrigger>
        ))}
        </TabsList>
      </Tabs>

    </div>
  );
}