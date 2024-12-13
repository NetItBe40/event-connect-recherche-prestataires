import { supabase } from "@/lib/supabase";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";

export function TestDescription() {
  const { toast } = useToast();
  
  const handleTest = async () => {
    try {
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
    <div className="p-4">
      <Button onClick={handleTest}>
        Tester l'écriture de 'test'
      </Button>
    </div>
  );
}