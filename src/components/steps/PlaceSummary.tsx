import { Card } from "../ui/card";
import { PlacePhoto } from "../PlacePhoto";

interface PlaceSummaryProps {
  selectedPlace: {
    id?: string;
    title: string;
    address: string;
    phone?: string;
    type?: string;
    rating?: string;
    reviews?: string;
    website?: string;
    city?: string;
    state?: string;
    description?: string;
    photobing1?: string;
    opening_hours?: {
      [key: string]: string;
    };
    facebook?: string;
    instagram?: string;
    tiktok?: string;
    snapchat?: string;
    twitter?: string;
    linkedin?: string;
    github?: string;
    youtube?: string;
    pinterest?: string;
    email_1?: string;
    email_2?: string;
    latitude?: number;
    longitude?: number;
    timezone?: string;
    place_id?: string;
    place_link?: string;
    price_level?: string;
    verified?: boolean;
    photos?: string;
  } | null;
}

export function PlaceSummary({ selectedPlace }: PlaceSummaryProps) {
  if (!selectedPlace) {
    return (
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Résumé</h2>
        <p className="text-gray-500">Aucun lieu sélectionné</p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Résumé</h2>
      <div className="space-y-4">
        {selectedPlace.photobing1 && (
          <div className="mb-4">
            <PlacePhoto photo={selectedPlace.photobing1} title={selectedPlace.title} />
          </div>
        )}
        
        <div className="space-y-2">
          <p><strong>Nom :</strong> {selectedPlace.title}</p>
          <p><strong>Adresse :</strong> {selectedPlace.address}</p>
          
          {selectedPlace.city && (
            <p><strong>Ville :</strong> {selectedPlace.city}</p>
          )}
          
          {selectedPlace.state && (
            <p><strong>État :</strong> {selectedPlace.state}</p>
          )}
          
          {selectedPlace.phone && (
            <p><strong>Téléphone :</strong> {selectedPlace.phone}</p>
          )}
          
          {selectedPlace.type && (
            <p><strong>Type :</strong> {selectedPlace.type}</p>
          )}
          
          {selectedPlace.website && (
            <p>
              <strong>Site web :</strong>{" "}
              <a 
                href={selectedPlace.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {selectedPlace.website}
              </a>
            </p>
          )}
          
          {selectedPlace.rating && (
            <p><strong>Note :</strong> {selectedPlace.rating}/5</p>
          )}
          
          {selectedPlace.reviews && (
            <p><strong>Avis :</strong> {selectedPlace.reviews}</p>
          )}

          {selectedPlace.price_level && (
            <p><strong>Niveau de prix :</strong> {selectedPlace.price_level}</p>
          )}

          {(selectedPlace.latitude && selectedPlace.longitude) && (
            <p><strong>Coordonnées :</strong> {selectedPlace.latitude}, {selectedPlace.longitude}</p>
          )}

          {selectedPlace.timezone && (
            <p><strong>Fuseau horaire :</strong> {selectedPlace.timezone}</p>
          )}

          {selectedPlace.place_link && (
            <p>
              <strong>Lien Google Maps :</strong>{" "}
              <a 
                href={selectedPlace.place_link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Voir sur Google Maps
              </a>
            </p>
          )}

          {selectedPlace.verified && (
            <p><strong>Vérifié :</strong> Oui</p>
          )}

          {selectedPlace.description && (
            <div>
              <strong>Description :</strong>
              <p className="mt-1 text-gray-600">{selectedPlace.description}</p>
            </div>
          )}

          {/* Réseaux sociaux */}
          {(selectedPlace.facebook || selectedPlace.instagram || selectedPlace.tiktok || 
            selectedPlace.snapchat || selectedPlace.twitter || selectedPlace.linkedin || 
            selectedPlace.github || selectedPlace.youtube || selectedPlace.pinterest) && (
            <div>
              <strong>Réseaux sociaux :</strong>
              <div className="mt-1 space-y-1">
                {selectedPlace.facebook && (
                  <p><strong>Facebook :</strong> {selectedPlace.facebook}</p>
                )}
                {selectedPlace.instagram && (
                  <p><strong>Instagram :</strong> {selectedPlace.instagram}</p>
                )}
                {selectedPlace.tiktok && (
                  <p><strong>TikTok :</strong> {selectedPlace.tiktok}</p>
                )}
                {selectedPlace.snapchat && (
                  <p><strong>Snapchat :</strong> {selectedPlace.snapchat}</p>
                )}
                {selectedPlace.twitter && (
                  <p><strong>Twitter :</strong> {selectedPlace.twitter}</p>
                )}
                {selectedPlace.linkedin && (
                  <p><strong>LinkedIn :</strong> {selectedPlace.linkedin}</p>
                )}
                {selectedPlace.github && (
                  <p><strong>GitHub :</strong> {selectedPlace.github}</p>
                )}
                {selectedPlace.youtube && (
                  <p><strong>YouTube :</strong> {selectedPlace.youtube}</p>
                )}
                {selectedPlace.pinterest && (
                  <p><strong>Pinterest :</strong> {selectedPlace.pinterest}</p>
                )}
              </div>
            </div>
          )}

          {/* Emails */}
          {(selectedPlace.email_1 || selectedPlace.email_2) && (
            <div>
              <strong>Emails :</strong>
              <div className="mt-1 space-y-1">
                {selectedPlace.email_1 && (
                  <p><strong>Email 1 :</strong> {selectedPlace.email_1}</p>
                )}
                {selectedPlace.email_2 && (
                  <p><strong>Email 2 :</strong> {selectedPlace.email_2}</p>
                )}
              </div>
            </div>
          )}

          {selectedPlace.opening_hours && Object.keys(selectedPlace.opening_hours).length > 0 && (
            <div>
              <strong>Horaires :</strong>
              <div className="mt-1 space-y-1">
                {Object.entries(selectedPlace.opening_hours).map(([day, hours]) => (
                  <p key={day} className="text-sm">
                    <span className="font-medium">{day} :</span> {hours}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}