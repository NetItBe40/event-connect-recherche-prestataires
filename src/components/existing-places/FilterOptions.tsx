import { Checkbox } from "../ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Category {
  id: string;
  name: string;
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

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      if (data) {
        setCategories(data);
      }
    };
    fetchCategories();
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
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Filtrer par catégorie" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">Toutes les catégories</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}