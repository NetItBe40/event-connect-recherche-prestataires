import { useState } from "react";
import { Card } from "@/components/ui/card";
import { BasicInfoForm } from "../enrichment/BasicInfoForm";
import { SocialMediaForm } from "../enrichment/SocialMediaForm";
import { EmailForm } from "../enrichment/EmailForm";
import { EnrichmentActions } from "../enrichment/EnrichmentActions";
import { useEnrichmentData } from "@/hooks/useEnrichmentData";
import { EnrichmentDebugDialog } from "./EnrichmentDebugDialog";

interface EnrichmentStepProps {
  placeId?: string;
  initialData: {
    website?: string;
    phone?: string;
    type?: string;
    openingHours?: {
      [key: string]: string;
    };
  };
}

export function EnrichmentStep({ placeId, initialData }: EnrichmentStepProps) {
  const [showFullForm, setShowFullForm] = useState(false);
  const [debugOpen, setDebugOpen] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>({});
  
  const {
    data,
    isLoading,
    handleChange,
    handleFetchSocials,
    handleSave
  } = useEnrichmentData(placeId, initialData);

  const onFetchSocials = async () => {
    try {
      // Préparer les données de debug
      const debugData = {
        website: data.website,
      };
      
      const response = await handleFetchSocials();
      
      // Mettre à jour les données de debug avec la réponse
      setDebugInfo({
        ...debugData,
        apiResponse: response
      });
      
      // Ouvrir la modale de debug
      setDebugOpen(true);
      
      if (response && response.length > 0) {
        setShowFullForm(true);
        return true;
      }
      return false;
    } catch (error) {
      // En cas d'erreur, afficher aussi dans la modale
      setDebugInfo({
        website: data.website,
        error: error
      });
      setDebugOpen(true);
      return false;
    }
  };

  return (
    <Card className="p-6 space-y-6">
      <h2 className="text-xl font-semibold">Enrichissement des données</h2>

      <div className="space-y-4">
        <BasicInfoForm
          data={data}
          onChange={handleChange}
          isLoading={isLoading}
          showOnlyWebsite={!showFullForm}
        />

        {!showFullForm && (
          <EnrichmentActions
            onFetchSocials={onFetchSocials}
            onSave={handleSave}
            isLoading={isLoading}
            hasWebsite={!!data.website}
            showSaveButton={false}
          />
        )}

        {showFullForm && (
          <>
            <h3 className="text-lg font-semibold">Réseaux sociaux</h3>
            <SocialMediaForm
              data={data}
              onChange={handleChange}
              isLoading={isLoading}
            />

            <h3 className="text-lg font-semibold">Emails</h3>
            <EmailForm
              data={data}
              onChange={handleChange}
              isLoading={isLoading}
            />

            <EnrichmentActions
              onFetchSocials={onFetchSocials}
              onSave={handleSave}
              isLoading={isLoading}
              hasWebsite={!!data.website}
              showSaveButton={true}
            />
          </>
        )}
      </div>

      <EnrichmentDebugDialog
        open={debugOpen}
        onOpenChange={setDebugOpen}
        debugInfo={debugInfo}
      />
    </Card>
  );
}