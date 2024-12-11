import { Card } from "../ui/card";

interface PlaceSummaryProps {
  selectedPlace: {
    title: string;
    address: string;
    phone?: string;
    type?: string;
  } | null;
}

export function PlaceSummary({ selectedPlace }: PlaceSummaryProps) {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Résumé</h2>
      {selectedPlace ? (
        <div className="space-y-2">
          <p><strong>Nom :</strong> {selectedPlace.title}</p>
          <p><strong>Adresse :</strong> {selectedPlace.address}</p>
          {selectedPlace.phone && (
            <p><strong>Téléphone :</strong> {selectedPlace.phone}</p>
          )}
          {selectedPlace.type && (
            <p><strong>Type :</strong> {selectedPlace.type}</p>
          )}
        </div>
      ) : (
        <p className="text-gray-500">Aucun lieu sélectionné</p>
      )}
    </Card>
  );
}