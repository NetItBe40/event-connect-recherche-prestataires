import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

export function useDescription(placeId?: string, initialDescription?: string) {
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    console.log("Initial description received:", initialDescription);
    if (initialDescription) {
      try {
        const parsed = JSON.parse(initialDescription);
        console.log("Parsed description:", parsed);
        
        if (Array.isArray(parsed)) {
          const text = parsed
            .filter(item => item && typeof item === 'string' && item !== 't')
            .join('\n\n');
          console.log("Setting description to:", text);
          setDescription(text);
        }
      } catch (error) {
        console.error("Error parsing description:", error);
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
      console.log("Saving description:", description);
      
      // Créer un tableau avec la description complète comme premier élément
      const descriptionArray = [description];
      console.log("Description array to save:", descriptionArray);

      const { error: updateError } = await supabase
        .from('places')
        .update({ 
          description: JSON.stringify(descriptionArray)
        })
        .eq('id', placeId);

      if (updateError) {
        throw updateError;
      }

      console.log("Description saved successfully");
      toast({
        title: "Succès",
        description: "La description a été sauvegardée",
      });
    } catch (error) {
      console.error("Save error:", error);
      setError("Impossible de sauvegarder la description");
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
    error,
    handleSaveDescription
  };
}