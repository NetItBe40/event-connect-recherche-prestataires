import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PlaceHeader } from "./place/PlaceHeader";
import { PlaceDetails } from "./place/PlaceDetails";
import { useEffect, useState } from "react";
import { useSupabaseSearch } from "@/hooks/useSupabaseSearch";
import { Badge } from "./ui/badge";
import { AlertCircle, Eye, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { PlaceDetailsDialog } from "./PlaceDetailsDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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
  onSelect?: (place: Place) => void;
  onDelete?: () => void;
}

export function ResultCard({ place, onSelect, onDelete }: ResultCardProps) {
  const { toast } = useToast();
  const { checkExistingPlace } = useSupabaseSearch();
  const [existingPlace, setExistingPlace] = useState<Place | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const checkPlace = async () => {
      const existing = await checkExistingPlace(place.placeId || '');
      setExistingPlace(existing);
    };
    checkPlace();
  }, [place.placeId]);

  const handleDelete = async () => {
    try {
      if (!place.placeId) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de supprimer cette fiche",
        });
        return;
      }

      console.log("Tentative de suppression du lieu avec place_id:", place.placeId);

      const { error } = await supabase
        .from('places')
        .delete()
        .eq('place_id', place.placeId);

      if (error) {
        console.error('Erreur lors de la suppression:', error);
        throw error;
      }

      toast({
        title: "Succès",
        description: "La fiche prestataire a été supprimée avec succès",
      });

      if (onDelete) {
        onDelete();
      }

    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression",
      });
    }
  };

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
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                size="sm"
                className="ml-2"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                <AlertDialogDescription>
                  Cette action est irréversible. Cela supprimera définitivement la fiche de {place.title}.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>
                  Supprimer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
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