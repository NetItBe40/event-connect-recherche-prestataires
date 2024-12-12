import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Info, CheckCircle, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Place {
  title: string;
  address: string;
  phone?: string;
  type?: string;
  rating?: string;
  description?: string;
  photobing1?: string;
}

interface ExistingPlaceAlertProps {
  place: Place;
}

export function ExistingPlaceAlert({ place }: ExistingPlaceAlertProps) {
  return (
    <Alert className="max-w-2xl mx-auto">
      <Info className="h-4 w-4" />
      <AlertTitle className="flex items-center gap-2">
        <span>{place.title}</span>
        <div className="flex gap-2">
          <Badge 
            variant={place.description ? "default" : "destructive"}
            className="flex items-center gap-1"
          >
            {place.description ? (
              <CheckCircle className="h-3 w-3" />
            ) : (
              <XCircle className="h-3 w-3" />
            )}
            Description
          </Badge>
          <Badge 
            variant={place.photobing1 ? "default" : "destructive"}
            className="flex items-center gap-1"
          >
            {place.photobing1 ? (
              <CheckCircle className="h-3 w-3" />
            ) : (
              <XCircle className="h-3 w-3" />
            )}
            Photo Bing
          </Badge>
        </div>
      </AlertTitle>
      <AlertDescription>
        <div className="mt-2 space-y-2">
          <p><strong>Adresse :</strong> {place.address}</p>
          {place.phone && <p><strong>Téléphone :</strong> {place.phone}</p>}
          {place.type && <p><strong>Type :</strong> {place.type}</p>}
          {place.rating && <p><strong>Note :</strong> {place.rating}/5</p>}
        </div>
      </AlertDescription>
    </Alert>
  );
}