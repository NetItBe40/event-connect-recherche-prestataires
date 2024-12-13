import { SearchForm } from "../SearchForm";
import { ResultsList } from "../ResultsList";
import { BingImageStep } from "./BingImageStep";
import { ChatGPTStep } from "./ChatGPTStep";
import { ExistingPlacesList } from "../ExistingPlacesList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface StepContentProps {
  currentStep: number;
  selectedPlace: any;
  results: any[];
  isLoading: boolean;
  onSearch: (params: any) => void;
  onSelect: (place: any) => void;
}

export function StepContent({
  currentStep,
  selectedPlace,
  results,
  isLoading,
  onSearch,
  onSelect,
}: StepContentProps) {
  console.log("StepContent - Étape actuelle:", currentStep);

  if (selectedPlace) {
    console.log("StepContent - Structure complète de selectedPlace:", JSON.stringify(selectedPlace, null, 2));
  }

  switch (currentStep) {
    case 0:
      return (
        <div className="space-y-4">
          <Tabs defaultValue="search" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="search">Recherche Google Maps</TabsTrigger>
              <TabsTrigger value="existing">Prestataires existants</TabsTrigger>
            </TabsList>
            <TabsContent value="search" className="space-y-4">
              <SearchForm onSearch={onSearch} isLoading={isLoading} />
              <ResultsList 
                results={results} 
                onSelect={onSelect}
                isLoading={isLoading}
              />
            </TabsContent>
            <TabsContent value="existing">
              <ExistingPlacesList onSelect={onSelect} />
            </TabsContent>
          </Tabs>
        </div>
      );
    case 1:
      return (
        <ChatGPTStep 
          placeId={selectedPlace?.id}
          title={selectedPlace?.title || ""}
          address={selectedPlace?.address || ""}
          type={selectedPlace?.type}
          rating={selectedPlace?.rating}
          phone={selectedPlace?.phone}
          description={selectedPlace?.description}
        />
      );
    case 2:
      return (
        <BingImageStep 
          placeId={selectedPlace?.id}
          title={selectedPlace?.title || ""}
          address={selectedPlace?.address || ""}
        />
      );
    default:
      return null;
  }
}