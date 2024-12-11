import { Card } from "@/components/ui/card";
import { BasicInfoForm } from "../enrichment/BasicInfoForm";
import { SocialMediaForm } from "../enrichment/SocialMediaForm";
import { EmailForm } from "../enrichment/EmailForm";
import { EnrichmentActions } from "../enrichment/EnrichmentActions";
import { useEnrichmentData } from "@/hooks/useEnrichmentData";
import { useState } from "react";

interface EnrichmentStepProps {
  placeId?: string;
  initialData: {
    website?: string;
    phone?: string;
    type?: string;
  };
}

export function EnrichmentStep({ placeId, initialData }: EnrichmentStepProps) {
  const [showFullForm, setShowFullForm] = useState(false);
  
  const {
    data,
    isLoading,
    handleChange,
    handleFetchSocials,
    handleSave
  } = useEnrichmentData(placeId, initialData);

  const onFetchSocials = async () => {
    const success = await handleFetchSocials();
    if (success) {
      setShowFullForm(true);
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
    </Card>
  );
}