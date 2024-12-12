import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { generateDescription } from "@/api/generate-description";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { useDescription } from "@/hooks/useDescription";
import { DescriptionForm } from "../description/DescriptionForm";

interface ChatGPTStepProps {
  placeId?: string;
  title: string;
  address: string;
  type?: string;
  rating?: string;
  phone?: string;
  description?: string;
}

export function ChatGPTStep({ 
  placeId, 
  title, 
  address, 
  type, 
  rating, 
  phone, 
  description: initialDescription 
}: ChatGPTStepProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const {
    description,
    setDescription,
    error,
    handleSaveDescription,
    DebugDialog
  } = useDescription(placeId, initialDescription);

  const handleGenerateDescription = async () => {
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
      
      if (!generatedDescription) {
        throw new Error("Aucune description n'a été générée");
      }

      setDescription(generatedDescription);

      if (placeId) {
        const descriptionArray = [generatedDescription];
        
        const { error: updateError } = await supabase
          .from('places')
          .update({ 
            description: JSON.stringify(descriptionArray)
          })
          .eq('id', placeId);

        if (updateError) {
          throw updateError;
        }

        toast({
          title: "Description générée",
          description: "La description a été générée et sauvegardée avec succès",
        });
      }
    } catch (error) {
      console.error("Erreur:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la génération de la description. Veuillez réessayer.",
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
        
        <DescriptionForm
          description={description}
          onDescriptionChange={setDescription}
          onSave={handleSaveDescription}
          error={error}
          isLoading={isLoading}
          DebugDialog={DebugDialog}
        />
      </div>
    </Card>
  );
}