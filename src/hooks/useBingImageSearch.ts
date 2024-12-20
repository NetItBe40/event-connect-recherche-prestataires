import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";

export interface BingImageSearchResult {
  url: string;
  width: number;
  height: number;
  contentSize: string;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export function useBingImageSearch() {
  const [images, setImages] = useState<BingImageSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const searchImages = async (query: string, retryCount = 0) => {
    if (!query) {
      toast.error("La requête de recherche est vide");
      return;
    }

    setIsLoading(true);
    try {
      console.log("Début de la récupération de la clé API");
      
      // Try bingkey1 first
      const { data: apiKeyData, error: apiKeyError } = await supabase
        .from('apikeys')
        .select('apikey')
        .eq('provider', 'bingkey1')
        .maybeSingle();

      let apiKey = apiKeyData?.apikey;

      if (!apiKey) {
        console.log("Pas de clé trouvée pour bingkey1, essai avec bingkey2");
        // Try bingkey2 if bingkey1 fails
        const { data: apiKey2Data, error: apiKey2Error } = await supabase
          .from('apikeys')
          .select('apikey')
          .eq('provider', 'bingkey2')
          .maybeSingle();

        if (apiKey2Error || !apiKey2Data) {
          throw new Error("Aucune clé API Bing valide trouvée");
        }
        apiKey = apiKey2Data.apikey;
      }

      // Add a small delay between requests to respect rate limits
      await delay(1000);

      const response = await fetch(`https://api.bing.microsoft.com/v7.0/images/search?q=${encodeURIComponent(query)}&count=10`, {
        headers: {
          'Ocp-Apim-Subscription-Key': apiKey
        }
      });

      if (response.status === 429) {
        // Rate limit hit - implement exponential backoff
        const waitTime = Math.min(Math.pow(2, retryCount) * 1000, 8000); // Max 8 seconds wait
        
        if (retryCount < 3) { // Max 3 retries
          toast.info(`Limite de requêtes atteinte, nouvelle tentative dans ${waitTime/1000} secondes...`);
          await delay(waitTime);
          return searchImages(query, retryCount + 1);
        } else {
          throw new Error("Limite de requêtes Bing atteinte. Veuillez réessayer plus tard.");
        }
      }

      if (!response.ok) {
        throw new Error(`Erreur API Bing: ${response.statusText}`);
      }

      const data = await response.json();
      
      console.log("Résultats de la recherche d'images:", data);

      const formattedResults: BingImageSearchResult[] = data.value.map((image: any) => ({
        url: image.contentUrl,
        width: image.width,
        height: image.height,
        contentSize: image.contentSize || 'Unknown'
      }));

      setImages(formattedResults);
    } catch (error: any) {
      console.error("Erreur lors de la recherche d'images:", error);
      toast.error(error.message || "Impossible de rechercher des images");
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