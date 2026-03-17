import React, { useState, useRef } from 'react';
import { Palette, Check, Hash, Plus, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBoardStore } from '@/stores/useBoardStore';
import { useOutsideClick } from '@/hooks/useOutsideClick';
import { toast } from 'sonner';

interface BackgroundDropdownProps {
  onClose: () => void;
}

const PRESET_GRADIENTS = [
  { name: 'FixNest Purple', value: 'linear-gradient(to right, #8E2DE2, #4A00E0)', color: '#8E2DE2' },
  { name: 'Sky Blue', value: 'linear-gradient(to right, #00c6ff, #0072ff)', color: '#00c6ff' },
  { name: 'Soft Lavender', value: 'linear-gradient(to right, #E0C3FC, #8EC5FC)', color: '#E0C3FC' },
  { name: 'Fresh Mint', value: 'linear-gradient(to right, #96fbc4, #f9f586)', color: '#96fbc4' },
  { name: 'Sunny Day', value: 'linear-gradient(to right, #f6d365, #fda085)', color: '#f6d365' },
  { name: 'Pink Rose', value: 'linear-gradient(to right, #f953c6, #b91d73)', color: '#f953c6' },
  { name: 'Vibrant Amethyst', value: 'linear-gradient(to right, #6a11cb, #2575fc)', color: '#6a11cb' },
  { name: 'Midnight Green', value: 'linear-gradient(to right, #11998e, #38ef7d)', color: '#11998e' },
];

const PRESET_COLORS = [
  { name: 'Snow', value: '#F8FAFC' },
  { name: 'Pastel Blue', value: '#E0F2FE' },
  { name: 'Pastel Rose', value: '#FFE4E6' },
  { name: 'Pastel Mint', value: '#F0FDF4' },
  { name: 'Slate', value: '#1E293B' },
  { name: 'Emerald', value: '#065F46' },
  { name: 'Indigo', value: '#3730A3' },
];

export const BackgroundDropdown = ({ onClose }: BackgroundDropdownProps) => {
  const { activeBoard, updateBoard } = useBoardStore();
  const [customHex, setCustomHex] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  useOutsideClick(dropdownRef, onClose);

  const handleApplyBackground = async (background: string, color?: string) => {
    if (!activeBoard) return;
    
    try {
      await updateBoard(activeBoard.id, { 
        background, 
        color: color || background 
      });
      toast.success('Background updated');
    } catch (err) {
      toast.error('Failed to update background');
    }
  };

  const handleApplyCustom = () => {
    if (!/^#[0-9A-F]{6}$/i.test(customHex)) {
      toast.error('Please enter a valid hex color (e.g., #6A3DE8)');
      return;
    }
    handleApplyBackground(customHex);
    setCustomHex('');
  };

  if (!activeBoard) return null;

  return (
    <motion.div
      ref={dropdownRef}
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      className="absolute right-0 mt-2 top-full w-80 bg-white border border-[#E5E7EB] rounded-2xl shadow-2xl z-[100] overflow-hidden flex flex-col max-h-[85vh]"
    >
      <div className="p-4 border-b border-gray-50 bg-gray-50/30 flex items-center justify-between">
        <h3 className="text-xs font-black text-[#1F2937] uppercase tracking-widest flex items-center gap-2">
          <Palette size={14} className="text-[#6A3DE8]" />
          Background
        </h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <Plus size={18} className="rotate-45" />
        </button>
      </div>

      <div className="p-4 space-y-6 overflow-y-auto">
        {/* Gradients */}
        <div className="space-y-3">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1 flex items-center gap-2">
            <Sparkles size={12} />
            Premium Gradients
          </label>
          <div className="grid grid-cols-2 gap-2">
            {PRESET_GRADIENTS.map((grad) => (
              <button
                key={grad.value}
                onClick={() => handleApplyBackground(grad.value, grad.color)}
                className="group relative h-16 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all border-2 border-transparent hover:border-[#6A3DE8]/20"
                style={{ background: grad.value }}
              >
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  {activeBoard.background === grad.value && (
                    <div className="bg-white rounded-full p-1 shadow-lg">
                      <Check size={12} className="text-[#6A3DE8]" />
                    </div>
                  )}
                </div>
                <div className="absolute bottom-1 right-2 text-[8px] font-black text-white/60 uppercase">
                  {grad.name}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Solid Colors */}
        <div className="space-y-3">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1 flex items-center gap-2">
            <Palette size={12} />
            Solid Colors
          </label>
          <div className="flex flex-wrap gap-2">
            {PRESET_COLORS.map((color) => (
              <button
                key={color.value}
                onClick={() => handleApplyBackground(color.value)}
                className="w-10 h-10 rounded-lg border-2 border-white shadow-sm ring-1 ring-gray-100 flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
                style={{ backgroundColor: color.value }}
              >
                {activeBoard.background === color.value && (
                  <Check size={14} className="text-white" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Hex */}
        <div className="space-y-3 pb-2">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1 flex items-center gap-2">
            <Hash size={12} />
            Custom Hex Color
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input 
                className="w-full bg-[#F6F7FB] border border-transparent focus:border-[#6A3DE8] rounded-xl px-4 py-2 text-sm focus:outline-none transition-all pr-12 uppercase"
                placeholder="#6A3DE8"
                value={customHex}
                onChange={(e) => setCustomHex(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleApplyCustom()}
              />
              <div 
                className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border border-gray-200"
                style={{ backgroundColor: customHex || 'transparent' }}
              ></div>
            </div>
            <button 
              onClick={handleApplyCustom}
              className="bg-[#6A3DE8] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#7C3AED] transition-all whitespace-nowrap"
            >
              Apply
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 bg-gray-50/50 border-t border-gray-100 mt-auto">
        <button 
          onClick={onClose}
          className="w-full bg-[#1F2937] text-white py-2.5 rounded-xl text-xs font-black uppercase tracking-[0.15em] hover:bg-black transition-all shadow-lg shadow-black/10"
        >
          Done customizing
        </button>
      </div>
    </motion.div>
  );
};
