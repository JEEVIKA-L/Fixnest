import React from 'react';
import Link from 'next/link';
import { Star, MoreHorizontal, Users, GripVertical } from 'lucide-react';
import { Board } from '../../types';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useBoardStore } from '../../stores/useBoardStore';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';

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

  // 3D Tilt Effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);
  
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    background: board.background,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 100 : 1,
    rotateX,
    rotateY,
    transformStyle: "preserve-3d" as const,
  };

 return (
    <motion.div 
      ref={setNodeRef} 
      style={style}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`group relative h-36 w-full rounded-2xl p-5 flex flex-col justify-between overflow-hidden cursor-pointer transition-all border border-white/20 shadow-lg shadow-[#D94F9D]/5`}
    >
      <Link href={`/board/${board.id}`} className="absolute inset-0 z-0" onClick={(e) => showMenu && e.preventDefault()}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent group-hover:bg-black/10 transition-colors"></div>
      </Link>
 
 <div className="relative z-10 flex justify-between items-start pointer-events-none" style={{ transform: "translateZ(30px)" }}>
 <h3 className="text-white font-black text-xl leading-tight drop-shadow-xl tracking-tight">
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

  <div className="relative z-10 flex items-center justify-between pointer-events-none" style={{ transform: "translateZ(20px)" }}>
  <div className="flex items-center gap-1.5 text-white/90 text-[11px] font-black uppercase tracking-widest bg-black/10 backdrop-blur-md px-2 py-1 rounded-lg">
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
 className="absolute bottom-full right-0 mb-2 w-32 bg-white dark:bg-[#1E293B] rounded-lg shadow-xl z-50 overflow-hidden border border-gray-100 dark:border-[#1E293B]"
 >
 <button onClick={handleArchive} className="w-full text-left px-3 py-2.5 text-xs font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-50">
 Archive
 </button>
 </motion.div>
 </>
 )}
 </AnimatePresence>
 </div>
 </div>
    </motion.div>
 );
};
