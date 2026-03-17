import { Card } from '../types';
import { mockCards as initialMockCards } from '../mock-data/cards';
import { delay, simulateError, getStorageData, setStorageData } from './serviceHelpers';
import { activityService } from './activityService';

let mockCards = getStorageData<Card[]>('cards', initialMockCards);

const syncStorage = () => setStorageData('cards', mockCards);

export const cardService = {
  getCardsByListId: async (listId: string): Promise<Card[]> => {
    await delay(300);
    simulateError();
    return mockCards.filter(c => c.listId === listId).sort((a, b) => a.order - b.order);
  },

  getCardById: async (id: string): Promise<Card> => {
    await delay(200);
    simulateError();
    const card = mockCards.find(c => c.id === id);
    if (!card) throw new Error('Card not found');
    return { ...card };
  },

  createCard: async (cardData: Partial<Card>): Promise<Card> => {
    await delay(500);
    simulateError();
    const newCard: Card = {
      ...cardData,
      id: `c${Math.random().toString(36).substr(2, 9)}`,
      description: '',
      memberIds: [],
      labelIds: [],
      checklists: [],
      commentIds: [],
      activityIds: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: cardData.createdBy,
    } as Card;
    mockCards.push(newCard);
    syncStorage();

    // Log creation
    await activityService.addActivity({
      userId: newCard.createdBy || 'u1',
      entityId: newCard.id,
      entityType: 'card',
      action: 'created',
      details: 'created this card'
    });

    return newCard;
  },

  updateCard: async (id: string, updates: Partial<Card>): Promise<Card> => {
    await delay(300);
    simulateError();
    const index = mockCards.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Card not found');
    const oldCard = { ...mockCards[index] };
    mockCards[index] = { ...mockCards[index], ...updates, updatedAt: new Date().toISOString() };
    syncStorage();

    // Log specific updates
    if (updates.dueDate && updates.dueDate !== oldCard.dueDate) {
      await activityService.addActivity({
        userId: updates.overdueReasonBy || oldCard.createdBy || 'u1',
        entityId: id,
        entityType: 'card',
        action: 'duedate_updated',
        details: updates.dueDate // Store the specific date in details
      });
    }

    return mockCards[index];
  },

  moveCard: async (id: string, toListId: string, newOrder: number, userId?: string): Promise<void> => {
    await delay(200);
    simulateError();
    const card = mockCards.find(c => c.id === id);
    if (card) {
      card.listId = toListId;
      card.order = newOrder;
      card.lastMovedAt = new Date().toISOString();
      syncStorage();

      await activityService.addActivity({
        userId: userId || card.createdBy || 'u1',
        entityId: id,
        entityType: 'card',
        action: 'moved',
        details: toListId
      });
    }
  },

  deleteCard: async (id: string): Promise<void> => {
    await delay(400);
    simulateError();
    const index = mockCards.findIndex(c => c.id === id);
    if (index !== -1) {
      mockCards.splice(index, 1);
      syncStorage();
    }
  }
};
