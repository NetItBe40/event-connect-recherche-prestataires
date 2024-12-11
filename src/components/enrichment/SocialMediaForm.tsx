import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SocialMediaFormProps {
  data: {
    facebook?: string;
    instagram?: string;
    tiktok?: string;
    snapchat?: string;
    twitter?: string;
    linkedin?: string;
    youtube?: string;
    pinterest?: string;
  };
  onChange: (field: string, value: string) => void;
  isLoading: boolean;
}

export function SocialMediaForm({ data, onChange, isLoading }: SocialMediaFormProps) {
  const socialFields = [
    { id: "facebook", label: "Facebook" },
    { id: "instagram", label: "Instagram" },
    { id: "tiktok", label: "TikTok" },
    { id: "snapchat", label: "Snapchat" },
    { id: "twitter", label: "Twitter" },
    { id: "linkedin", label: "LinkedIn" },
    { id: "youtube", label: "YouTube" },
    { id: "pinterest", label: "Pinterest" },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {socialFields.map(({ id, label }) => (
        <div key={id} className="space-y-2">
          <Label htmlFor={id}>{label}</Label>
          <Input
            id={id}
            value={data[id as keyof typeof data] || ""}
            onChange={(e) => onChange(id, e.target.value)}
            placeholder={`URL ${label}`}
            disabled={isLoading}
          />
        </div>
      ))}
    </div>
  );
}