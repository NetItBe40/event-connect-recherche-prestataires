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

  const cleanText = (text: string) => {
    // Supprimer les répétitions du nom dans l'adresse
    return text.replace(new RegExp(`^${title},\\s*`), '');
  };

  const extractCity = (address: string): string => {
    const cityMatch = address.match(/\d{5}\s+([^,]+)$/);
    return cityMatch ? cityMatch[1].trim() : '';
  };

  const searchImages = async () => {
    setIsLoading(true);
    try {
      console.log("=== Début de la recherche d'images ===");
      console.log("Données initiales:", { title, address, placeId });

      // Nettoyer l'adresse
      const cleanedAddress = cleanText(address);
      console.log("Adresse nettoyée:", cleanedAddress);

      let website = '';
      let type = '';
      let city = '';
      
      if (placeId) {
        console.log("Récupération des informations depuis la base de données pour l'ID:", placeId);
        const { data: placeData, error } = await supabase
          .from('places')
          .select('website, type, city')
          .eq('id', placeId)
          .maybeSingle();

        if (error) {
          console.error("Erreur lors de la récupération des informations:", error);
          throw error;
        }

        console.log("Données récupérées de la base:", placeData);
        website = placeData?.website || '';
        type = placeData?.type || '';
        city = placeData?.city || '';
      }

      // Extraire la ville si non définie
      if (!city) {
        city = extractCity(cleanedAddress);
        console.log("Ville extraite de l'adresse:", city);
      }

      // Construction de la requête optimisée
      const queryParts = [title];
      
      if (type && !title.toLowerCase().includes(type.toLowerCase())) {
        queryParts.push(type);
      }
      
      if (city && !queryParts.join(' ').toLowerCase().includes(city.toLowerCase())) {
        queryParts.push(city);
      }

      const optimizedQuery = queryParts.join(' ');
      console.log("Construction de la requête:", {
        queryParts,
        finalQuery: optimizedQuery
      });

      setSearchQuery(optimizedQuery);
      
      console.log("Appel de la fonction search-images avec:", {
        query: optimizedQuery,
        website,
        count: 10
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