import { useState } from "react";
import { SearchForm, type SearchParams } from "@/components/SearchForm";
import { ResultsList } from "@/components/ResultsList";
import { useToast } from "@/components/ui/use-toast";

interface Place {
  id?: string;
  title: string;
  address: string;
  rating?: string;
  reviews?: string;
  type?: string;
  phone?: string;
  website?: string;
}

interface APIResponse {
  business_id: string;
  name: string;
  full_address: string;
  rating: number;
  review_count: number;
  types: string[];
  phone_number: string;
  website: string | null;
}

const API_KEY = "333560f1da2bc2c0fd39bfd3f4e1567b9b208d9ace5945433a3e1a75a5232657";

export default function Index() {
  const [results, setResults] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSearch = async (params: SearchParams) => {
    setIsLoading(true);
    try {
      let endpoint = "https://api.scrapetable.com/maps/search";
      let apiParams: any = {
        query: params.query,
        country: params.country,
        limit: parseInt(params.limit),
        ...(params.lat && { lat: parseFloat(params.lat) }),
        ...(params.lng && { lng: parseFloat(params.lng) }),
      };

      // Si un placeId est fourni, utiliser l'endpoint details à la place
      if (params.placeId) {
        endpoint = "https://api.scrapetable.com/maps/place";
        apiParams = {
          place_id: params.placeId,
        };
      }

      console.log("Sending API request with params:", apiParams);

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": API_KEY,
        },
        body: JSON.stringify(apiParams),
      });

      const data = await response.json();
      console.log("API Response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Une erreur est survenue");
      }

      if (!data) {
        throw new Error("Format de réponse invalide");
      }

      let apiResults: APIResponse[];
      
      if (params.placeId) {
        apiResults = [data];
      } else {
        apiResults = Array.isArray(data) ? data : data.data;
      }

      if (!Array.isArray(apiResults)) {
        throw new Error("Format de réponse invalide");
      }
      
      const transformedResults: Place[] = apiResults.map((item: APIResponse) => ({
        id: item.business_id,
        title: item.name,
        address: item.full_address,
        rating: item.rating?.toString(),
        reviews: item.review_count?.toString(),
        type: item.types?.join(", "),
        phone: item.phone_number,
        website: item.website || undefined,
      }));

      setResults(transformedResults);
    } catch (error) {
      console.error("Search error:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue lors de la recherche",
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
