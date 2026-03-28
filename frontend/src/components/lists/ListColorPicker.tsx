'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

interface ListColorPickerProps {
 currentColor?: string;
 onSelect: (color: string) => void;
 onClose: () => void;
}

const PRESET_COLORS = [
 // Vibrant Colors
 { name: 'Emerald', value: '#10B981' },
 { name: 'Amber', value: '#F59E0B' },
 { name: 'Orange', value: '#F97316' },
 { name: 'Rose', value: '#F43F5E' },
 { name: 'Violet', value: '#8B5CF6' },
 { name: 'Blue', value: '#3B82F6' },
 { name: 'Sky', value: '#0EA5E9' },
 { name: 'Lime', value: '#84CC16' },
 { name: 'Pink', value: '#EC4899' },
 { name: 'Slate', value: '#64748B' },
 // Light Colors
 { name: 'Soft Purple', value: '#F3E8FF' },
 { name: 'Soft Blue', value: '#E0F2FE' },
 { name: 'Soft Green', value: '#DCFCE7' },
 { name: 'Soft Yellow', value: '#FEF9C3' },
 { name: 'Soft Orange', value: '#FFEDD5' },
 { name: 'Soft Red', value: '#FEE2E2' },
 { name: 'Soft Pink', value: '#FCE7F3' },
 { name: 'Soft Teal', value: '#CCFBFE' },
 { name: 'Soft Indigo', value: '#b7c5f0ff' },
 { name: 'Soft Slate', value: '#F1F5F9' },
];

export const ListColorPicker = ({ currentColor, onSelect, onClose }: ListColorPickerProps) => {
 return (
 <motion.div
 initial={{ opacity: 0, scale: 0.95, y: 10 }}
 animate={{ opacity: 1, scale: 1, y: 0 }}
 exit={{ opacity: 0, scale: 0.95, y: 10 }}
 className="absolute right-0 mt-2 top-full w-48 bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-[#334155] rounded-2xl shadow-2xl z-[60] overflow-hidden"
 >
 <div className="p-3 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
 <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">
 Change Color
 </h4>
 <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
 <X size={14} />
 </button>
 </div>
 <div className="p-3">
 <div className="grid grid-cols-5 gap-2">
 {PRESET_COLORS.map((color) => (
 <button
 key={color.name}
 onClick={() => {
 onSelect(color.value);
 onClose();
 }}
 className="w-6 h-6 rounded-md border border-gray-100 dark:border-[#1E293B] shadow-sm relative transition-transform hover:scale-110 active:scale-90 overflow-hidden flex items-center justify-center"
 style={{ backgroundColor: color.value || '#F1F2F4' }}
 title={color.name}
 >
 {(currentColor === color.value || (color.value === '' && !currentColor)) && (
 <div className="bg-white/40 rounded-full p-0.5">
 <Check size={10} className="text-[#1F2937] dark:text-gray-100" />
 </div>
 )}
 </button>
 ))}
 </div>
 </div>
 </motion.div>
 );
};
