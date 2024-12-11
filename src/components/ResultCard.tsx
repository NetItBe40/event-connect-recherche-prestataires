import { Card } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";

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
    <Card className="p-4 hover:shadow-lg transition-shadow">
      <div className="space-y-2">
        <div className="flex items-start justify-between">
          <h3 className="font-semibold text-lg">{place.title}</h3>
          {place.website && (
            <a
              href={place.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-google-blue hover:text-google-blue/80"
            >
              <ExternalLink className="h-5 w-5" />
            </a>
          )}
        </div>
        
        <p className="text-sm text-gray-600">{place.address}</p>
        
        {place.rating && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{place.rating} ⭐</span>
            {place.reviews && (
              <span className="text-sm text-gray-500">({place.reviews} avis)</span>
            )}
          </div>
        )}
        
        {place.type && (
          <p className="text-sm text-gray-500">{place.type}</p>
        )}
        
        {place.phone && (
          <p className="text-sm text-gray-600">{place.phone}</p>
        )}
      </div>
    </Card>
  );
}