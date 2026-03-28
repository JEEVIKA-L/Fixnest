import { create } from 'zustand';
import { Board } from '../types';
import { boardService } from '../services/boardService';

interface BoardState {
 boards: Board[];
 activeBoard: Board | null;
 isLoading: boolean;
 error: string | null;
 fetchBoards: () => Promise<void>;
 fetchBoardById: (id: string) => Promise<void>;
 addBoard: (boardData: Partial<Board>) => Promise<Board>;
 updateBoard: (id: string, updates: Partial<Board>) => Promise<void>;
 deleteBoard: (id: string) => Promise<void>;
 starBoard: (id: string, isStarred: boolean) => Promise<void>;
 reorderBoards: (activeId: string, overId: string) => Promise<void>;
}

export const useBoardStore = create<BoardState>((set) => ({
 boards: [],
 activeBoard: null,
 isLoading: false,
 error: null,

 fetchBoards: async () => {
 set({ isLoading: true, error: null });
 try {
 const boards = await boardService.getBoards();
 set({ boards, isLoading: false });
 } catch (error: any) {
 set({ error: error.message, isLoading: false });
 }
 },

 fetchBoardById: async (id: string) => {
 set({ isLoading: true, error: null });
 try {
 const board = await boardService.getBoardById(id);
 set({ activeBoard: board, isLoading: false });
 } catch (error: any) {
 set({ error: error.message, isLoading: false });
 }
 },

 addBoard: async (boardData) => {
 set({ isLoading: true, error: null });
 try {
 const newBoard = await boardService.createBoard(boardData);
 set((state) => ({ boards: [...state.boards, newBoard], isLoading: false }));
 return newBoard;
 } catch (error: any) {
 set({ error: error.message, isLoading: false });
 throw error;
 }
 },

 updateBoard: async (id, updates) => {
 try {
 const updatedBoard = await boardService.updateBoard(id, updates);
 set((state) => ({
 boards: state.boards.map(b => b.id === id ? updatedBoard : b),
 activeBoard: state.activeBoard?.id === id ? updatedBoard : state.activeBoard
 }));
 } catch (error: any) {
 set({ error: error.message });
 }
 },

 deleteBoard: async (id) => {
 set({ isLoading: true, error: null });
 try {
 await boardService.deleteBoard(id);
 set((state) => ({
 boards: state.boards.filter(b => b.id !== id),
 activeBoard: state.activeBoard?.id === id ? null : state.activeBoard,
 isLoading: false
 }));
 } catch (error: any) {
 set({ error: error.message, isLoading: false });
 }
 },

 starBoard: async (id, isStarred) => {
 try {
 const updatedBoard = await boardService.updateBoard(id, { isStarred });
 set((state) => ({
 boards: state.boards.map(b => b.id === id ? updatedBoard : b),
 activeBoard: state.activeBoard?.id === id ? updatedBoard : state.activeBoard
 }));
 } catch (error: any) {
 set({ error: error.message });
 }
 },

 reorderBoards: async (activeId, overId) => {
 set((state) => {
 const oldIndex = state.boards.findIndex(b => b.id === activeId);
 const newIndex = state.boards.findIndex(b => b.id === overId);
 
 const newBoards = [...state.boards];
 const [movedBoard] = newBoards.splice(oldIndex, 1);
 newBoards.splice(newIndex, 0, movedBoard);
 
 return { boards: newBoards };
 });
 },
}));
