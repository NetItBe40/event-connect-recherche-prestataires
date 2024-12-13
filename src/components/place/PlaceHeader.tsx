import { CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface PlaceHeaderProps {
  title: string;
  verified?: boolean;
  id?: string;
  onSelect?: () => void;
  children?: React.ReactNode;
}

export function PlaceHeader({ title, verified, id, onSelect, children }: PlaceHeaderProps) {
  return (
    <CardHeader>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">{title}</h3>
            {verified && (
              <Check className="h-4 w-4 text-green-500" />
            )}
          </div>
          {onSelect && (
            <Button onClick={onSelect} variant="default" size="sm">
              Sélectionner
            </Button>
          )}
        </div>
        {children}
      </div>
    </CardHeader>
  );
}