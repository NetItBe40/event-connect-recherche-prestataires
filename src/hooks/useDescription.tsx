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
      console.error("Erreur: ID manquant");
      setError("ID manquant");
      return;
    }

    try {
      console.log("Début de la sauvegarde pour le lieu:", placeId);
      console.log("Description à sauvegarder:", description);

      // Mise à jour de la description
      const { data: updateData, error: updateError } = await supabase
        .from('places')
        .update({
          description: description.trim() // Assurons-nous qu'il n'y a pas d'espaces inutiles
        })
        .eq('id', placeId)
        .select()
        .single();

      if (updateError) {
        console.error("Erreur lors de la mise à jour:", updateError);
        throw updateError;
      }

      console.log("Résultat de la mise à jour:", updateData);

      setDebugInfo({
        step: "Sauvegarde réussie",
        placeId,
        descriptionToSave: description,
        updateResponse: updateData,
        verificationResult: {
          data: updateData,
          currentDescription: updateData?.description
        }
      });

      toast({
        title: "Succès",
        description: "La description a été sauvegardée avec succès",
      });

      setDebugDialog(true);

    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      setError("Impossible de sauvegarder la description");
      
      setDebugInfo(prev => ({
        ...prev,
        step: "Erreur",
        error
      }));
      
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