import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

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
}

export function SearchForm({ onSearch, isLoading }: SearchFormProps) {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    query: "",
    country: "us",
    limit: "10",
    lat: "",
    lng: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchParams);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchParams((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="query">Recherche</Label>
          <Input
            id="query"
            name="query"
            value={searchParams.query}
            onChange={handleChange}
            placeholder="Ex: restaurants, hotels..."
            required
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
              required
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
              required
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