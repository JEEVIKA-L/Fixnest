import React from 'react';
import Link from 'next/link';
import { Star, MoreHorizontal, Users, GripVertical } from 'lucide-react';
import { Board } from '../../types';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useBoardStore } from '../../stores/useBoardStore';
import { motion, AnimatePresence } from 'framer-motion';

interface BoardCardProps {
  board: Board;
}

export const BoardCard = ({ board }: BoardCardProps) => {
  const { updateBoard, deleteBoard } = useBoardStore();
  const [showMenu, setShowMenu] = React.useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: board.id });

  const handleArchive = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    updateBoard(board.id, { isArchived: true });
    setShowMenu(false);
  };

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    background: board.background,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 100 : 1,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style}
      className={`group relative h-32 w-full rounded-xl p-4 flex flex-col justify-between overflow-hidden cursor-pointer transition-all ${!isDragging ? 'hover:shadow-lg hover:-translate-y-1' : ''}`}
    >
      <Link href={`/board/${board.id}`} className="absolute inset-0 z-0" onClick={(e) => showMenu && e.preventDefault()}>
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors"></div>
      </Link>
      
      <div className="relative z-10 flex justify-between items-start pointer-events-none">
        <h3 className="text-white font-bold text-lg leading-tight drop-shadow-md">
          {board.title}
        </h3>
        <div className="flex items-center gap-2 pointer-events-auto">
          {board.isArchived && (
            <span className="bg-white/20 backdrop-blur-md text-white border border-white/30 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">
              Archived
            </span>
          )}
          <button className="text-white/0 group-hover:text-white/80 hover:text-white transition-all">
            <Star size={18} />
          </button>
          <div 
            {...attributes} 
            {...listeners}
            className="text-white/20 group-hover:text-white/80 hover:text-white cursor-grab active:cursor-grabbing p-1 transition-all"
          >
            <GripVertical size={18} />
          </div>
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-1.5 text-white/90 text-[10px] font-bold uppercase tracking-wider">
          <Users size={12} />
          <span>{board.memberIds.length} Members</span>
        </div>
        <div className="relative pointer-events-auto">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setShowMenu(!showMenu);
            }}
            className="p-1 hover:bg-white/20 rounded-lg transition-all text-white bg-white/10"
          >
            <MoreHorizontal size={18} />
          </button>

          <AnimatePresence>
            {showMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setShowMenu(false); }}></div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="absolute bottom-full right-0 mb-2 w-32 bg-white rounded-lg shadow-xl z-50 overflow-hidden border border-gray-100"
                >
                  <button onClick={handleArchive} className="w-full text-left px-3 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-50">
                    Archive
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
