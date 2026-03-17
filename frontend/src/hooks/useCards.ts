import { useCallback } from 'react';
import { useCardStore } from '../stores/useCardStore';
import { Card } from '../types';

export const useCards = (listId?: string) => {
  const { cards, isLoading, error, fetchCardsByList, addCard, updateCard, moveCard, deleteCard, addComment, toggleChecklistItem } = useCardStore();

  const fetchListCards = useCallback((id?: string) => {
    const targetId = id || listId;
    if (targetId) {
      fetchCardsByList(targetId);
    }
  }, [listId, fetchCardsByList]);

  const listCards = listId ? (cards[listId] || []) : [];

  return {
    cards: listCards,
    allCards: cards,
    isLoading,
    error,
    fetchListCards,
    addCard,
    updateCard,
    moveCard,
    deleteCard,
    addComment,
    toggleChecklistItem,
  };
};
