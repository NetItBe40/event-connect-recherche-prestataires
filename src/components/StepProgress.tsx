import { Check, Loader } from "lucide-react";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

interface StepProgressProps {
  currentStep: number;
  onStepClick?: (step: number) => void;
  selectedPlace: any;
}

export function StepProgress({ currentStep, onStepClick, selectedPlace }: StepProgressProps) {
  console.log("StepProgress rendering", { currentStep });
  
  const steps = [
    "Recherche Google Maps",
    "Description ChatGPT",
    "Image Bing",
    "Catégories"
  ];

  const handleStepClick = (stepIndex: number) => {
    // Ne permet pas de cliquer sur une étape future
    if (stepIndex > currentStep) return;
    
    // Ne permet pas de naviguer après l'étape 0 si aucun lieu n'est sélectionné
    if (stepIndex > 0 && !selectedPlace) return;

    onStepClick?.(stepIndex);
  };

  return (
    <div className="w-full mb-8">
      <div className="flex justify-between">
        {steps.map((step, index) => (
          <TooltipProvider key={index}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex flex-col items-center p-0 hover:bg-transparent"
                  onClick={() => handleStepClick(index)}
                  disabled={index > currentStep || (index > 0 && !selectedPlace)}
                >
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-colors
                    ${index < currentStep ? 'bg-green-500 text-white cursor-pointer' : 
                      index === currentStep ? 'bg-blue-500 text-white' : 
                      'bg-gray-200 text-gray-500'}
                    ${index <= currentStep && selectedPlace ? 'hover:opacity-80' : ''}
                  `}>
                    {index < currentStep ? (
                      <Check className="w-6 h-6" />
                    ) : index === currentStep ? (
                      <Loader className="w-6 h-6 animate-spin" />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>
                  <span className={`text-sm text-center ${
                    index === currentStep ? 'text-blue-500 font-medium' : 'text-gray-500'
                  }`}>
                    {step}
                  </span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {index > currentStep ? 
                  "Cette étape n'est pas encore accessible" :
                  index === currentStep ?
                    "Étape actuelle" :
                    "Cliquez pour revenir à cette étape"
                }
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
      <div className="relative mt-2">
        <div className="absolute top-0 h-1 bg-gray-200 w-full"></div>
        <div 
          className="absolute top-0 h-1 bg-blue-500 transition-all duration-500" 
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        ></div>
      </div>
    </div>
  );
}