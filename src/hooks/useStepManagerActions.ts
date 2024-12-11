import { useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useStepManagerState } from "./useStepManagerState";

export function useStepManagerActions() {
  const { toast } = useToast();
  const { setSelectedPlace, setCurrentStep } = useStepManagerState();

  const handleSearch = useCallback(async (params: { query: string }) => {
    try {
      const { data, error } = await supabase
        .from('places')
        .select('*')
        .ilike('title', `%${params.query}%`);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error searching places:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la recherche",
        variant: "destructive",
      });
      return [];
    }
  }, [toast]);

  const handlePlaceSelect = useCallback((place: any) => {
    setSelectedPlace(place);
    toast({
      title: "Succès",
      description: "Le prestataire a été sélectionné",
    });
  }, [setSelectedPlace, toast]);

  const handleNextStep = useCallback(() => {
    setCurrentStep(prev => Math.min(prev + 1, 3));
  }, [setCurrentStep]);

  const handlePreviousStep = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  }, [setCurrentStep]);

  return {
    handleSearch,
    handlePlaceSelect,
    handleNextStep,
    handlePreviousStep,
  };
}