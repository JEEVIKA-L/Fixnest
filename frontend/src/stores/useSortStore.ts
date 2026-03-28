import { create } from 'zustand';

export type SortField = 'title' | 'createdAt' | 'manual';
export type SortOrder = 'asc' | 'desc';

interface SortState {
 field: SortField;
 order: SortOrder;
 setSort: (field: SortField, order: SortOrder) => void;
 resetSort: () => void;
 isSorted: () => boolean;
}

export const useSortStore = create<SortState>((set, get) => ({
 field: 'manual',
 order: 'asc',
 
 setSort: (field, order) => set({ field, order }),
 
 resetSort: () => set({ field: 'manual', order: 'asc' }),
 
 isSorted: () => get().field !== 'manual'
}));
