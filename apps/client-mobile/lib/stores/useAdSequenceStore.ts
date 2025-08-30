import { create } from 'zustand';

interface AdSequenceState {
  currentStep: number;
  totalTickets: number;
  totalSteps: number;
  isSequenceCompleted: boolean;
  watchAd: () => void; // La acción principal
  resetSequence: () => void;
}

export const useAdSequenceStore = create<AdSequenceState>((set, get) => ({
  currentStep: 0,
  totalTickets: 0,
  totalSteps: 5, // La configuración vive aquí
  isSequenceCompleted: false,
  
  watchAd: () => {
    const { currentStep, totalSteps, totalTickets } = get();
    if (currentStep >= totalSteps) return; // No hacer nada si ya está completo

    const nextStep = currentStep + 1;
    const ticketsEarned = (nextStep === totalSteps) ? 100 : 20; // Lógica de recompensa
    
    set({
      currentStep: nextStep,
      totalTickets: totalTickets + ticketsEarned,
      isSequenceCompleted: nextStep === totalSteps,
    });
  },
  
  resetSequence: () => set({ currentStep: 0, isSequenceCompleted: false }),
}));
