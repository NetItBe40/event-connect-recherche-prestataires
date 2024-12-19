import { Card } from "@/components/ui/card";
import { Badge } from "./ui/badge";
import { AlertCircle, Eye } from "lucide-react";
import { Button } from "./ui/button";
import { PlaceHeader } from "./place/PlaceHeader";
import { PlaceDetails } from "./place/PlaceDetails";
import { PlaceDetailsDialog } from "./PlaceDetailsDialog";
import { useEffect, useState } from "react";
import { useSupabaseSearch } from "@/hooks/useSupabaseSearch";
import { PlaceActions } from "./result-card/PlaceActions";
import { usePlaceSelection } from "./result-card/PlaceSelection";

export interface Place {
  id?: string;
  title: string;
  address: string;
  rating?: string;
  reviews?: string;
  type?: string;
  phone?: string;
  website?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  placeId?: string;
  placeLink?: string;
  priceLevel?: string;
  openingHours?: {
    [key: string]: string;
  };
  city?: string;
  verified?: boolean;
  photos?: string;
  state?: string;
  description?: string;
}

interface ResultCardProps {
  place: Place;
  onSelect?: (place: Place) => void;
  onDelete?: () => void;
}

export function ResultCard({ place, onSelect, onDelete }: ResultCardProps) {
  const { checkExistingPlace } = useSupabaseSearch();
  const [existingPlace, setExistingPlace] = useState<Place | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const { handleSelect } = usePlaceSelection({ place, onSelect });

  useEffect(() => {
    const checkPlace = async () => {
      const existing = await checkExistingPlace(place.placeId || '');
      setExistingPlace(existing);
    };
    checkPlace();
  }, [place.placeId]);

  return (
    <Card className="overflow-hidden">
      <PlaceHeader 
        title={place.title}
        verified={place.verified}
        id={place.id}
        onSelect={handleSelect}
      >
        {existingPlace && (
          <Badge variant="destructive" className="flex items-center gap-1">
            <AlertCircle className="h-4 w-4" />
            Fiche existante
          </Badge>
        )}
        {place.placeId && (
          <PlaceActions
            placeId={place.placeId}
            title={place.title}
            onDelete={onDelete}
          />
        )}
      </PlaceHeader>
      
      <PlaceDetails place={place} />
      
      <div className="p-6 border-t bg-white">
        <Button
          variant="outline"
          size="sm"
          className="w-full flex items-center justify-center gap-2"
          onClick={() => setShowDetails(true)}
        >
          <Eye className="h-4 w-4" />
          Voir les détails
        </Button>
      </div>
      
      <PlaceDetailsDialog 
        place={place}
        open={showDetails}
        onOpenChange={setShowDetails}
      />
    </Card>
  );
}