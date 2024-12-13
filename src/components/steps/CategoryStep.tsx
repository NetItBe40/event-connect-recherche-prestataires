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
import { Badge } from "@/components/ui/badge";

interface Category {
  id: string;
  name: string;
  subcategories: Subcategory[];
}

interface Subcategory {
  id: string;
  name: string;
  suggested?: boolean;
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

      // Récupérer la description et le type du lieu
      const { data: placeData, error: placeError } = await supabase
        .from('places')
        .select('description, type')
        .eq('id', placeId)
        .single();

      if (placeError) throw placeError;

      // Analyser la description pour suggérer des catégories
      const suggestedCategories = analyzePlaceData(
        placeData.description || "",
        placeData.type || "",
        categoriesWithSubs
      );

      // Marquer les sous-catégories suggérées
      const categoriesWithSuggestions = categoriesWithSubs.map(category => ({
        ...category,
        subcategories: category.subcategories.map(sub => ({
          ...sub,
          suggested: suggestedCategories.includes(sub.id)
        }))
      }));

      setCategories(categoriesWithSuggestions);
      // Présélectionner les catégories suggérées
      setSelectedSubcategories(suggestedCategories);
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

  const analyzePlaceData = (description: string, type: string, categories: Category[]): string[] => {
    const suggestedIds: string[] = [];
    const text = `${description} ${type}`.toLowerCase();
    
    // Parcourir toutes les catégories et sous-catégories
    categories.forEach(category => {
      const categoryKeywords = category.name.toLowerCase().split(' ');
      
      category.subcategories.forEach(subcategory => {
        const subcategoryKeywords = subcategory.name.toLowerCase().split(' ');
        let score = 0;
        
        // Vérifier les mots-clés de la catégorie
        categoryKeywords.forEach(keyword => {
          if (text.includes(keyword)) score += 1;
        });
        
        // Vérifier les mots-clés de la sous-catégorie
        subcategoryKeywords.forEach(keyword => {
          if (text.includes(keyword)) score += 2;
        });
        
        // Si le score est suffisant, suggérer cette sous-catégorie
        if (score >= 1) {
          suggestedIds.push(subcategory.id);
        }
      });
    });
    
    return suggestedIds;
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
                    {subcategory.suggested && (
                      <Badge variant="secondary" className="ml-2">
                        Suggéré
                      </Badge>
                    )}
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