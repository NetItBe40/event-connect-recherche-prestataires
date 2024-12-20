import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface BingImageSearchResult {
  imageUrl: string;
  thumbnailUrl: string;
  name: string;
}

export function useBingImageSearch() {
  const [images, setImages] = useState<BingImageSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const searchImages = async (query: string) => {
    setIsLoading(true);
    try {
      console.log("Début de la récupération de la clé API");
      
      // Récupérer la première clé API Bing disponible
      const { data: apiKeyData, error: apiKeyError } = await supabase
        .from('apikeys')
        .select('apikey')
        .eq('provider', 'bing')
        .limit(1)
        .single();

      if (apiKeyError) {
        console.error("Erreur lors de la récupération de la clé API:", apiKeyError);
        throw new Error("Impossible de récupérer la clé API");
      }

      if (!apiKeyData?.apikey) {
        throw new Error("Aucune clé API trouvée");
      }

      console.log("Clé API récupérée, début de la recherche d'images");

      const response = await fetch(`https://api.bing.microsoft.com/v7.0/images/search?q=${encodeURIComponent(query)}&count=10`, {
        headers: {
          'Ocp-Apim-Subscription-Key': apiKeyData.apikey
        }
      });

      if (!response.ok) {
        throw new Error(`Erreur API Bing: ${response.statusText}`);
      }

      const data = await response.json();
      
      console.log("Résultats de la recherche d'images:", data);

      const formattedResults = data.value.map((image: any) => ({
        imageUrl: image.contentUrl,
        thumbnailUrl: image.thumbnailUrl,
        name: image.name
      }));

      setImages(formattedResults);
    } catch (error: any) {
      console.error("Erreur lors de la recherche d'images:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Impossible de rechercher des images"
      });
      setImages([]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    images,
    isLoading,
    searchImages
  };
}