import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useDescription(placeId: string | undefined, initialDescription?: string) {
  const [description, setDescription] = useState<string>(
    Array.isArray(initialDescription) 
      ? initialDescription[0] 
      : initialDescription || ""
  );
  const [error, setError] = useState<string | null>(null);

  const handleSaveDescription = async () => {
    if (!placeId) {
      setError("ID du lieu manquant");
      return;
    }

    try {
      const formattedDescription = [description.trim()];
      
      const { data: existingPlace, error: fetchError } = await supabase
        .from('places')
        .select('id')
        .eq('place_id', placeId)
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (!existingPlace) {
        throw new Error("Place not found");
      }

      const { error: updateError } = await supabase
        .from('places')
        .update({ 
          description: JSON.stringify(formattedDescription)
        })
        .eq('id', existingPlace.id);

      if (updateError) throw updateError;

      toast.success("Description sauvegardée");
      setError(null);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      setError(`Impossible de sauvegarder la description: ${error}`);
      toast.error("Erreur lors de la sauvegarde de la description");
    }
  };

  return {
    description,
    setDescription,
    error,
    handleSaveDescription,
  };
}