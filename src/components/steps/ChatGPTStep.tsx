import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { generateDescription } from "@/api/generate-description";
import { useDescription } from "@/hooks/useDescription";
import { DescriptionForm } from "../description/DescriptionForm";
import { toast } from "sonner";

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
  const [description, setDescription] = useState(initialDescription || "");
  const [isGenerating, setIsGenerating] = useState(false);
  const { handleSaveDescription, isLoading, error } = useDescription();

  console.log("ChatGPTStep - État initial:", {
    placeId,
    initialDescription,
    currentDescription: description,
    error
  });

  const handleGenerateDescription = async () => {
    setIsGenerating(true);
    
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

      console.log("Génération de la description - Prompt:", prompt);

      const generatedDescription = await generateDescription(prompt);
      
      if (!generatedDescription) {
        throw new Error("Aucune description n'a été générée");
      }

      console.log("Description générée:", generatedDescription);
      setDescription(generatedDescription);
      
      toast.success("Description générée avec succès");
    } catch (error) {
      console.error("Erreur lors de la génération:", error);
      toast.error("Une erreur est survenue lors de la génération de la description");
    } finally {
      setIsGenerating(false);
    }
  };

  const onSave = async () => {
    if (!placeId) {
      toast.error("ID du lieu manquant");
      return;
    }
    await handleSaveDescription(placeId, description);
  };

  return (
    <Card className="p-6 space-y-4">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Génération de la description</h2>
        
        <Button 
          onClick={handleGenerateDescription} 
          disabled={isGenerating}
          className="w-full bg-google-blue hover:bg-google-blue/90"
        >
          {isGenerating ? "Génération en cours..." : "Générer la description"}
        </Button>
        
        <DescriptionForm
          description={description}
          onDescriptionChange={setDescription}
          onSave={onSave}
          error={error}
          isLoading={isLoading}
        />
      </div>
    </Card>
  );
}