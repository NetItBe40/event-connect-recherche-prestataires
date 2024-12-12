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
      
      // Vérification de l'état actuel
      const { data: currentData, error: fetchError } = await supabase
        .from('places')
        .select('description')
        .eq('id', placeId)
        .single();

      if (fetchError) {
        throw new Error("Erreur lors de la récupération des données actuelles");
      }

      // Mise à jour de la description
      const { error: updateError } = await supabase
        .from('places')
        .update({ description })
        .eq('id', placeId);

      if (updateError) {
        throw updateError;
      }

      // Vérification après mise à jour
      const { data: verificationData, error: verificationError } = await supabase
        .from('places')
        .select('description')
        .eq('id', placeId)
        .single();

      if (verificationError) {
        throw new Error("Erreur lors de la vérification finale");
      }

      setDebugInfo({
        step: "Sauvegarde réussie",
        placeId,
        currentDescription: currentData?.description,
        descriptionToSave: description,
        verificationResult: {
          data: verificationData,
          currentDescription: verificationData?.description
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