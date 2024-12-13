import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { generateDescription } from "@/api/generate-description";

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

export function useCategorySuggestions(placeId: string) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const analyzePlaceWithAI = async (description: string, type: string, categories: Category[]) => {
    try {
      const prompt = `
Analyse le profil du prestataire suivant en fonction de la liste des catégories disponibles. Classe ce prestataire uniquement dans les catégories dont les services ou activités sont clairement et explicitement mentionnés dans la description fournie. Ne fais aucune supposition ou extrapolation.

Description du prestataire :
${description}

Type d'établissement : ${type}

Catégories disponibles :
${categories.map(cat => `${cat.name}:
${cat.subcategories.map(sub => `- ${sub.name}`).join('\n')}`).join('\n\n')}

1. Classe uniquement le prestataire dans les catégories **explicitement** liées à ses services.
2. Si aucune catégorie ne correspond parfaitement, indique qu'aucune catégorie adéquate n'est disponible.

### Résultat attendu :
- Liste des sous-catégories pertinentes : [liste des noms exacts des sous-catégories]
`;

      console.log("Envoi du prompt à GPT-4:", prompt);

      const response = await generateDescription(prompt);
      console.log("Réponse de GPT-4:", response);

      // Extraction des sous-catégories suggérées
      const suggestedIds: string[] = [];
      categories.forEach(category => {
        category.subcategories.forEach(subcategory => {
          if (response?.toLowerCase().includes(subcategory.name.toLowerCase())) {
            suggestedIds.push(subcategory.id);
          }
        });
      });

      return suggestedIds;
    } catch (error) {
      console.error("Erreur lors de l'analyse AI:", error);
      return [];
    }
  };

  const fetchCategories = async () => {
    try {
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('id, name');

      if (categoriesError) throw categoriesError;

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

      const { data: placeData, error: placeError } = await supabase
        .from('places')
        .select('description, type')
        .eq('id', placeId)
        .single();

      if (placeError) throw placeError;

      const suggestedCategories = await analyzePlaceWithAI(
        placeData.description || "",
        placeData.type || "",
        categoriesWithSubs
      );

      const categoriesWithSuggestions = categoriesWithSubs.map(category => ({
        ...category,
        subcategories: category.subcategories.map(sub => ({
          ...sub,
          suggested: suggestedCategories.includes(sub.id)
        }))
      }));

      setCategories(categoriesWithSuggestions);
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

  useEffect(() => {
    fetchCategories();
    fetchExistingSelections();
  }, [placeId]);

  return {
    categories,
    selectedSubcategories,
    setSelectedSubcategories,
    isLoading
  };
}