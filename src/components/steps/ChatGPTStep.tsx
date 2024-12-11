import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { generateDescription } from "@/api/generate-description";

interface ChatGPTStepProps {
  placeId?: string;
  title: string;
  address: string;
  type?: string;
  rating?: string;
  phone?: string;
}

export function ChatGPTStep({ placeId, title, address, type, rating, phone }: ChatGPTStepProps) {
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerateDescription = async () => {
    if (!import.meta.env.VITE_OPENAI_API_KEY) {
      toast({
        variant: "destructive",
        title: "Configuration requise",
        description: "Veuillez configurer votre clé API OpenAI",
      });
      return;
    }

    setIsLoading(true);
    try {
      const prompt = `Rédige une description complète et professionnelle pour un répertoire en ligne de prestataires spécialisés dans l'organisation d'événements. Inclut les informations suivantes :
- Nom : ${title}
- Adresse : ${address}
- Téléphone : ${phone || "Non renseigné"}
- Services : ${type || "Non renseigné"}
- Note : ${rating || "Non renseignée"}

Si nécessaire, recherche sur Internet pour compléter les informations et enrichir la description. Rédige dans un style engageant et optimisé pour le SEO. Inclut les sections suivantes :
1. Type de services proposés
2. Valeur ajoutée
3. Zone d'intervention
4. Public cible
5. Expérience et réputation
6. Informations pratiques`;

      const generatedDescription = await generateDescription(prompt);
      setDescription(generatedDescription);

      if (placeId) {
        await supabase
          .from("places")
          .update({ description: generatedDescription })
          .eq("id", placeId);
      }

      toast({
        title: "Description générée",
        description: "La description a été générée et sauvegardée avec succès",
      });
    } catch (error) {
      console.error("Erreur:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de générer la description",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6 space-y-4">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Génération de la description</h2>
        <Button 
          onClick={handleGenerateDescription} 
          disabled={isLoading}
          className="w-full bg-google-blue hover:bg-google-blue/90"
        >
          {isLoading ? "Génération en cours..." : "Générer la description"}
        </Button>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="La description générée apparaîtra ici..."
          className="h-64"
        />
      </div>
    </Card>
  );
}