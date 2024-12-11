import { useState, useEffect } from 'react';
import { supabase } from "@/lib/supabase";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Search } from "lucide-react";
import { ExistingPlaceAlert } from './ExistingPlaceAlert';

interface Place {
  id: string;
  title: string;
  address: string;
  phone?: string;
  type?: string;
  rating?: string;
}

interface ExistingPlacesListProps {
  onSelect: (place: Place) => void;
}

export function ExistingPlacesList({ onSelect }: ExistingPlacesListProps) {
  const [places, setPlaces] = useState<Place[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchPlaces = async (query: string = '') => {
    setIsLoading(true);
    try {
      let supabaseQuery = supabase
        .from('places')
        .select('id, title, address, phone, type, rating');

      if (query) {
        supabaseQuery = supabaseQuery.ilike('title', `%${query}%`);
      }

      const { data, error } = await supabaseQuery;

      if (error) throw error;
      setPlaces(data || []);
    } catch (error) {
      console.error('Erreur lors de la récupération des lieux:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaces();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPlaces(searchQuery);
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="flex gap-2">
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
      </form>

      <div className="space-y-4">
        {isLoading ? (
          <Card className="p-4">Chargement...</Card>
        ) : places.length === 0 ? (
          <Card className="p-4">Aucun prestataire trouvé</Card>
        ) : (
          places.map((place) => (
            <div key={place.id} onClick={() => onSelect(place)} className="cursor-pointer">
              <ExistingPlaceAlert place={place} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}