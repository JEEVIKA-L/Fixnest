import { Comment } from '../types';
import { mockComments } from '../mock-data/comments';
import { delay, simulateError } from './serviceHelpers';

export const commentService = {
  getCommentsByCardId: async (cardId: string): Promise<Comment[]> => {
    await delay(300);
    simulateError();
    return mockComments.filter(c => c.cardId === cardId);
  },

  addComment: async (commentData: Partial<Comment>): Promise<Comment> => {
    await delay(400);
    simulateError();
    const newComment: Comment = {
      ...commentData,
      id: `co${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as Comment;
    mockComments.push(newComment);
    return newComment;
  },

  updateComment: async (id: string, text: string): Promise<Comment> => {
    await delay(300);
    simulateError();
    const index = mockComments.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Comment not found');
    mockComments[index] = { ...mockComments[index], text, updatedAt: new Date().toISOString() };
    return mockComments[index];
  },

  deleteComment: async (id: string): Promise<void> => {
    await delay(300);
    simulateError();
    const index = mockComments.findIndex(c => c.id === id);
    if (index !== -1) mockComments.splice(index, 1);
  }
};
