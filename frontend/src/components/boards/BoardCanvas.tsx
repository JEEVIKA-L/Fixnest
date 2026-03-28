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
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex-1 flex flex-col items-center justify-center min-h-[400px] text-center"
    >
      <div className="w-24 h-24 bg-white/40 rounded-[2rem] flex items-center justify-center mb-6 shadow-xl shadow-[#D94F9D]/5 border border-white/60">
        <Search size={40} className="text-[#D94F9D]/40" />
      </div>
      <h3 className="text-2xl font-black text-[#2D2D2D] tracking-tight">No results found</h3>
      <p className="text-[#6B6B6B] max-w-xs mt-3 font-medium leading-relaxed">
        We couldn't find anything matching your filters. Try adjusting your search or clearing filters.
      </p>
    </motion.div>
 )}
 </LayoutGroup>
 
 {isAddingList ? (
  <div className="w-80 flex-shrink-0 glass-panel rounded-2xl p-5 shadow-xl shadow-[#D94F9D]/5 border-0">
  <input
  autoFocus
  className="w-full bg-white/60 border-2 border-[#D94F9D] rounded-xl px-4 py-2 text-sm focus:outline-none mb-4 text-[#2D2D2D] placeholder:text-[#6B6B6B]/40"
  placeholder="Enter list title..."
  value={newListTitle}
  onChange={(e) => setNewListTitle(e.target.value)}
  onKeyDown={(e) => e.key === 'Enter' && handleAddList()}
  />
  <div className="flex items-center gap-3">
  <button 
  onClick={handleAddList}
  className="bg-[#D94F9D] text-white px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#B83280] transition-all shadow-md shadow-[#D94F9D]/20 active:scale-95"
  >
  Add List
  </button>
  <button 
  onClick={() => setIsAddingList(false)}
  className="p-2 hover:bg-white/60 rounded-xl text-[#6B6B6B] transition-all"
  >
  <X size={20} />
  </button>
  </div>
  </div>
 ) : (
  <button 
  onClick={() => setIsAddingList(true)}
  className="w-80 flex-shrink-0 bg-white/40 hover:bg-white/60 border-2 border-[#E6D6F5] border-dashed rounded-[1.5rem] p-5 text-sm font-black text-[#6B6B6B] hover:text-[#D94F9D] hover:border-[#D94F9D] transition-all flex items-center gap-3 h-14 backdrop-blur-md shadow-sm group"
  >
  <Plus size={22} className="group-hover:rotate-90 transition-transform duration-300" />
  Add another list
  </button>
 )}

 {/* Archived Items Button */}
 <div className="flex-shrink-0 flex items-center h-12">
  <button
  onClick={() => setShowArchived(true)}
  className="flex items-center gap-2 px-5 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] text-[#6B6B6B] hover:text-[#D94F9D] transition-all glass-panel rounded-xl shadow-sm hover:shadow-md"
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
