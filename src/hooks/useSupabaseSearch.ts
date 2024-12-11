import { supabase } from "@/lib/supabase";

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
      const { data, error } = await supabase
        .from('places')
        .select('*')
        .ilike('title', `%${query}%`);

      if (error) {
        console.error('Erreur lors de la vérification:', error);
        return null;
      }

      // Si on a des résultats, on retourne le premier
      if (data && data.length > 0) {
        return data[0];
      }

      return null;
    } catch (error) {
      console.error('Erreur lors de la vérification:', error);
      return null;
    }
  };

  return { checkExistingPlace };
};