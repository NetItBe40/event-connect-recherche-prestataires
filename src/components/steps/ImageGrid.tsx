import { Check } from "lucide-react";
import { PlacePhoto } from "../PlacePhoto";
import { BingImageSearchResult } from "@/hooks/useBingImageSearch";

interface ImageGridProps {
  photos: BingImageSearchResult[];
  selectedImage: string | null;
  title: string;
  onImageSelect: (imageUrl: string) => void;
}

export function ImageGrid({ photos, selectedImage, title, onImageSelect }: ImageGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {photos.map((photo, index) => (
        <div key={index} className="space-y-2 relative">
          <div 
            className="cursor-pointer relative group"
            onClick={() => onImageSelect(photo.url)}
          >
            <PlacePhoto photo={photo.url} title={title} />
            {selectedImage === photo.url && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                <Check className="w-8 h-8 text-white" />
              </div>
            )}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors rounded-lg" />
          </div>
          <p className="text-xs text-gray-500">
            {photo.width}x{photo.height}px • {photo.contentSize}
          </p>
        </div>
      ))}
    </div>
  );
}