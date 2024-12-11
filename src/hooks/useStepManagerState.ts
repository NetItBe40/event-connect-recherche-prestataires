import { create } from 'zustand';

interface Place {
  id?: string;
  title: string;
  address: string;
  rating?: string;
  reviews?: string;
  type?: string;
  phone?: string;
  website?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  placeId?: string;
  placeLink?: string;
  priceLevel?: string;
  openingHours?: {
    [key: string]: string;
  };
  city?: string;
  verified?: boolean;
  photos?: string;
  state?: string;
  description?: string;
}

interface StepManagerState {
  currentStep: number;
  selectedPlace: Place | null;
  results: Place[];
  isLoading: boolean;
  setCurrentStep: (step: number | ((prev: number) => number)) => void;
  setSelectedPlace: (place: Place | null) => void;
  setResults: (results: Place[]) => void;
  setIsLoading: (isLoading: boolean) => void;
}

export const useStepManagerState = create<StepManagerState>((set) => ({
  currentStep: 0,
  selectedPlace: null,
  results: [],
  isLoading: false,
  setCurrentStep: (step) => set((state) => ({ 
    currentStep: typeof step === 'function' ? step(state.currentStep) : step 
  })),
  setSelectedPlace: (place) => set({ selectedPlace: place }),
  setResults: (results) => set({ results }),
  setIsLoading: (isLoading) => set({ isLoading }),
}));