import { Camera } from "lucide-react";

interface PlacePhotoProps {
  photo: string;
  title: string;
}

export function PlacePhoto({ photo, title }: PlacePhotoProps) {
  if (!photo) {
    return (
      <div className="w-full h-40 bg-gray-100 flex items-center justify-center rounded-lg">
        <Camera className="h-8 w-8 text-gray-400" />
      </div>
    );
  }

  return (
    <div className="w-full h-40 relative rounded-lg overflow-hidden">
      <img 
        src={photo} 
        alt={title} 
        className="w-full h-full object-cover"
        onError={(e) => {
          e.currentTarget.src = "/placeholder.svg";
        }}
      />
    </div>
  );
}