import { create } from 'zustand';
import { Fiche } from '../types';

interface FicheStore {
  fiches: Fiche[];
  selectedFicheId: string | null;
  setSelectedFicheId: (id: string | null) => void;
  addFiche: (fiche: Fiche) => void;
  updateFiche: (id: string, updates: Partial<Fiche>) => void;
  removeFiche: (id: string) => void;
}

export const useFicheStore = create<FicheStore>((set) => ({
  fiches: [],
  selectedFicheId: null,
  setSelectedFicheId: (id) => set({ selectedFicheId: id }),
  addFiche: (fiche) => set((state) => ({
    fiches: [...state.fiches, fiche]
  })),
  updateFiche: (id, updates) => set((state) => ({
    fiches: state.fiches.map(fiche => 
      fiche.id === id ? { ...fiche, ...updates } : fiche
    )
  })),
  removeFiche: (id) => set((state) => ({
    fiches: state.fiches.filter(fiche => fiche.id !== id)
  }))
}));
