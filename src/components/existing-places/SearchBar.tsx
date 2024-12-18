import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Search } from "lucide-react";

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSearch: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export function SearchBar({ searchQuery, onSearchChange, onSearch, isLoading }: SearchBarProps) {
  return (
    <form onSubmit={onSearch} className="flex gap-2">
      <Input
        type="text"
        placeholder="Rechercher un prestataire existant..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <Button type="submit" disabled={isLoading}>
        <Search className="h-4 w-4 mr-2" />
        Rechercher
      </Button>
    </form>
  );
}