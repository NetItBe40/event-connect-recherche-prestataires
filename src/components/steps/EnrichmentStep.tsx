import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BasicInfoForm } from "../enrichment/BasicInfoForm";
import { SocialMediaForm } from "../enrichment/SocialMediaForm";
import { EmailForm } from "../enrichment/EmailForm";
import { EnrichmentActions } from "../enrichment/EnrichmentActions";
import { useEnrichmentData } from "@/hooks/useEnrichmentData";

interface EnrichmentStepProps {
  placeId?: string;
  initialData: {
    website?: string;
    phone?: string;
    type?: string;
    openingHours?: {
      [key: string]: string;
    };
    facebook?: string;
    instagram?: string;
    tiktok?: string;
    snapchat?: string;
    twitter?: string;
    linkedin?: string;
    github?: string;
    youtube?: string;
    pinterest?: string;
    email_1?: string;
    email_2?: string;
  };
}

export function EnrichmentStep({ placeId, initialData }: EnrichmentStepProps) {
  console.log("EnrichmentStep - initialData:", initialData);

  const {
    data,
    isLoading,
    handleChange,
    handleFetchSocials,
    handleSave
  } = useEnrichmentData(placeId, initialData);

  console.log("EnrichmentStep - data after hook:", data);

  return (
    <Card className="p-6 space-y-6">
      <h2 className="text-xl font-semibold">Enrichissement des données</h2>

      <div className="space-y-4">
        <div className="flex gap-2">
          <BasicInfoForm
            data={data}
            onChange={handleChange}
            isLoading={isLoading}
          />
        </div>

        <Separator className="my-4" />

        <h3 className="text-lg font-semibold">Réseaux sociaux</h3>
        <SocialMediaForm
          data={data}
          onChange={handleChange}
          isLoading={isLoading}
        />

        <Separator className="my-4" />

        <h3 className="text-lg font-semibold">Emails</h3>
        <EmailForm
          data={data}
          onChange={handleChange}
          isLoading={isLoading}
        />

        <EnrichmentActions
          onFetchSocials={handleFetchSocials}
          onSave={handleSave}
          isLoading={isLoading}
          hasWebsite={!!data.website}
        />
      </div>
    </Card>
  );
}