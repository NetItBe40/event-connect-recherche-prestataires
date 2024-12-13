import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export function useImageSave() {
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const saveImage = async (placeId: string, selectedImage: string) => {
    if (!selectedImage || !placeId) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez sélectionner une image",
      });
      return;
    }

    setIsSaving(true);
    try {
      console.log("Starting image save process...");
      console.log("Place ID:", placeId);
      console.log("Selected image URL:", selectedImage);

      const { error: updateError } = await supabase
        .from("places")
        .update({ photobing1: selectedImage })
        .eq("id", placeId);

      if (updateError) {
        console.error("Update error:", updateError);
        throw updateError;
      }

      const { data: verifyData, error: verifyError } = await supabase
        .from("places")
        .select("photobing1")
        .eq("id", placeId)
        .maybeSingle();

      if (verifyError) {
        console.error("Verification error:", verifyError);
        throw verifyError;
      }

      if (!verifyData || verifyData.photobing1 !== selectedImage) {
        console.error("Verification failed:", verifyData);
        throw new Error("Failed to verify the image update");
      }

      toast({
        title: "Image sauvegardée",
        description: "L'image a été sauvegardée avec succès",
      });
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de sauvegarder l'image",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return { saveImage, isSaving };
}