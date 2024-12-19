import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
  const [lastSearchTime, setLastSearchTime] = useState(0);

  const cleanText = (text: string) => {
    return text.replace(new RegExp(`^${title},\\s*`), '');
  };

  const extractCity = (address: string): string => {
    const cityMatch = address.match(/\d{5}\s+([^,]+)$/);
    return cityMatch ? cityMatch[1].trim() : '';
  };

  const searchImages = async (customQuery?: string) => {
    const now = Date.now();
    const timeSinceLastSearch = now - lastSearchTime;
    if (timeSinceLastSearch < 1500) {
      toast.error("Merci d'attendre un moment avant de relancer une recherche");
      return;
    }

    setIsLoading(true);
    try {
      const cleanedAddress = cleanText(address);
      let website = '';
      let type = '';
      let city = '';
      
      if (placeId) {
        // Determine which column to use based on the placeId format
        const isGooglePlaceId = placeId.startsWith('ChIJ');
        const query = supabase
          .from('places')
          .select('website, type, city');

        if (isGooglePlaceId) {
          query.eq('place_id', placeId);
        } else {
          query.eq('id', placeId);
        }

        const { data: placeData, error } = await query.maybeSingle();

        if (error) {
          console.error('Erreur lors de la récupération des données:', error);
          throw error;
        }

        if (placeData) {
          website = placeData.website || '';
          type = placeData.type || '';
          city = placeData.city || '';
        }
      }

      if (!city) {
        city = extractCity(cleanedAddress);
      }

      let optimizedQuery = customQuery;
      if (!optimizedQuery) {
        const queryParts = [title];
        
        if (type && !title.toLowerCase().includes(type.toLowerCase())) {
          queryParts.push(type);
        }
        
        if (city && !queryParts.join(' ').toLowerCase().includes(city.toLowerCase())) {
          queryParts.push(city);
        }

        optimizedQuery = queryParts.join(' ');
      }
      
      setSearchQuery(optimizedQuery);
      
      const response = await supabase.functions.invoke('search-images', {
        body: { 
          query: optimizedQuery,
          website: website,
          count: 10
        },
      });

      if (response.error) {
        if (response.error.message.includes("429")) {
          throw new Error("Limite de requêtes atteinte. Merci de patienter quelques secondes avant de réessayer.");
        }
        throw response.error;
      }

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

      setPhotos(sortedPhotos);
      setLastSearchTime(now);

      toast.success("Images trouvées", {
        description: "Les images ont été récupérées avec succès",
      });
    } catch (error: any) {
      console.error('Erreur lors de la récupération des données:', error);
      toast.error("Erreur", {
        description: error.message || "Impossible de récupérer les images",
      });
      setPhotos([]);
    } finally {
      setIsLoading(false);
    }
  };

  return { photos, isLoading, searchImages, searchQuery };
}