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
      console.log("Début du fetchCategories pour le lieu:", placeId);
      
      // 1. Récupérer toutes les catégories et sous-catégories
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

      // 2. Obtenir l'ID Supabase si c'est un ID Google
      let finalPlaceId = placeId;
      if (placeId.startsWith('ChIJ')) {
        console.log("Conversion de l'ID Google en ID Supabase");
        const { data: placeData, error: placeError } = await supabase
          .from('places')
          .select('id')
          .eq('place_id', placeId)
          .maybeSingle();

        if (placeError) {
          console.error('Erreur lors de la récupération du lieu:', placeError);
          throw placeError;
        }

        if (placeData) {
          finalPlaceId = placeData.id;
          console.log("ID Supabase trouvé:", finalPlaceId);
        }
      }

      // 3. Récupérer les données du lieu pour l'analyse AI
      console.log("Récupération des données du lieu pour l'analyse AI");
      const { data: placeData, error: placeError } = await supabase
        .from('places')
        .select('description, type')
        .eq('id', finalPlaceId)
        .maybeSingle();

      if (placeError) {
        console.error("Erreur lors de la récupération des données du lieu:", placeError);
        throw placeError;
      }

      // 4. Récupérer les sous-catégories existantes
      console.log("Récupération des sous-catégories existantes pour le lieu:", finalPlaceId);
      const { data: existingSubcategories, error: existingError } = await supabase
        .from('place_subcategories')
        .select('subcategory_id')
        .eq('place_id', finalPlaceId);

      if (existingError) {
        console.error("Erreur lors de la récupération des sous-catégories existantes:", existingError);
        throw existingError;
      }

      // 5. Analyser avec l'AI et préparer les catégories avec suggestions
      let finalCategories = categoriesWithSubs;
      if (placeData?.description || placeData?.type) {
        console.log("Analyse AI des catégories avec description:", placeData.description);
        const suggestedCategories = await analyzePlaceWithAI(
          placeData.description || "",
          placeData.type || "",
          categoriesWithSubs
        );

        console.log("Catégories suggérées par l'AI:", suggestedCategories);

        finalCategories = categoriesWithSubs.map(category => ({
          ...category,
          subcategories: category.subcategories.map(sub => ({
            ...sub,
            suggested: suggestedCategories.includes(sub.id)
          }))
        }));
      } else {
        console.log("Pas de description ou de type pour l'analyse AI");
      }

      // 6. Mettre à jour l'état
      console.log("Mise à jour des états");
      setCategories(finalCategories);
      const existingIds = existingSubcategories?.map(item => item.subcategory_id) || [];
      console.log("IDs des sous-catégories existantes:", existingIds);
      setSelectedSubcategories(existingIds);

    } catch (error: any) {
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

  useEffect(() => {
    console.log("useEffect déclenché avec placeId:", placeId);
    if (placeId) {
      fetchCategories();
    }
  }, [placeId]);

  return {
    categories,
    selectedSubcategories,
    setSelectedSubcategories,
    isLoading
  };
}