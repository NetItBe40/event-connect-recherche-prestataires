import { Card } from "@/components/ui/card";
import { useToast } from "./ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PlaceHeader } from "./place/PlaceHeader";
import { PlaceDetails } from "./place/PlaceDetails";

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

  const handleSelect = async () => {
    try {
      // Validation des champs obligatoires
      if (!place.title || !place.address) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Le titre et l'adresse sont obligatoires",
        });
        return;
      }

      // Ensure reviews is just the number before saving
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
    <Card className="h-full">
      <PlaceHeader 
        title={place.title}
        verified={place.verified}
        id={place.id}
        onSelect={handleSelect}
      />
      <PlaceDetails place={place} />
    </Card>
  );
}