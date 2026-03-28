import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore } from '@/stores/useUIStore';
import { useBoardStore } from '@/stores/useBoardStore';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const PRESET_GRADIENTS = [
 { name: 'Signature', value: 'var(--brand-gradient)', color: '#6A3DE8' },
 { name: 'Soft Lavender', value: 'linear-gradient(to right, #E0C3FC, #8EC5FC)', color: '#E0C3FC' },
 { name: 'Fresh Mint', value: 'linear-gradient(to right, #96fbc4, #f9f586)', color: '#96fbc4' },
 { name: 'Sunny Day', value: 'linear-gradient(to right, #f6d365, #fda085)', color: '#f6d365' },
];

export const CreateBoardModal = () => {
 const { isCreateBoardModalOpen, setCreateBoardModalOpen } = useUIStore();
 const { addBoard } = useBoardStore();
 const [title, setTitle] = useState('');
 const [background, setBackground] = useState(PRESET_GRADIENTS[0].value);
 const [color, setColor] = useState(PRESET_GRADIENTS[0].color);
 const router = useRouter();

 if (!isCreateBoardModalOpen) return null;

 const handleCreate = async () => {
 if (!title.trim()) {
 toast.error('Board title is required');
 return;
 }

 try {
 const newBoard = await addBoard({
 title: title.trim(),
 background,
 color,
 isStarred: false,
 workspaceId: 'w1',
 memberIds: [],
 });
 setCreateBoardModalOpen(false);
 setTitle('');
 toast.success('Board created successfully!');
 router.push(`/board/${newBoard.id}`);
 } catch (error) {
 toast.error('Failed to create board');
 }
 };

 return (
 <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
 <motion.div 
 initial={{ opacity: 0, scale: 0.9, y: 20 }}
 animate={{ opacity: 1, scale: 1, y: 0 }}
 exit={{ opacity: 0, scale: 0.9, y: 20 }}
 className="bg-white dark:bg-[#1E293B] w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden border border-white/20"
 >
 <div className="p-5 border-b flex items-center justify-between bg-gray-50/50">
 <h2 className="font-bold text-xl text-gray-800 dark:text-gray-200 tracking-tight">Create Board</h2>
 <button 
 onClick={() => setCreateBoardModalOpen(false)} 
 className="p-1.5 hover:bg-gray-200 rounded-full transition-colors text-gray-400 hover:text-gray-600"
 >
 <X size={20} />
 </button>
 </div>
 
 <div className="p-6 space-y-6">
 <div className="space-y-2">
 <label className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Board Title</label>
 <input 
 autoFocus
 type="text" 
 value={title}
 onChange={(e) => setTitle(e.target.value)}
 onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
 placeholder="e.g. Marketing Plan 2024"
 className="w-full px-4 py-3 border-2 border-gray-100 dark:border-[#1E293B] rounded-xl focus:ring-4 focus:ring-[#6A3DE8]/10 focus:border-[#6A3DE8] outline-none transition-all text-gray-800 dark:text-gray-200 font-medium placeholder:text-gray-300"
 />
 </div>

 <div className="space-y-2">
 <label className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Background</label>
 <div className="grid grid-cols-4 gap-3">
 {PRESET_GRADIENTS.map((p) => (
 <button
 key={p.name}
 onClick={() => { setBackground(p.value); setColor(p.color); }}
 className="h-12 rounded-lg border-2 transition-all relative group hover:scale-105 active:scale-95 overflow-hidden"
 style={{ 
 background: p.value, 
 borderColor: background === p.value ? '#6A3DE8' : 'transparent',
 boxShadow: background === p.value ? '0 0 15px rgba(106, 61, 232, 0.3)' : 'none'
 }}
 >
 {background === p.value && (
 <motion.div 
 layoutId="check"
 className="absolute inset-0 flex items-center justify-center bg-black/10"
 >
 <Check size={18} className="text-white drop-shadow-md" strokeWidth={3} />
 </motion.div>
 )}
 </button>
 ))}
 </div>
 </div>
 </div>

 <div className="p-5 bg-gray-50 dark:bg-[#1A2333] flex gap-3">
 <button 
 onClick={() => setCreateBoardModalOpen(false)}
 className="flex-1 py-3 font-bold text-gray-500 dark:text-gray-400 hover:text-gray-700 hover:bg-gray-200 rounded-xl transition-all"
 >
 Cancel
 </button>
 <button 
 onClick={handleCreate}
 disabled={!title.trim()}
 className={`flex-1 py-3 font-bold text-white rounded-xl transition-all shadow-lg active:scale-95 ${
 title.trim() 
 ? 'bg-[#6A3DE8] hover:bg-[#5b35c9] shadow-[#6A3DE8]/20' 
 : 'bg-gray-300 cursor-not-allowed'
 }`}
 >
 Create
 </button>
 </div>
 </motion.div>
 </div>
 );
};
