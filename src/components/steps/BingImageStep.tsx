import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { ImageGrid } from "./ImageGrid";
import { useBingImageSearch } from "@/hooks/useBingImageSearch";
import { useImageSave } from "@/hooks/useImageSave";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BingImageStepProps {
  placeId?: string;
  title: string;
  address: string;
}

export function BingImageStep({ placeId, title, address }: BingImageStepProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [customQuery, setCustomQuery] = useState<string>("");
  const defaultQuery = `${title} ${address}`;
  
  console.log("BingImageStep - Données reçues:", { placeId, title, address });
  
  const { images, isLoading, searchImages } = useBingImageSearch();
  const { saveImage, isSaving } = useImageSave();

  useEffect(() => {
    // Afficher la requête qui va être utilisée
    toast.info("Requête de recherche", {
      description: defaultQuery
    });
    
    // Lancer la recherche uniquement au montage initial
    searchImages(defaultQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Dépendances vides pour n'exécuter qu'au montage

  const handleImageSelect = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const handleSaveImage = async () => {
    if (!selectedImage) {
      toast.error("Veuillez sélectionner une image");
      return;
    }

    if (!placeId) {
      toast.error("ID du lieu manquant");
      return;
    }

    await saveImage(placeId, selectedImage);
  };

  const handleCustomSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuery.trim()) {
      toast.error("Veuillez entrer une requête de recherche");
      return;
    }
    searchImages(customQuery);
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Recherche d'images</h2>
        
        <form onSubmit={handleCustomSearch} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="customQuery">Requête personnalisée</Label>
            <div className="flex gap-2">
              <Input
                id="customQuery"
                placeholder={defaultQuery}
                value={customQuery}
                onChange={(e) => setCustomQuery(e.target.value)}
              />
              <Button 
                type="submit"
                disabled={isLoading}
                variant="secondary"
              >
                Rechercher
              </Button>
            </div>
          </div>
        </form>

        <div className="space-y-2">
          <p className="text-sm text-gray-600">
            Requête Bing : <span className="font-mono bg-gray-100 px-2 py-1 rounded">
              {customQuery || defaultQuery}
            </span>
          </p>
        </div>
        <Button 
          onClick={() => searchImages(defaultQuery)}
          disabled={isLoading}
          className="w-full bg-google-blue hover:bg-google-blue/90"
        >
          {isLoading ? "Recherche en cours..." : "Rafraîchir les images"}
        </Button>
      </div>

      {images.length > 0 && (
        <div className="space-y-4">
          <ImageGrid
            photos={images}
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