import { 
  DragStartEvent, 
  DragOverEvent, 
  DragEndEvent, 
  PointerSensor, 
  KeyboardSensor, 
  useSensor, 
  useSensors 
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useState, useCallback } from 'react';
import { useCardStore } from '../stores/useCardStore';
import { useListStore } from '../stores/useListStore';
import { Card, List } from '../types';

export const useDragAndDrop = () => {
  const [activeCard, setActiveCard] = useState<Card | null>(null);
  const [activeList, setActiveList] = useState<List | null>(null);
  
  const { moveCard, cards } = useCardStore();
  const { moveList, reorderLists } = useListStore();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const onDragStart = useCallback((event: DragStartEvent) => {
    if (event.active.data.current?.type === 'List') {
      setActiveList(event.active.data.current.list);
      return;
    }

    if (event.active.data.current?.type === 'Card') {
      setActiveCard(event.active.data.current.card);
      return;
    }
  }, []);

  const onDragOver = useCallback((event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveACard = active.data.current?.type === 'Card';
    const isOverACard = over.data.current?.type === 'Card';

    if (!isActiveACard) return;

    // Dropping a card over another card
    if (isActiveACard && isOverACard) {
      const activeCard = active.data.current?.card as Card;
      const overCard = over.data.current?.card as Card;
      
      // Get the current listId from the store to avoid stale data during continuous drag
      let currentListId = '';
      for (const lid in cards) {
        if (cards[lid].some(c => c.id === activeId)) {
          currentListId = lid;
          break;
        }
      }

      if (currentListId && currentListId !== overCard.listId) {
        const overIndex = (cards[overCard.listId] || []).findIndex(c => c.id === overId);
        moveCard(activeId as string, currentListId, overCard.listId, overIndex);
      }
    }

    // Dropping a card over a list
    const isOverAList = over.data.current?.type === 'List';
    if (isActiveACard && isOverAList) {
      const activeCard = active.data.current?.card as Card;
      const overList = over.data.current?.list as List;

      let currentListId = '';
      for (const lid in cards) {
        if (cards[lid].some(c => c.id === activeId)) {
          currentListId = lid;
          break;
        }
      }

      if (currentListId && currentListId !== overList.id) {
        moveCard(activeId as string, currentListId, overList.id, 0);
      }
    }
  }, [cards, moveCard]);

  const onDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    
    setActiveCard(null);
    setActiveList(null);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    // Handle list reordering
    if (active.data.current?.type === 'List' && over.data.current?.type === 'List') {
      reorderLists(activeId as string, overId as string);
      return;
    }

    // Handle card reordering within same list
    if (active.data.current?.type === 'Card' && over.data.current?.type === 'Card') {
      const overCard = over.data.current.card as Card;

      let currentListId = '';
      for (const lid in cards) {
        if (cards[lid].some(c => c.id === activeId)) {
          currentListId = lid;
          break;
        }
      }

      if (currentListId && currentListId === overCard.listId) {
        const overIndex = (cards[overCard.listId] || []).findIndex(c => c.id === overId);
        moveCard(activeId as string, currentListId, overCard.listId, overIndex);
      }
    }
  }, [cards, moveCard, moveList]);

  return {
    sensors,
    activeCard,
    activeList,
    onDragStart,
    onDragOver,
    onDragEnd
  };
};
