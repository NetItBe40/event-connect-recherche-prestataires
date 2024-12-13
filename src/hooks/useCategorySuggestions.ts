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
    
    // Mots-clés spécifiques par catégorie
    const categoryKeywords: { [key: string]: string[] } = {
      "Lieux": ["salle", "château", "domaine", "espace", "lieu", "villa", "manoir"],
      "Traiteurs": ["traiteur", "cuisine", "gastronomie", "chef", "repas", "buffet"],
      "Animation": ["dj", "musique", "animation", "spectacle", "artiste", "band", "groupe"],
      "Décoration": ["décor", "fleur", "design", "ambiance", "scénographie"],
      "Photo & Vidéo": ["photo", "vidéo", "photographe", "cameraman", "film", "reportage"],
      "Services": ["organisation", "planification", "coordination", "wedding planner"]
    };
    
    categories.forEach(category => {
      const relevantKeywords = categoryKeywords[category.name] || [];
      let categoryScore = 0;
      
      // Vérifie les mots-clés de la catégorie
      relevantKeywords.forEach(keyword => {
        if (text.includes(keyword)) {
          categoryScore += 2;
        }
      });
      
      // Si la catégorie est pertinente, analyse les sous-catégories
      if (categoryScore > 0) {
        category.subcategories.forEach(subcategory => {
          const subcategoryWords = subcategory.name.toLowerCase().split(' ');
          let subcategoryScore = 0;
          
          // Analyse plus précise des sous-catégories
          subcategoryWords.forEach(word => {
            if (text.includes(word) && word.length > 3) { // Ignore les mots trop courts
              subcategoryScore += 3;
            }
          });
          
          // Vérifie les expressions exactes
          if (text.includes(subcategory.name.toLowerCase())) {
            subcategoryScore += 5;
          }
          
          // Ajoute seulement si le score est suffisamment élevé
          if (subcategoryScore >= 5) {
            suggestedIds.push(subcategory.id);
          }
        });
      }
    });
    
    // Limite le nombre de suggestions à 3 maximum par catégorie
    return suggestedIds.slice(0, 3);
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