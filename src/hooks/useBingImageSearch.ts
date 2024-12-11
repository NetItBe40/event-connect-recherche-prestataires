import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

interface ImageResult {
  url: string;
  width: number;
  height: number;
  contentSize: string;
}

export function useBingImageSearch(title: string, address: string, website?: string) {
  const [photos, setPhotos] = useState<ImageResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const extractWebsiteFromTitle = (title: string): string | null => {
    const domains = ['.fr', '.com', '.net', '.org', '.eu'];
    const words = title.split(' ');
    
    for (const word of words) {
      if (domains.some(domain => word.toLowerCase().includes(domain))) {
        const domainEnd = Math.max(...domains.map(d => word.toLowerCase().indexOf(d) + d.length));
        return word.substring(0, domainEnd);
      }
    }
    return null;
  };

  const searchImages = async () => {
    setIsLoading(true);
    try {
      const effectiveWebsite = website || extractWebsiteFromTitle(title);
      let searchQuery;
      
      if (effectiveWebsite) {
        searchQuery = `site:${effectiveWebsite}`;
      } else {
        // Combine title and address, but remove any duplicate information
        const addressParts = address.split(',');
        const cleanAddress = addressParts[addressParts.length - 2] + ',' + addressParts[addressParts.length - 1];
        searchQuery = `${title} ${cleanAddress}`;
      }
      
      console.log("Searching images with query:", searchQuery);
      const response = await supabase.functions.invoke('search-images', {
        body: { 
          query: searchQuery,
          website: effectiveWebsite,
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