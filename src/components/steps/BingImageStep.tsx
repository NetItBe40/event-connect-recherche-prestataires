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

export function BingImageStep({ placeId, title, address, website }: BingImageStepProps) {
  const [photos, setPhotos] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const searchQuery = website ? `"site:${website}"` : `${title}, ${address}`;

  const searchImages = async () => {
    setIsLoading(true);
    try {
      const response = await supabase.functions.invoke('search-images', {
        body: { 
          query: `${title} ${address}`,
          website: website,
          count: 5
        },
      });

      if (response.error) throw new Error(response.error.message);
      
      const data = response.data;
      setPhotos(data.photos);

      if (placeId && data.photos.length > 0) {
        await supabase
          .from("places")
          .update({ photos: data.photos })
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
            <PlacePhoto key={index} photo={photo} title={title} />
          ))}
        </div>
      )}
    </Card>
  );
}