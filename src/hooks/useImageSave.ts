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
      let finalId: string;

      // Check if this is a Google Place ID (starts with 'ChIJ')
      if (placeId.startsWith('ChIJ')) {
        console.log("Recherche du lieu avec le Google Place ID:", placeId);
        const { data: places, error: fetchError } = await supabase
          .from("places")
          .select("id")
          .eq("place_id", placeId);

        if (fetchError) {
          console.error("Erreur lors de la recherche du lieu:", fetchError);
          throw fetchError;
        }

        if (!places || places.length === 0) {
          console.error("Aucun lieu trouvé avec ce Google Place ID");
          throw new Error("Lieu non trouvé");
        }

        // Prendre le premier ID trouvé
        finalId = places[0].id;
        console.log("ID Supabase trouvé:", finalId);
      } else {
        // If it's not a Google Place ID, use it directly as Supabase UUID
        finalId = placeId;
      }

      console.log("Mise à jour de l'image pour le lieu:", finalId);
      const { error: updateError } = await supabase
        .from("places")
        .update({ photobing1: selectedImage })
        .eq("id", finalId);

      if (updateError) {
        console.error("Erreur lors de la mise à jour de l'image:", updateError);
        throw updateError;
      }

      toast.success("Image sauvegardée avec succès");
    } catch (error) {
      console.error("Erreur complète lors de la sauvegarde:", error);
      toast.error("Impossible de sauvegarder l'image");
    } finally {
      setIsSaving(false);
    }
  };

  return { saveImage, isSaving };
}