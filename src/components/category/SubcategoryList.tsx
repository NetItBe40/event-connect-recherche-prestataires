import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

interface Subcategory {
  id: string;
  name: string;
  suggested?: boolean;
}

interface SubcategoryListProps {
  subcategories: Subcategory[];
  selectedSubcategories: string[];
  onToggle: (subcategoryId: string) => void;
}

export function SubcategoryList({ 
  subcategories, 
  selectedSubcategories, 
  onToggle 
}: SubcategoryListProps) {
  return (
    <div className="space-y-2 p-4">
      {subcategories.map((subcategory) => (
        <div key={subcategory.id} className="flex items-center space-x-2">
          <Checkbox
            id={subcategory.id}
            checked={selectedSubcategories.includes(subcategory.id)}
            onCheckedChange={() => onToggle(subcategory.id)}
          />
          <label
            htmlFor={subcategory.id}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {subcategory.name}
          </label>
          {subcategory.suggested && (
            <Badge variant="secondary" className="ml-2">
              Suggéré
            </Badge>
          )}
        </div>
      ))}
    </div>
  );
}