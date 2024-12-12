import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { DescriptionDebugDialog } from "@/components/description/DescriptionDebugDialog";

export function useDescription(placeId?: string, initialDescription?: string) {
  const [description, setDescription] = useState(initialDescription || "");
  const [error, setError] = useState<string | null>(null);
  const [debugDialog, setDebugDialog] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>({});
  const { toast } = useToast();

  const handleSaveDescription = async () => {
    if (!placeId) {
      setError("ID manquant");
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "ID manquant",
      });
      return;
    }

    try {
      console.log("Début de la sauvegarde pour le lieu:", placeId);
      console.log("Description à sauvegarder:", description);

      // Update the description
      const { data: updateData, error: updateError } = await supabase
        .from('places')
        .update({ 
          description: description 
        })
        .eq('id', placeId)
        .select();

      if (updateError) {
        console.error("Erreur lors de la mise à jour:", updateError);
        throw updateError;
      }

      if (!updateData || updateData.length === 0) {
        throw new Error("Aucun enregistrement mis à jour");
      }

      const updatedPlace = updateData[0];
      console.log("Place mise à jour:", updatedPlace);

      setDebugInfo({
        step: "Sauvegarde réussie",
        placeId,
        descriptionToSave: description,
        updateResponse: updatedPlace,
        verificationResult: {
          data: updatedPlace,
          currentDescription: updatedPlace.description
        }
      });

      toast({
        title: "Succès",
        description: "La description a été sauvegardée avec succès",
      });

      setError(null);
      setDebugDialog(true);

    } catch (error: any) {
      console.error("Erreur lors de la sauvegarde:", error);
      
      const errorMessage = error.message || "Erreur inconnue";
      setError(`Impossible de sauvegarder la description: ${errorMessage}`);
      
      setDebugInfo({
        step: "Erreur",
        placeId,
        descriptionToSave: description,
        error: errorMessage
      });
      
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de sauvegarder la description. Veuillez réessayer.",
      });
      
      setDebugDialog(true);
    }
  };

  const DebugDialog = () => (
    <DescriptionDebugDialog
      open={debugDialog}
      onOpenChange={setDebugDialog}
      debugInfo={debugInfo}
    />
  );

  return {
    description,
    setDescription,
    error,
    handleSaveDescription,
    DebugDialog
  };
}