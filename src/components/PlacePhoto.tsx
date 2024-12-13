import { Camera } from "lucide-react";

interface PhotoObject {
  src: string;
  max_size?: [number, number];
  min_size?: [number, number];
}

interface PlacePhotoProps {
  photo: string | PhotoObject | PhotoObject[] | null; // Accept string, photo object, or array of photo objects
  title: string;
}

export function PlacePhoto({ photo, title }: PlacePhotoProps) {
  // Si pas de photo du tout
  if (!photo) {
    return (
      <div className="w-full h-40 bg-gray-100 flex items-center justify-center rounded-lg">
        <Camera className="h-8 w-8 text-gray-400" />
      </div>
    );
  }

  // Extraire l'URL de la photo selon son type
  let photoUrl: string | null = null;

  if (typeof photo === 'string') {
    photoUrl = photo;
  } else if (Array.isArray(photo) && photo.length > 0 && photo[0].src) {
    photoUrl = photo[0].src;
  } else if ((photo as PhotoObject).src) {
    photoUrl = (photo as PhotoObject).src;
  }

  // Si on n'a pas réussi à extraire une URL valide
  if (!photoUrl) {
    return (
      <div className="w-full h-40 bg-gray-100 flex items-center justify-center rounded-lg">
        <Camera className="h-8 w-8 text-gray-400" />
      </div>
    );
  }

  return (
    <div className="w-full h-40 relative rounded-lg overflow-hidden">
      <img 
        src={photoUrl} 
        alt={title} 
        className="w-full h-full object-cover"
        onError={(e) => {
          e.currentTarget.src = "/placeholder.svg";
        }}
      />
    </div>
  );
}