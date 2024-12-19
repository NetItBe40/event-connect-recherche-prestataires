import { Checkbox } from "../ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "../ui/badge";

interface Category {
  id: string;
  name: string;
  count?: number;
}

interface FilterOptionsProps {
  filters: {
    noDescription: boolean;
    noBingPhoto: boolean;
    noCategory: boolean;
    categoryId?: string;
  };
  onFilterChange: (filterName: 'noDescription' | 'noBingPhoto' | 'noCategory') => void;
  onCategoryChange: (categoryId: string) => void;
}

export function FilterOptions({ filters, onFilterChange, onCategoryChange }: FilterOptionsProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategoriesWithCount = async () => {
      setIsLoading(true);
      try {
        // Récupérer toutes les catégories
        const { data: categoriesData } = await supabase
          .from('categories')
          .select('*')
          .order('name');

        if (!categoriesData) return;

        // Pour chaque catégorie, compter le nombre de prestataires
        const categoriesWithCount = await Promise.all(
          categoriesData.map(async (category) => {
            // Récupérer les IDs des sous-catégories
            const { data: subcategoriesData } = await supabase
              .from('subcategories')
              .select('id')
              .eq('category_id', category.id);

            if (!subcategoriesData || subcategoriesData.length === 0) {
              return { ...category, count: 0 };
            }

            const subcategoryIds = subcategoriesData.map(sub => sub.id);

            // Récupérer les IDs des places pour ces sous-catégories
            const { data: placeSubcategoriesData } = await supabase
              .from('place_subcategories')
              .select('place_id')
              .in('subcategory_id', subcategoryIds);

            if (!placeSubcategoriesData || placeSubcategoriesData.length === 0) {
              return { ...category, count: 0 };
            }

            const placeIds = [...new Set(placeSubcategoriesData.map(p => p.place_id))];

            // Compter le nombre de places uniques
            const { count } = await supabase
              .from('places')
              .select('*', { count: 'exact', head: true })
              .in('id', placeIds);

            return {
              ...category,
              count: count || 0
            };
          })
        );

        // Compter le nombre total de prestataires
        const { count: totalCount } = await supabase
          .from('places')
          .select('*', { count: 'exact', head: true });

        setCategories([
          { id: 'all', name: 'Toutes les catégories', count: totalCount || 0 },
          ...categoriesWithCount
        ]);
      } catch (error) {
        console.error('Erreur lors de la récupération des catégories:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategoriesWithCount();
  }, []);

  return (
    <div className="flex gap-4 items-center flex-wrap">
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="noDescription"
          checked={filters.noDescription}
          onCheckedChange={() => onFilterChange('noDescription')}
        />
        <label
          htmlFor="noDescription"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Sans description
        </label>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox 
          id="noBingPhoto"
          checked={filters.noBingPhoto}
          onCheckedChange={() => onFilterChange('noBingPhoto')}
        />
        <label
          htmlFor="noBingPhoto"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Sans photo Bing
        </label>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox 
          id="noCategory"
          checked={filters.noCategory}
          onCheckedChange={() => onFilterChange('noCategory')}
        />
        <label
          htmlFor="noCategory"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Sans catégorie
        </label>
      </div>

      <Select
        value={filters.categoryId}
        onValueChange={onCategoryChange}
      >
        <SelectTrigger className="w-[300px]">
          <SelectValue placeholder="Filtrer par catégorie" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.id} className="flex items-center justify-between">
              <span>{category.name}</span>
              <Badge variant="secondary" className="ml-2">
                {category.count}
              </Badge>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}