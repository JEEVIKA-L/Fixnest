import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card } from '../../types';
import { LabelTag } from '../common/LabelTag';
import { MemberAvatar } from '../common/MemberAvatar';
import { Calendar, MessageSquare, Paperclip } from 'lucide-react';
import { mockUsers } from '../../mock-data/users';
import { mockLabels } from '../../mock-data/labels';
import { useUIStore } from '@/stores/useUIStore';
import { DateAlert } from './DateAlert';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';

interface CardItemProps {
 card: Card;
}

// Priority label IDs in descending order — only these affect card color
const PRIORITY_LABEL_IDS = ['l1', 'l2', 'l3'];

export const CardItem = ({ card }: CardItemProps) => {
 const { openCardModal } = useUIStore();
 const {
 attributes,
 listeners,
 setNodeRef,
 transform,
 transition,
 isDragging
 } = useSortable({
 id: card.id,
 data: {
 type: 'Card',
 card,
 },
 });

  // 3D Tilt Effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);
  
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

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

  // Derive highest-priority label color from card's labels
  const priorityLabelId = PRIORITY_LABEL_IDS.find(id => card.labelIds?.includes(id));
 const priorityLabel = priorityLabelId ? mockLabels.find(l => l.id === priorityLabelId) : null;

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    rotateX,
    rotateY,
    transformStyle: "preserve-3d",
    ...(priorityLabel
      ? {
          borderLeftColor: priorityLabel.color,
          borderLeftWidth: '4px',
          backgroundColor: 'white', 
        }
      : {
          backgroundColor: 'white',
        }),
  };

 const cardMembers = mockUsers.filter(u => card.memberIds?.includes(u.id));
 const coverImage = card.attachments?.find(at => at.id === card.coverImageId);

 return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={(e) => {
        if (transform) return;
        openCardModal(card.id);
      }}
      whileHover={{ 
        y: -4, 
        scale: 1.02,
        boxShadow: "0 20px 40px -10px rgba(184, 50, 128, 0.2), 0 10px 20px -5px rgba(217, 79, 157, 0.1)"
      }}
      whileTap={{ scale: 0.98 }}
      className="bg-white rounded-2xl border border-[#E6D6F5] hover:border-[#D94F9D] transition-all group cursor-grab active:cursor-grabbing mb-2.5 overflow-hidden shadow-sm flex flex-col"
    >
 {coverImage && (
 <div className="w-full h-32 overflow-hidden bg-[#F1F2F4]">
 <img src={coverImage.url} alt="Cover" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
 </div>
 )}
 
 <div className="p-2.5">
 {card.labelIds?.length > 0 && (
 <div className="flex flex-wrap gap-1 mb-2">
 {card.labelIds.map((labelId) => (
 <LabelTag key={labelId} text={labelId} />
 ))}
 </div>
 )}
 
      <h4 className="text-[14px] font-black text-[#2D2D2D] group-hover:text-[#D94F9D] transition-colors leading-snug mb-2.5">
        {card.title}
      </h4>

 <div className="flex items-center justify-between">
 <div className="flex items-center gap-2">
 <DateAlert card={card} showTime={false} className="px-1.5 py-0.5" />
 
 {((card.commentIds?.length || 0) > 0 || (card.attachments?.length || 0) > 0) && (
 <div className="flex items-center gap-2 text-[hsl(var(--muted-foreground))]">
 {(card.commentIds?.length || 0) > 0 && (
 <div className="flex items-center gap-0.5 text-[10px] font-bold">
 <MessageSquare size={12} />
 <span>{card.commentIds.length}</span>
 </div>
 )}
 {(card.attachments?.length || 0) > 0 && (
 <div className="flex items-center gap-0.5 text-[10px] font-bold">
 <Paperclip size={12} />
 <span>{card.attachments.length}</span>
 </div>
 )}
 </div>
 )}
 </div>

 <div className="flex -space-x-1.5 overflow-hidden">
 {cardMembers.map((member) => (
 <MemberAvatar key={member.id} name={member.name} src={member.avatar} size="xs" />
 ))}
 </div>
 </div>
 </div>
 </motion.div>
 );
};
