import React from 'react';
import { User, Settings, LogOut, Activity, ExternalLink, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserStore } from '@/stores/useUserStore';
import { useOutsideClick } from '@/hooks/useOutsideClick';

interface UserMenuProps {
 onClose: () => void;
}

export const UserMenu = ({ onClose }: UserMenuProps) => {
 const { currentUser } = useUserStore();
 const menuRef = React.useRef<HTMLDivElement>(null);

 useOutsideClick(menuRef, onClose);

 const menuItems = [
 { icon: <User size={16} />, label: 'Profile', description: 'Your personal info' },
 { icon: <Settings size={16} />, label: 'Settings', description: 'Preferences & privacy' },
 { icon: <Activity size={16} />, label: 'Activity', description: 'Your recent actions' },
 ];

 const secondaryItems = [
 { icon: <HelpCircle size={16} />, label: 'Help & Support' },
 { icon: <ExternalLink size={16} />, label: 'Try Enterprise' },
 ];

 return (
 <motion.div
 ref={menuRef}
 initial={{ opacity: 0, scale: 0.95, y: 10 }}
 animate={{ opacity: 1, scale: 1, y: 0 }}
 exit={{ opacity: 0, scale: 0.95, y: 10 }}
 className="absolute right-0 mt-3 w-72 bg-white dark:bg-[#1E293B] rounded-2xl shadow-2xl border border-gray-100 dark:border-[#1E293B] overflow-hidden z-[60]"
 >
 <div className="p-4 bg-gray-50/80 border-b border-gray-100 dark:border-[#1E293B]">
 <div className="flex items-center gap-3">
 <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#8E2DE2] to-[#4A00E0] p-[2px]">
 <div className="w-full h-full rounded-full bg-white dark:bg-[#1E293B] flex items-center justify-center overflow-hidden">
 {currentUser?.avatar ? (
 <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
 ) : (
 <User className="text-[#6A3DE8]" size={24} />
 )}
 </div>
 </div>
 <div>
 <h4 className="font-bold text-gray-900 dark:text-gray-50 leading-tight">{currentUser?.name || 'Guest User'}</h4>
 <p className="text-xs text-gray-500 dark:text-gray-400 font-medium truncate max-w-[160px]">{currentUser?.email || 'guest@fixnest.com'}</p>
 </div>
 </div>
 </div>

 <div className="py-2">
 {menuItems.map((item, idx) => (
 <button
 key={idx}
 className="w-full px-4 py-3 hover:bg-gray-50 flex items-start gap-3 transition-colors text-left group"
 onClick={onClose}
 >
 <div className="mt-0.5 text-gray-400 group-hover:text-[#6A3DE8] transition-colors">
 {item.icon}
 </div>
 <div>
 <div className="text-sm font-bold text-gray-700 dark:text-gray-300 group-hover:text-gray-900">{item.label}</div>
 <div className="text-xs text-gray-400 font-medium">{item.description}</div>
 </div>
 </button>
 ))}
 </div>

 <div className="h-px bg-gray-100 mx-4"></div>

 <div className="py-2">
 {secondaryItems.map((item, idx) => (
 <button
 key={idx}
 className="w-full px-4 py-2.5 hover:bg-gray-50 flex items-center gap-3 transition-colors text-left group"
 onClick={onClose}
 >
 <div className="text-gray-400 group-hover:text-gray-600">
 {item.icon}
 </div>
 <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 group-hover:text-gray-800">{item.label}</div>
 </button>
 ))}
 </div>

 <div className="bg-gray-50 dark:bg-[#1A2333] p-2 border-t border-gray-100 dark:border-[#1E293B]">
 <button
 className="w-full px-3 py-2 hover:bg-red-50 text-red-500 hover:text-red-600 flex items-center gap-3 transition-all rounded-lg group"
 onClick={onClose}
 >
 <LogOut size={16} className="group-hover:translate-x-0.5 transition-transform" />
 <span className="text-sm font-bold uppercase tracking-wider">Log Out</span>
 </button>
 </div>
 </motion.div>
 );
};
