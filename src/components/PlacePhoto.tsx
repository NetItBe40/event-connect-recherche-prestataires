import { Camera } from "lucide-react";

interface PlacePhotoProps {
  photo: any; // On accepte tout type pour le moment car le format peut varier
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

  // Si c'est un tableau de photos, on prend la première
  const photoUrl = Array.isArray(photo) && photo.length > 0 
    ? photo[0].src 
    : (typeof photo === 'string' ? photo : null);

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