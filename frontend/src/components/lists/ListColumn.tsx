import React from 'react';
import { useSortable, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { List, Card } from '../../types';
import { CardItem } from '../cards/CardItem';
import { MoreHorizontal, Plus, Edit2, Archive } from 'lucide-react';
import { useListStore } from '../../stores/useListStore';

interface ListColumnProps {
  list: List;
  cards: Card[];
}

import { useCards } from '../../hooks/useCards';
import { useUserStore } from '@/stores/useUserStore';
import { motion, AnimatePresence } from 'framer-motion';
import { useOutsideClick } from '@/hooks/useOutsideClick';

export const ListColumn = ({ list, cards }: ListColumnProps) => {
  const { addCard } = useCards();
  const { currentUser } = useUserStore();
  const [isAddingCard, setIsAddingCard] = React.useState(false);
  const [newCardTitle, setNewCardTitle] = React.useState('');

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: list.id,
    data: {
      type: 'List',
      list,
    },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const cardIds = cards.map(c => c.id);

  const handleAddCard = async () => {
    if (newCardTitle.trim()) {
      await addCard({
        title: newCardTitle,
        listId: list.id,
        boardId: list.boardId,
        createdBy: currentUser?.id,
      });
      setNewCardTitle('');
      setIsAddingCard(false);
    }
  };

  const { updateList, archiveList } = useListStore();
  const [showMenu, setShowMenu] = React.useState(false);
  const [isEditingTitle, setIsEditingTitle] = React.useState(false);
  const [title, setTitle] = React.useState(list.title);
  const menuRef = React.useRef<HTMLDivElement>(null);

  useOutsideClick(menuRef, () => setShowMenu(false), showMenu);

  const handleTitleSave = () => {
    if (title.trim() && title !== list.title) {
      updateList(list.id, { title });
    }
    setIsEditingTitle(false);
  };

  const handleArchiveList = () => {
    archiveList(list.id);
    setShowMenu(false);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="w-72 flex-shrink-0 flex flex-col max-h-full bg-[#F1F2F4] border border-[#E5E7EB] rounded-2xl overflow-hidden"
    >
      <div 
        {...attributes} 
        {...listeners}
        className="p-4 flex items-center justify-between cursor-grab active:cursor-grabbing"
      >
        <div className="flex items-center gap-2 flex-1 min-w-0 pr-2">
           {isEditingTitle ? (
             <input
               autoFocus
               className="font-black text-[#1F2937] text-xs uppercase tracking-widest bg-white/50 border-b border-[#6A3DE8] focus:outline-none w-full px-1"
               value={title}
               onChange={(e) => setTitle(e.target.value)}
               onBlur={handleTitleSave}
               onKeyDown={(e) => {
                 if (e.key === 'Enter') handleTitleSave();
                 if (e.key === 'Escape') {
                   setTitle(list.title);
                   setIsEditingTitle(false);
                 }
               }}
             />
           ) : (
             <div 
               onClick={(e) => {
                 e.stopPropagation();
                 setIsEditingTitle(true);
               }}
               onPointerDown={(e) => e.stopPropagation()}
               className="flex items-center gap-1.5 cursor-pointer hover:bg-white/40 px-1 rounded transition-colors truncate group/title"
             >
               <h3 className="font-black text-[#1F2937] text-xs uppercase tracking-widest truncate">{list.title}</h3>
               <Edit2 size={10} className="text-[#6A3DE8] opacity-0 group-hover/title:opacity-100 transition-opacity flex-shrink-0" />
             </div>
           )}
           <span className="bg-white px-2 py-0.5 rounded-full text-[10px] font-bold text-[#1F2937]/40 border border-[#E5E7EB] flex-shrink-0">
             {cards.length}
           </span>
           {list.isArchived && (
             <span className="bg-amber-100 text-amber-700 text-[10px] font-black uppercase px-2 py-0.5 rounded-full border border-amber-200">
               Archived
             </span>
           )}
        </div>
        <div className="flex items-center gap-1.5 relative">
          <button 
            onClick={() => setIsAddingCard(true)}
            className="p-1.5 rounded-lg text-[#1F2937]/40 hover:text-[#6A3DE8] hover:bg-white transition-all"
            title="Add card"
          >
            <Plus size={16} />
          </button>

          <button 
            onClick={() => setShowMenu(!showMenu)}
            className={`p-1.5 rounded-lg transition-all ${showMenu ? 'bg-[#6A3DE8] text-white' : 'text-[#1F2937]/40 hover:text-[#6A3DE8] hover:bg-white'}`}
          >
            <MoreHorizontal size={16} />
          </button>

          <AnimatePresence>
            {showMenu && (
              <motion.div
                ref={menuRef}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-2 top-full w-32 bg-white border border-[#E5E7EB] rounded-xl shadow-xl z-50 overflow-hidden"
              >
                <button onClick={handleArchiveList} className="w-full text-left px-3 py-2.5 text-xs font-bold text-[#1F2937]/60 hover:bg-gray-50 flex items-center gap-2 transition-colors">
                  <Archive size={12} />
                  Archive List
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 min-h-[10px] space-y-3">
        <SortableContext items={cardIds} strategy={verticalListSortingStrategy}>
          <AnimatePresence initial={false}>
            {cards.map((card) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ 
                  opacity: 0, 
                  scale: 0.9, 
                  transition: { duration: 0.2 } 
                }}
              >
                <CardItem card={card} />
              </motion.div>
            ))}
          </AnimatePresence>
        </SortableContext>
      </div>

      <div className="p-3">
        {isAddingCard ? (
          <div className="space-y-2">
            <textarea
              autoFocus
              className="w-full bg-[#F6F7FB] border-2 border-[#6A3DE8] rounded-xl p-3 text-sm focus:outline-none min-h-[80px] shadow-sm"
              placeholder="Enter a title for this card..."
              value={newCardTitle}
              onChange={(e) => setNewCardTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleAddCard();
                }
              }}
            />
            <div className="flex items-center gap-2">
              <button 
                onClick={handleAddCard}
                className="bg-[#6A3DE8] text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-[#7C3AED] transition-all"
              >
                Add Card
              </button>
              <button 
                onClick={() => setIsAddingCard(false)}
                className="p-1.5 hover:bg-[#F6F7FB] rounded-lg text-[#1F2937]/40 transition-all font-bold text-xs"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button 
            onClick={() => setIsAddingCard(true)}
            className="w-full flex items-center gap-2 p-2.5 text-sm font-bold text-[#1F2937]/60 hover:text-[#6A3DE8] hover:bg-white rounded-xl transition-all group"
          >
            <Plus size={18} className="text-[#6A3DE8] group-hover:scale-110 transition-transform" />
            Add a card
          </button>
        )}
      </div>
    </div>
  );
};
