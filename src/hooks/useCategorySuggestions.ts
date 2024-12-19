import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Category } from "@/types/categories";
import { analyzePlaceWithAI } from "@/services/categoryAIService";
import { 
  fetchAllCategories, 
  fetchExistingSubcategories, 
  getPlaceDetails,
  convertGooglePlaceId 
} from "@/services/categoryService";

export function useCategorySuggestions(placeId: string) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function initializeCategories() {
      try {
        console.log("useEffect déclenché avec placeId:", placeId);
        if (!placeId) return;
        
        setIsLoading(true);

        // 1. Convertir l'ID Google si nécessaire
        const finalPlaceId = await convertGooglePlaceId(placeId);
        if (!finalPlaceId) {
          toast({
            variant: "destructive",
            title: "Erreur",
            description: "Impossible de trouver l'identifiant du lieu",
          });
          return;
        }

        // 2. Récupérer toutes les catégories
        const categoriesWithSubs = await fetchAllCategories();

        // 3. Récupérer les sous-catégories existantes
        const existingIds = await fetchExistingSubcategories(finalPlaceId);
        console.log("IDs des sous-catégories existantes:", existingIds);

        // 4. Récupérer les données du lieu pour l'analyse AI
        const placeData = await getPlaceDetails(finalPlaceId);

        // 5. Analyser avec l'AI si des données sont disponibles
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
        }

        // 6. Mettre à jour l'état
        console.log("Mise à jour des états");
        setCategories(finalCategories);
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
    }

    initializeCategories();
  }, [placeId, toast]);

  return {
    categories,
    selectedSubcategories,
    setSelectedSubcategories,
    isLoading
  };
}