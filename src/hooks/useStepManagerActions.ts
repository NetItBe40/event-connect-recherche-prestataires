import { useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useStepManagerState } from "./useStepManagerState";

interface SearchParams {
  query: string;
  country: string;
  limit: string;
  lat?: string;
  lng?: string;
  placeId?: string;
}

export function useStepManagerActions() {
  const { toast } = useToast();
  const { setSelectedPlace, setCurrentStep, setResults, setIsLoading } = useStepManagerState();

  const handleSearch = useCallback(async (params: SearchParams) => {
    setIsLoading(true);
    try {
      const { data: apiKeyData, error: apiKeyError } = await supabase
        .from('apikeys')
        .select('apikey')
        .eq('provider', 'scrapetable')
        .single();

      if (apiKeyError || !apiKeyData?.apikey) {
        throw new Error("Impossible de récupérer la clé API Scrapetable");
      }

      const searchParams: any = {
        query: params.query,
        country: params.country,
        limit: parseInt(params.limit),
        lang: "fr",
        zoom: "13",
        offset: "0",
        flatten: false
      };

      if (params.lat && params.lng) {
        searchParams.lat = parseFloat(params.lat);
        searchParams.lng = parseFloat(params.lng);
      }

      if (params.placeId) {
        searchParams.place_id = params.placeId;
      }

      console.log("Paramètres de recherche:", searchParams);

      const response = await fetch("https://api.scrapetable.com/maps/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": apiKeyData.apikey,
        },
        body: JSON.stringify(searchParams),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error("Erreur API:", {
          status: response.status,
          statusText: response.statusText,
          body: errorData
        });
        throw new Error("Erreur lors de la recherche");
      }

      const data = await response.json();
      console.log("Résultats de la recherche:", data);

      // Formater les résultats en incluant le website
      const formattedResults = data.map((place: any) => ({
        title: place.name,
        address: place.full_address,
        rating: place.rating,
        reviews: place.review_count,
        type: place.types?.[0],
        phone: place.phone_number,
        website: place.website || "", // Ajout du champ website
        latitude: place.latitude,
        longitude: place.longitude,
        timezone: place.timezone,
        placeId: place.place_id,
        placeLink: place.place_link,
        priceLevel: place.price_level,
        openingHours: place.working_hours,
        city: place.city,
        state: place.state,
        photos: place.photos?.[0],
      }));

      setResults(formattedResults);
      
      if (formattedResults.length === 0) {
        toast({
          title: "Aucun résultat",
          description: "Aucun résultat trouvé pour cette recherche",
        });
      }

    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la recherche",
        variant: "destructive",
      });
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [setResults, setIsLoading, toast]);

  const handlePlaceSelect = useCallback((place: any) => {
    setSelectedPlace(place);
    toast({
      title: "Succès",
      description: "Le prestataire a été sélectionné",
    });
  }, [setSelectedPlace, toast]);

  const handleNextStep = useCallback(() => {
    setCurrentStep(prev => Math.min(prev + 1, 3));
  }, [setCurrentStep]);

  const handlePreviousStep = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  }, [setCurrentStep]);

  const handleStepChange = useCallback((step: number) => {
    setCurrentStep(step);
    toast({
      title: "Navigation",
      description: "Retour à l'étape précédente",
    });
  }, [setCurrentStep, toast]);

  return {
    handleSearch,
    handlePlaceSelect,
    handleNextStep,
    handlePreviousStep,
    handleStepChange,
  };
}