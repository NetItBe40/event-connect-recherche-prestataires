import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { SearchBar } from './existing-places/SearchBar';
import { FilterOptions } from './existing-places/FilterOptions';
import { PlacesList } from './existing-places/PlacesList';

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
  const [places, setPlaces] = useState<Place[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({
    hasDescription: false,
    hasBingPhoto: false,
  });
  const { toast } = useToast();

  const fetchPlaces = async (query: string = '') => {
    console.log("Fetching places with query:", query);
    setIsLoading(true);
    try {
      let supabaseQuery = supabase
        .from('places')
        .select('id, title, address, phone, type, rating, description, photobing1, website');

      if (query) {
        supabaseQuery = supabaseQuery.ilike('title', `%${query}%`);
      }

      if (filters.hasDescription) {
        supabaseQuery = supabaseQuery
          .not('description', 'is', null)
          .not('description', 'eq', '')
          .not('description', 'eq', '[]');
      }

      if (filters.hasBingPhoto) {
        supabaseQuery = supabaseQuery
          .not('photobing1', 'is', null)
          .not('photobing1', 'eq', '');
      }

      const { data, error } = await supabaseQuery;

      if (error) {
        console.error("Erreur Supabase:", error);
        throw error;
      }
      
      console.log("Places récupérées:", data);
      setPlaces(data || []);
    } catch (error) {
      console.error('Erreur lors de la récupération des lieux:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger la liste des prestataires",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (placeId: string) => {
    console.log("Tentative de suppression du lieu:", placeId);
    try {
      const { error } = await supabase
        .from('places')
        .delete()
        .eq('id', placeId);

      if (error) {
        console.error("Erreur lors de la suppression:", error);
        throw error;
      }

      console.log("Suppression réussie, mise à jour de la liste");
      // Mise à jour immédiate de l'état local
      setPlaces(currentPlaces => currentPlaces.filter(place => place.id !== placeId));
      
      toast({
        title: "Succès",
        description: "Le prestataire a été supprimé",
      });
    } catch (error) {
      console.error("Erreur complète:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer le prestataire",
      });
    }
  };

  useEffect(() => {
    console.log("Effect déclenché - Recherche ou filtres modifiés");
    fetchPlaces(searchQuery);
  }, [searchQuery, filters]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Recherche lancée");
    fetchPlaces(searchQuery);
  };

  const handleFilterChange = (filterName: keyof typeof filters) => {
    console.log("Changement de filtre:", filterName);
    setFilters(prev => ({
      ...prev,
      [filterName]: !prev[filterName]
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