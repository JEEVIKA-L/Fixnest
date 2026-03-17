import { List } from '../types';

export const mockLists: List[] = [
  { id: 'li1', title: 'To Do', boardId: 'b1', order: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'li2', title: 'In Progress', boardId: 'b1', order: 1, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'li3', title: 'Code Review', boardId: 'b1', order: 2, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'li4', title: 'Done', boardId: 'b1', order: 3, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'li5', title: 'Backlog', boardId: 'b2', order: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'li6', title: 'Q1 Planning', boardId: 'b2', order: 1, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'li7', title: 'In Progress', boardId: 'b2', order: 2, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'li8', title: 'Completed', boardId: 'b2', order: 3, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];
