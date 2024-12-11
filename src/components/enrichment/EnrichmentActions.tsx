import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface EnrichmentActionsProps {
  onFetchSocials: () => void;
  onSave: () => void;
  isLoading: boolean;
  hasWebsite: boolean;
  showSaveButton: boolean;
}

export function EnrichmentActions({ 
  onFetchSocials, 
  onSave, 
  isLoading, 
  hasWebsite,
  showSaveButton
}: EnrichmentActionsProps) {
  return (
    <div className="space-y-4">
      <Button 
        onClick={onFetchSocials}
        disabled={isLoading || !hasWebsite}
        variant="secondary"
        className="w-full"
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Récupérer les réseaux sociaux
      </Button>

      {showSaveButton && (
        <Button onClick={onSave} className="w-full">
          Sauvegarder les modifications
        </Button>
      )}
    </div>
  );
}