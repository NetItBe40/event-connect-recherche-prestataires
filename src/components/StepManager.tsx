import { useState } from "react";
import { ResultsList } from "./ResultsList";
import { SearchForm } from "./SearchForm";
import { StepProgress } from "./StepProgress";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { useToast } from "./ui/use-toast";
import { ExistingPlacesList } from "./ExistingPlacesList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface Place {
  id?: string;
  title: string;
  address: string;
  rating?: string;
  reviews?: string;
  type?: string;
  phone?: string;
  website?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  placeId?: string;
  placeLink?: string;
  priceLevel?: string;
  openingHours?: {
    [key: string]: string;
  };
  city?: string;
  verified?: boolean;
  photos?: string;
  state?: string;
  description?: string;
}

export function StepManager() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [results, setResults] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSearch = async (params: any) => {
    setIsLoading(true);
    
    let endpoint = "https://api.scrapetable.com/maps/search";
    let apiParams: any = {
      query: params.query,
      country: params.country,
      limit: parseInt(params.limit),
      lang: "french",
      ...(params.lat && { lat: parseFloat(params.lat) }),
      ...(params.lng && { lng: parseFloat(params.lng) }),
    };

    if (params.placeId) {
      endpoint = "https://api.scrapetable.com/maps/place";
      apiParams = {
        place_id: params.placeId,
        lang: "french",
      };
    }

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": process.env.SCRAPETABLE_API_KEY || "",
        },
        body: JSON.stringify(apiParams),
      });

      const data = await response.json();
      console.log("API Response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Une erreur est survenue");
      }

      let apiResults = params.placeId ? [data] : (Array.isArray(data) ? data : data.data);

      if (!Array.isArray(apiResults)) {
        throw new Error("Format de réponse invalide");
      }

      const transformedResults = apiResults.map(item => ({
        title: item.name,
        address: item.full_address,
        rating: item.rating?.toString(),
        reviews: item.review_count?.toString(),
        type: item.types,
        phone: item.phone_number,
        website: item.website || undefined,
        latitude: item.latitude,
        longitude: item.longitude,
        timezone: item.timezone,
        placeId: item.place_id,
        placeLink: item.place_link,
        priceLevel: item.price_level,
        openingHours: {
          Dimanche: item.Dimanche || item.Sunday,
          Lundi: item.Lundi || item.Monday,
          Mardi: item.Mardi || item.Tuesday,
          Mercredi: item.Mercredi || item.Wednesday,
          Jeudi: item.Jeudi || item.Thursday,
          Vendredi: item.Vendredi || item.Friday,
          Samedi: item.Samedi || item.Saturday,
        },
        city: item.city,
        verified: item.verified,
        photos: item.photos,
        state: item.state,
        description: item.description,
      }));

      setResults(transformedResults);
    } catch (error) {
      console.error("Erreur lors de la recherche:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la recherche",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlaceSelect = (place: Place) => {
    setSelectedPlace(place);
    toast({
      title: "Lieu sélectionné",
      description: `${place.title} a été sélectionné pour le traitement.`,
    });
  };

  const handleNextStep = () => {
    if (!selectedPlace && currentStep === 0) {
      toast({
        variant: "destructive",
        title: "Sélection requise",
        description: "Veuillez sélectionner un lieu avant de continuer.",
      });
      return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  return (
    <div className="container py-8 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-google-blue">
          Traitement des fiches prestataires
        </h1>
        <p className="text-gray-600">
          Enrichissez vos fiches prestataires en 4 étapes simples
        </p>
      </div>

      <StepProgress currentStep={currentStep} />

      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2">
          {currentStep === 0 && (
            <Tabs defaultValue="new" className="space-y-8">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="new">Nouveau prestataire</TabsTrigger>
                <TabsTrigger value="existing">Prestataire existant</TabsTrigger>
              </TabsList>
              
              <TabsContent value="new" className="space-y-8">
                <div className="max-w-2xl mx-auto">
                  <SearchForm onSearch={handleSearch} isLoading={isLoading} />
                </div>
                <ResultsList 
                  results={results} 
                  isLoading={isLoading} 
                  onSelect={handlePlaceSelect}
                />
              </TabsContent>
              
              <TabsContent value="existing">
                <ExistingPlacesList onSelect={handlePlaceSelect} />
              </TabsContent>
            </Tabs>
          )}
        </div>

        <div className="col-span-1">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Résumé</h2>
            {selectedPlace ? (
              <div className="space-y-2">
                <p><strong>Nom :</strong> {selectedPlace.title}</p>
                <p><strong>Adresse :</strong> {selectedPlace.address}</p>
                {selectedPlace.phone && (
                  <p><strong>Téléphone :</strong> {selectedPlace.phone}</p>
                )}
                {selectedPlace.type && (
                  <p><strong>Type :</strong> {selectedPlace.type}</p>
                )}
              </div>
            ) : (
              <p className="text-gray-500">Aucun lieu sélectionné</p>
            )}
          </Card>

          <Button
            onClick={handleNextStep}
            className="w-full mt-4 bg-google-blue hover:bg-google-blue/90"
            disabled={!selectedPlace && currentStep === 0}
          >
            Étape suivante
          </Button>
        </div>
      </div>
    </div>
  );
}