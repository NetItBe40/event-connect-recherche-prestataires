import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { parseDescription, formatDescriptionForSave } from "@/utils/descriptionFormatter";
import { DescriptionDebugDialog } from "@/components/description/DescriptionDebugDialog";

export function useDescription(placeId?: string, initialDescription?: string) {
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [debugDialog, setDebugDialog] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>({});
  const { toast } = useToast();

  useEffect(() => {
    if (initialDescription) {
      const parsedDescription = parseDescription(initialDescription);
      setDescription(parsedDescription);
      console.log("Description initiale chargée:", parsedDescription);
    }
  }, [initialDescription]);

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
      
      const descriptionArray = formatDescriptionForSave(description);
      console.log("Description à sauvegarder:", descriptionArray);
      
      setDebugInfo({
        step: "Début de la sauvegarde",
        placeId,
        descriptionToSave: description,
        descriptionArray,
        jsonString: JSON.stringify(descriptionArray)
      });

      const { data: currentData, error: currentError } = await supabase
        .from('places')
        .select('description')
        .eq('id', placeId)
        .single();

      if (currentError) {
        throw currentError;
      }

      setDebugInfo(prev => ({
        ...prev,
        step: "Description actuelle",
        currentDescription: currentData?.description
      }));
      
      const { error: updateError } = await supabase
        .from('places')
        .update({ 
          description: JSON.stringify(descriptionArray)
        })
        .eq('id', placeId);

      if (updateError) {
        throw updateError;
      }

      const { data: verificationData, error: verificationError } = await supabase
        .from('places')
        .select('description')
        .eq('id', placeId)
        .single();

      if (verificationError) {
        throw verificationError;
      }

      setDebugInfo(prev => ({
        ...prev,
        step: "Après la sauvegarde",
        supabaseResponse: { data: verificationData, error: updateError },
        verificationResult: {
          data: verificationData,
          error: verificationError,
          currentDescription: verificationData?.description,
          parsedDescription: JSON.parse(verificationData?.description || '[]')
        }
      }));

      console.log("Sauvegarde réussie. Description actuelle:", verificationData);
      
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