import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useImageSave() {
  const [isSaving, setIsSaving] = useState(false);

  const saveImage = async (supabaseId: string, selectedImage: string, googlePlaceId?: string) => {
    if (!selectedImage) {
      toast.error("Veuillez sélectionner une image");
      return;
    }

    setIsSaving(true);
    try {
      let finalId = supabaseId;

      // If we have a Google Place ID, we need to find the corresponding Supabase ID
      if (googlePlaceId && !supabaseId) {
        console.log("Recherche du lieu avec le Google Place ID:", googlePlaceId);
        const { data: place, error: fetchError } = await supabase
          .from("places")
          .select("id")
          .eq("place_id", googlePlaceId)
          .maybeSingle();

        if (fetchError) throw fetchError;

        if (!place) {
          throw new Error("Lieu non trouvé");
        }

        finalId = place.id;
      }

      console.log("Mise à jour de l'image pour le lieu:", finalId);
      const { error: updateError } = await supabase
        .from("places")
        .update({ photobing1: selectedImage })
        .eq("id", finalId);

      if (updateError) throw updateError;

      toast.success("Image sauvegardée");
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      toast.error("Impossible de sauvegarder l'image");
    } finally {
      setIsSaving(false);
    }
  };

  return { saveImage, isSaving };
}