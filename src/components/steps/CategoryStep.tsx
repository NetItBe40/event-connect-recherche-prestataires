import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { SubcategoryList } from "../category/SubcategoryList";
import { useCategorySuggestions } from "@/hooks/useCategorySuggestions";
import { supabase } from "@/integrations/supabase/client";

interface CategoryStepProps {
  placeId: string;
}

export function CategoryStep({ placeId }: CategoryStepProps) {
  const { categories, selectedSubcategories, setSelectedSubcategories, isLoading } = useCategorySuggestions(placeId);
  const { toast } = useToast();

  const handleSubcategoryToggle = (subcategoryId: string) => {
    setSelectedSubcategories(prev => {
      if (prev.includes(subcategoryId)) {
        return prev.filter(id => id !== subcategoryId);
      } else {
        return [...prev, subcategoryId];
      }
    });
  };

  const handleSave = async () => {
    try {
      const { error: deleteError } = await supabase
        .from('place_subcategories')
        .delete()
        .eq('place_id', placeId);

      if (deleteError) throw deleteError;

      const { error: insertError } = await supabase
        .from('place_subcategories')
        .insert(
          selectedSubcategories.map(subcategoryId => ({
            place_id: placeId,
            subcategory_id: subcategoryId,
          }))
        );

      if (insertError) throw insertError;

      toast({
        title: "Succès",
        description: "Les catégories ont été sauvegardées",
      });
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les catégories",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div>Chargement des catégories...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Sélectionnez les catégories</h2>
      
      <Accordion type="single" collapsible className="w-full">
        {categories.map((category) => (
          <AccordionItem key={category.id} value={category.id}>
            <AccordionTrigger className="text-left">
              {category.name}
            </AccordionTrigger>
            <AccordionContent>
              <SubcategoryList
                subcategories={category.subcategories}
                selectedSubcategories={selectedSubcategories}
                onToggle={handleSubcategoryToggle}
              />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <Button onClick={handleSave} className="w-full">
        Sauvegarder les catégories
      </Button>
    </div>
  );
}