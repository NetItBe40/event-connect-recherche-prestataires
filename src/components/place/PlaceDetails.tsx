import { CardContent } from "@/components/ui/card";
import { PlacePhoto } from "../PlacePhoto";
import { Clock, MapIcon, DollarSign, Building2, MapPin, Star, MessageCircle, Tag, Phone, Globe } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface Place {
  title: string;
  address: string;
  rating?: string;
  reviews?: string;
  type?: string;
  phone?: string;
  website?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  placeId?: string;
  placeLink?: string;
  priceLevel?: string;
  openingHours?: {
    [key: string]: string;
  };
  city?: string;
  verified?: boolean;
  photos?: string;
  state?: string;
  description?: string;
}

export function PlaceDetails({ place }: { place: Place }) {
  return (
    <CardContent className="space-y-4">
      <PlacePhoto photo={place.photos} title={place.title} />
        <div className="flex items-center justify-between">
          {place.state && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">{place.state}</span>
            </div>
          )}
          {place.priceLevel && (
            <div className="flex items-center gap-1">
              <DollarSign className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">{place.priceLevel}</span>
            </div>
          )}
        </div>
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
            <span className="text-sm text-gray-600">{place.address}</span>
          </div>
          {place.city && (
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">{place.city}</span>
            </div>
          )}
        </div>
        {(place.latitude && place.longitude) && (
          <div className="flex items-center gap-2">
            <MapIcon className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              Coordonnées : {place.latitude}, {place.longitude}
            </span>
          </div>
        )}
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
        {place.type && (
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">Catégorie : {place.type}</span>
          </div>
        )}
        {place.openingHours && Object.keys(place.openingHours).length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">Horaires d'ouverture</span>
            </div>
            <div className="grid grid-cols-1 gap-1 pl-6">
              {Object.entries(place.openingHours).map(([day, hours]) => (
                hours && (
                  <div key={day} className="flex justify-between text-sm">
                    <span className="text-gray-600">{day}</span>
                    <span className="text-gray-800">{hours}</span>
                  </div>
                )
              ))}
            </div>
          </div>
        )}
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
        {place.placeLink && (
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gray-500" />
            <a
              href={place.placeLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-google-blue hover:underline"
            >
              Voir sur Google Maps
            </a>
          </div>
        )}
        {place.description && (
          <div className="text-sm text-gray-600">
            <span className="font-medium">Description :</span> {place.description}
          </div>
        )}
    </CardContent>
  );
}
