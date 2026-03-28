import { Card } from '../types';

interface Filters {
 labelIds: string[];
 memberIds: string[];
 dueDate?: 'overdue' | 'dueSoon' | 'all';
}

export const filterCards = (cards: Card[], filters: Filters): Card[] => {
 return cards.filter(card => {
 const matchesLabels = filters.labelIds.length === 0 || 
 filters.labelIds.some(id => card.labelIds.includes(id));
 
 const matchesMembers = filters.memberIds.length === 0 || 
 filters.memberIds.some(id => card.memberIds.includes(id));
 
 let matchesDueDate = true;
 if (filters.dueDate === 'overdue' && card.dueDate) {
 matchesDueDate = new Date(card.dueDate) < new Date();
 } else if (filters.dueDate === 'dueSoon' && card.dueDate) {
 const soon = new Date();
 soon.setDate(soon.getDate() + 2);
 matchesDueDate = new Date(card.dueDate) >= new Date() && new Date(card.dueDate) <= soon;
 }
 
 return matchesLabels && matchesMembers && matchesDueDate;
 });
};
