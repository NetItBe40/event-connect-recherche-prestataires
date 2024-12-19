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
      
      // Mise à jour directe avec l'ID du lieu
      const { error: updateError } = await supabase
        .from('places')
        .update({ 
          description: JSON.stringify(formattedDescription)
        })
        .eq('id', placeId);

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