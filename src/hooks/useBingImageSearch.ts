import { useState } from "react";
import { supabase } from "@/lib/supabase";
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
        const { data: placeData, error } = await supabase
          .from('places')
          .select('website')
          .eq('id', placeId)
          .single();

        if (error) throw error;
        website = placeData?.website || '';
        console.log("Retrieved website from DB:", website);
      }
      
      let searchQuery;
      
      if (website) {
        searchQuery = `site:${website}`;
        console.log("Using website query:", searchQuery);
      } else {
        const cleanAddress = address.replace(title, '').trim();
        searchQuery = `${title} ${cleanAddress}`;
        console.log("Using title + address query:", searchQuery);
      }
      
      console.log("Final search query:", searchQuery);
      
      const response = await supabase.functions.invoke('search-images', {
        body: { 
          query: searchQuery,
          website: website,
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