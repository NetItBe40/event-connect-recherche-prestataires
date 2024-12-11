import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Phone, Globe, Star, MessageCircle, Tag } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface Place {
  title: string;
  address: string;
  rating?: string;
  reviews?: string;
  type?: string;
  phone?: string;
  website?: string;
}

interface ResultCardProps {
  place: Place;
}

export function ResultCard({ place }: ResultCardProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-google-blue">
          {place.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Adresse */}
        <div className="flex items-start gap-2">
          <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
          <span className="text-sm text-gray-600">{place.address}</span>
        </div>

        {/* Note et avis */}
        {(place.rating || place.reviews) && (
          <div className="flex items-center gap-4">
            {place.rating && (
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 fill-google-yellow text-google-yellow" />
                <span className="text-sm font-medium">{place.rating}</span>
              </div>
            )}
            {place.reviews && (
              <div className="flex items-center gap-1 text-gray-600">
                <MessageCircle className="h-4 w-4" />
                <span className="text-sm">{place.reviews} avis</span>
              </div>
            )}
          </div>
        )}

        <Separator />

        {/* Type d'établissement */}
        {place.type && (
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">{place.type}</span>
          </div>
        )}

        {/* Téléphone */}
        {place.phone && (
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-gray-500" />
            <a
              href={`tel:${place.phone}`}
              className="text-sm text-google-blue hover:underline"
            >
              {place.phone}
            </a>
          </div>
        )}

        {/* Site web */}
        {place.website && (
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-gray-500" />
            <a
              href={place.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-google-blue hover:underline truncate"
            >
              {place.website}
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  );
}