import React, { useRef } from 'react';
import { useNotificationStore } from '@/stores/useNotificationStore';
import { useOutsideClick } from '@/hooks/useOutsideClick';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Bell, BellOff, MessageSquare, Move, UserPlus, Clock } from 'lucide-react';
import Link from 'next/link';

const formatRelativeTime = (dateString: string) => {
 const now = new Date();
 const date = new Date(dateString);
 const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
 
 if (diffInSeconds < 60) return 'Just now';
 if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
 if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
 return `${Math.floor(diffInSeconds / 86400)}d ago`;
};

interface NotificationDropdownProps {
 onClose: () => void;
}

export const NotificationDropdown = ({ onClose }: NotificationDropdownProps) => {
 const { notifications, markAsRead, markAllAsRead, isLoading } = useNotificationStore();
 const dropdownRef = useRef<HTMLDivElement>(null);
 
 useOutsideClick(dropdownRef, onClose);

 const getIcon = (type: string) => {
 switch (type) {
 case 'comment_added': return <MessageSquare size={14} className="text-blue-500" />;
 case 'card_moved': return <Move size={14} className="text-purple-500" />;
 case 'assignment': return <UserPlus size={14} className="text-green-500" />;
 case 'due_date': return <Clock size={14} className="text-red-500" />;
 default: return <Bell size={14} className="text-gray-500 dark:text-gray-400" />;
 }
 };

 const unreadCount = notifications.filter(n => !n.isRead).length;

 return (
 <motion.div
 ref={dropdownRef}
 initial={{ opacity: 0, y: 10, scale: 0.95 }}
 animate={{ opacity: 1, y: 0, scale: 1 }}
 exit={{ opacity: 0, y: 10, scale: 0.95 }}
 className="absolute right-0 mt-2 top-full w-80 bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-[#334155] rounded-2xl shadow-2xl z-[100] overflow-hidden flex flex-col max-h-[80vh]"
 >
 <div className="p-4 border-b border-gray-100 dark:border-[#1E293B] flex items-center justify-between bg-gray-50/50">
 <h3 className="text-sm font-bold text-[#1F2937] dark:text-gray-100 flex items-center gap-2">
 Notifications
 {unreadCount > 0 && (
 <span className="bg-[#6A3DE8] text-white text-[10px] px-1.5 py-0.5 rounded-full">
 {unreadCount}
 </span>
 )}
 </h3>
 {unreadCount > 0 && (
 <button 
 onClick={() => markAllAsRead('u1')} // Mocking user u1
 className="text-[10px] font-bold text-[#6A3DE8] hover:underline uppercase tracking-wider"
 >
 Mark all read
 </button>
 )}
 </div>

 <div className="overflow-y-auto flex-1 h-full min-h-0">
 {notifications.length === 0 ? (
 <div className="p-10 flex flex-col items-center justify-center text-center opacity-40">
 <BellOff size={32} className="mb-2" />
 <p className="text-xs font-bold">No notifications yet</p>
 </div>
 ) : (
 <div className="divide-y divide-gray-50">
 {notifications.map((n) => (
 <div 
 key={n.id}
 className={`p-4 hover:bg-gray-50 transition-colors relative group ${!n.isRead ? 'bg-[#6A3DE8]/[0.02]' : ''}`}
 >
 <div className="flex gap-3">
 <div className="mt-1 flex-shrink-0">
 {getIcon(n.type)}
 </div>
 <div className="flex-1 min-w-0">
 <Link 
 href={n.link || '#'} 
 onClick={onClose}
 className="block"
 >
 <p className="text-xs font-bold text-[#1F2937] dark:text-gray-100 leading-tight mb-1">
 {n.title}
 </p>
 <p className="text-[11px] text-[#1F2937]/70 leading-normal line-clamp-2">
 {n.message}
 </p>
 </Link>
 <p className="text-[9px] text-[#1F2937]/40 font-bold mt-2 uppercase tracking-tight">
 {formatRelativeTime(n.createdAt)}
 </p>
 </div>
 {!n.isRead && (
 <button 
 onClick={(e) => {
 e.stopPropagation();
 markAsRead(n.id);
 }}
 className="w-2 h-2 rounded-full bg-[#6A3DE8] mt-1.5 opacity-100 group-hover:opacity-0 transition-opacity"
 ></button>
 )}
 <button 
 onClick={() => markAsRead(n.id)}
 className="absolute top-4 right-4 text-[#6A3DE8] opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110 active:scale-95"
 >
 <Check size={14} />
 </button>
 </div>
 </div>
 ))}
 </div>
 )}
 </div>

 <div className="p-3 bg-gray-50 dark:bg-[#1A2333] border-t border-gray-100 dark:border-[#1E293B] flex justify-center">
 <button className="text-[10px] font-black uppercase tracking-widest text-[#1F2937]/40 hover:text-[#6A3DE8] transition-colors">
 View all activity
 </button>
 </div>
 </motion.div>
 );
};
