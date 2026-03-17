import { create } from 'zustand';

interface FilterState {
  searchText: string;
  selectedMemberIds: string[];
  selectedLabelIds: string[];
  setSearchText: (text: string) => void;
  toggleMember: (memberId: string) => void;
  toggleLabel: (labelId: string) => void;
  clearFilters: () => void;
  isActive: () => boolean;
}

export const useFilterStore = create<FilterState>((set, get) => ({
  searchText: '',
  selectedMemberIds: [],
  selectedLabelIds: [],
  
  setSearchText: (text) => set({ searchText: text }),
  
  toggleMember: (memberId) => set((state) => {
    const isSelected = state.selectedMemberIds.includes(memberId);
    return {
      selectedMemberIds: isSelected 
        ? state.selectedMemberIds.filter(id => id !== memberId)
        : [...state.selectedMemberIds, memberId]
    };
  }),
  
  toggleLabel: (labelId) => set((state) => {
    const isSelected = state.selectedLabelIds.includes(labelId);
    return {
      selectedLabelIds: isSelected 
        ? state.selectedLabelIds.filter(id => id !== labelId)
        : [...state.selectedLabelIds, labelId]
    };
  }),
  
  clearFilters: () => set({ searchText: '', selectedMemberIds: [], selectedLabelIds: [] }),
  
  isActive: () => {
    const { searchText, selectedMemberIds, selectedLabelIds } = get();
    return searchText.length > 0 || selectedMemberIds.length > 0 || selectedLabelIds.length > 0;
  }
}));
