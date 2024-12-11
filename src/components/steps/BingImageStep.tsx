import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { PlacePhoto } from "../PlacePhoto";
import { Check } from "lucide-react";

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
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
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

  const effectiveWebsite = website || extractWebsiteFromTitle(title);
  const searchQuery = effectiveWebsite ? `site:${effectiveWebsite}` : `${title} ${address}`;

  const searchImages = async () => {
    setIsLoading(true);
    try {
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

  const handleImageSelect = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const handleSaveImage = async () => {
    if (!selectedImage || !placeId) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez sélectionner une image",
      });
      return;
    }

    setIsSaving(true);
    try {
      console.log("Starting image save process...");
      console.log("Place ID:", placeId);
      console.log("Selected image URL:", selectedImage);

      const { error: updateError } = await supabase
        .from("places")
        .update({ 
          photobing1: selectedImage 
        })
        .eq("id", placeId);

      if (updateError) {
        console.error("Update error:", updateError);
        throw updateError;
      }

      toast({
        title: "Image sauvegardée",
        description: "L'image a été sauvegardée avec succès",
      });
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de sauvegarder l'image",
      });
    } finally {
      setIsSaving(false);
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
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {photos.map((photo, index) => (
              <div key={index} className="space-y-2 relative">
                <div 
                  className="cursor-pointer relative group"
                  onClick={() => handleImageSelect(photo.url)}
                >
                  <PlacePhoto photo={photo.url} title={title} />
                  {selectedImage === photo.url && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                      <Check className="w-8 h-8 text-white" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors rounded-lg" />
                </div>
                <p className="text-xs text-gray-500">
                  {photo.width}x{photo.height}px • {photo.contentSize}
                </p>
              </div>
            ))}
          </div>

          {selectedImage && (
            <Button 
              onClick={handleSaveImage} 
              disabled={isSaving}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {isSaving ? "Enregistrement en cours..." : "Enregistrer l'image sélectionnée"}
            </Button>
          )}
        </div>
      )}
    </Card>
  );
}