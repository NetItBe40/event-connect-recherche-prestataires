import { useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

export function useStepManagerActions() {
  const { toast } = useToast();

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
    // Handle place selection logic here
    console.log('Selected place:', place);
  }, []);

  const handleNextStep = useCallback(() => {
    // Handle next step logic here
    console.log('Moving to next step');
  }, []);

  const handlePreviousStep = useCallback(() => {
    // Handle previous step logic here
    console.log('Moving to previous step');
  }, []);

  return {
    handleSearch,
    handlePlaceSelect,
    handleNextStep,
    handlePreviousStep,
  };
}