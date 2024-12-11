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
      const apiParams = {
        query: params.query,
        country: params.country,
        limit: parseInt(params.limit),
        ...(params.lat && { lat: parseFloat(params.lat) }),
        ...(params.lng && { lng: parseFloat(params.lng) }),
      };

      console.log("Sending API request with params:", apiParams);

      const response = await fetch("https://api.scrapetable.com/maps/search", {
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

      // Vérification et transformation des données
      if (!data || (!Array.isArray(data) && !Array.isArray(data.data))) {
        throw new Error("Format de réponse invalide");
      }

      const apiResults = Array.isArray(data) ? data : data.data;
      
      // Transformation des données de l'API vers notre format Place
      const transformedResults: Place[] = apiResults.map((item: APIResponse) => ({
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