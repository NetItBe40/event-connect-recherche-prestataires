import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Search } from "lucide-react";
import { ExistingPlaceAlert } from './ExistingPlaceAlert';
import { Checkbox } from "./ui/checkbox";
import { useToast } from "@/hooks/use-toast";

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

      if (error) throw error;
      console.log("Résultats de la requête:", data);
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
    try {
      console.log("Suppression du lieu:", placeId);
      
      const { error } = await supabase
        .from('places')
        .delete()
        .eq('id', placeId);

      if (error) throw error;

      // Mise à jour de l'état local après une suppression réussie
      setPlaces(prevPlaces => prevPlaces.filter(place => place.id !== placeId));
      
      toast({
        title: "Succès",
        description: "La fiche prestataire a été supprimée avec succès",
      });

    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression",
      });
      // Rafraîchir la liste en cas d'erreur
      await fetchPlaces(searchQuery);
    }
  };

  useEffect(() => {
    fetchPlaces(searchQuery);
  }, [searchQuery, filters]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPlaces(searchQuery);
  };

  const handleFilterChange = (filterName: keyof typeof filters) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: !prev[filterName]
    }));
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Rechercher un prestataire existant..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button type="submit" disabled={isLoading}>
            <Search className="h-4 w-4 mr-2" />
            Rechercher
          </Button>
        </div>
        
        <div className="flex gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="hasDescription"
              checked={filters.hasDescription}
              onCheckedChange={() => handleFilterChange('hasDescription')}
            />
            <label
              htmlFor="hasDescription"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Avec description
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox 
              id="hasBingPhoto"
              checked={filters.hasBingPhoto}
              onCheckedChange={() => handleFilterChange('hasBingPhoto')}
            />
            <label
              htmlFor="hasBingPhoto"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Avec photo Bing
            </label>
          </div>
        </div>
      </form>

      <div className="space-y-4">
        {isLoading ? (
          <Card className="p-4">Chargement...</Card>
        ) : places.length === 0 ? (
          <Card className="p-4">Aucun prestataire trouvé</Card>
        ) : (
          places.map((place) => (
            <div key={place.id} onClick={() => onSelect(place)} className="cursor-pointer">
              <ExistingPlaceAlert 
                place={place} 
                onDelete={() => handleDelete(place.id)}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}