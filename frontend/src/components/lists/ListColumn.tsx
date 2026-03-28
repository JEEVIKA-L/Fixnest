import React from 'react';
import { useSortable, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { List, Card } from '../../types';
import { CardItem } from '../cards/CardItem';
import { MoreHorizontal, Plus, Edit2, Archive, Palette } from 'lucide-react';
import { useListStore } from '../../stores/useListStore';
import { useCards } from '../../hooks/useCards';
import { useUserStore } from '@/stores/useUserStore';
import { motion, AnimatePresence } from 'framer-motion';
import { useOutsideClick } from '@/hooks/useOutsideClick';
import { ListColorPicker } from './ListColorPicker';
import { getContrastColor, getAccentColor } from '@/utils/colorUtils';

interface ListColumnProps {
 list: List;
 cards: Card[];
}

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
 const [showColorPicker, setShowColorPicker] = React.useState(false);
 const [isEditingTitle, setIsEditingTitle] = React.useState(false);
 const [title, setTitle] = React.useState(list.title);
 const menuRef = React.useRef<HTMLDivElement>(null);

 useOutsideClick(menuRef, () => {
 setShowMenu(false);
 setShowColorPicker(false);
 }, showMenu || showColorPicker);

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

 const handleColorSelect = (color: string) => {
 updateList(list.id, { color });
 };

 const contrastColor = getContrastColor(list.color);
 const isDark = contrastColor === '#FFFFFF';

 return (
    <motion.div
      ref={setNodeRef}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      style={{
        ...style,
        background: list.color ? `${list.color}66` : 'rgba(255, 255, 255, 0.4)',
      }}
      className="w-[300px] flex-shrink-0 flex flex-col max-h-full glass-panel rounded-2xl shadow-sm transition-all duration-500 overflow-hidden border-0"
    >
 <div
 {...attributes}
 {...listeners}
 className="p-3 flex items-center justify-between cursor-grab active:cursor-grabbing"
 >
 <div className="flex items-center gap-2 flex-1 min-w-0 pr-2">
 {isEditingTitle ? (
 <input
 autoFocus
 className={`font-semibold text-[14px] border-b focus:outline-none w-full px-1 bg-transparent ${
 isDark
 ? 'text-white border-white/40 placeholder:text-white/40'
 : 'text-[hsl(var(--foreground))] border-[#6A3DE8] placeholder:text-[hsl(var(--foreground))]/40'
 }`}
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
  className={`flex items-center gap-1.5 cursor-pointer px-1 rounded transition-colors truncate group/title hover:bg-black/5`}
  >
  <h3 className={`font-black text-[15px] tracking-tight truncate text-[#2D2D2D]`}>{list.title}</h3>
  <Edit2 size={12} className={`text-[#D94F9D] opacity-0 group-hover/title:opacity-100 transition-opacity flex-shrink-0`} />
  </div>
  )}
  <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black border flex-shrink-0 bg-white/60 text-[#D94F9D] border-[#E6D6F5] shadow-sm`}>
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
  onClick={(e) => {
  e.stopPropagation();
  setIsAddingCard(true);
  }}
  onPointerDown={(e) => e.stopPropagation()}
  className={`p-1.5 rounded-lg transition-all text-[#6B6B6B] hover:text-[#D94F9D] hover:bg-white/60`}
  title="Add card"
  >
  <Plus size={18} />
  </button>

  <button 
  onClick={(e) => {
  e.stopPropagation();
  setShowMenu(!showMenu);
  }}
  onPointerDown={(e) => e.stopPropagation()}
  className={`p-1.5 rounded-lg transition-all ${
  showMenu 
  ? 'bg-[#D94F9D] text-white shadow-lg' 
  : 'text-[#6B6B6B] hover:text-[#D94F9D] hover:bg-white/60'
  }`}
  >
  <MoreHorizontal size={18} />
  </button>

 <AnimatePresence>
 {showMenu && (
 <motion.div
 ref={menuRef}
 initial={{ opacity: 0, y: 10, scale: 0.95 }}
 animate={{ opacity: 1, y: 0, scale: 1 }}
 exit={{ opacity: 0, y: 10, scale: 0.95 }}
 className="absolute right-0 mt-2 top-full w-36 bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-[#334155] rounded-xl shadow-xl z-50 overflow-hidden"
 >
 <button 
 onClick={(e) => {
 e.stopPropagation();
 handleArchiveList();
 }}
 className="w-full text-left px-3 py-2.5 text-xs font-bold text-[#1F2937]/60 hover:bg-gray-50 flex items-center gap-2 transition-colors"
 >
 <Archive size={12} />
 Archive List
 </button>
 <button 
 onClick={(e) => {
 e.stopPropagation();
 setShowColorPicker(!showColorPicker);
 setShowMenu(false);
 }} 
 className={`w-full text-left px-3 py-2.5 text-xs font-bold transition-colors flex items-center gap-2 text-[#1F2937]/60 hover:bg-gray-50`}
 >
 <Palette size={12} />
 Change Color
 </button>
 </motion.div>
 )}
 </AnimatePresence>

 <AnimatePresence>
 {showColorPicker && (
 <ListColorPicker
 currentColor={list.color}
 onSelect={handleColorSelect}
 onClose={() => setShowColorPicker(false)}
 />
 )}
 </AnimatePresence>
 </div>
 </div>

 <div className="flex-1 overflow-y-auto px-2 min-h-[10px] space-y-2">
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
 className={`w-full border-2 rounded-xl p-3 text-sm focus:outline-none min-h-[80px] shadow-sm ${
 isDark 
 ? 'bg-white/90 border-white/20 text-[#1F2937] dark:text-gray-100 placeholder:text-gray-400' 
 : 'bg-[#F6F7FB] dark:bg-[#0F172A] border-[#6A3DE8] text-[#1F2937] dark:text-gray-100 placeholder:text-gray-400'
 }`}
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
 className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
 isDark 
 ? 'bg-white dark:bg-[#1E293B] text-[#6A3DE8] hover:bg-gray-100' 
 : 'bg-[#6A3DE8] text-white hover:bg-[#7C3AED]'
 }`}
 >
 Add Card
 </button>
 <button 
 onClick={() => setIsAddingCard(false)}
 className={`p-1.5 rounded-lg transition-all font-bold text-xs ${
 isDark ? 'text-white/60 hover:text-white hover:bg-white/20' : 'text-[#1F2937]/40 hover:bg-[#F6F7FB]'
 }`}
 >
 Cancel
 </button>
 </div>
 </div>
 ) : (
 <button 
 onClick={() => setIsAddingCard(true)}
 className={`w-full flex items-center gap-2 p-2.5 text-sm font-bold rounded-xl transition-all group ${
 isDark 
 ? 'text-white/80 hover:text-white hover:bg-white/20' 
 : 'text-[#1F2937]/70 hover:text-[#6A3DE8] hover:bg-white/80'
 }`}
 >
 <Plus size={18} className={`${isDark ? 'text-white' : 'text-[#6A3DE8]'} group-hover:scale-110 transition-transform`} />
 Add a card
 </button>
 )}
 </div>
    </motion.div>
  );
};
