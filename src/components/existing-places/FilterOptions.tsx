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
    categoryId?: string;
  };
  onFilterChange: (filterName: 'noDescription' | 'noBingPhoto') => void;
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
            const { count } = await supabase
              .from('places')
              .select('*', { count: 'exact', head: true })
              .in('id', (sb) =>
                sb.from('place_subcategories')
                  .select('place_id')
                  .in('subcategory_id', (sb) =>
                    sb.from('subcategories')
                      .select('id')
                      .eq('category_id', category.id)
                  )
              );

            return {
              ...category,
              count: count || 0
            };
          })
        );

        // Compter le nombre total de prestataires pour "Toutes les catégories"
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
    <div className="flex gap-4 items-center">
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