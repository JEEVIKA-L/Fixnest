import { Comment } from '../types';

export const mockComments: Comment[] = [
  {
    id: 'co1',
    cardId: 'c1',
    userId: 'u1',
    text: 'I have started the research on Competitor A. Their new feature is impressive.',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: 'co2',
    cardId: 'c1',
    userId: 'u2',
    text: 'Great, thanks for the update. Let me know when you finish Competitor B.',
    createdAt: new Date(Date.now() - 1800000).toISOString(),
    updatedAt: new Date(Date.now() - 1800000).toISOString()
  }
];
