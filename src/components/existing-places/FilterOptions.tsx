import { Checkbox } from "../ui/checkbox";

interface FilterOptionsProps {
  filters: {
    hasDescription: boolean;
    hasBingPhoto: boolean;
  };
  onFilterChange: (filterName: 'hasDescription' | 'hasBingPhoto') => void;
}

export function FilterOptions({ filters, onFilterChange }: FilterOptionsProps) {
  return (
    <div className="flex gap-4">
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="hasDescription"
          checked={filters.hasDescription}
          onCheckedChange={() => onFilterChange('hasDescription')}
        />
        <label
          htmlFor="hasDescription"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Avec description
        </label>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox 
          id="hasBingPhoto"
          checked={filters.hasBingPhoto}
          onCheckedChange={() => onFilterChange('hasBingPhoto')}
        />
        <label
          htmlFor="hasBingPhoto"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Avec photo Bing
        </label>
      </div>
    </div>
  );
}