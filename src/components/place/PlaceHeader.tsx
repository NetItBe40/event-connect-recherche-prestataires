import { CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Info } from "lucide-react";

interface PlaceHeaderProps {
  title: string;
  verified?: boolean;
  id?: string;
  onSelect: () => void;
}

export function PlaceHeader({ title, verified, id, onSelect }: PlaceHeaderProps) {
  return (
    <CardHeader>
      <div className="flex justify-between items-start">
        <CardTitle className="text-xl font-bold text-google-blue">
          {title}
        </CardTitle>
        <Button 
          onClick={onSelect}
          className="bg-google-blue hover:bg-google-blue/90"
        >
          Sélectionner
        </Button>
      </div>
      {verified && (
        <div className="flex items-center gap-2 text-sm text-green-500">
          <CheckCircle className="h-4 w-4" />
          <span>Vérifié</span>
        </div>
      )}
      {id && (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Info className="h-4 w-4" />
          <span>Identifiant : {id}</span>
        </div>
      )}
    </CardHeader>
  );
}