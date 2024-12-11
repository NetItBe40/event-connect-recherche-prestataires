import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EmailFormProps {
  data: {
    email_1?: string;
    email_2?: string;
  };
  onChange: (field: string, value: string) => void;
  isLoading: boolean;
}

export function EmailForm({ data, onChange, isLoading }: EmailFormProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="email_1">Email principal</Label>
        <Input
          id="email_1"
          value={data.email_1 || ""}
          onChange={(e) => onChange("email_1", e.target.value)}
          placeholder="email@example.com"
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email_2">Email secondaire</Label>
        <Input
          id="email_2"
          value={data.email_2 || ""}
          onChange={(e) => onChange("email_2", e.target.value)}
          placeholder="email@example.com"
          disabled={isLoading}
        />
      </div>
    </div>
  );
}