import { useState } from "react";
import { Card } from "@/components/ui/card";
import { EnrichmentActions } from "./EnrichmentActions";
import { useEnrichmentData } from "@/hooks/useEnrichmentData";
import { EnrichmentDebugDialog } from "./EnrichmentDebugDialog";
import { EnrichmentForms } from "./EnrichmentForms";

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
      const debugData = {
        website: data.website,
      };
      
      const response = await handleFetchSocials();
      
      setDebugInfo({
        ...debugData,
        apiResponse: response
      });
      
      setDebugOpen(true);
      
      if (response && typeof response === 'object') {
        setShowFullForm(true);
        return true;
      }
      return false;
    } catch (error) {
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
        <EnrichmentForms
          data={data}
          onChange={handleChange}
          isLoading={isLoading}
          showFullForm={showFullForm}
        />

        <EnrichmentActions
          onFetchSocials={onFetchSocials}
          onSave={handleSave}
          isLoading={isLoading}
          hasWebsite={!!data.website}
          showSaveButton={showFullForm}
        />
      </div>

      <EnrichmentDebugDialog
        open={debugOpen}
        onOpenChange={setDebugOpen}
        debugInfo={debugInfo}
      />
    </Card>
  );
}