import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Place {
  id: string;
  title: string;
  address: string;
  phone?: string;
  type?: string;
  rating?: string;
  description?: string;
  photobing1?: string;
  website?: string;
}

interface PlacesManagementFilters {
  noDescription: boolean;
  noBingPhoto: boolean;
  noCategory: boolean;
  categoryId?: string;
}

export function usePlacesManagement() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentQuery, setCurrentQuery] = useState('');
  const [currentFilters, setCurrentFilters] = useState<PlacesManagementFilters>({
    noDescription: false,
    noBingPhoto: false,
    noCategory: false,
    categoryId: 'all',
  });
  const { toast } = useToast();

  const fetchPlaces = async (query: string = '', filters: PlacesManagementFilters) => {
    console.log("Début du fetchPlaces avec query:", query, "et filtres:", filters);
    setIsLoading(true);
    setCurrentQuery(query);
    setCurrentFilters(filters);
    
    try {
      let supabaseQuery = supabase
        .from('places')
        .select('*')
        .order('created_at', { ascending: false }); // Ajout du tri chronologique inverse

      // Si une catégorie spécifique est sélectionnée
      if (filters.categoryId && filters.categoryId !== 'all') {
        // D'abord, obtenir les IDs des sous-catégories pour la catégorie sélectionnée
        const { data: subcategoriesData } = await supabase
          .from('subcategories')
          .select('id')
          .eq('category_id', filters.categoryId);

        if (subcategoriesData && subcategoriesData.length > 0) {
          const subcategoryIds = subcategoriesData.map(sub => sub.id);

          // Ensuite, obtenir les IDs des places pour ces sous-catégories
          const { data: placeSubcategoriesData } = await supabase
            .from('place_subcategories')
            .select('place_id')
            .in('subcategory_id', subcategoryIds);

          if (placeSubcategoriesData && placeSubcategoriesData.length > 0) {
            const placeIds = [...new Set(placeSubcategoriesData.map(p => p.place_id))];
            supabaseQuery = supabaseQuery.in('id', placeIds);
          } else {
            setPlaces([]);
            setIsLoading(false);
            return;
          }
        }
      }

      // Filtre pour les places sans catégorie
      if (filters.noCategory) {
        const { data: placesWithCategories } = await supabase
          .from('place_subcategories')
          .select('place_id');

        if (placesWithCategories && placesWithCategories.length > 0) {
          const placeIdsWithCategories = placesWithCategories.map(p => p.place_id);
          supabaseQuery = supabaseQuery.not('id', 'in', `(${placeIdsWithCategories.join(',')})`);
        }
      }

      if (query) {
        supabaseQuery = supabaseQuery.ilike('title', `%${query}%`);
      }

      if (filters.noDescription) {
        supabaseQuery = supabaseQuery.or('description.is.null,description.eq.,description.eq.[]');
      }

      if (filters.noBingPhoto) {
        supabaseQuery = supabaseQuery.or('photobing1.is.null,photobing1.eq.');
      }

      console.log("Envoi de la requête Supabase");
      const { data, error } = await supabaseQuery;

      if (error) {
        console.error("Erreur Supabase lors du fetch:", error);
        throw error;
      }
      
      console.log("Données reçues:", data?.length, "places");
      setPlaces(data || []);
    } catch (error) {
      console.error('Erreur lors de la récupération des lieux:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger la liste des prestataires",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (placeId: string) => {
    console.log("Début de la suppression pour le lieu:", placeId);
    try {
      // Mise à jour optimiste de l'interface
      setPlaces(currentPlaces => {
        console.log("Mise à jour optimiste - avant:", currentPlaces.length, "places");
        const updatedPlaces = currentPlaces.filter(place => place.id !== placeId);
        console.log("Mise à jour optimiste - après:", updatedPlaces.length, "places");
        return updatedPlaces;
      });

      // D'abord, supprimer les enregistrements dans place_subcategories
      console.log("Suppression des sous-catégories associées");
      const { error: subcategoriesError } = await supabase
        .from('place_subcategories')
        .delete()
        .eq('place_id', placeId);

      if (subcategoriesError) {
        console.error("Erreur lors de la suppression des sous-catégories:", subcategoriesError);
        throw subcategoriesError;
      }

      // Ensuite, supprimer la place
      console.log("Suppression de la place");
      const { error: placeError } = await supabase
        .from('places')
        .delete()
        .eq('id', placeId);

      if (placeError) {
        console.error("Erreur Supabase lors de la suppression:", placeError);
        throw placeError;
      }

      console.log("Suppression réussie");
      toast({
        title: "Succès",
        description: "Le prestataire a été supprimé",
      });
    } catch (error) {
      console.error("Erreur complète lors de la suppression:", error);
      // Restaurer l'état précédent en cas d'erreur
      fetchPlaces(currentQuery, currentFilters);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer le prestataire",
      });
    }
  };

  return {
    places,
    isLoading,
    fetchPlaces,
    handleDelete
  };
}