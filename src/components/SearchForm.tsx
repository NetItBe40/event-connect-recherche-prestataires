import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface SearchFormProps {
  onSearch: (params: SearchParams) => void;
  isLoading: boolean;
}

export interface SearchParams {
  query: string;
  country: string;
  limit: string;
  lat?: string;
  lng?: string;
  placeId?: string;
}

export function SearchForm({ onSearch, isLoading }: SearchFormProps) {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    query: "",
    country: "fr",
    limit: "1",
    lat: "",
    lng: "",
  });
  const [googleUrl, setGoogleUrl] = useState("");

  const extractPlaceId = (url: string): string | null => {
    try {
      const match = url.match(/place\/.*?\/([\w\d:]+)!/);
      if (match && match[1]) {
        return match[1];
      }
      return null;
    } catch (error) {
      console.error("Error extracting place ID:", error);
      return null;
    }
  };

  const extractPlaceNameAndCoordinates = (url: string) => {
    try {
      // Extraire le nom du lieu
      const placeNameMatch = url.match(/place\/(.*?)\/[@\d]/);
      if (placeNameMatch && placeNameMatch[1]) {
        const placeName = decodeURIComponent(placeNameMatch[1].replace(/\+/g, ' '));
        setSearchParams(prev => ({ ...prev, query: placeName }));
      }

      // Extraire les coordonnées
      const coordsMatch = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
      if (coordsMatch) {
        const [, lat, lng] = coordsMatch;
        setSearchParams(prev => ({
          ...prev,
          lat: lat,
          lng: lng,
        }));
        console.log(`Coordonnées extraites - Lat: ${lat}, Lng: ${lng}`);
      }
    } catch (error) {
      console.error("Error extracting place name and coordinates:", error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = { ...searchParams };
    
    if (googleUrl) {
      const placeId = extractPlaceId(googleUrl);
      if (placeId) {
        params.placeId = placeId;
      }
    }
    
    onSearch(params);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "googleUrl") {
      setGoogleUrl(value);
      extractPlaceNameAndCoordinates(value);
    } else {
      setSearchParams((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="googleUrl">URL Google Maps (optionnel)</Label>
          <Input
            id="googleUrl"
            name="googleUrl"
            value={googleUrl}
            onChange={handleChange}
            placeholder="https://www.google.fr/maps/place/..."
          />
        </div>

        <Separator className="my-4" />

        <div className="space-y-2">
          <Label htmlFor="query">Recherche</Label>
          <Input
            id="query"
            name="query"
            value={searchParams.query}
            onChange={handleChange}
            placeholder="Ex: restaurants, hotels..."
            required={!googleUrl}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="country">Pays</Label>
            <Input
              id="country"
              name="country"
              value={searchParams.country}
              onChange={handleChange}
              placeholder="us, fr, etc."
              required={!googleUrl}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="limit">Limite</Label>
            <Input
              id="limit"
              name="limit"
              type="number"
              value={searchParams.limit}
              onChange={handleChange}
              min="1"
              max="20"
              required={!googleUrl}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="lat">Latitude (optionnel)</Label>
            <Input
              id="lat"
              name="lat"
              value={searchParams.lat}
              onChange={handleChange}
              placeholder="Ex: 48.8566"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lng">Longitude (optionnel)</Label>
            <Input
              id="lng"
              name="lng"
              value={searchParams.lng}
              onChange={handleChange}
              placeholder="Ex: 2.3522"
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-google-blue hover:bg-google-blue/90"
          disabled={isLoading}
        >
          {isLoading ? "Recherche en cours..." : "Rechercher"}
        </Button>
      </form>
    </Card>
  );
}