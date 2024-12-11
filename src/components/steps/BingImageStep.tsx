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
}

export function BingImageStep({ placeId, title, address }: BingImageStepProps) {
  const [photos, setPhotos] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const searchImages = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/search-images", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          query: `${title} ${address}`,
          count: 5
        }),
      });

      if (!response.ok) throw new Error("Erreur lors de la recherche");

      const data = await response.json();
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