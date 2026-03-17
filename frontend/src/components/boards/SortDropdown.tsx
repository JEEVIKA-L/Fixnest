import React, { useRef } from 'react';
import { SortAsc, SortDesc, Calendar, Type, Hash, X, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSortStore, SortField, SortOrder } from '@/stores/useSortStore';
import { useOutsideClick } from '@/hooks/useOutsideClick';

interface SortDropdownProps {
  onClose: () => void;
}

export const SortDropdown = ({ onClose }: SortDropdownProps) => {
  const { field, order, setSort, resetSort } = useSortStore();
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  useOutsideClick(dropdownRef, onClose);

  const options: { label: string; field: SortField; icon: any }[] = [
    { label: 'Alphabetical', field: 'title', icon: Type },
    { label: 'Creation Date', field: 'createdAt', icon: Calendar },
    { label: 'Custom (Drag & Drop)', field: 'manual', icon: Hash },
  ];

  return (
    <motion.div
      ref={dropdownRef}
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      className="absolute right-0 mt-2 top-full w-64 bg-white border border-[#E5E7EB] rounded-2xl shadow-2xl z-[100] overflow-hidden flex flex-col"
    >
      <div className="p-4 border-b border-gray-50 bg-gray-50/30 flex items-center justify-between">
        <h3 className="text-xs font-black text-[#1F2937] uppercase tracking-widest">Sort Board</h3>
        {field !== 'manual' && (
          <button 
            onClick={resetSort}
            className="text-[10px] font-bold text-[#6A3DE8] hover:underline"
          >
            Reset
          </button>
        )}
      </div>

      <div className="p-2 space-y-1">
        {options.map((opt) => (
          <button
            key={opt.field}
            onClick={() => setSort(opt.field, opt.field === 'manual' ? 'asc' : order)}
            className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
              field === opt.field 
                ? 'bg-[#6A3DE8]/5 text-[#6A3DE8]' 
                : 'hover:bg-gray-50 text-gray-600'
            }`}
          >
            <div className="flex items-center gap-3">
              <opt.icon size={16} className={field === opt.field ? 'text-[#6A3DE8]' : 'text-gray-400'} />
              <span className="text-xs font-bold">{opt.label}</span>
            </div>
            {field === opt.field && <Check size={14} />}
          </button>
        ))}
      </div>

      {field !== 'manual' && (
        <div className="p-2 border-t border-gray-50 bg-gray-50/20">
          <div className="flex gap-1 p-1 bg-gray-100 rounded-xl">
            {(['asc', 'desc'] as SortOrder[]).map((ord) => (
              <button
                key={ord}
                onClick={() => setSort(field, ord)}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                  order === ord 
                    ? 'bg-white text-[#6A3DE8] shadow-sm' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {ord === 'asc' ? <SortAsc size={14} /> : <SortDesc size={14} />}
                {ord === 'asc' ? 'Ascending' : 'Descending'}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="p-4 bg-gray-50/50 border-t border-gray-100 mt-auto">
        <button 
          onClick={onClose}
          className="w-full bg-[#1F2937] text-white py-2.5 rounded-xl text-xs font-black uppercase tracking-[0.15em] hover:bg-black transition-all shadow-lg shadow-black/10"
        >
          Done
        </button>
      </div>
    </motion.div>
  );
};
