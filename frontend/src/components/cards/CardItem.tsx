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
import { motion } from 'framer-motion';

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

  // Derive highest-priority label color from card's labels
  const priorityLabelId = PRIORITY_LABEL_IDS.find(id => card.labelIds?.includes(id));
  const priorityLabel = priorityLabelId ? mockLabels.find(l => l.id === priorityLabelId) : null;

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    ...(priorityLabel
      ? {
          borderLeftColor: priorityLabel.color,
          borderLeftWidth: '4px',
          backgroundColor: '#FFFFFF', // Maintain solid white background
        }
      : {}),
  };

  const cardMembers = mockUsers.filter(u => card.memberIds?.includes(u.id));
  const coverImage = card.attachments?.find(at => at.id === card.coverImageId);

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={(e) => {
        if (transform) return;
        openCardModal(card.id);
      }}
      whileHover={{ 
        y: -4, 
        scale: 1.02,
        boxShadow: "0 20px 25px -5px rgba(106, 61, 232, 0.1), 0 10px 10px -5px rgba(106, 61, 232, 0.04)"
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="bg-white rounded-xl border border-[#E5E7EB] hover:border-[#6A3DE8] transition-all group cursor-grab active:cursor-grabbing mb-3 overflow-hidden shadow-sm flex flex-col"
    >
      {coverImage && (
        <div className="w-full h-32 overflow-hidden bg-[#F1F2F4]">
          <img src={coverImage.url} alt="Cover" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        </div>
      )}
      
      <div className="p-3">
        {card.labelIds?.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {card.labelIds.map((labelId) => (
              <LabelTag key={labelId} text={labelId} />
            ))}
          </div>
        )}
        
        <h4 className="text-sm font-bold text-[#1F2937] group-hover:text-[#6A3DE8] transition-colors leading-tight mb-3">
          {card.title}
        </h4>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DateAlert card={card} showTime={false} className="px-1.5 py-0.5" />
            
            {((card.commentIds?.length || 0) > 0 || (card.attachments?.length || 0) > 0) && (
              <div className="flex items-center gap-2 text-[#1F2937]/30">
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
