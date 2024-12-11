import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BasicInfoFormProps {
  data: {
    website?: string;
    phone?: string;
    type?: string;
  };
  onChange: (field: string, value: string) => void;
  isLoading: boolean;
  showOnlyWebsite?: boolean;
}

export function BasicInfoForm({ data, onChange, isLoading, showOnlyWebsite }: BasicInfoFormProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="website">Site web</Label>
        <Input
          id="website"
          value={data.website || ""}
          onChange={(e) => onChange("website", e.target.value)}
          placeholder="https://..."
          disabled={isLoading}
        />
      </div>

      {!showOnlyWebsite && (
        <>
          <div className="space-y-2">
            <Label htmlFor="phone">Téléphone</Label>
            <Input
              id="phone"
              value={data.phone || ""}
              onChange={(e) => onChange("phone", e.target.value)}
              placeholder="+33..."
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Type d'établissement</Label>
            <Input
              id="type"
              value={data.type || ""}
              onChange={(e) => onChange("type", e.target.value)}
              placeholder="Restaurant, Hôtel..."
              disabled={isLoading}
            />
          </div>
        </>
      )}
    </div>
  );
}