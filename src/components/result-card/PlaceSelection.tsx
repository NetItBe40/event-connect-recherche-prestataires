import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Place } from "../ResultCard";

interface PlaceSelectionProps {
  place: Place;
  onSelect?: (place: Place) => void;
}

export function usePlaceSelection({ place, onSelect }: PlaceSelectionProps) {
  const { toast } = useToast();

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

      console.log("Début de la sauvegarde du lieu:", place);

      const reviews = place.reviews ? place.reviews.toString().replace(/\s+avis$/, '') : null;

      const { data, error } = await supabase
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
        ])
        .select()
        .maybeSingle();

      if (error) {
        console.error('Erreur Supabase:', error);
        throw error;
      }

      if (!data) {
        console.error('Aucune donnée retournée');
        throw new Error("Aucune donnée retournée après l'insertion");
      }

      console.log("Lieu sauvegardé avec succès:", data);

      toast({
        title: "Succès",
        description: "Le lieu a été sauvegardé avec succès",
      });

      if (onSelect) {
        const placeWithId: Place = {
          ...place,
          id: data.id
        };
        console.log("Transmission du lieu avec ID:", placeWithId);
        onSelect(placeWithId);
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

  return { handleSelect };
}