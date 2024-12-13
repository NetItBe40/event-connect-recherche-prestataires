import { useState } from "react";
import { Card } from "@/components/ui/card";
import { EnrichmentActions } from "./EnrichmentActions";
import { useEnrichmentData } from "@/hooks/useEnrichmentData";
import { EnrichmentDebugDialog } from "./EnrichmentDebugDialog";
import { EnrichmentForms } from "./EnrichmentForms";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

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
  const [apiResults, setApiResults] = useState<any>(null);
  
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
      
      setApiResults(response);
      setDebugInfo({
        ...debugData,
        apiResponse: response
      });
      
      setDebugOpen(true);
      console.log("Réponse de l'API:", response);
      
      if (response && Array.isArray(response) && response.length > 0) {
        const socialData = response[0];
        setShowFullForm(true);
        toast({
          title: "Succès",
          description: "Les réseaux sociaux ont été récupérés"
        });
        return true;
      }

      toast({
        variant: "destructive",
        title: "Information",
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

  const handleValidateResults = async () => {
    if (!apiResults || !Array.isArray(apiResults) || apiResults.length === 0) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Aucun résultat à valider"
      });
      return;
    }

    const socialData = apiResults[0];
    
    // Mise à jour des données avec les résultats de l'API
    Object.entries(socialData).forEach(([key, value]) => {
      if (value && typeof value === 'string') {
        handleChange(key, value);
      }
    });

    // Si des emails sont présents, les ajouter
    if (socialData.emails && Array.isArray(socialData.emails)) {
      if (socialData.emails[0]) handleChange('email_1', socialData.emails[0]);
      if (socialData.emails[1]) handleChange('email_2', socialData.emails[1]);
    }

    toast({
      title: "Succès",
      description: "Les données ont été mises à jour"
    });
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

        <div className="space-y-4">
          <EnrichmentActions
            onFetchSocials={onFetchSocials}
            onSave={handleSave}
            isLoading={isLoading}
            hasWebsite={!!data.website}
            showSaveButton={showFullForm}
          />

          {apiResults && (
            <Button 
              onClick={handleValidateResults}
              className="w-full"
              variant="secondary"
            >
              Valider les résultats
            </Button>
          )}
        </div>
      </div>

      <EnrichmentDebugDialog
        open={debugOpen}
        onOpenChange={setDebugOpen}
        debugInfo={debugInfo}
      />
    </Card>
  );
}