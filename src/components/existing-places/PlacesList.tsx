import { Card } from "../ui/card";
import { ExistingPlaceAlert } from "../ExistingPlaceAlert";

interface Place {
  id: string;
  title: string;
  address: string;
  phone?: string;
  type?: string;
  rating?: string;
  description?: string;
  photobing1?: string;
}

interface PlacesListProps {
  places: Place[];
  isLoading: boolean;
  onSelect: (place: Place) => void;
  onDelete: (placeId: string) => void;
}

export function PlacesList({ places, isLoading, onSelect, onDelete }: PlacesListProps) {
  if (isLoading) {
    return <Card className="p-4">Chargement...</Card>;
  }

  if (places.length === 0) {
    return <Card className="p-4">Aucun prestataire trouvé</Card>;
  }

  return (
    <div className="space-y-4">
      {places.map((place) => (
        <div key={place.id} onClick={() => onSelect(place)} className="cursor-pointer">
          <ExistingPlaceAlert 
            place={place} 
            onDelete={() => onDelete(place.id)}
          />
        </div>
      ))}
    </div>
  );
}