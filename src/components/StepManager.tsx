import { useState } from "react";
import { StepProgress } from "./StepProgress";
import { Button } from "./ui/button";
import { StepContent } from "./steps/StepContent";
import { PlaceSummary } from "./steps/PlaceSummary";
import { useStepManagerState } from "@/hooks/useStepManagerState";
import { useStepManagerActions } from "@/hooks/useStepManagerActions";

export function StepManager() {
  const { currentStep, selectedPlace, results, isLoading } = useStepManagerState();
  const { handleSearch, handlePlaceSelect, handleNextStep, handlePreviousStep, handleStepChange } = useStepManagerActions();

  console.log("StepManager rendering", { currentStep, selectedPlace, results, isLoading });

  const handlePlaceDelete = () => {
    handlePlaceSelect(null);
    handleStepChange(0);
  };

  return (
    <div className="container py-8 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">
          Traitement des fiches prestataires
        </h1>
        <p className="text-muted-foreground">
          Enrichissez vos fiches prestataires en 4 étapes simples
        </p>
      </div>

      <StepProgress 
        currentStep={currentStep} 
        onStepClick={handleStepChange}
        selectedPlace={selectedPlace}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <StepContent 
            currentStep={currentStep}
            selectedPlace={selectedPlace}
            results={results}
            isLoading={isLoading}
            onSearch={handleSearch}
            onSelect={handlePlaceSelect}
            onDelete={handlePlaceDelete}
          />
        </div>

        <div className="space-y-4">
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
              className="flex-1"
              disabled={!selectedPlace && currentStep === 0}
            >
              Étape suivante
            </Button>
          </div>
          
          <PlaceSummary 
            selectedPlace={selectedPlace} 
            onDelete={handlePlaceDelete}
          />
        </div>
      </div>
    </div>
  );
}