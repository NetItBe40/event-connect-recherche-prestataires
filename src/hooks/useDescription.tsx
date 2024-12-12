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
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de sauvegarder la description : ID manquant",
      });
      return;
    }

    try {
      console.log("Début de la sauvegarde pour le lieu:", placeId);
      
      // Vérification de la description actuelle
      const { data: currentData, error: checkError } = await supabase
        .from('places')
        .select('description')
        .eq('id', placeId)
        .maybeSingle();

      if (checkError) {
        setDebugInfo({
          step: "Erreur lors de la vérification initiale",
          placeId,
          error: checkError,
          rawResponse: currentData
        });
        throw checkError;
      }

      const currentDescription = currentData?.description;

      setDebugInfo({
        step: "Début de la sauvegarde",
        placeId,
        descriptionToSave: description,
        currentDescription,
        rawResponse: currentData
      });

      // Sauvegarde de la nouvelle description
      const { data: updateData, error: updateError } = await supabase
        .from('places')
        .update({ description })
        .eq('id', placeId)
        .select();

      if (updateError) {
        setDebugInfo(prev => ({
          ...prev,
          step: "Erreur lors de la mise à jour",
          error: updateError,
          rawResponse: updateData
        }));
        throw updateError;
      }

      // Vérification après sauvegarde
      const { data: verificationData, error: verificationError } = await supabase
        .from('places')
        .select('description')
        .eq('id', placeId)
        .maybeSingle();

      if (verificationError) {
        setDebugInfo(prev => ({
          ...prev,
          step: "Erreur lors de la vérification finale",
          error: verificationError,
          rawResponse: verificationData
        }));
        throw verificationError;
      }

      const finalDescription = verificationData?.description;

      setDebugInfo(prev => ({
        ...prev,
        step: "Après la sauvegarde",
        updateResponse: updateData,
        verificationResult: {
          data: verificationData,
          currentDescription: finalDescription,
          rawResponse: verificationData
        }
      }));

      console.log("Sauvegarde réussie. Description actuelle:", finalDescription);
      
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