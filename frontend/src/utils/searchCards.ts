import { Card } from '../types';

export const searchCards = (cards: Card[], query: string): Card[] => {
 const q = query.toLowerCase();
 return cards.filter(card => 
 card.title.toLowerCase().includes(q) || 
 card.description.toLowerCase().includes(q)
 );
};
