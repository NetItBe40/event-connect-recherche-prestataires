import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { generateDescription } from "@/api/generate-description";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface ChatGPTStepProps {
  placeId?: string;
  title: string;
  address: string;
  type?: string;
  rating?: string;
  phone?: string;
  description?: string;
}

export function ChatGPTStep({ placeId, title, address, type, rating, phone, description: initialDescription }: ChatGPTStepProps) {
  const [description, setDescription] = useState(initialDescription || "");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (initialDescription) {
      try {
        console.log("Description initiale reçue:", initialDescription);
        const parsedDescription = JSON.parse(initialDescription);
        console.log("Description parsée:", parsedDescription);
        if (Array.isArray(parsedDescription)) {
          // Filtrer les valeurs null et non-string, puis joindre avec des sauts de ligne
          const validDescriptions = parsedDescription
            .filter(desc => desc && typeof desc === 'string' && desc !== 't')
            .join('\n\n');
          console.log("Descriptions valides concaténées:", validDescriptions);
          setDescription(validDescriptions || "");
        } else {
          setDescription(initialDescription);
        }
      } catch (error) {
        console.log("Erreur lors du parsing de la description:", error);
        setDescription(initialDescription);
      }
    }
  }, [initialDescription]);

  const handleGenerateDescription = async () => {
    setIsLoading(true);
    setError(null);
    
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
        console.log("Tentative de sauvegarde de la description générée:", {
          placeId,
          description: descriptionArray,
          descriptionJson: JSON.stringify(descriptionArray)
        });
        
        const { data, error: updateError } = await supabase
          .from('places')
          .update({ 
            description: JSON.stringify(descriptionArray)
          })
          .eq('id', placeId)
          .select();

        console.log("Résultat de la sauvegarde de la description générée:", { data, error: updateError });

        if (updateError) {
          console.error("Erreur lors de la mise à jour:", updateError);
          throw updateError;
        }

        toast({
          title: "Description générée",
          description: "La description a été générée et sauvegardée avec succès",
        });
      }
    } catch (error) {
      console.error("Erreur:", error);
      setError("Une erreur est survenue lors de la génération de la description. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveDescription = async () => {
    if (!placeId) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de sauvegarder la description",
      });
      return;
    }

    try {
      console.log("Description actuelle avant la sauvegarde:", description);
      // Séparer la description en paragraphes et créer un tableau
      const descriptionArray = description.split('\n\n').filter(Boolean);
      console.log("Tentative de sauvegarde manuelle de la description:", {
        placeId,
        description: descriptionArray,
        descriptionJson: JSON.stringify(descriptionArray),
        currentState: {
          description,
          type: typeof description,
          isArray: Array.isArray(description),
          paragraphs: descriptionArray
        }
      });
      
      const { data, error } = await supabase
        .from('places')
        .update({ 
          description: JSON.stringify(descriptionArray)
        })
        .eq('id', placeId)
        .select();

      console.log("Résultat de la sauvegarde manuelle:", { data, error });

      if (error) throw error;

      toast({
        title: "Succès",
        description: "La description a été sauvegardée",
      });
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de sauvegarder la description",
      });
    }
  };

  return (
    <Card className="p-6 space-y-4">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Génération de la description</h2>
        
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

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

        <Button 
          onClick={handleSaveDescription}
          disabled={!description}
          variant="outline"
          className="w-full"
        >
          Sauvegarder les modifications
        </Button>
      </div>
    </Card>
  );
}