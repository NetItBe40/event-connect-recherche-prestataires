import { useState } from "react";
import { Card } from "@/components/ui/card";
import { EnrichmentActions } from "./EnrichmentActions";
import { useEnrichmentData } from "@/hooks/useEnrichmentData";
import { EnrichmentDebugDialog } from "./EnrichmentDebugDialog";
import { EnrichmentForms } from "./EnrichmentForms";
import { toast } from "@/components/ui/use-toast";

interface EnrichmentStepProps {
  placeId?: string;
  initialData: {
    website?: string;
    phone?: string;
    type?: string;
    openingHours?: {
      [key: string]: string;
    };
  };
}

export function EnrichmentStep({ placeId, initialData }: EnrichmentStepProps) {
  const [showFullForm, setShowFullForm] = useState(false);
  const [debugOpen, setDebugOpen] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>({});
  
  const {
    data,
    isLoading,
    handleChange,
    handleFetchSocials,
    handleSave
  } = useEnrichmentData(placeId, initialData);

  const onFetchSocials = async () => {
    try {
      const debugData = {
        website: data.website,
      };
      
      if (!data.website) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "L'URL du site web est requise"
        });
        return false;
      }

      console.log("Démarrage de la recherche des réseaux sociaux pour:", data.website);
      const response = await handleFetchSocials();
      
      setDebugInfo({
        ...debugData,
        apiResponse: response
      });
      
      setDebugOpen(true);
      console.log("Réponse de l'API:", response);
      
      if (response && typeof response === 'object') {
        setShowFullForm(true);
        toast({
          title: "Succès",
          description: "Les réseaux sociaux ont été récupérés"
        });
        return true;
      }

      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Aucun réseau social trouvé"
      });
      return false;
    } catch (error) {
      console.error("Erreur lors de la recherche:", error);
      setDebugInfo({
        website: data.website,
        error: error
      });
      setDebugOpen(true);
      
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de récupérer les réseaux sociaux"
      });
      return false;
    }
  };

  return (
    <Card className="p-6 space-y-6">
      <h2 className="text-xl font-semibold">Enrichissement des données</h2>

      <div className="space-y-4">
        <EnrichmentForms
          data={data}
          onChange={handleChange}
          isLoading={isLoading}
          showFullForm={showFullForm}
        />

        <EnrichmentActions
          onFetchSocials={onFetchSocials}
          onSave={handleSave}
          isLoading={isLoading}
          hasWebsite={!!data.website}
          showSaveButton={showFullForm}
        />
      </div>

      <EnrichmentDebugDialog
        open={debugOpen}
        onOpenChange={setDebugOpen}
        debugInfo={debugInfo}
      />
    </Card>
  );
}