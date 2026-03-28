import { Board } from '../types';
import { mockBoards } from '../mock-data/boards';
import { delay, simulateError } from './serviceHelpers';

export const boardService = {
 getBoards: async (): Promise<Board[]> => {
 await delay(400);
 simulateError();
 return [...mockBoards];
 },

 getBoardById: async (id: string): Promise<Board> => {
 await delay(300);
 simulateError();
 const board = mockBoards.find(b => b.id === id);
 if (!board) throw new Error('Board not found');
 return { ...board };
 },

 createBoard: async (boardData: Partial<Board>): Promise<Board> => {
 await delay(600);
 simulateError();
 const newBoard: Board = {
 ...boardData,
 id: `b${Math.random().toString(36).substr(2, 9)}`,
 createdAt: new Date().toISOString(),
 updatedAt: new Date().toISOString(),
 } as Board;
 mockBoards.push(newBoard);
 return newBoard;
 },

 updateBoard: async (id: string, updates: Partial<Board>): Promise<Board> => {
 await delay(400);
 simulateError();
 const index = mockBoards.findIndex(b => b.id === id);
 if (index === -1) throw new Error('Board not found');
 mockBoards[index] = { ...mockBoards[index], ...updates, updatedAt: new Date().toISOString() };
 return mockBoards[index];
 },

 deleteBoard: async (id: string): Promise<void> => {
 await delay(500);
 simulateError();
 const index = mockBoards.findIndex(b => b.id === id);
 if (index !== -1) mockBoards.splice(index, 1);
 }
};
