import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Category {
  name: string;
  subcategories: string[];
}

interface PlaceSummaryCategoriesProps {
  placeId: string;
}

export function PlaceSummaryCategories({ placeId }: PlaceSummaryCategoriesProps) {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    async function fetchCategories() {
      const { data: placeSubcategories, error: placeSubError } = await supabase
        .from('place_subcategories')
        .select(`
          subcategory_id,
          subcategories (
            id,
            name,
            category_id,
            categories (
              id,
              name
            )
          )
        `)
        .eq('place_id', placeId);

      if (placeSubError) {
        console.error('Erreur lors de la récupération des catégories:', placeSubError);
        return;
      }

      // Organiser les données par catégorie
      const categoriesMap = new Map<string, Category>();
      
      placeSubcategories?.forEach(item => {
        const subcategory = item.subcategories;
        const category = subcategory.categories;
        
        if (!categoriesMap.has(category.id)) {
          categoriesMap.set(category.id, {
            name: category.name,
            subcategories: []
          });
        }
        
        categoriesMap.get(category.id)?.subcategories.push(subcategory.name);
      });

      setCategories(Array.from(categoriesMap.values()));
    }

    if (placeId) {
      fetchCategories();
    }
  }, [placeId]);

  if (categories.length === 0) return null;

  return (
    <div>
      <strong>Catégories :</strong>
      <div className="mt-1 space-y-2">
        {categories.map((category, index) => (
          <div key={index}>
            <p className="font-medium">{category.name} :</p>
            <ul className="list-disc list-inside pl-4">
              {category.subcategories.map((subcat, subIndex) => (
                <li key={subIndex} className="text-sm text-gray-600">
                  {subcat}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}