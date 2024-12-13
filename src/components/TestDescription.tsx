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
      
      // Sauvegarder directement la valeur texte
      const { data, error } = await supabase
        .from('places')
        .update({ description: 'test' })
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

      // Afficher directement la valeur de la description
      console.log("Valeur de la description:", verificationData.description);
      setCurrentValue(verificationData.description);

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