import { supabase } from "@/integrations/supabase/client";
import { Category } from "@/types/categories";

export async function fetchAllCategories(): Promise<Category[]> {
  const { data: categoriesData, error: categoriesError } = await supabase
    .from('categories')
    .select('id, name');

  if (categoriesError) {
    console.error("Erreur lors de la récupération des catégories:", categoriesError);
    throw categoriesError;
  }

  const categoriesWithSubs = await Promise.all(
    categoriesData.map(async (category) => {
      const { data: subcategories, error: subError } = await supabase
        .from('subcategories')
        .select('id, name')
        .eq('category_id', category.id);

      if (subError) {
        console.error("Erreur lors de la récupération des sous-catégories:", subError);
        throw subError;
      }

      return {
        ...category,
        subcategories: subcategories || [],
      };
    })
  );

  return categoriesWithSubs;
}

export async function fetchExistingSubcategories(placeId: string): Promise<string[]> {
  const { data: existingSubcategories, error: existingError } = await supabase
    .from('place_subcategories')
    .select('subcategory_id')
    .eq('place_id', placeId);

  if (existingError) {
    console.error("Erreur lors de la récupération des sous-catégories existantes:", existingError);
    throw existingError;
  }

  return existingSubcategories?.map(item => item.subcategory_id) || [];
}

export async function getPlaceDetails(placeId: string) {
  const { data: placeData, error: placeError } = await supabase
    .from('places')
    .select('description, type')
    .eq('id', placeId)
    .maybeSingle();

  if (placeError) {
    console.error("Erreur lors de la récupération des données du lieu:", placeError);
    throw placeError;
  }

  return placeData;
}

export async function convertGooglePlaceId(googlePlaceId: string): Promise<string | null> {
  if (!googlePlaceId.startsWith('ChIJ')) {
    return googlePlaceId;
  }

  const { data: placeData, error: placeError } = await supabase
    .from('places')
    .select('id')
    .eq('place_id', googlePlaceId)
    .maybeSingle();

  if (placeError) {
    console.error('Erreur lors de la récupération du lieu:', placeError);
    throw placeError;
  }

  return placeData?.id || null;
}