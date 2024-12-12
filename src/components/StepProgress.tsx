import { Check, Loader } from "lucide-react";

interface StepProgressProps {
  currentStep: number;
}

export function StepProgress({ currentStep }: StepProgressProps) {
  console.log("StepProgress rendering", { currentStep });
  
  const steps = [
    "Recherche Google Maps",
    "Description ChatGPT",
    "Enrichissement données",
    "Image Bing"
  ];

  return (
    <div className="w-full mb-8">
      <div className="flex justify-between">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center w-1/4">
            <div className={`
              w-10 h-10 rounded-full flex items-center justify-center mb-2
              ${index < currentStep ? 'bg-green-500 text-white' : 
                index === currentStep ? 'bg-blue-500 text-white' : 
                'bg-gray-200 text-gray-500'}
            `}>
              {index < currentStep ? (
                <Check className="w-6 h-6" />
              ) : index === currentStep ? (
                <Loader className="w-6 h-6 animate-spin" />
              ) : (
                <span>{index + 1}</span>
              )}
            </div>
            <span className={`text-sm text-center ${index === currentStep ? 'text-blue-500 font-medium' : 'text-gray-500'}`}>
              {step}
            </span>
          </div>
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