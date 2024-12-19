import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { SubcategoryList } from "../category/SubcategoryList";
import { useCategorySuggestions } from "@/hooks/useCategorySuggestions";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface CategoryStepProps {
  placeId: string;
}

export function CategoryStep({ placeId }: CategoryStepProps) {
  const { categories, selectedSubcategories, setSelectedSubcategories, isLoading } = useCategorySuggestions(placeId);
  const { toast } = useToast();

  const handleSubcategoryToggle = (subcategoryId: string) => {
    console.log("Toggle sous-catégorie:", subcategoryId);
    setSelectedSubcategories(prev => {
      if (prev.includes(subcategoryId)) {
        return prev.filter(id => id !== subcategoryId);
      } else {
        return [...prev, subcategoryId];
      }
    });
  };

  const handleSave = async () => {
    try {
      console.log("Début de la sauvegarde des catégories");
      
      // First, get the Supabase UUID if this is a Google Place ID
      let finalPlaceId = placeId;
      if (placeId.startsWith('ChIJ')) {
        const { data: placeData, error: placeError } = await supabase
          .from('places')
          .select('id')
          .eq('place_id', placeId)
          .maybeSingle();

        if (placeError) throw placeError;
        if (!placeData) {
          toast({
            variant: "destructive",
            title: "Erreur",
            description: "Place non trouvée",
          });
          return;
        }
        
        finalPlaceId = placeData.id;
      }

      console.log("Suppression des anciennes sous-catégories");
      const { error: deleteError } = await supabase
        .from('place_subcategories')
        .delete()
        .eq('place_id', finalPlaceId);

      if (deleteError) throw deleteError;

      if (selectedSubcategories.length > 0) {
        console.log("Insertion des nouvelles sous-catégories:", selectedSubcategories);
        const { error: insertError } = await supabase
          .from('place_subcategories')
          .insert(
            selectedSubcategories.map(subcategoryId => ({
              place_id: finalPlaceId,
              subcategory_id: subcategoryId,
            }))
          );

        if (insertError) throw insertError;
      }

      toast({
        title: "Succès",
        description: "Les catégories ont été sauvegardées",
      });
    } catch (error: any) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de sauvegarder les catégories",
      });
    }
  };

  if (isLoading) {
    return <div>Chargement des catégories...</div>;
  }

  if (categories.length === 0) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Aucune catégorie n'a été trouvée. Veuillez contacter l'administrateur.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Sélectionnez les catégories</h2>
        <Badge variant="secondary" className="text-sm">
          {selectedSubcategories.length} sous-catégorie{selectedSubcategories.length > 1 ? 's' : ''} sélectionnée{selectedSubcategories.length > 1 ? 's' : ''}
        </Badge>
      </div>
      
      <Accordion type="single" collapsible className="w-full">
        {categories.map((category) => (
          <AccordionItem key={category.id} value={category.id}>
            <AccordionTrigger className="text-left">
              {category.name}
            </AccordionTrigger>
            <AccordionContent>
              <SubcategoryList
                subcategories={category.subcategories}
                selectedSubcategories={selectedSubcategories}
                onToggle={handleSubcategoryToggle}
              />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <Button 
        onClick={handleSave} 
        className="w-full"
        disabled={selectedSubcategories.length === 0}
      >
        Sauvegarder les catégories
      </Button>
    </div>
  );
}