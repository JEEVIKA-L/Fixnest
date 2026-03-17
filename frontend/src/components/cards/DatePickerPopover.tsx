'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, AlertCircle } from 'lucide-react';
import { useCardStore } from '@/stores/useCardStore';

interface DatePickerPopoverProps {
  cardId: string;
  currentDate?: string;
  onClose: () => void;
}

export const DatePickerPopover = ({ cardId, currentDate, onClose }: DatePickerPopoverProps) => {
  const { updateCard } = useCardStore();
  const [date, setDate] = React.useState(currentDate ? currentDate.split('T')[0] : '');
  const [time, setTime] = React.useState(currentDate ? currentDate.split('T')[1]?.substring(0, 5) : '12:00');

  const handleSave = async () => {
    if (date) {
      const isoString = new Date(`${date}T${time}`).toISOString();
      await updateCard(cardId, { dueDate: isoString });
    } else {
      await updateCard(cardId, { dueDate: undefined });
    }
    onClose();
  };

  const handleRemove = async () => {
    await updateCard(cardId, { dueDate: undefined });
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -10 }}
      className="absolute top-full left-0 mt-1 w-72 bg-white rounded-2xl shadow-2xl border border-[#E5E7EB] z-[200] overflow-hidden"
    >
      <div className="flex items-center justify-between p-4 border-b border-[#E5E7EB]">
        <h3 className="text-sm font-black text-[#1F2937]">Dates</h3>
        <button onClick={onClose} className="p-1 hover:bg-[#F6F7FB] rounded-full text-[#1F2937]/40 hover:text-[#1F2937]">
          <X size={16} />
        </button>
      </div>
      
      <div className="p-6 space-y-6">
        <div>
          <label className="text-[10px] font-bold text-[#1F2937]/40 uppercase tracking-widest block mb-2">Due Date</label>
          <div className="relative">
            <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1F2937]/40" />
            <input 
              type="date" 
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#F6F7FB] border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:border-[#6A3DE8] transition-all"
            />
          </div>
        </div>

        <div>
          <label className="text-[10px] font-bold text-[#1F2937]/40 uppercase tracking-widest block mb-2">Time</label>
          <div className="relative">
            <Clock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1F2937]/40" />
            <input 
              type="time" 
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#F6F7FB] border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:border-[#6A3DE8] transition-all"
            />
          </div>
        </div>

        <div className="space-y-2">
          <button 
            onClick={handleSave}
            className="w-full bg-[#6A3DE8] text-white py-2 rounded-xl text-sm font-bold hover:bg-[#7C3AED] transition-all shadow-lg shadow-[#6A3DE8]/20"
          >
            Save Changes
          </button>
          <button 
            onClick={handleRemove}
            className="w-full bg-red-50 text-red-500 py-2 rounded-xl text-sm font-bold hover:bg-red-100 transition-all"
          >
            Remove Date
          </button>
        </div>
      </div>
    </motion.div>
  );
};
