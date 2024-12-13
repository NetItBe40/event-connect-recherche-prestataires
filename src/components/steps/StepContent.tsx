import { SearchForm } from "../SearchForm";
import { ResultsList } from "../ResultsList";
import { EnrichmentStep } from "./EnrichmentStep";
import { BingImageStep } from "./BingImageStep";
import { ChatGPTStep } from "./ChatGPTStep";

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
    
    if (currentStep === 1) {
      console.log("StepContent - Préparation des données pour EnrichmentStep");
      console.log("StepContent - Website depuis selectedPlace:", selectedPlace.website);
      
      // Log des données attendues pour les réseaux sociaux
      console.log("StepContent - Données attendues des réseaux sociaux:", {
        facebook: "https://www.facebook.com/daniellenatoni",
        instagram: "https://www.instagram.com/daniellenatoni",
        youtube: "https://www.youtube.com/channel/UCCbyYD6W2U44K-OgpayiTng",
        email_1: "bonjour@danieletannesophie.com",
        email_2: "danielle@healthy.hair"
      });
    }
  }

  switch (currentStep) {
    case 0:
      return (
        <div className="space-y-4">
          <SearchForm onSearch={onSearch} isLoading={isLoading} />
          <ResultsList 
            results={results} 
            onSelect={onSelect}
            isLoading={isLoading}
          />
        </div>
      );
    case 1:
      return (
        <EnrichmentStep
          placeId={selectedPlace?.id}
          initialData={{
            website: selectedPlace?.website || "",
            phone: selectedPlace?.phone || "",
            type: selectedPlace?.type || "",
            openingHours: selectedPlace?.opening_hours || {},
            facebook: "",
            instagram: "",
            tiktok: "",
            snapchat: "",
            twitter: "",
            linkedin: "",
            github: "",
            youtube: "",
            pinterest: "",
            email_1: "",
            email_2: "",
          }}
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
    case 3:
      return (
        <ChatGPTStep 
          placeId={selectedPlace?.id}
          title={selectedPlace?.title || ""}
          address={selectedPlace?.address || ""}
        />
      );
    default:
      return null;
  }
}