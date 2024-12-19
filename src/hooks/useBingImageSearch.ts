import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface ImageResult {
  url: string;
  width: number;
  height: number;
  contentSize: string;
}

export function useBingImageSearch(title: string, address: string, placeId?: string) {
  const [photos, setPhotos] = useState<ImageResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const searchImages = async () => {
    setIsLoading(true);
    try {
      // Récupérer d'abord le site web depuis la base de données
      let website = '';
      if (placeId) {
        console.log("useBingImageSearch - Recherche du site web pour l'ID:", placeId);
        const { data: placeData, error } = await supabase
          .from('places')
          .select('website')
          .eq('place_id', placeId)
          .maybeSingle();

        if (error) {
          console.error("Erreur lors de la récupération du site web:", error);
          throw error;
        }
        
        website = placeData?.website || '';
        console.log("useBingImageSearch - Site web trouvé:", website);
      }
      
      let searchQuery;
      
      if (website) {
        // Extraire le domaine de base de l'URL
        try {
          const url = new URL(website);
          const domain = url.hostname;
          searchQuery = `site:${domain}`;
          console.log("useBingImageSearch - Utilisation de la requête site:", searchQuery);
        } catch (error) {
          console.error("Erreur lors du parsing de l'URL:", error);
          searchQuery = `${title} ${address}`;
        }
      } else {
        searchQuery = `${title} ${address}`;
        console.log("useBingImageSearch - Utilisation de la requête titre + adresse:", searchQuery);
      }
      
      const response = await supabase.functions.invoke('search-images', {
        body: { 
          query: searchQuery,
          count: 10
        },
      });

      if (response.error) throw new Error(response.error.message);
      
      const sortedPhotos = response.data.photos
        .sort((a: ImageResult, b: ImageResult) => {
          const aRatio = a.width / a.height;
          const bRatio = b.width / b.height;
          return bRatio - aRatio;
        })
        .slice(0, 5);

      setPhotos(sortedPhotos);

      toast({
        title: "Images trouvées",
        description: "Les images ont été récupérées avec succès",
      });
    } catch (error) {
      console.error("Erreur:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de récupérer les images",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { photos, isLoading, searchImages };
}