import { Camera } from "lucide-react";

interface PhotoObject {
  src?: string;
  url?: string;
  contentUrl?: string;
  max_size?: [number, number];
  min_size?: [number, number];
}

interface PlacePhotoProps {
  photo: string | PhotoObject | PhotoObject[] | null;
  title: string;
}

export function PlacePhoto({ photo, title }: PlacePhotoProps) {
  console.log("PlacePhoto - Données reçues:", { photo, title });

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
  } else if (Array.isArray(photo) && photo.length > 0) {
    // Si c'est un tableau, prendre le premier élément et chercher src ou url
    photoUrl = photo[0].src || photo[0].url || photo[0].contentUrl || null;
  } else if (typeof photo === 'object' && photo !== null) {
    // Si c'est un objet unique, chercher src, url ou contentUrl
    photoUrl = photo.src || photo.url || photo.contentUrl || null;
  }

  console.log("PlacePhoto - URL extraite:", photoUrl);

  // Si on n'a pas réussi à extraire une URL valide
  if (!photoUrl) {
    return (
      <div className="w-full h-40 bg-gray-100 flex items-center justify-center rounded-lg">
        <Camera className="h-8 w-4 text-gray-400" />
      </div>
    );
  }

  return (
    <div className="w-full h-40 relative rounded-lg overflow-hidden bg-gray-100">
      <img 
        src={photoUrl} 
        alt={title} 
        className="w-full h-full object-cover"
        onError={(e) => {
          console.error("Erreur de chargement de l'image:", photoUrl);
          const target = e.target as HTMLImageElement;
          target.onerror = null; // Prevent infinite loop
          target.src = "/placeholder.svg";
        }}
      />
    </div>
  );
}