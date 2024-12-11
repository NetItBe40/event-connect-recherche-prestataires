import { ResultCard } from "./ResultCard";

interface Place {
  title: string;
  address: string;
  rating?: string;
  reviews?: string;
  type?: string;
  phone?: string;
  website?: string;
}

interface ResultsListProps {
  results: Place[];
  isLoading: boolean;
}

export function ResultsList({ results, isLoading }: ResultsListProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-40 bg-gray-100 rounded-lg animate-pulse-slow"
          />
        ))}
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Aucun résultat trouvé</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {results.map((place, index) => (
        <ResultCard key={index} place={place} />
      ))}
    </div>
  );
}