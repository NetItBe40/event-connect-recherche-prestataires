import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

interface Place {
  title: string;
  address: string;
  phone?: string;
  type?: string;
  rating?: string;
}

interface ExistingPlaceAlertProps {
  place: Place;
}

export function ExistingPlaceAlert({ place }: ExistingPlaceAlertProps) {
  return (
    <Alert className="max-w-2xl mx-auto">
      <Info className="h-4 w-4" />
      <AlertTitle>Lieu déjà enregistré</AlertTitle>
      <AlertDescription>
        <div className="mt-2 space-y-2">
          <p><strong>Nom :</strong> {place.title}</p>
          <p><strong>Adresse :</strong> {place.address}</p>
          {place.phone && <p><strong>Téléphone :</strong> {place.phone}</p>}
          {place.type && <p><strong>Type :</strong> {place.type}</p>}
          {place.rating && <p><strong>Note :</strong> {place.rating}/5</p>}
        </div>
      </AlertDescription>
    </Alert>
  );
}