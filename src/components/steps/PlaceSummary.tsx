import { Card } from "../ui/card";
import { PlaceSummaryHeader } from "../place/PlaceSummaryHeader";
import { PlaceSummaryBasicInfo } from "../place/PlaceSummaryBasicInfo";
import { PlaceSummaryCategories } from "../place/PlaceSummaryCategories";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "../ui/use-toast";
import { PlaceDeleteDialog } from "../place/PlaceDeleteDialog";
import { PlaceSocialMedia } from "../place/PlaceSocialMedia";
import { PlaceEmails } from "../place/PlaceEmails";
import { PlaceDescription } from "../place/PlaceDescription";

interface PlaceSummaryProps {
  selectedPlace: {
    id?: string;
    title: string;
    address: string;
    phone?: string;
    type?: string;
    rating?: string;
    reviews?: string;
    website?: string;
    city?: string;
    state?: string;
    description?: string;
    photobing1?: string;
    opening_hours?: {
      [key: string]: string;
    };
    facebook?: string;
    instagram?: string;
    tiktok?: string;
    snapchat?: string;
    twitter?: string;
    linkedin?: string;
    github?: string;
    youtube?: string;
    pinterest?: string;
    email_1?: string;
    email_2?: string;
    latitude?: number;
    longitude?: number;
    timezone?: string;
    place_id?: string;
    place_link?: string;
    price_level?: string;
    verified?: boolean;
    photos?: string;
  } | null;
  onDelete?: () => void;
}

export function PlaceSummary({ selectedPlace, onDelete }: PlaceSummaryProps) {
  const { toast } = useToast();

  if (!selectedPlace) {
    return (
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Résumé</h2>
        <p className="text-gray-500">Aucun lieu sélectionné</p>
      </Card>
    );
  }

  const handleClearPhoto = async () => {
    if (!selectedPlace.id) return;

    try {
      const { error } = await supabase
        .from('places')
        .update({ photobing1: null })
        .eq('id', selectedPlace.id);

      if (error) throw error;

      toast({
        title: "Image supprimée",
        description: "L'image a été supprimée avec succès",
      });
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'image:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression de l'image",
      });
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Résumé</h2>
        {selectedPlace.id && (
          <PlaceDeleteDialog 
            title={selectedPlace.title}
            onDelete={onDelete || (() => {})}
          />
        )}
      </div>
      <div className="space-y-4">
        <PlaceSummaryHeader 
          title={selectedPlace.title}
          photobing1={selectedPlace.photobing1}
          onClearPhoto={handleClearPhoto}
        />
        
        <PlaceSummaryBasicInfo {...selectedPlace} />

        {selectedPlace.id && (
          <PlaceSummaryCategories placeId={selectedPlace.id} />
        )}

        <PlaceDescription description={selectedPlace.description} />

        {selectedPlace.opening_hours && Object.keys(selectedPlace.opening_hours).length > 0 && (
          <div>
            <strong>Horaires :</strong>
            <div className="mt-1 space-y-1">
              {Object.entries(selectedPlace.opening_hours).map(([day, hours]) => (
                <p key={day} className="text-sm">
                  <span className="font-medium">{day} :</span> {hours}
                </p>
              ))}
            </div>
          </div>
        )}

        <PlaceSocialMedia {...selectedPlace} />
        <PlaceEmails {...selectedPlace} />
      </div>
    </Card>
  );
}