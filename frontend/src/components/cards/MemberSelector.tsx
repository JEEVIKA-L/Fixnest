'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { mockUsers } from '@/mock-data/users';
import { MemberAvatar } from '../common/MemberAvatar';
import { Check, X } from 'lucide-react';
import { useCardStore } from '@/stores/useCardStore';

interface MemberSelectorProps {
 cardId: string;
 selectedMemberIds: string[];
 onClose: () => void;
}

export const MemberSelector = ({ cardId, selectedMemberIds, onClose }: MemberSelectorProps) => {
 const { toggleMember } = useCardStore();

 return (
 <motion.div
 initial={{ opacity: 0, scale: 0.95, y: -10 }}
 animate={{ opacity: 1, scale: 1, y: 0 }}
 exit={{ opacity: 0, scale: 0.95, y: -10 }}
 className="absolute top-full left-0 mt-1 w-72 bg-white dark:bg-[#1E293B] rounded-2xl shadow-2xl border border-[#E5E7EB] dark:border-[#334155] z-[200] overflow-hidden"
 >
 <div className="flex items-center justify-between p-4 border-b border-[#E5E7EB] dark:border-[#334155]">
 <h3 className="text-sm font-black text-[#1F2937] dark:text-gray-100">Members</h3>
 <button onClick={onClose} className="p-1 hover:bg-[#F6F7FB] rounded-full text-[#1F2937]/40 hover:text-[#1F2937]">
 <X size={16} />
 </button>
 </div>
 
 <div className="p-2 max-h-[300px] overflow-y-auto">
 <div className="text-[10px] font-bold text-[#1F2937]/40 uppercase tracking-widest px-3 mb-2">Workspace Members</div>
 <div className="space-y-1">
 {mockUsers.map(user => {
 const isSelected = selectedMemberIds.includes(user.id);
 return (
 <button
 key={user.id}
 onClick={() => toggleMember(cardId, user.id)}
 className="w-full flex items-center justify-between px-3 py-2 rounded-xl border-2 border-transparent hover:bg-[#F6F7FB] hover:border-[#6A3DE8]/10 transition-all group"
 >
 <div className="flex items-center gap-3">
 <MemberAvatar name={user.name} src={user.avatar} size="sm" />
 <span className="text-sm font-semibold text-[#1F2937] dark:text-gray-100">{user.name}</span>
 </div>
 {isSelected && <Check size={16} className="text-[#6A3DE8]" />}
 </button>
 );
 })}
 </div>
 </div>
 </motion.div>
 );
};
