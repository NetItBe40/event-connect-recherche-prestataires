import { Card } from "@/components/ui/card";
import { ExternalLink, MapPin, Phone } from "lucide-react";

interface Place {
  title: string;
  address: string;
  rating?: string;
  reviews?: string;
  type?: string;
  phone?: string;
  website?: string;
}

export function ResultCard({ place }: { place: Place }) {
  return (
    <Card className="p-4 hover:shadow-lg transition-shadow h-full">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-lg line-clamp-2">{place.title}</h3>
          {place.website && (
            <a
              href={place.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-google-blue hover:text-google-blue/80 flex-shrink-0"
              title="Visiter le site web"
            >
              <ExternalLink className="h-5 w-5" />
            </a>
          )}
        </div>
        
        {place.address && (
          <div className="flex items-start gap-2 text-gray-600">
            <MapPin className="h-4 w-4 flex-shrink-0 mt-1" />
            <p className="text-sm">{place.address}</p>
          </div>
        )}
        
        {place.rating && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{place.rating} ⭐</span>
            {place.reviews && (
              <span className="text-sm text-gray-500">({place.reviews} avis)</span>
            )}
          </div>
        )}
        
        {place.type && (
          <p className="text-sm text-gray-500 italic">{place.type}</p>
        )}
        
        {place.phone && (
          <div className="flex items-center gap-2 text-gray-600">
            <Phone className="h-4 w-4" />
            <p className="text-sm">{place.phone}</p>
          </div>
        )}
      </div>
    </Card>
  );
}