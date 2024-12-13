import { PlacePhoto } from "../PlacePhoto";

interface PlaceSummaryHeaderProps {
  title: string;
  photobing1?: string;
}

export function PlaceSummaryHeader({ title, photobing1 }: PlaceSummaryHeaderProps) {
  return (
    <div className="space-y-4">
      {photobing1 && (
        <div className="mb-4">
          <PlacePhoto photo={photobing1} title={title} />
        </div>
      )}
    </div>
  );
}