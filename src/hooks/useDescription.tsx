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

      // Vérifier d'abord si l'enregistrement existe
      const { data: existingPlace, error: checkError } = await supabase
        .from('places')
        .select('id, description')
        .eq('id', placeId)
        .single();

      if (checkError) {
        throw new Error(`Erreur lors de la vérification: ${checkError.message}`);
      }

      if (!existingPlace) {
        throw new Error("Lieu non trouvé");
      }

      // Mise à jour avec la nouvelle description
      const { data: updateData, error: updateError } = await supabase
        .from('places')
        .update({ description })
        .eq('id', placeId)
        .select()
        .single();

      if (updateError) {
        console.error("Erreur lors de la mise à jour:", updateError);
        throw updateError;
      }

      setDebugInfo({
        step: "Sauvegarde réussie",
        placeId,
        descriptionToSave: description,
        updateResponse: updateData,
        verificationResult: {
          data: updateData,
          currentDescription: updateData.description
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
      setError("Impossible de sauvegarder la description");
      
      setDebugInfo({
        step: "Erreur",
        placeId,
        descriptionToSave: description,
        error: error.message || "Erreur inconnue"
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