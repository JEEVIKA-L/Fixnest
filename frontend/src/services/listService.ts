import { List } from '../types';
import { mockLists } from '../mock-data/lists';
import { delay, simulateError } from './serviceHelpers';

export const listService = {
  getListsByBoardId: async (boardId: string): Promise<List[]> => {
    await delay(400);
    simulateError();
    return mockLists.filter(l => l.boardId === boardId).sort((a, b) => a.order - b.order);
  },

  createList: async (listData: Partial<List>): Promise<List> => {
    await delay(500);
    simulateError();
    const newList: List = {
      ...listData,
      id: `li${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as List;
    mockLists.push(newList);
    return newList;
  },

  updateList: async (id: string, updates: Partial<List>): Promise<List> => {
    await delay(300);
    simulateError();
    const index = mockLists.findIndex(l => l.id === id);
    if (index === -1) throw new Error('List not found');
    mockLists[index] = { ...mockLists[index], ...updates, updatedAt: new Date().toISOString() };
    return mockLists[index];
  },

  updateListOrder: async (id: string, newOrder: number): Promise<void> => {
    await delay(200);
    simulateError();
    const list = mockLists.find(l => l.id === id);
    if (list) list.order = newOrder;
  },

  deleteList: async (id: string): Promise<void> => {
    await delay(400);
    simulateError();
    const index = mockLists.findIndex(l => l.id === id);
    if (index !== -1) mockLists.splice(index, 1);
  }
};
