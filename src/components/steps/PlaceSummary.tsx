import { Card } from "../ui/card";
import { PlacePhoto } from "../PlacePhoto";

interface PlaceSummaryProps {
  selectedPlace: {
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
          {selectedPlace.description && (
            <div>
              <strong>Description :</strong>
              <p className="mt-1 text-gray-600">{selectedPlace.description}</p>
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