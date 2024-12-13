import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { EnrichmentData } from "@/types/enrichment";
import { fetchSocialMediaData } from "@/services/socialMediaService";
import { savePlaceData } from "@/services/placeService";

export function useEnrichmentData(placeId: string | undefined, initialData: EnrichmentData) {
  const [data, setData] = useState<EnrichmentData>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleChange = (field: string, value: string) => {
    setData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFetchSocials = async (): Promise<boolean> => {
    if (!data.website) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "L'URL du site web est requise pour cette opération",
      });
      return false;
    }

    setIsLoading(true);
    try {
      const result = await fetchSocialMediaData(data.website);

      if (result && result.length > 0) {
        const socialData = result[0];
        setData(prev => ({
          ...prev,
          facebook: socialData.facebook || "",
          instagram: socialData.instagram || "",
          twitter: socialData.twitter || "",
          linkedin: socialData.linkedin || "",
          youtube: socialData.youtube || "",
          email_1: socialData.emails?.[0] || "",
          email_2: socialData.emails?.[1] || "",
        }));

        toast({
          title: "Succès",
          description: "Les réseaux sociaux ont été récupérés avec succès",
        });

        return true;
      }

      toast({
        title: "Information",
        description: "Aucun réseau social trouvé pour ce site web",
      });
      return false;

    } catch (error) {
      console.error("Erreur lors de la récupération des réseaux sociaux:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de récupérer les réseaux sociaux",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!placeId) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de sauvegarder les données",
      });
      return;
    }

    try {
      await savePlaceData(placeId, data);
      toast({
        title: "Succès",
        description: "Les données ont été sauvegardées avec succès",
      });
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de sauvegarder les données",
      });
    }
  };

  return {
    data,
    isLoading,
    handleChange,
    handleFetchSocials,
    handleSave
  };
}