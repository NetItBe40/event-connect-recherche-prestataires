import { BasicInfoForm } from "./BasicInfoForm";
import { SocialMediaForm } from "./SocialMediaForm";
import { EmailForm } from "./EmailForm";

interface EnrichmentFormsProps {
  data: any;
  onChange: (field: string, value: string) => void;
  isLoading: boolean;
  showFullForm: boolean;
}

export function EnrichmentForms({ data, onChange, isLoading, showFullForm }: EnrichmentFormsProps) {
  return (
    <div className="space-y-4">
      <BasicInfoForm
        data={data}
        onChange={onChange}
        isLoading={isLoading}
        showOnlyWebsite={!showFullForm}
      />

      {showFullForm && (
        <>
          <h3 className="text-lg font-semibold">Réseaux sociaux</h3>
          <SocialMediaForm
            data={data}
            onChange={onChange}
            isLoading={isLoading}
          />

          <h3 className="text-lg font-semibold">Emails</h3>
          <EmailForm
            data={data}
            onChange={onChange}
            isLoading={isLoading}
          />
        </>
      )}
    </div>
  );
}