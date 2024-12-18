import { useState, useEffect } from 'react';
import { SearchBar } from './existing-places/SearchBar';
import { FilterOptions } from './existing-places/FilterOptions';
import { PlacesList } from './existing-places/PlacesList';
import { usePlacesManagement } from '@/hooks/usePlacesManagement';

interface Place {
  id: string;
  title: string;
  address: string;
  phone?: string;
  type?: string;
  rating?: string;
  description?: string;
  photobing1?: string;
  website?: string;
}

interface ExistingPlacesListProps {
  onSelect: (place: Place) => void;
}

export function ExistingPlacesList({ onSelect }: ExistingPlacesListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    noDescription: false,
    noBingPhoto: false,
    categoryId: '',
  });

  const { places, isLoading, fetchPlaces, handleDelete } = usePlacesManagement();

  useEffect(() => {
    console.log("Effect déclenché - Recherche ou filtres modifiés");
    fetchPlaces(searchQuery, filters);
  }, [searchQuery, filters]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Recherche lancée");
    fetchPlaces(searchQuery, filters);
  };

  const handleFilterChange = (filterName: 'noDescription' | 'noBingPhoto') => {
    console.log("Changement de filtre:", filterName);
    setFilters(prev => ({
      ...prev,
      [filterName]: !prev[filterName]
    }));
  };

  const handleCategoryChange = (categoryId: string) => {
    console.log("Changement de catégorie:", categoryId);
    setFilters(prev => ({
      ...prev,
      categoryId
    }));
  };

  return (
    <div className="space-y-4">
      <SearchBar 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearch={handleSearch}
        isLoading={isLoading}
      />
      
      <FilterOptions 
        filters={filters}
        onFilterChange={handleFilterChange}
        onCategoryChange={handleCategoryChange}
      />

      <PlacesList 
        places={places}
        isLoading={isLoading}
        onSelect={onSelect}
        onDelete={handleDelete}
      />
    </div>
  );
}