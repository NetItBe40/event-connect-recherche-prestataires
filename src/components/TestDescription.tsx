import { supabase } from "@/lib/supabase";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";
import { useState } from "react";

export function TestDescription() {
  const { toast } = useToast();
  const [currentValue, setCurrentValue] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleTest = async () => {
    setIsLoading(true);
    try {
      // Première vérification - lire la valeur actuelle
      console.log("Vérification de la valeur initiale...");
      const { data: initialData, error: initialError } = await supabase
        .from('places')
        .select('description2')
        .eq('id', 'feef6749-89ad-484c-81b7-42783bffaea0')
        .single();

      if (initialError) {
        console.error("Erreur lors de la vérification initiale:", initialError);
        toast({
          variant: "destructive",
          title: "Erreur initiale",
          description: `Impossible de lire la valeur actuelle: ${initialError.message}`
        });
        return;
      }

      console.log("Valeur initiale de description2:", initialData?.description2);

      // Écriture de la valeur 'test'
      console.log("Début du test d'écriture dans description2...");
      const { data, error } = await supabase
        .from('places')
        .update({ description2: 'test' })
        .eq('id', 'feef6749-89ad-484c-81b7-42783bffaea0')
        .select();

      if (error) {
        console.error("Erreur lors du test:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: `Impossible d'écrire la valeur: ${error.message}`
        });
        return;
      }

      console.log("Résultat de l'écriture:", data);
      
      // Vérification finale de la valeur
      const { data: verificationData, error: verificationError } = await supabase
        .from('places')
        .select('description2')
        .eq('id', 'feef6749-89ad-484c-81b7-42783bffaea0')
        .single();

      if (verificationError) {
        console.error("Erreur lors de la vérification finale:", verificationError);
        toast({
          variant: "destructive",
          title: "Erreur de vérification",
          description: verificationError.message
        });
        return;
      }

      // Afficher la valeur finale
      console.log("Valeur finale de description2:", verificationData.description2);
      setCurrentValue(verificationData.description2);

      // Vérifier si la valeur est bien 'test'
      if (verificationData.description2 === 'test') {
        toast({
          title: "Succès",
          description: "La valeur 'test' a été correctement écrite dans description2"
        });
      } else {
        toast({
          variant: "destructive",
          title: "Attention",
          description: `La valeur dans description2 est "${verificationData.description2}" au lieu de "test"`
        });
      }

    } catch (error: any) {
      console.error("Erreur inattendue:", error);
      toast({
        variant: "destructive",
        title: "Erreur inattendue",
        description: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <Button 
        onClick={handleTest}
        disabled={isLoading}
        variant="default"
      >
        {isLoading ? "Test en cours..." : "Tester l'écriture de 'test' dans description2"}
      </Button>
      {currentValue !== null && (
        <div className="text-sm">
          Valeur actuelle dans description2: {currentValue || 'aucune valeur'}
        </div>
      )}
    </div>
  );
}