export interface Activity {
  id: string;
  userId: string;
  entityId: string; // cardId or boardId
  entityType: 'card' | 'board';
  action: string;
  details?: string;
  createdAt: string;
}
