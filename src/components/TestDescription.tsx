import { supabase } from "@/lib/supabase";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";
import { useState } from "react";

export function TestDescription() {
  const { toast } = useToast();
  const [currentValue, setCurrentValue] = useState<string | null>(null);
  
  const handleTest = async () => {
    try {
      console.log("Début du test d'écriture dans description2...");
      
      // Sauvegarder directement la valeur texte dans description2
      const { data, error } = await supabase
        .from('places')
        .update({ description2: 'test' })
        .eq('id', 'feef6749-89ad-484c-81b7-42783bffaea0')
        .select('description2');

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
        description: "La valeur 'test' a été écrite avec succès dans description2"
      });

      // Vérification de la valeur
      const { data: verificationData, error: verificationError } = await supabase
        .from('places')
        .select('description2')
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

      // Afficher directement la valeur de description2
      console.log("Valeur de description2:", verificationData.description2);
      setCurrentValue(verificationData.description2);

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
        Tester l'écriture de 'test' dans description2
      </Button>
      {currentValue !== null && (
        <div className="text-sm">
          Valeur actuelle dans description2: {currentValue || 'aucune valeur'}
        </div>
      )}
    </div>
  );
}