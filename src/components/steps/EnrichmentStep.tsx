import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface EnrichmentStepProps {
  placeId?: string;
  initialData: {
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
  };
}

export function EnrichmentStep({ placeId, initialData }: EnrichmentStepProps) {
  const [data, setData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleChange = (field: string, value: string) => {
    setData((prev) => ({
      ...prev,
      [field]: value,
    }));
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
      // Récupérer la clé API depuis Supabase
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

      // Mise à jour des données avec les résultats
      if (result && result.length > 0) {
        const socialData = result[0];
        setData(prev => ({
          ...prev,
          facebook: socialData.facebook || prev.facebook,
          instagram: socialData.instagram || prev.instagram,
          twitter: socialData.twitter || prev.twitter,
          linkedin: socialData.linkedin || prev.linkedin,
          youtube: socialData.youtube || prev.youtube,
          // ... autres réseaux sociaux si disponibles
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

  return (
    <Card className="p-6 space-y-6">
      <h2 className="text-xl font-semibold">Enrichissement des données</h2>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="website">Site web</Label>
          <div className="flex gap-2">
            <Input
              id="website"
              value={data.website || ""}
              onChange={(e) => handleChange("website", e.target.value)}
              placeholder="https://..."
              className="flex-1"
            />
            <Button 
              onClick={handleFetchSocials}
              disabled={isLoading || !data.website}
              variant="secondary"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Récupérer les réseaux sociaux
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Téléphone</Label>
          <Input
            id="phone"
            value={data.phone || ""}
            onChange={(e) => handleChange("phone", e.target.value)}
            placeholder="+33..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Type d'établissement</Label>
          <Input
            id="type"
            value={data.type || ""}
            onChange={(e) => handleChange("type", e.target.value)}
            placeholder="Restaurant, Hôtel..."
          />
        </div>

        <Separator className="my-4" />

        <h3 className="text-lg font-semibold">Réseaux sociaux</h3>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="facebook">Facebook</Label>
            <Input
              id="facebook"
              value={data.facebook || ""}
              onChange={(e) => handleChange("facebook", e.target.value)}
              placeholder="URL Facebook"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="instagram">Instagram</Label>
            <Input
              id="instagram"
              value={data.instagram || ""}
              onChange={(e) => handleChange("instagram", e.target.value)}
              placeholder="URL Instagram"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tiktok">TikTok</Label>
            <Input
              id="tiktok"
              value={data.tiktok || ""}
              onChange={(e) => handleChange("tiktok", e.target.value)}
              placeholder="URL TikTok"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="snapchat">Snapchat</Label>
            <Input
              id="snapchat"
              value={data.snapchat || ""}
              onChange={(e) => handleChange("snapchat", e.target.value)}
              placeholder="URL Snapchat"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="twitter">Twitter</Label>
            <Input
              id="twitter"
              value={data.twitter || ""}
              onChange={(e) => handleChange("twitter", e.target.value)}
              placeholder="URL Twitter"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="linkedin">LinkedIn</Label>
            <Input
              id="linkedin"
              value={data.linkedin || ""}
              onChange={(e) => handleChange("linkedin", e.target.value)}
              placeholder="URL LinkedIn"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="youtube">YouTube</Label>
            <Input
              id="youtube"
              value={data.youtube || ""}
              onChange={(e) => handleChange("youtube", e.target.value)}
              placeholder="URL YouTube"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pinterest">Pinterest</Label>
            <Input
              id="pinterest"
              value={data.pinterest || ""}
              onChange={(e) => handleChange("pinterest", e.target.value)}
              placeholder="URL Pinterest"
            />
          </div>
        </div>

        <Separator className="my-4" />

        <h3 className="text-lg font-semibold">Emails</h3>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email_1">Email principal</Label>
            <Input
              id="email_1"
              value={data.email_1 || ""}
              onChange={(e) => handleChange("email_1", e.target.value)}
              placeholder="email@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email_2">Email secondaire</Label>
            <Input
              id="email_2"
              value={data.email_2 || ""}
              onChange={(e) => handleChange("email_2", e.target.value)}
              placeholder="email@example.com"
            />
          </div>
        </div>

        <Button onClick={handleSave} className="w-full">
          Sauvegarder les modifications
        </Button>
      </div>
    </Card>
  );
}