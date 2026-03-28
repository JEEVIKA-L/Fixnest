import { create } from 'zustand';

interface UIState {
 isCardModalOpen: boolean;
 activeCardId: string | null;
 isCreateBoardModalOpen: boolean;
 openCardModal: (cardId: string) => void;
 closeCardModal: () => void;
 setCreateBoardModalOpen: (isOpen: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
 isCardModalOpen: false,
 activeCardId: null,
 isCreateBoardModalOpen: false,
 openCardModal: (cardId) => set({ isCardModalOpen: true, activeCardId: cardId }),
 closeCardModal: () => set({ isCardModalOpen: false, activeCardId: null }),
 setCreateBoardModalOpen: (isOpen) => set({ isCreateBoardModalOpen: isOpen }),
}));
