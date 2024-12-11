import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

interface EnrichmentData {
  website?: string;
  phone?: string;
  type?: string;
  openingHours?: {
    [key: string]: string;
  };
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  snapchat?: string;
  twitter?: string;
  linkedin?: string;
  github?: string;
  youtube?: string;
  pinterest?: string;
  email_1?: string;
  email_2?: string;
}

export function useEnrichmentData(placeId: string | undefined, initialData: EnrichmentData) {
  console.log("useEnrichmentData - initialData received:", initialData);
  
  const [data, setData] = useState(() => {
    console.log("useEnrichmentData - initializing state with:", initialData);
    return {
      ...initialData,
      website: initialData.website || "",
      phone: initialData.phone || "",
      type: initialData.type || "",
    };
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleChange = (field: string, value: string) => {
    console.log("handleChange called with:", field, value);
    setData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFetchSocials = async () => {
    if (!data.website) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "L'URL du site web est requise pour cette opération",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data: apiKeyData, error: apiKeyError } = await supabase
        .from('apikeys')
        .select('apikey')
        .eq('provider', 'scrapetable')
        .single();

      if (apiKeyError || !apiKeyData?.apikey) {
        throw new Error("Impossible de récupérer la clé API");
      }

      const response = await fetch("https://api.scrapetable.com/website/email-socials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": apiKeyData.apikey,
        },
        body: JSON.stringify({
          websites: [data.website],
          flatten: true
        })
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des données");
      }

      const result = await response.json();
      console.log("Résultats de l'API Email Socials:", result);

      if (result && result.length > 0) {
        const socialData = result[0];
        setData(prev => ({
          ...prev,
          facebook: socialData.facebook || prev.facebook,
          instagram: socialData.instagram || prev.instagram,
          twitter: socialData.twitter || prev.twitter,
          linkedin: socialData.linkedin || prev.linkedin,
          youtube: socialData.youtube || prev.youtube,
          email_1: socialData.emails?.[0] || prev.email_1,
          email_2: socialData.emails?.[1] || prev.email_2,
        }));
      }

      toast({
        title: "Succès",
        description: "Les réseaux sociaux ont été récupérés avec succès",
      });

    } catch (error) {
      console.error("Erreur lors de la récupération des réseaux sociaux:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de récupérer les réseaux sociaux",
      });
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
      const { error } = await supabase
        .from("places")
        .update({
          website: data.website,
          phone: data.phone,
          type: data.type,
          opening_hours: data.openingHours,
          facebook: data.facebook,
          instagram: data.instagram,
          tiktok: data.tiktok,
          snapchat: data.snapchat,
          twitter: data.twitter,
          linkedin: data.linkedin,
          github: data.github,
          youtube: data.youtube,
          pinterest: data.pinterest,
          email_1: data.email_1,
          email_2: data.email_2,
        })
        .eq("id", placeId);

      if (error) throw error;

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