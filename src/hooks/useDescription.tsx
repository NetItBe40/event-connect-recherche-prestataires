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
      
      // Remove any asterisks from the beginning of the description
      const cleanDescription = description.replace(/^\*+/, '');
      console.log("Description nettoyée à sauvegarder:", cleanDescription);
      
      // Vérification de la description actuelle
      const { data: currentData, error: checkError } = await supabase
        .from('places')
        .select('description')
        .eq('id', placeId)
        .single();

      if (checkError) {
        console.error("Erreur lors de la vérification initiale:", checkError);
        throw checkError;
      }

      console.log("Description actuelle:", currentData?.description);

      // Sauvegarde de la nouvelle description
      const { data: updateData, error: updateError } = await supabase
        .from('places')
        .update({ description: cleanDescription })
        .eq('id', placeId)
        .select();

      if (updateError) {
        console.error("Erreur lors de la mise à jour:", updateError);
        throw updateError;
      }

      console.log("Mise à jour effectuée:", updateData);

      // Vérification après sauvegarde
      const { data: verificationData, error: verificationError } = await supabase
        .from('places')
        .select('description')
        .eq('id', placeId)
        .single();

      if (verificationError) {
        console.error("Erreur lors de la vérification finale:", verificationError);
        throw verificationError;
      }

      setDebugInfo({
        step: "Sauvegarde réussie",
        placeId,
        descriptionToSave: cleanDescription,
        currentDescription: currentData?.description,
        updateResponse: updateData,
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