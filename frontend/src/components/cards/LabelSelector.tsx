'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { mockLabels } from '@/mock-data/labels';
import { Check, X, Tag } from 'lucide-react';
import { useCardStore } from '@/stores/useCardStore';

interface LabelSelectorProps {
  cardId: string;
  selectedLabelIds: string[];
  onClose: () => void;
}

export const LabelSelector = ({ cardId, selectedLabelIds, onClose }: LabelSelectorProps) => {
  const { toggleLabel } = useCardStore();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -10 }}
      className="absolute top-full left-0 mt-1 w-72 bg-white rounded-2xl shadow-2xl border border-[#E5E7EB] z-[200] overflow-hidden"
    >
      <div className="flex items-center justify-between p-4 border-b border-[#E5E7EB]">
        <h3 className="text-sm font-black text-[#1F2937]">Labels</h3>
        <button onClick={onClose} className="p-1 hover:bg-[#F6F7FB] rounded-full text-[#1F2937]/40 hover:text-[#1F2937]">
          <X size={16} />
        </button>
      </div>
      
      <div className="p-2 max-h-[300px] overflow-y-auto">
        <div className="text-[10px] font-bold text-[#1F2937]/40 uppercase tracking-widest px-3 mb-2">Labels</div>
        <div className="space-y-2">
          {mockLabels.map(label => {
            const isSelected = selectedLabelIds.includes(label.id);
            return (
              <button
                key={label.id}
                onClick={() => toggleLabel(cardId, label.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border transition-all group ${
                  isSelected ? 'border-[#6A3DE8] bg-[#6A3DE8]/5' : 'border-[#E5E7EB] hover:border-[#6A3DE8]/30 hover:bg-[#F6F7FB]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded" 
                    style={{ backgroundColor: label.color }}
                  />
                  <span className="text-sm font-semibold text-[#1F2937]">{label.title}</span>
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
