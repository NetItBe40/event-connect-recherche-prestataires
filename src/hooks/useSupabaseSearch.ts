import { supabase } from "@/integrations/supabase/client";

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

export const useSupabaseSearch = () => {
  const checkExistingPlace = async (query: string): Promise<Place | null> => {
    try {
      console.log("Recherche d'un lieu existant avec le place_id:", query);
      
      const { data, error } = await supabase
        .from('places')
        .select('*')
        .eq('place_id', query)
        .maybeSingle();

      if (error) {
        console.error('Erreur lors de la vérification:', error);
        return null;
      }

      console.log("Résultat de la recherche:", data);
      return data;
    } catch (error) {
      console.error('Erreur lors de la vérification:', error);
      return null;
    }
  };

  return { checkExistingPlace };
};