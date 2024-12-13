import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

interface Category {
  id: string;
  name: string;
  subcategories: Subcategory[];
}

interface Subcategory {
  id: string;
  name: string;
}

interface CategoryStepProps {
  placeId: string;
}

export function CategoryStep({ placeId }: CategoryStepProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchCategories();
    fetchExistingSelections();
  }, [placeId]);

  const fetchCategories = async () => {
    try {
      // Récupérer les catégories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('id, name');

      if (categoriesError) throw categoriesError;

      // Pour chaque catégorie, récupérer ses sous-catégories
      const categoriesWithSubs = await Promise.all(
        categoriesData.map(async (category) => {
          const { data: subcategories, error: subError } = await supabase
            .from('subcategories')
            .select('id, name')
            .eq('category_id', category.id);

          if (subError) throw subError;

          return {
            ...category,
            subcategories: subcategories || [],
          };
        })
      );

      setCategories(categoriesWithSubs);
    } catch (error) {
      console.error('Erreur lors du chargement des catégories:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les catégories",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchExistingSelections = async () => {
    try {
      const { data, error } = await supabase
        .from('place_subcategories')
        .select('subcategory_id')
        .eq('place_id', placeId);

      if (error) throw error;

      setSelectedSubcategories(data.map(item => item.subcategory_id));
    } catch (error) {
      console.error('Erreur lors du chargement des sélections existantes:', error);
    }
  };

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
      // Supprimer les anciennes liaisons
      const { error: deleteError } = await supabase
        .from('place_subcategories')
        .delete()
        .eq('place_id', placeId);

      if (deleteError) throw deleteError;

      // Créer les nouvelles liaisons
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
              <div className="space-y-2 p-4">
                {category.subcategories.map((subcategory) => (
                  <div key={subcategory.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={subcategory.id}
                      checked={selectedSubcategories.includes(subcategory.id)}
                      onCheckedChange={() => handleSubcategoryToggle(subcategory.id)}
                    />
                    <label
                      htmlFor={subcategory.id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {subcategory.name}
                    </label>
                  </div>
                ))}
              </div>
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