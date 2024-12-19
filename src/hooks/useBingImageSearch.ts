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
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { toast } = useToast();

  const searchImages = async () => {
    setIsLoading(true);
    try {
      // Récupérer les informations du lieu depuis la base de données
      let website = '';
      let type = '';
      let city = '';
      
      console.log("useBingImageSearch - Début de la recherche avec:", {
        title,
        address,
        placeId
      });

      if (placeId) {
        console.log("useBingImageSearch - Recherche des informations pour l'ID:", placeId);
        const { data: placeData, error } = await supabase
          .from('places')
          .select('website, type, city')
          .eq('id', placeId)
          .maybeSingle();

        if (error) {
          console.error("Erreur lors de la récupération des informations:", error);
          throw error;
        }

        console.log("useBingImageSearch - Données récupérées de la base:", placeData);
        
        website = placeData?.website || '';
        type = placeData?.type || '';
        city = placeData?.city || '';
      }
      
      // Construire une requête optimisée
      let optimizedQuery = title;
      if (type) optimizedQuery += ` ${type}`;
      if (city) optimizedQuery += ` ${city}`;
      
      console.log("useBingImageSearch - Construction de la requête:", {
        baseTitle: title,
        addedType: type,
        addedCity: city,
        finalQuery: optimizedQuery
      });

      setSearchQuery(optimizedQuery);
      
      console.log("useBingImageSearch - Appel de la fonction search-images avec:", {
        query: optimizedQuery,
        website
      });

      const response = await supabase.functions.invoke('search-images', {
        body: { 
          query: optimizedQuery,
          website: website,
          count: 10
        },
      });

      if (response.error) {
        console.error("Erreur de la fonction search-images:", response.error);
        throw new Error(response.error.message);
      }
      
      console.log("Réponse de la fonction search-images:", response);

      if (!response.data?.photos) {
        throw new Error("Pas de photos dans la réponse");
      }

      const sortedPhotos = response.data.photos
        .sort((a: ImageResult, b: ImageResult) => {
          const aRatio = a.width / a.height;
          const bRatio = b.width / b.height;
          return Math.abs(1.5 - aRatio) - Math.abs(1.5 - bRatio);
        })
        .slice(0, 6);

      console.log("Photos triées et filtrées:", sortedPhotos);

      setPhotos(sortedPhotos);

      toast({
        title: "Images trouvées",
        description: "Les images ont été récupérées avec succès",
      });
    } catch (error) {
      console.error("Erreur complète:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de récupérer les images",
      });
      setPhotos([]);
    } finally {
      setIsLoading(false);
    }
  };

  return { photos, isLoading, searchImages, searchQuery };
}