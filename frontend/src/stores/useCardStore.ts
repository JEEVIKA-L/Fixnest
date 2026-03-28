import { create } from 'zustand';
import { Card, Checklist, ChecklistItem, Comment, Activity } from '../types';
import { cardService } from '../services/cardService';
import { activityService } from '../services/activityService';
import { commentService } from '../services/commentService';
import { mockUsers } from '../mock-data/users';
import { arrayMove } from '@dnd-kit/sortable';
import { useUserStore } from './useUserStore';
import { useNotificationStore } from './useNotificationStore';
import { useBoardStore } from './useBoardStore';

interface CardState {
 cards: Record<string, Card[]>; // listId -> cards
 activeCardId: string | null;
 isLoading: boolean;
 error: string | null;
 
 fetchCardsByList: (listId: string) => Promise<void>;
 addCard: (cardData: Partial<Card>) => Promise<void>;
 updateCard: (id: string, updates: Partial<Card>) => Promise<void>;
 moveCard: (cardId: string, fromListId: string, toListId: string, newOrder: number) => Promise<void>;
 deleteCard: (id: string) => Promise<void>;
 
 // Card Detail Actions
 addComment: (cardId: string, userId: string, text: string) => Promise<void>;
 updateComment: (commentId: string, text: string) => Promise<void>;
 deleteComment: (cardId: string, commentId: string) => Promise<void>;
 toggleMember: (cardId: string, userId: string) => Promise<void>;
 toggleLabel: (cardId: string, labelId: string) => Promise<void>;
 toggleChecklistItem: (cardId: string, checklistId: string, itemId: string) => Promise<void>;
 addChecklist: (cardId: string, title: string) => Promise<void>;
 addChecklistItem: (cardId: string, checklistId: string, title: string) => Promise<void>;
 updateChecklistItem: (cardId: string, checklistId: string, itemId: string, patch: Partial<ChecklistItem>) => Promise<void>;
 deleteChecklistItem: (cardId: string, checklistId: string, itemId: string) => Promise<void>;
 toggleChecklistItemLabel: (cardId: string, checklistId: string, itemId: string, labelId: string) => Promise<void>;
 activities: Record<string, Activity[]>;
 fetchActivities: (cardId: string) => Promise<void>;
}

export const useCardStore = create<CardState>((set, get) => ({
 cards: {},
 activeCardId: null,
 isLoading: false,
 error: null,
 activities: {},

 fetchCardsByList: async (listId) => {
 try {
 const cards = await cardService.getCardsByListId(listId);
 set((state) => ({
 cards: { ...state.cards, [listId]: cards }
 }));
 } catch (error: any) {
 set({ error: error.message });
 }
 },

 addCard: async (cardData) => {
 try {
 const newCard = await cardService.createCard(cardData);
 set((state) => ({
 cards: {
 ...state.cards,
 [newCard.listId]: [...(state.cards[newCard.listId] || []), newCard].sort((a, b) => a.order - b.order),
 },
 }));
 // Refresh activities for new card
 get().fetchActivities(newCard.id);
 } catch (error: any) {
 set({ error: error.message });
 }
 },

 updateCard: async (id, updates) => {
 try {
 const updatedCard = await cardService.updateCard(id, updates);
 const listId = updatedCard.listId;
 set((state) => ({
 cards: {
 ...state.cards,
 [listId]: (state.cards[listId] || []).map(c => c.id === id ? updatedCard : c)
 }
 }));
 // If due date changed, refresh activities
 if (updates.dueDate) {
 get().fetchActivities(id);
 }
 } catch (error: any) {
 set({ error: error.message });
 }
 },

 moveCard: async (cardId, fromListId, toListId, newOrder) => {
 const { cards } = get();
 const sourceCards = [...(cards[fromListId] || [])];
 
 if (fromListId === toListId) {
 const cardIndex = sourceCards.findIndex((c) => c.id === cardId);
 if (cardIndex === -1) return;
 
 const newCards = arrayMove(sourceCards, cardIndex, newOrder);
 const updatedCards = newCards.map((c, index) => ({ ...c, order: index }));
 
 set((state) => ({
 cards: { ...state.cards, [fromListId]: updatedCards },
 }));

 try {
 await cardService.moveCard(cardId, toListId, newOrder);
 get().fetchActivities(cardId);
 } catch (error: any) {
 set({ error: error.message });
 }
 return;
 }

 const destCards = [...(cards[toListId] || [])];
 const cardIndex = sourceCards.findIndex((c) => c.id === cardId);
 if (cardIndex === -1) return;
 
 const [movedCard] = sourceCards.splice(cardIndex, 1);
 movedCard.listId = toListId;
 destCards.splice(newOrder, 0, movedCard);
 
 const updatedSourceCards = sourceCards.map((c, index) => ({ ...c, order: index }));
 const updatedDestCards = destCards.map((c, index) => ({ ...c, order: index }));
 
 set((state) => ({
 cards: {
 ...state.cards,
 [fromListId]: updatedSourceCards,
 [toListId]: updatedDestCards,
 },
 }));

 try {
 const currentUser = useUserStore.getState().currentUser;
 await cardService.moveCard(cardId, toListId, newOrder, currentUser?.id);
 get().fetchActivities(cardId);

 // Trigger Notification
 const activeBoard = useBoardStore.getState().activeBoard;
 if (activeBoard && currentUser) {
 const movedCard = cards[toListId]?.find(c => c.id === cardId);
 if (movedCard) {
 const boardMembers = useUserStore.getState().users.filter(u => activeBoard.memberIds.includes(u.id));
 const boardAdmins = boardMembers.filter(u => u.role === 'admin').map(u => u.id);
 const recipients = [...new Set([...movedCard.memberIds, activeBoard.ownerId, ...boardAdmins])];
 recipients.forEach(userId => {
 useNotificationStore.getState().addNotification({
 userId,
 title: 'Card Moved',
 message: `${currentUser.name} moved "${movedCard.title}" to another list`,
 type: 'card_moved',
 link: `/board/${activeBoard.id}?cardId=${cardId}`
 });
 });
 }
 }
 } catch (error: any) {
 set({ error: error.message });
 }
 },

 deleteCard: async (id) => {
 const { cards } = get();
 let foundListId = '';
 for (const listId in cards) {
 if (cards[listId].some(c => c.id === id)) {
 foundListId = listId;
 break;
 }
 }
 
 if (!foundListId) return;

 try {
 await cardService.deleteCard(id);
 set((state) => ({
 cards: {
 ...state.cards,
 [foundListId]: state.cards[foundListId].filter(c => c.id !== id)
 }
 }));
 } catch (error: any) {
 set({ error: error.message });
 }
 },

 toggleMember: async (cardId, userId) => {
 const { cards, updateCard } = get();
 for (const lid in cards) {
 const card = cards[lid].find(c => c.id === cardId);
 if (card) {
 const isAdded = !card.memberIds.includes(userId);
 const newMemberIds = isAdded
 ? [...card.memberIds, userId]
 : card.memberIds.filter(id => id !== userId);
 
 await updateCard(cardId, { memberIds: newMemberIds });

 // Log Activity
 const currentUser = useUserStore.getState().currentUser;
 const targetUser = mockUsers.find(u => u.id === userId);
 if (currentUser && targetUser) {
 await activityService.addActivity({
 userId: currentUser.id,
 entityId: cardId,
 entityType: 'card',
 action: isAdded ? 'member_added' : 'member_removed',
 details: targetUser.name
 });
 get().fetchActivities(cardId);
 }

 // Trigger Notification if user was added
 const activeBoard = useBoardStore.getState().activeBoard;
 if (isAdded && activeBoard && currentUser) {
 useNotificationStore.getState().addNotification({
 userId,
 title: 'New Assignment',
 message: `${currentUser.name} assigned you to "${card.title}"`,
 type: 'assignment',
 link: `/board/${activeBoard.id}?cardId=${cardId}`
 });
 }
 break;
 }
 }
 },

 toggleLabel: async (cardId, labelId) => {
 const { cards, updateCard } = get();
 for (const lid in cards) {
 const card = cards[lid].find(c => c.id === cardId);
 if (card) {
 const newLabelIds = card.labelIds.includes(labelId)
 ? card.labelIds.filter(id => id !== labelId)
 : [...card.labelIds, labelId];
 await updateCard(cardId, { labelIds: newLabelIds });
 break;
 }
 }
 },

 addComment: async (cardId, userId, text) => {
 try {
 const newComment = await commentService.addComment({ cardId, userId, text });
 // Update the card locally to include the new comment ID
 const { cards } = get();
 let targetCard: Card | null = null;
 let targetListId = '';
 
 for (const lid in cards) {
 const c = cards[lid].find(card => card.id === cardId);
 if (c) {
 targetCard = c;
 targetListId = lid;
 break;
 }
 }
 
 if (targetCard && targetListId) {
 const updatedCard = {
 ...targetCard,
 commentIds: [...targetCard.commentIds, newComment.id]
 };
 set((state) => ({
 cards: {
 ...state.cards,
 [targetListId]: state.cards[targetListId].map(c => c.id === cardId ? updatedCard : c)
 }
 }));

 // Log Activity
 const currentUser = useUserStore.getState().currentUser;
 if (currentUser) {
 await activityService.addActivity({
 userId: currentUser.id,
 entityId: cardId,
 entityType: 'card',
 action: 'comment_added',
 details: text.length > 50 ? text.substring(0, 50) + '...' : text
 });
 get().fetchActivities(cardId);
 }

 // Trigger Notification
 const activeBoard = useBoardStore.getState().activeBoard;
 if (activeBoard && currentUser) {
 const boardMembers = useUserStore.getState().users.filter(u => activeBoard.memberIds.includes(u.id));
 const boardAdmins = boardMembers.filter(u => u.role === 'admin').map(u => u.id);
 const recipients = [...new Set([...targetCard.memberIds, activeBoard.ownerId, ...boardAdmins])];
 recipients.forEach(rid => {
 useNotificationStore.getState().addNotification({
 userId: rid,
 title: 'New Comment',
 message: `${currentUser.name} commented on "${targetCard!.title}"`,
 type: 'comment_added',
 link: `/board/${activeBoard.id}?cardId=${cardId}`
 });
 });
 }
 }
 } catch (error: any) {
 set({ error: error.message });
 }
 },

 updateComment: async (commentId, text) => {
 try {
 await commentService.updateComment(commentId, text);
 } catch (error: any) {
 set({ error: error.message });
 }
 },

 deleteComment: async (cardId, commentId) => {
 try {
 await commentService.deleteComment(commentId);
 const { cards } = get();
 for (const lid in cards) {
 const cardIndex = cards[lid].findIndex(c => c.id === cardId);
 if (cardIndex > -1) {
 const card = cards[lid][cardIndex];
 const updatedCard = {
 ...card,
 commentIds: card.commentIds.filter(id => id !== commentId)
 };
 const newList = [...cards[lid]];
 newList[cardIndex] = updatedCard;
 set((state) => ({
 cards: { ...state.cards, [lid]: newList }
 }));
 break;
 }
 }
 } catch (error: any) {
 set({ error: error.message });
 }
 },

 toggleChecklistItem: async (cardId, checklistId, itemId) => {
 const { cards } = get();
 for (const lid in cards) {
 const list = cards[lid];
 const cardIndex = list.findIndex(c => c.id === cardId);
 if (cardIndex > -1) {
 const card = list[cardIndex];
 const updatedChecklists = card.checklists.map(cl => {
 if (cl.id === checklistId) {
 return {
 ...cl,
 items: cl.items.map((item: ChecklistItem) => 
 item.id === itemId ? { ...item, isCompleted: !item.isCompleted } : item
 )
 };
 }
 return cl;
 });
 
 const updatedCard = { ...card, checklists: updatedChecklists };
 const newList = [...list];
 newList[cardIndex] = updatedCard;
 
 set((state) => ({
 cards: { ...state.cards, [lid]: newList }
 }));
 
 try {
 await cardService.updateCard(cardId, { checklists: updatedChecklists });
 } catch (error: any) {
 set({ error: error.message });
 }
 break;
 }
 }
 },

 addChecklist: async (cardId, title) => {
 const { cards } = get();
 for (const lid in cards) {
 const list = cards[lid];
 const cardIndex = list.findIndex(c => c.id === cardId);
 if (cardIndex > -1) {
 const card = list[cardIndex];
 const newChecklist = {
 id: `ck-${Math.random().toString(36).substr(2, 9)}`,
 title,
 items: []
 };
 const updatedChecklists = [...card.checklists, newChecklist];
 const updatedCard = { ...card, checklists: updatedChecklists };
 const newList = [...list];
 newList[cardIndex] = updatedCard;

 set((state) => ({
 cards: { ...state.cards, [lid]: newList }
 }));

 try {
 await cardService.updateCard(cardId, { checklists: updatedChecklists });
 
 // Log activity
 await activityService.addActivity({
 userId: useUserStore.getState().currentUser?.id || 'u1',
 entityId: cardId,
 entityType: 'card',
 action: 'checklist_added',
 details: title
 });
 
 get().fetchActivities(cardId);
 } catch (error: any) {
 set({ error: error.message });
 }
 break;
 }
 }
 },

 addChecklistItem: async (cardId, checklistId, title) => {
 const { cards } = get();
 for (const lid in cards) {
 const list = cards[lid];
 const cardIndex = list.findIndex(c => c.id === cardId);
 if (cardIndex > -1) {
 const card = list[cardIndex];
 const updatedChecklists = card.checklists.map(cl => {
 if (cl.id === checklistId) {
 const newItem = {
 id: `cki-${Math.random().toString(36).substr(2, 9)}`,
 title,
 isCompleted: false
 };
 return {
 ...cl,
 items: [...cl.items, newItem]
 };
 }
 return cl;
 });

 const updatedCard = { ...card, checklists: updatedChecklists };
 const newList = [...list];
 newList[cardIndex] = updatedCard;

 set((state) => ({
 cards: { ...state.cards, [lid]: newList }
 }));

 try {
 await cardService.updateCard(cardId, { checklists: updatedChecklists });

 // Log activity
 await activityService.addActivity({
 userId: useUserStore.getState().currentUser?.id || 'u1',
 entityId: cardId,
 entityType: 'card',
 action: 'checklist_item_added',
 details: title
 });

 get().fetchActivities(cardId);
 } catch (error: any) {
 set({ error: error.message });
 }
 break;
 }
 }
 },

 updateChecklistItem: async (cardId, checklistId, itemId, patch) => {
 const { cards } = get();
 for (const lid in cards) {
 const list = cards[lid];
 const cardIndex = list.findIndex(c => c.id === cardId);
 if (cardIndex > -1) {
 const card = list[cardIndex];
 const updatedChecklists = card.checklists.map(cl => {
 if (cl.id === checklistId) {
 return {
 ...cl,
 items: cl.items.map((item: ChecklistItem) =>
 item.id === itemId ? { ...item, ...patch } : item
 )
 };
 }
 return cl;
 });
 const updatedCard = { ...card, checklists: updatedChecklists };
 const newList = [...list];
 newList[cardIndex] = updatedCard;
 set((state) => ({
 cards: { ...state.cards, [lid]: newList }
 }));
 try {
 await cardService.updateCard(cardId, { checklists: updatedChecklists });
 } catch (error: any) {
 set({ error: error.message });
 }
 break;
 }
 }
 },

 deleteChecklistItem: async (cardId: string, checklistId: string, itemId: string) => {
 const { cards } = get();
 for (const lid in cards) {
 const list = cards[lid];
 const cardIndex = list.findIndex(c => c.id === cardId);
 if (cardIndex > -1) {
 const card = list[cardIndex];
 const updatedChecklists = card.checklists.map(cl => {
 if (cl.id === checklistId) {
 return {
 ...cl,
 items: cl.items.filter((item: ChecklistItem) => item.id !== itemId)
 };
 }
 return cl;
 });
 const updatedCard = { ...card, checklists: updatedChecklists };
 const newList = [...list];
 newList[cardIndex] = updatedCard;
 set((state) => ({
 cards: { ...state.cards, [lid]: newList }
 }));
 try {
 await cardService.updateCard(cardId, { checklists: updatedChecklists });
 } catch (error: any) {
 set({ error: error.message });
 }
 break;
 }
 }
 },

 toggleChecklistItemLabel: async (cardId: string, checklistId: string, itemId: string, labelId: string) => {
 const { cards } = get();
 for (const lid in cards) {
 const list = cards[lid];
 const cardIndex = list.findIndex(c => c.id === cardId);
 if (cardIndex > -1) {
 const card = list[cardIndex];
 const updatedChecklists = card.checklists.map(cl => {
 if (cl.id === checklistId) {
 return {
 ...cl,
 items: cl.items.map((item: ChecklistItem) => {
 if (item.id === itemId) {
 const currentLabels = item.labelIds || [];
 const newLabelIds = currentLabels.includes(labelId)
 ? currentLabels.filter(id => id !== labelId)
 : [...currentLabels, labelId];
 return { ...item, labelIds: newLabelIds };
 }
 return item;
 })
 };
 }
 return cl;
 });
 const updatedCard = { ...card, checklists: updatedChecklists };
 const newList = [...list];
 newList[cardIndex] = updatedCard;
 set((state) => ({
 cards: { ...state.cards, [lid]: newList }
 }));
 try {
 await cardService.updateCard(cardId, { checklists: updatedChecklists });
 } catch (error: any) {
 set({ error: error.message });
 }
 break;
 }
 }
 },

 fetchActivities: async (cardId) => {
 try {
 const activities = await activityService.getActivitiesByCardId(cardId);
 set((state) => ({
 activities: { ...state.activities, [cardId]: activities }
 }));
 } catch (error: any) {
 set({ error: error.message });
 }
 }
}));
