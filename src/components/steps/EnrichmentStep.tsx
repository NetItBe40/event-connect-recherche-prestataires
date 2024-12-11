import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { Loader2 } from "lucide-react";

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
  const [data, setData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleChange = (field: string, value: string) => {
    setData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      if (!placeId) return;

      const { error } = await supabase
        .from("places")
        .update(data)
        .eq("id", placeId);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Les informations ont été mises à jour",
      });
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de sauvegarder les modifications",
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
      const response = await fetch("https://api.scrapetable.com/website/email-socials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": process.env.SCRAPETABLE_API_KEY || "",
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

        <Button 
          onClick={handleSave}
          className="w-full bg-google-blue hover:bg-google-blue/90"
        >
          Sauvegarder les modifications
        </Button>
      </div>
    </Card>
  );
}