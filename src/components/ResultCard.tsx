import { Card } from "@/components/ui/card";
import { useToast } from "./ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PlaceHeader } from "./place/PlaceHeader";
import { PlaceDetails } from "./place/PlaceDetails";
import { useEffect, useState } from "react";
import { useSupabaseSearch } from "@/hooks/useSupabaseSearch";
import { Badge } from "./ui/badge";
import { AlertCircle, Eye } from "lucide-react";
import { Button } from "./ui/button";
import { PlaceDetailsDialog } from "./PlaceDetailsDialog";

interface Place {
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
  onSelect?: () => void;
}

export function ResultCard({ place, onSelect }: ResultCardProps) {
  const { toast } = useToast();
  const { checkExistingPlace } = useSupabaseSearch();
  const [existingPlace, setExistingPlace] = useState<Place | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const checkPlace = async () => {
      const existing = await checkExistingPlace(place.title);
      setExistingPlace(existing);
    };
    checkPlace();
  }, [place.title]);

  const handleSelect = async () => {
    try {
      if (!place.title || !place.address) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Le titre et l'adresse sont obligatoires",
        });
        return;
      }

      const reviews = place.reviews ? place.reviews.toString().replace(/\s+avis$/, '') : null;

      const { error } = await supabase
        .from('places')
        .insert([
          {
            title: place.title,
            address: place.address,
            rating: place.rating,
            reviews: reviews,
            type: place.type,
            phone: place.phone,
            website: place.website,
            latitude: place.latitude,
            longitude: place.longitude,
            timezone: place.timezone,
            place_id: place.placeId,
            place_link: place.placeLink,
            price_level: place.priceLevel,
            opening_hours: place.openingHours,
            city: place.city,
            verified: place.verified,
            photos: place.photos,
            state: place.state,
            description: place.description
          }
        ]);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Le lieu a été sauvegardé avec succès",
      });

      if (onSelect) {
        onSelect();
      }

    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la sauvegarde",
      });
    }
  };

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
      </PlaceHeader>
      <PlaceDetails place={place} />
      <div className="p-6 border-t">
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => setShowDetails(true)}
        >
          <Eye className="h-4 w-4 mr-2" />
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