import { X } from "lucide-react";
import { PlacePhoto } from "../PlacePhoto";
import { Button } from "../ui/button";

interface PlaceSummaryHeaderProps {
  title: string;
  photobing1?: string;
  onClearPhoto?: () => void;
}

export function PlaceSummaryHeader({ title, photobing1, onClearPhoto }: PlaceSummaryHeaderProps) {
  return (
    <div className="space-y-4">
      {photobing1 && (
        <div className="mb-4 relative group">
          <PlacePhoto photo={photobing1} title={title} />
          {onClearPhoto && (
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={onClearPhoto}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}