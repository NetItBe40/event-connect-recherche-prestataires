import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useImageSave() {
  const [isSaving, setIsSaving] = useState(false);

  const saveImage = async (placeId: string, selectedImage: string) => {
    if (!selectedImage || !placeId) {
      toast.error("Veuillez sélectionner une image");
      return;
    }

    setIsSaving(true);
    try {
      // First, find the place by its Google Place ID
      const { data: place, error: fetchError } = await supabase
        .from("places")
        .select("id")
        .eq("place_id", placeId)
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (!place) {
        throw new Error("Place not found");
      }

      // Then update using the Supabase UUID
      const { error: updateError } = await supabase
        .from("places")
        .update({ photobing1: selectedImage })
        .eq("id", place.id);

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