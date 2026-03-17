import { create } from 'zustand';

interface UIState {
  isCardModalOpen: boolean;
  activeCardId: string | null;
  openCardModal: (cardId: string) => void;
  closeCardModal: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isCardModalOpen: false,
  activeCardId: null,
  openCardModal: (cardId) => set({ isCardModalOpen: true, activeCardId: cardId }),
  closeCardModal: () => set({ isCardModalOpen: false, activeCardId: null }),
}));
