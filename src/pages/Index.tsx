import { useState } from "react";
import { SearchForm, type SearchParams } from "@/components/SearchForm";
import { ResultsList } from "@/components/ResultsList";
import { useToast } from "@/hooks/use-toast";
import { ExistingPlaceAlert } from "@/components/ExistingPlaceAlert";
import { useSupabaseSearch } from "@/hooks/useSupabaseSearch";

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

const API_KEY = "333560f1da2bc2c0fd39bfd3f4e1567b9b208d9ace5945433a3e1a75a5232657";

export default function Index() {
  const [results, setResults] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [existingPlace, setExistingPlace] = useState<Place | null>(null);
  const { toast } = useToast();
  const { checkExistingPlace } = useSupabaseSearch();

  const handleSearch = async (params: SearchParams) => {
    setIsLoading(true);
    setExistingPlace(null);

    try {
      // Vérifier si le lieu existe déjà
      const existing = await checkExistingPlace(params.query);
      if (existing) {
        setExistingPlace(existing);
        toast({
          title: "Lieu déjà enregistré",
          description: "Ce lieu existe déjà dans la base de données",
        });
        setIsLoading(false);
        return;
      }

      let endpoint = "https://api.scrapetable.com/maps/search";
      let apiParams: any = {
        query: params.query,
        country: params.country,
        limit: parseInt(params.limit),
        lang: "french",
        ...(params.lat && { lat: parseFloat(params.lat) }),
        ...(params.lng && { lng: parseFloat(params.lng) }),
      };

      if (params.placeId) {
        endpoint = "https://api.scrapetable.com/maps/place";
        apiParams = {
          place_id: params.placeId,
          lang: "french",
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

      let apiResults = params.placeId ? [data] : (Array.isArray(data) ? data : data.data);

      if (!Array.isArray(apiResults)) {
        throw new Error("Format de réponse invalide");
      }

      const transformedResults = apiResults.map(item => ({
        id: item.business_id,
        title: item.name,
        address: item.full_address,
        rating: item.rating?.toString(),
        reviews: item.review_count?.toString(),
        type: item.types,
        phone: item.phone_number,
        website: item.website || undefined,
        latitude: item.latitude,
        longitude: item.longitude,
        timezone: item.timezone,
        placeId: item.place_id,
        placeLink: item.place_link,
        priceLevel: item.price_level,
        openingHours: {
          Dimanche: item.Dimanche || item.Sunday,
          Lundi: item.Lundi || item.Monday,
          Mardi: item.Mardi || item.Tuesday,
          Mercredi: item.Mercredi || item.Wednesday,
          Jeudi: item.Jeudi || item.Thursday,
          Vendredi: item.Vendredi || item.Friday,
          Samedi: item.Samedi || item.Saturday,
        },
        city: item.city,
        verified: item.verified,
        photos: item.photos,
        state: item.state,
        description: item.description,
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

      {existingPlace && <ExistingPlaceAlert place={existingPlace} />}

      <ResultsList results={results} isLoading={isLoading} />
    </div>
  );
}