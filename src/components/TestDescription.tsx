import { supabase } from "@/integrations/supabase/client";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";
import { useState } from "react";

export function TestDescription() {
  const { toast } = useToast();
  const [currentValue, setCurrentValue] = useState<string | null>(null);
  
  const handleTest = async () => {
    try {
      console.log("Début du test d'écriture...");
      
      // Créer un tableau avec la valeur test
      const descriptionArray = ["test"];
      console.log("Description à sauvegarder:", descriptionArray);
      
      const { data, error } = await supabase
        .from('places')
        .update({ description: JSON.stringify(descriptionArray) })
        .eq('id', 'feef6749-89ad-484c-81b7-42783bffaea0')
        .select('description');

      if (error) {
        console.error("Erreur lors du test:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: error.message
        });
        return;
      }

      console.log("Résultat du test:", data);
      toast({
        title: "Succès",
        description: "La valeur 'test' a été écrite avec succès"
      });

      // Vérification de la valeur
      const { data: verificationData, error: verificationError } = await supabase
        .from('places')
        .select('description')
        .eq('id', 'feef6749-89ad-484c-81b7-42783bffaea0')
        .single();

      if (verificationError) {
        console.error("Erreur lors de la vérification:", verificationError);
        toast({
          variant: "destructive",
          title: "Erreur de vérification",
          description: verificationError.message
        });
        return;
      }

      // Afficher la valeur brute pour le débogage
      console.log("Valeur brute de la description:", verificationData.description);
      
      try {
        // Si la valeur n'est pas au format JSON, l'afficher telle quelle
        if (typeof verificationData.description === 'string') {
          try {
            const parsedDescription = JSON.parse(verificationData.description);
            console.log("Description parsée:", parsedDescription);
            
            if (Array.isArray(parsedDescription)) {
              const cleanedDescription = parsedDescription.filter(item => 
                item !== null && 
                item !== "t" && 
                typeof item === 'string' && 
                item.trim() !== ""
              );
              setCurrentValue(cleanedDescription.join(", "));
            } else {
              setCurrentValue(String(parsedDescription));
            }
          } catch (parseError) {
            // Si le parsing échoue, afficher la valeur brute
            console.log("La valeur n'est pas au format JSON, affichage brut");
            setCurrentValue(verificationData.description);
          }
        } else {
          setCurrentValue(String(verificationData.description));
        }
      } catch (displayError) {
        console.error("Erreur lors de l'affichage:", displayError);
        setCurrentValue("Erreur lors de l'affichage de la valeur");
      }

    } catch (error: any) {
      console.error("Erreur inattendue:", error);
      toast({
        variant: "destructive",
        title: "Erreur inattendue",
        description: error.message
      });
    }
  };

  return (
    <div className="p-4 space-y-4">
      <Button onClick={handleTest}>
        Tester l'écriture de 'test'
      </Button>
      {currentValue !== null && (
        <div className="text-sm">
          Valeur actuelle: {currentValue || 'aucune valeur'}
        </div>
      )}
    </div>
  );
}