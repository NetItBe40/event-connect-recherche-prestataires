import { useState } from "react";
import { StepProgress } from "./StepProgress";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";
import { StepContent } from "./steps/StepContent";
import { PlaceSummary } from "./steps/PlaceSummary";
import { supabase } from "@/lib/supabase";
import { useStepManagerState } from "@/hooks/useStepManagerState";
import { useStepManagerActions } from "@/hooks/useStepManagerActions";

export function StepManager() {
  const { currentStep, selectedPlace, results, isLoading } = useStepManagerState();
  const { handleSearch, handlePlaceSelect, handleNextStep, handlePreviousStep } = useStepManagerActions();

  return (
    <div className="container py-8 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-google-blue">
          Traitement des fiches prestataires
        </h1>
        <p className="text-gray-600">
          Enrichissez vos fiches prestataires en 4 étapes simples
        </p>
      </div>

      <StepProgress currentStep={currentStep} />

      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2">
          <StepContent 
            currentStep={currentStep}
            selectedPlace={selectedPlace}
            results={results}
            isLoading={isLoading}
            onSearch={handleSearch}
            onSelect={handlePlaceSelect}
          />
        </div>

        <div className="col-span-1 space-y-4">
          <PlaceSummary selectedPlace={selectedPlace} />

          <div className="flex gap-4">
            {currentStep > 0 && (
              <Button
                onClick={handlePreviousStep}
                variant="outline"
                className="flex-1"
              >
                Étape précédente
              </Button>
            )}
            <Button
              onClick={handleNextStep}
              className="flex-1 bg-google-blue hover:bg-google-blue/90"
              disabled={!selectedPlace && currentStep === 0}
            >
              Étape suivante
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}