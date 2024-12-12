import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

export function useDescription(placeId?: string, initialDescription?: string) {
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (initialDescription) {
      try {
        console.log("Description initiale reçue:", initialDescription);
        const parsedDescription = JSON.parse(initialDescription);
        console.log("Description parsée:", parsedDescription);
        if (Array.isArray(parsedDescription)) {
          const validDescriptions = parsedDescription
            .filter(desc => desc && typeof desc === 'string' && desc !== 't')
            .join('\n\n');
          console.log("Descriptions valides concaténées:", validDescriptions);
          setDescription(validDescriptions || "");
        } else {
          setDescription(initialDescription);
        }
      } catch (error) {
        console.log("Erreur lors du parsing de la description:", error);
        setDescription(initialDescription);
      }
    }
  }, [initialDescription]);

  const handleSaveDescription = async () => {
    if (!placeId) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de sauvegarder la description",
      });
      return;
    }

    try {
      console.log("Description actuelle avant la sauvegarde:", description);
      
      // Sauvegarde directe de la description actuelle comme premier élément du tableau
      const descriptionArray = [description];
      
      const { data, error } = await supabase
        .from('places')
        .update({ 
          description: JSON.stringify(descriptionArray)
        })
        .eq('id', placeId)
        .select();

      console.log("Résultat de la sauvegarde manuelle:", { data, error });

      if (error) throw error;

      toast({
        title: "Succès",
        description: "La description a été sauvegardée",
      });
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de sauvegarder la description",
      });
    }
  };

  return {
    description,
    setDescription,
    isLoading,
    error,
    handleSaveDescription
  };
}