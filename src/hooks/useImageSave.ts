import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useImageSave() {
  const [isSaving, setIsSaving] = useState(false);

  const saveImage = async (placeId: string, selectedImage: string) => {
    if (!selectedImage || !placeId) {
      toast.error("Erreur", {
        description: "Veuillez sélectionner une image",
      });
      return;
    }

    setIsSaving(true);
    try {
      const { error: updateError } = await supabase
        .from("places")
        .update({ photobing1: selectedImage })
        .eq("id", placeId);

      if (updateError) throw updateError;

      const { data: verifyData, error: verifyError } = await supabase
        .from("places")
        .select("photobing1")
        .eq("id", placeId)
        .maybeSingle();

      if (verifyError) throw verifyError;

      if (!verifyData || verifyData.photobing1 !== selectedImage) {
        throw new Error("Failed to verify the image update");
      }

      toast.success("Image sauvegardée", {
        description: "L'image a été sauvegardée avec succès",
      });
    } catch (error) {
      toast.error("Erreur", {
        description: "Impossible de sauvegarder l'image",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return { saveImage, isSaving };
}