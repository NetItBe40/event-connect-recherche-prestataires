import { ChatGPTStep } from "./ChatGPTStep";
import { EnrichmentStep } from "./EnrichmentStep";
import { BingImageStep } from "./BingImageStep";
import { ResultsList } from "../ResultsList";
import { SearchForm } from "../SearchForm";
import { ExistingPlacesList } from "../ExistingPlacesList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

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
  onSelect 
}: StepContentProps) {
  switch (currentStep) {
    case 0:
      return (
        <Tabs defaultValue="new" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="new">Nouveau prestataire</TabsTrigger>
            <TabsTrigger value="existing">Prestataire existant</TabsTrigger>
          </TabsList>
          
          <TabsContent value="new" className="space-y-8">
            <div className="max-w-2xl mx-auto">
              <SearchForm onSearch={onSearch} isLoading={isLoading} />
            </div>
            <ResultsList 
              results={results} 
              isLoading={isLoading} 
              onSelect={onSelect}
            />
          </TabsContent>
          
          <TabsContent value="existing">
            <ExistingPlacesList onSelect={onSelect} />
          </TabsContent>
        </Tabs>
      );
    case 1:
      return (
        <ChatGPTStep 
          placeId={selectedPlace?.id}
          title={selectedPlace?.title}
          address={selectedPlace?.address}
          type={selectedPlace?.type}
          rating={selectedPlace?.rating}
          phone={selectedPlace?.phone}
        />
      );
    case 2:
      return (
        <EnrichmentStep 
          placeId={selectedPlace?.id}
          initialData={{
            website: selectedPlace?.website,
            phone: selectedPlace?.phone,
            type: selectedPlace?.type,
            openingHours: selectedPlace?.openingHours,
          }}
        />
      );
    case 3:
      return (
        <BingImageStep 
          placeId={selectedPlace?.id}
          title={selectedPlace?.title}
          address={selectedPlace?.address}
        />
      );
    default:
      return null;
  }
}