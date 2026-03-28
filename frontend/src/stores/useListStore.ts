import { create } from 'zustand';
import { List } from '../types';
import { listService } from '../services/listService';

interface ListState {
 lists: List[];
 isLoading: boolean;
 error: string | null;
 fetchLists: (boardId: string) => Promise<void>;
 createList: (listData: Partial<List>) => Promise<void>;
 updateList: (id: string, updates: Partial<List>) => Promise<void>;
 moveList: (id: string, newOrder: number) => Promise<void>;
 reorderLists: (activeId: string, overId: string) => Promise<void>;
 deleteList: (id: string) => Promise<void>;
 archiveList: (id: string) => Promise<void>;
 restoreList: (id: string) => Promise<void>;
}

export const useListStore = create<ListState>((set) => ({
 lists: [],
 isLoading: false,
 error: null,

 fetchLists: async (boardId: string) => {
 set({ isLoading: true, error: null });
 try {
 const lists = await listService.getListsByBoardId(boardId);
 set({ lists, isLoading: false });
 } catch (error: any) {
 set({ error: error.message, isLoading: false });
 }
 },

 createList: async (listData) => {
 try {
 const newList = await listService.createList(listData);
 set((state) => ({ lists: [...state.lists, newList].sort((a, b) => a.order - b.order) }));
 } catch (error: any) {
 set({ error: error.message });
 }
 },

 updateList: async (id, updates) => {
 try {
 const updatedList = await listService.updateList(id, updates);
 set((state) => ({
 lists: state.lists.map(l => l.id === id ? updatedList : l)
 }));
 } catch (error: any) {
 set({ error: error.message });
 }
 },

 moveList: async (id, newOrder) => {
 // Optimistic update
 set((state) => ({
 lists: state.lists.map(l => l.id === id ? { ...l, order: newOrder } : l).sort((a, b) => a.order - b.order)
 }));
 try {
 await listService.updateListOrder(id, newOrder);
 } catch (error: any) {
 set({ error: error.message });
 // Revert or re-fetch on error
 }
 },

 reorderLists: async (activeId, overId) => {
 set((state) => {
 const oldIndex = state.lists.findIndex(l => l.id === activeId);
 const newIndex = state.lists.findIndex(l => l.id === overId);
 
 const newLists = [...state.lists];
 const [movedList] = newLists.splice(oldIndex, 1);
 newLists.splice(newIndex, 0, movedList);
 
 // Update orders based on new sequence
 const updatedLists = newLists.map((l, i) => ({ ...l, order: i }));
 
 return { lists: updatedLists };
 });
 },

 deleteList: async (id) => {
 try {
 await listService.deleteList(id);
 set((state) => ({
 lists: state.lists.filter(l => l.id !== id)
 }));
 } catch (error: any) {
 set({ error: error.message });
 }
 },

 archiveList: async (id) => {
 try {
 const updatedList = await listService.updateList(id, { isArchived: true });
 set((state) => ({
 lists: state.lists.map(l => l.id === id ? updatedList : l)
 }));
 } catch (error: any) {
 set({ error: error.message });
 }
 },

 restoreList: async (id) => {
 try {
 const updatedList = await listService.updateList(id, { isArchived: false });
 set((state) => ({
 lists: state.lists.map(l => l.id === id ? updatedList : l)
 }));
 } catch (error: any) {
 set({ error: error.message });
 }
 },
}));
