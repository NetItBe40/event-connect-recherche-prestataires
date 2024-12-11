import { useState } from "react";
import { SearchForm, type SearchParams } from "@/components/SearchForm";
import { ResultsList } from "@/components/ResultsList";
import { useToast } from "@/components/ui/use-toast";

interface Place {
  title: string;
  address: string;
  rating?: string;
  reviews?: string;
  type?: string;
  phone?: string;
  website?: string;
}

const API_KEY = "333560f1da2bc2c0fd39bfd3f4e1567b9b208d9ace5945433a3e1a75a5232657";

export default function Index() {
  const [results, setResults] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSearch = async (params: SearchParams) => {
    setIsLoading(true);
    try {
      const response = await fetch("https://api.scrapetable.com/maps/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": API_KEY,
        },
        body: JSON.stringify({
          query: params.query,
          country: params.country,
          limit: params.limit,
          ...(params.lat && { lat: params.lat }),
          ...(params.lng && { lng: params.lng }),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Une erreur est survenue");
      }

      setResults(data.data || []);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue",
      });
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-8 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-google-blue">
          Recherche Google Maps
        </h1>
        <p className="text-gray-600">
          Trouvez des lieux et des entreprises partout dans le monde
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <SearchForm onSearch={handleSearch} isLoading={isLoading} />
      </div>

      <ResultsList results={results} isLoading={isLoading} />
    </div>
  );
}