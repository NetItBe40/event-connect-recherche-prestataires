import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { PlacePhoto } from "../PlacePhoto";

interface BingImageStepProps {
  placeId?: string;
  title: string;
  address: string;
  website?: string;
}

interface ImageResult {
  url: string;
  width: number;
  height: number;
  contentSize: string;
}

export function BingImageStep({ placeId, title, address, website }: BingImageStepProps) {
  const [photos, setPhotos] = useState<ImageResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const searchQuery = website ? `"site:${website}"` : `${title}, ${address}`;

  const searchImages = async () => {
    setIsLoading(true);
    try {
      const response = await supabase.functions.invoke('search-images', {
        body: { 
          query: website ? `site:${website}` : `${title} ${address}`,
          website: website,
          count: 10 // Increased to get more options for sorting
        },
      });

      if (response.error) throw new Error(response.error.message);
      
      // Sort images to prioritize horizontal format
      const sortedPhotos = response.data.photos
        .sort((a: ImageResult, b: ImageResult) => {
          const aRatio = a.width / a.height;
          const bRatio = b.width / b.height;
          return bRatio - aRatio; // Higher ratio = more horizontal
        })
        .slice(0, 5); // Keep only top 5 after sorting

      setPhotos(sortedPhotos);

      if (placeId && sortedPhotos.length > 0) {
        await supabase
          .from("places")
          .update({ photos: sortedPhotos.map(p => p.url) })
          .eq("id", placeId);
      }

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

  return (
    <Card className="p-6 space-y-6">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Recherche d'images</h2>
        <p className="text-sm text-gray-600">
          Requête Bing : <span className="font-mono bg-gray-100 px-2 py-1 rounded">{searchQuery}</span>
        </p>
        <Button 
          onClick={searchImages} 
          disabled={isLoading}
          className="w-full bg-google-blue hover:bg-google-blue/90"
        >
          {isLoading ? "Recherche en cours..." : "Rechercher des images"}
        </Button>
      </div>

      {photos.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          {photos.map((photo, index) => (
            <div key={index} className="space-y-2">
              <PlacePhoto photo={photo.url} title={title} />
              <p className="text-xs text-gray-500">
                {photo.width}x{photo.height}px • {photo.contentSize}
              </p>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}