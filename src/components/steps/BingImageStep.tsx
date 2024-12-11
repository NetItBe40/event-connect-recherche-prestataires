import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { ImageGrid } from "./ImageGrid";
import { useBingImageSearch } from "@/hooks/useBingImageSearch";
import { useImageSave } from "@/hooks/useImageSave";

interface BingImageStepProps {
  placeId?: string;
  title: string;
  address: string;
}

export function BingImageStep({ placeId, title, address }: BingImageStepProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  console.log("BingImageStep - Données reçues:", { placeId, title, address });
  
  const { photos, isLoading, searchImages } = useBingImageSearch(title, address, placeId);
  const { saveImage, isSaving } = useImageSave();

  const handleImageSelect = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const handleSaveImage = async () => {
    if (placeId && selectedImage) {
      await saveImage(placeId, selectedImage);
    }
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Recherche d'images</h2>
        <p className="text-sm text-gray-600">
          Requête Bing : <span className="font-mono bg-gray-100 px-2 py-1 rounded">
            {title} {address}
          </span>
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
          <ImageGrid
            photos={photos}
            selectedImage={selectedImage}
            title={title}
            onImageSelect={handleImageSelect}
          />

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