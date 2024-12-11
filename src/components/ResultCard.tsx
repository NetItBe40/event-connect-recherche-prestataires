import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Phone, Globe, Star, MessageCircle, Tag, Info, Clock, MapIcon, DollarSign, CheckCircle, Building2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { PlacePhoto } from "./PlacePhoto";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";
import { createClient } from '@supabase/supabase-js';

interface Place {
  id?: string;
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

interface ResultCardProps {
  place: Place;
}

export function ResultCard({ place }: ResultCardProps) {
  const { toast } = useToast();
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleSelect = async () => {
    try {
      const { data, error } = await supabase
        .from('places')
        .insert([
          {
            title: place.title,
            address: place.address,
            rating: place.rating,
            reviews: place.reviews,
            type: place.type,
            phone: place.phone,
            website: place.website,
            latitude: place.latitude,
            longitude: place.longitude,
            timezone: place.timezone,
            place_id: place.placeId,
            place_link: place.placeLink,
            price_level: place.priceLevel,
            opening_hours: place.openingHours,
            city: place.city,
            verified: place.verified,
            photos: place.photos,
            state: place.state,
            description: place.description
          }
        ])
        .select();

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Le lieu a été sauvegardé avec succès",
      });

    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la sauvegarde",
      });
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-bold text-google-blue">
            {place.title}
          </CardTitle>
          <Button 
            onClick={handleSelect}
            className="bg-google-blue hover:bg-google-blue/90"
          >
            Sélectionner
          </Button>
        </div>
        {place.verified && (
          <div className="flex items-center gap-2 text-sm text-green-500">
            <CheckCircle className="h-4 w-4" />
            <span>Vérifié</span>
          </div>
        )}
        {place.id && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Info className="h-4 w-4" />
            <span>Identifiant : {place.id}</span>
          </div>
        )}
      </CardHeader>
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
    </Card>
  );
}
