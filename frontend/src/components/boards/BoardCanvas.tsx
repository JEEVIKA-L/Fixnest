'use client';

import React, { useState, useEffect } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  defaultDropAnimationSideEffects
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { Plus, X, Search, Archive } from 'lucide-react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { ListColumn } from '../lists/ListColumn';
import { CardItem } from '../cards/CardItem';
import { ArchivedListsModal } from './ArchivedListsModal';
import { Board, List } from '../../types';
import { useLists } from '../../hooks/useLists';
import { useCards } from '../../hooks/useCards';
import { useDragAndDrop } from '../../hooks/useDragAndDrop';
import { createPortal } from 'react-dom';
import { useFilterStore } from '@/stores/useFilterStore';
import { useSortStore } from '@/stores/useSortStore';

interface BoardCanvasProps {
  board: Board;
}

export const BoardCanvas = ({ board }: BoardCanvasProps) => {
  const { lists, fetchBoardLists, createList, reorderLists } = useLists(board.id);
  const { allCards, fetchListCards } = useCards();
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
  const { activeCard, activeList, onDragStart, onDragOver, onDragEnd } = useDragAndDrop();
  const [isMounted, setIsMounted] = useState(false);
  const [isAddingList, setIsAddingList] = useState(false);
  const [newListTitle, setNewListTitle] = useState('');
  const [showArchived, setShowArchived] = useState(false);
  
  const { searchText, selectedMemberIds, selectedLabelIds } = useFilterStore();
  const { field: sortField, order: sortOrder } = useSortStore();

  const activeLists = lists.filter(l => !l.isArchived);

  const filteredLists = activeLists.filter(list => {
    // 1. Get filtered cards for this list
    const listCards = allCards[list.id] || [];
    const matchingCards = listCards.filter(card => {
      // Search text match
      const matchesSearch = searchText === '' || 
        card.title.toLowerCase().includes(searchText.toLowerCase());
      
      // Member match
      const matchesMembers = selectedMemberIds.length === 0 || 
        card.memberIds.some(id => selectedMemberIds.includes(id));
      
      // Label match
      const matchesLabels = selectedLabelIds.length === 0 || 
        card.labelIds.some(id => selectedLabelIds.includes(id));
      
      return matchesSearch && matchesMembers && matchesLabels;
    });

    // 2. List matches if title matches search OR it has matching cards
    const listTitleMatches = searchText !== '' && list.title.toLowerCase().includes(searchText.toLowerCase());
    
    return listTitleMatches || matchingCards.length > 0 || (searchText === '' && selectedMemberIds.length === 0 && selectedLabelIds.length === 0);
  });

  // Apply Sorting to Lists
  const displayLists = [...filteredLists].sort((a, b) => {
    if (sortField === 'manual') return 0; // Keep drag & drop order
    
    let comparison = 0;
    if (sortField === 'title') {
      comparison = a.title.localeCompare(b.title);
    } else if (sortField === 'createdAt') {
      comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const getFilteredAndSortedCards = (listId: string) => {
    const listCards = allCards[listId] || [];
    const filtered = listCards.filter(card => {
      const matchesSearch = searchText === '' || 
        card.title.toLowerCase().includes(searchText.toLowerCase());
      const matchesMembers = selectedMemberIds.length === 0 || 
        card.memberIds.some(id => selectedMemberIds.includes(id));
      const matchesLabels = selectedLabelIds.length === 0 || 
        card.labelIds.some(id => selectedLabelIds.includes(id));
      
      return matchesSearch && matchesMembers && matchesLabels;
    });

    // Apply Sorting to Cards
    return [...filtered].sort((a, b) => {
      if (sortField === 'manual') return 0; // Keep drag & drop order
      
      let comparison = 0;
      if (sortField === 'title') {
        comparison = a.title.localeCompare(b.title);
      } else if (sortField === 'createdAt') {
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  };

  useEffect(() => {
    setIsMounted(true);
    fetchBoardLists();
  }, [board.id, fetchBoardLists]);

  // Fetch cards for each list once lists are loaded
  useEffect(() => {
    if (lists.length > 0) {
      lists.forEach(list => {
        fetchListCards(list.id);
      });
    }
  }, [lists, fetchListCards]);

  const handleAddList = async () => {
    if (newListTitle.trim()) {
      await createList({
        title: newListTitle,
        boardId: board.id,
      });
      setNewListTitle('');
      setIsAddingList(false);
    }
  };

  if (!isMounted) return null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
    >
      <div className="flex gap-6 h-full overflow-x-auto pb-4 pt-6 scrollbar-hide px-6">
        <LayoutGroup>
          {displayLists.length > 0 ? (
            <SortableContext
              items={displayLists.map(l => l.id)}
              strategy={horizontalListSortingStrategy}
            >
              <AnimatePresence initial={false}>
                {displayLists.map((list, index) => (
                  <motion.div
                    key={list.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ 
                      opacity: 1, 
                      x: 0,
                      transition: { delay: index * 0.1, duration: 0.4, ease: "easeOut" }
                    }}
                    exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                  >
                    <ListColumn 
                      list={list} 
                      cards={getFilteredAndSortedCards(list.id)} 
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </SortableContext>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1 flex flex-col items-center justify-center min-h-[400px] text-center"
            >
              <div className="w-20 h-20 bg-[#F6F7FB] rounded-full flex items-center justify-center mb-4">
                <Search size={32} className="text-[#6A3DE8]/20" />
              </div>
              <h3 className="text-lg font-black text-[#1F2937]">No results found</h3>
              <p className="text-sm text-[#1F2937]/40 max-w-xs mt-2 font-medium">
                We couldn't find anything matching your filters. Try adjusting your search or clearing filters.
              </p>
            </motion.div>
          )}
        </LayoutGroup>
        
        {isAddingList ? (
          <div className="w-72 flex-shrink-0 bg-white border border-[#E5E7EB] rounded-xl p-4 shadow-lg shadow-[#6A3DE8]/5">
            <input
              autoFocus
              className="w-full bg-[#F6F7FB] border-2 border-[#6A3DE8] rounded-lg px-3 py-2 text-sm focus:outline-none mb-3"
              placeholder="Enter list title..."
              value={newListTitle}
              onChange={(e) => setNewListTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddList()}
            />
            <div className="flex items-center gap-2">
              <button 
                onClick={handleAddList}
                className="bg-[#6A3DE8] text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-[#7C3AED] transition-all"
              >
                Add List
              </button>
              <button 
                onClick={() => setIsAddingList(false)}
                className="p-1.5 hover:bg-[#F6F7FB] rounded-lg text-[#1F2937]/40 transition-all"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        ) : (
          <button 
            onClick={() => setIsAddingList(true)}
            className="w-72 flex-shrink-0 bg-white/40 hover:bg-white/60 border border-[#E5E7EB] border-dashed rounded-xl p-4 text-sm font-bold text-[#1F2937]/60 hover:text-[#6A3DE8] transition-all flex items-center gap-2 h-12 backdrop-blur-sm shadow-sm"
          >
            + Add another list
          </button>
        )}

        {/* Archived Items Button */}
        <div className="flex-shrink-0 flex items-center h-12">
          <button
            onClick={() => setShowArchived(true)}
            className="flex items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-widest text-[#1F2937]/40 hover:text-[#6A3DE8] transition-all bg-white/20 hover:bg-white/40 rounded-xl"
          >
            <Archive size={14} />
            Archived Lists
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showArchived && (
          <ArchivedListsModal 
            lists={lists.filter(l => l.isArchived)} 
            onClose={() => setShowArchived(false)} 
          />
        )}
      </AnimatePresence>

      {createPortal(
        <DragOverlay dropAnimation={{
          sideEffects: defaultDropAnimationSideEffects({
            styles: {
              active: {
                opacity: '0.5',
              },
            },
          }),
        }}>
          {activeCard && <CardItem card={activeCard} />}
          {activeList && (
            <ListColumn 
              list={activeList} 
              cards={allCards[activeList.id] || []} 
            />
          )}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  );
};
