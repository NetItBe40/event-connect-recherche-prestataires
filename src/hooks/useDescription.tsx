import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useDescription() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSaveDescription = async (placeId: string, description: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log("Tentative de sauvegarde de la description pour:", placeId);
      
      let updateQuery;
      
      // Si l'ID commence par ChIJ, c'est un Google Place ID
      if (placeId.startsWith('ChIJ')) {
        updateQuery = supabase
          .from('places')
          .update({ description })
          .eq('place_id', placeId);
      } else {
        // Sinon c'est un UUID Supabase
        updateQuery = supabase
          .from('places')
          .update({ description })
          .eq('id', placeId);
      }
      
      const { error: updateError } = await updateQuery;

      if (updateError) {
        console.error("Erreur lors de la sauvegarde:", updateError);
        throw updateError;
      }

      toast.success("Description sauvegardée avec succès");
    } catch (error: any) {
      console.error("Erreur lors de la sauvegarde:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      setError(`Impossible de sauvegarder la description: ${error}`);
      toast.error("Impossible de sauvegarder la description");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleSaveDescription,
    isLoading,
    error
  };
}