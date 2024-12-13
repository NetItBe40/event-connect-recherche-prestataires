import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { EnrichmentData } from "@/types/enrichment";
import { fetchSocialMediaData } from "@/services/socialMediaService";
import { savePlaceData } from "@/services/placeService";

export function useEnrichmentData(placeId: string | undefined, initialData: EnrichmentData) {
  console.log("🔄 useEnrichmentData hook initialized with:", { placeId, initialData });
  
  const [data, setData] = useState<EnrichmentData>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleChange = (field: string, value: string) => {
    console.log("📝 Field update:", { field, value });
    setData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFetchSocials = async (): Promise<boolean> => {
    console.log("🚀 Starting social media fetch with website:", data.website);
    
    if (!data.website) {
      console.warn("⚠️ No website URL provided");
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
      console.log("📥 Received social media data:", result);

      if (result && result.length > 0) {
        const socialData = result[0];
        console.log("✅ Processing social data:", socialData);
        
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

      console.log("ℹ️ No social media data found");
      toast({
        title: "Information",
        description: "Aucun réseau social trouvé pour ce site web",
      });
      return false;

    } catch (error) {
      console.error("❌ Error fetching social media:", error);
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
      console.error("❌ No placeId provided for save operation");
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de sauvegarder les données",
      });
      return;
    }

    console.log("💾 Saving place data:", { placeId, data });
    try {
      await savePlaceData(placeId, data);
      console.log("✅ Data saved successfully");
      toast({
        title: "Succès",
        description: "Les données ont été sauvegardées avec succès",
      });
    } catch (error) {
      console.error("❌ Error saving data:", error);
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