import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

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

  const analyzePlaceData = (description: string, type: string, categories: Category[]): string[] => {
    const suggestedIds: string[] = [];
    const text = `${description} ${type}`.toLowerCase();
    
    categories.forEach(category => {
      const categoryKeywords = category.name.toLowerCase().split(' ');
      
      category.subcategories.forEach(subcategory => {
        const subcategoryKeywords = subcategory.name.toLowerCase().split(' ');
        let score = 0;
        
        categoryKeywords.forEach(keyword => {
          if (text.includes(keyword)) score += 1;
        });
        
        subcategoryKeywords.forEach(keyword => {
          if (text.includes(keyword)) score += 2;
        });
        
        if (score >= 1) {
          suggestedIds.push(subcategory.id);
        }
      });
    });
    
    return suggestedIds;
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

      const suggestedCategories = analyzePlaceData(
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