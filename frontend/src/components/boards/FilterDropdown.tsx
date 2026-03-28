import React, { useRef } from 'react';
import { Search, X, Users, Tag, UserCheck, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFilterStore } from '@/stores/useFilterStore';
import { mockUsers } from '@/mock-data/users';
import { mockLabels } from '@/mock-data/labels';
import { useOutsideClick } from '@/hooks/useOutsideClick';

interface FilterDropdownProps {
 onClose: () => void;
}

export const FilterDropdown = ({ onClose }: FilterDropdownProps) => {
 const { 
 searchText, 
 selectedMemberIds, 
 selectedLabelIds, 
 setSearchText, 
 toggleMember, 
 toggleLabel, 
 clearFilters,
 isActive
 } = useFilterStore();
 
 const dropdownRef = useRef<HTMLDivElement>(null);
 useOutsideClick(dropdownRef, onClose);

 return (
 <motion.div
 ref={dropdownRef}
 initial={{ opacity: 0, y: 10, scale: 0.95 }}
 animate={{ opacity: 1, y: 0, scale: 1 }}
 exit={{ opacity: 0, y: 10, scale: 0.95 }}
 className="absolute right-0 mt-2 top-full w-80 bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-[#334155] rounded-2xl shadow-2xl z-[100] overflow-hidden flex flex-col max-h-[80vh]"
 >
 <div className="p-4 border-b border-gray-50 bg-gray-50/30 flex items-center justify-between">
 <h3 className="text-xs font-black text-[#1F2937] dark:text-gray-100 uppercase tracking-widest">Filters</h3>
 {isActive() && (
 <button 
 onClick={clearFilters}
 className="text-[10px] font-bold text-[#6A3DE8] hover:underline"
 >
 Clear all
 </button>
 )}
 </div>

 <div className="p-4 space-y-6 overflow-y-auto">
 {/* Search */}
 <div className="space-y-2">
 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1 flex items-center gap-2">
 <Search size={12} />
 Search
 </label>
 <div className="relative">
 <input 
 autoFocus
 className="w-full bg-[#F6F7FB] dark:bg-[#0F172A] border border-transparent focus:border-[#6A3DE8] rounded-xl px-4 py-2 text-sm focus:outline-none transition-all pr-10"
 placeholder="Search cards or lists..."
 value={searchText}
 onChange={(e) => setSearchText(e.target.value)}
 />
 {searchText && (
 <button 
 onClick={() => setSearchText('')}
 className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
 >
 <X size={14} />
 </button>
 )}
 </div>
 </div>

 {/* Members */}
 <div className="space-y-3">
 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1 flex items-center gap-2">
 <Users size={12} />
 Members
 </label>
 <div className="flex flex-wrap gap-2">
 {mockUsers.map(user => {
 const isSelected = selectedMemberIds.includes(user.id);
 return (
 <button
 key={user.id}
 onClick={() => toggleMember(user.id)}
 className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border-2 transition-all ${
 isSelected 
 ? 'border-[#6A3DE8] bg-[#6A3DE8]/5 text-[#6A3DE8]' 
 : 'border-[#F3F4F6] bg-[#F3F4F6] text-gray-500 dark:text-gray-400 hover:border-gray-200'
 }`}
 >
 <img src={user.avatar} className="w-5 h-5 rounded-full object-cover" alt="" />
 <span className="text-xs font-bold">{user.name.split(' ')[0]}</span>
 {isSelected && <UserCheck size={12} />}
 </button>
 );
 })}
 </div>
 </div>

 {/* Labels */}
 <div className="space-y-3">
 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1 flex items-center gap-2">
 <Tag size={12} />
 Labels
 </label>
 <div className="grid grid-cols-2 gap-2">
 {mockLabels.map(label => {
 const isSelected = selectedLabelIds.includes(label.id);
 return (
 <button
 key={label.id}
 onClick={() => toggleLabel(label.id)}
 className={`flex items-center justify-between p-2 rounded-xl border-2 transition-all text-left ${
 isSelected 
 ? 'border-[#6A3DE8] bg-white dark:bg-[#1E293B] shadow-sm ring-1 ring-[#6A3DE8]/10' 
 : 'border-transparent bg-gray-50 dark:bg-[#1A2333] hover:bg-gray-100'
 }`}
 >
 <div className="flex items-center gap-2 truncate">
 <div className="w-2 h-2 rounded-full" style={{ backgroundColor: label.color }}></div>
 <span className="text-[11px] font-bold text-gray-700 dark:text-gray-300 truncate">{label.title}</span>
 </div>
 {isSelected && <CheckCircle2 size={12} className="text-[#6A3DE8] flex-shrink-0" />}
 </button>
 );
 })}
 </div>
 </div>
 </div>

 <div className="p-4 bg-gray-50/50 border-t border-gray-100 dark:border-[#1E293B] mt-auto">
 <button 
 onClick={onClose}
 className="w-full bg-[#1F2937] text-white py-2.5 rounded-xl text-xs font-black uppercase tracking-[0.15em] hover:bg-black transition-all shadow-lg shadow-black/10"
 >
 Done filtering
 </button>
 </div>
 </motion.div>
 );
};
