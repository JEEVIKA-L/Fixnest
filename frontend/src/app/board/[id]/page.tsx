'use client';

import React, { useEffect } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { BoardCanvas } from '@/components/boards/BoardCanvas';
import { useBoardStore } from '@/stores/useBoardStore';
import { useListStore } from '@/stores/useListStore';
import { useUIStore } from '@/stores/useUIStore';
import { useLists } from '@/hooks/useLists';
import { List } from '@/types';
import { Share2, MoreHorizontal, Plus, Search, Filter, Settings, Zap, Edit2, Columns, Star, Users, Palette, Bell } from 'lucide-react';
import { MemberAvatar } from '@/components/common/MemberAvatar';
import { mockUsers } from '@/mock-data/users';
import { CardModal } from '@/components/cards/CardModal';
import { useUserStore } from '@/stores/useUserStore';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useOutsideClick } from '@/hooks/useOutsideClick';
import { FilterDropdown } from '@/components/boards/FilterDropdown';
import { SortDropdown } from '@/components/boards/SortDropdown';
import { BackgroundDropdown } from '@/components/boards/BackgroundDropdown';
import { useFilterStore } from '@/stores/useFilterStore';
import { useSortStore } from '@/stores/useSortStore';
import { BoardNotifications } from '@/components/boards/BoardNotifications';
import { getContrastColor } from '@/utils/colorUtils';
import { useNotificationStore } from '@/stores/useNotificationStore';
import { NotificationDropdown } from '@/components/notifications/NotificationDropdown';

export default function BoardPage() {
 const { id } = useParams();
 const searchParams = useSearchParams();
 const router = useRouter();
 const cardIdParam = searchParams.get('cardId');
 const { openCardModal, activeCardId } = useUIStore();
 const { activeBoard, fetchBoardById, updateBoard, isLoading } = useBoardStore();
 const { lists, updateList } = useLists(id as string);
 const { fetchCurrentUser } = useUserStore();
 const [isEditingTitle, setIsEditingTitle] = React.useState(false);
 const [title, setTitle] = React.useState('');
 const [showMenu, setShowMenu] = React.useState(false);
 const [showFilters, setShowFilters] = React.useState(false);
 const [showSort, setShowSort] = React.useState(false);
 const [showBackground, setShowBackground] = React.useState(false);
 const menuRef = React.useRef<HTMLDivElement>(null);
 const { isActive: isFilterActive } = useFilterStore();
 const { isSorted } = useSortStore();
 const { notifications } = useNotificationStore();

 const effectiveColor = activeBoard?.color || (activeBoard?.background?.startsWith('#') ? activeBoard.background : undefined);
 const headerColor = (!activeBoard?.background || activeBoard?.background === 'var(--brand-gradient)') 
 ? '#FFFFFF' 
 : getContrastColor(effectiveColor);
 const isDarkHeader = headerColor === '#FFFFFF';

 const unreadCount = notifications.filter(n => !n.isRead).length;
 const [showNotifications, setShowNotifications] = React.useState(false);
 const searchInputRef = React.useRef<HTMLInputElement>(null);

 React.useEffect(() => {
 const handleKeyDown = (e: KeyboardEvent) => {
 if (e.key === '/' && document.activeElement?.tagName !== 'INPUT') {
 e.preventDefault();
 searchInputRef.current?.focus();
 }
 };
 window.addEventListener('keydown', handleKeyDown);
 return () => window.removeEventListener('keydown', handleKeyDown);
 }, []);

 useOutsideClick(menuRef, () => setShowMenu(false), showMenu);

 // Handle opening card from query param
 useEffect(() => {
 if (cardIdParam && activeCardId !== cardIdParam) {
 openCardModal(cardIdParam);
 }
 }, [cardIdParam, activeCardId, openCardModal]);

 // Handle clearing query param when modal closes
 useEffect(() => {
 if (!activeCardId && cardIdParam) {
 const params = new URLSearchParams(searchParams.toString());
 params.delete('cardId');
 const newQuery = params.toString();
 const newUrl = `${window.location.pathname}${newQuery ? `?${newQuery}` : ''}`;
 router.replace(newUrl);
 }
 }, [activeCardId, cardIdParam, searchParams, router]);

 useEffect(() => {
 if (id) {
 fetchBoardById(id as string);
 }
 fetchCurrentUser();
 }, [id, fetchBoardById, fetchCurrentUser]);

 useEffect(() => {
 if (activeBoard) {
 setTitle(activeBoard.title);
 }
 }, [activeBoard]);

 const handleTitleSave = () => {
 if (activeBoard && title.trim() && title !== activeBoard.title) {
 updateBoard(activeBoard.id, { title });
 }
 setIsEditingTitle(false);
 };

 const handleRestoreList = (listId: string) => {
 updateList(listId, { isArchived: false });
 toast.success('List restored');
 };

 const handleShare = () => {
 if (typeof window !== 'undefined') {
 const url = window.location.href;
 navigator.clipboard.writeText(url);
 toast.info('Board link copied to clipboard');
 }
 };

 if (isLoading || !activeBoard) {
 return (
 <div className="min-h-screen bg-[#F6F7FB] dark:bg-[#0F172A] flex items-center justify-center">
 <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6A3DE8]"></div>
 </div>
 );
 }

 return (
    <div className="h-screen flex flex-col overflow-hidden text-[#2D2D2D]">
 <Navbar />
 <BoardNotifications />
 
 <main className="pt-16 flex-1 flex flex-col min-h-0">
 {/* Board Header */}
 <header className="h-16 px-6 flex items-center justify-between bg-transparent flex-shrink-0 z-10">
 <div className="flex items-center gap-6">
 <div className="flex items-center gap-3">
 {isEditingTitle ? (
  <input
  autoFocus
  className="text-2xl font-black bg-white/20 border-b-2 border-[#D94F9D] focus:outline-none w-64 px-2 rounded-t-lg"
  style={{ color: '#2D2D2D' }}
 value={title}
 onChange={(e) => setTitle(e.target.value)}
 onBlur={handleTitleSave}
 onKeyDown={(e) => {
 if (e.key === 'Enter') handleTitleSave();
 if (e.key === 'Escape') {
 setTitle(activeBoard.title);
 setIsEditingTitle(false);
 }
 }}
 />
 ) : (
 <div 
 onClick={(e) => {
 e.stopPropagation();
 setIsEditingTitle(true);
 }}
 className="flex items-center gap-2 cursor-pointer group/title"
 >
  <h1 
  className={`text-2xl font-black tracking-tight px-3 py-1.5 -ml-3 rounded-2xl transition-all inline-block min-w-[50px] hover:bg-[#E6D6F5]/50`}
  >
  {activeBoard.title}
  </h1>
  <div className="bg-[#D94F9D]/10 p-1.5 rounded-xl">
  <Edit2 size={16} className="text-[#D94F9D]" />
  </div>
  </div>
 )}
  <button 
  className="text-[#D94F9D]/30 hover:text-[#D94F9D] transition-colors"
  >
 <Star size={18} />
 </button>
 </div>

 <div className="h-4 w-px" style={{ backgroundColor: isDarkHeader ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)' }}></div>

 <div className="flex items-center gap-2">
 <div className="flex -space-x-2">
 {mockUsers.slice(0, 3).map(user => (
 <MemberAvatar key={user.id} name={user.name} src={user.avatar} size="sm" />
 ))}
 </div>
 </div>
 </div>

 <div className="flex items-center gap-3">
 {/* Search */}
  <div className="relative hidden xl:block">
  <Search 
  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6B6B]" 
  size={16} 
  />
  <input 
  ref={searchInputRef}
  type="text" 
  placeholder="Find here ...." 
  className="border-none rounded-xl pl-10 pr-4 py-2 bg-white/40 focus:bg-white/60 focus:ring-2 focus:ring-[#D94F9D]/20 placeholder:text-[#6B6B6B]/60 placeholder:italic text-sm outline-none w-48 lg:w-64 transition-all focus:w-80 shadow-sm"
  />
  </div>
 
 {/* Notification temporarily moved to be placed after Automation */}

 <div className="relative">
  <button 
  onClick={() => setShowFilters(!showFilters)}
  className={`flex items-center gap-2 px-4 py-2 text-sm font-black rounded-xl transition-all border ${
  isFilterActive() 
  ? 'bg-[#D94F9D] text-white border-[#D94F9D] shadow-lg shadow-[#D94F9D]/20'
  : 'bg-white/40 border-[#E6D6F5] text-[#6B6B6B] hover:text-[#D94F9D] hover:bg-white/60'
  }`}
  >
  <Filter size={14} />
  Filters
  </button>
 
 <AnimatePresence>
 {showFilters && (
 <FilterDropdown onClose={() => setShowFilters(false)} />
 )}
 </AnimatePresence>
 </div>

  <div className="relative">
  <button 
  onClick={() => setShowSort(!showSort)}
  className={`flex items-center gap-2 px-4 py-2 text-sm font-black rounded-xl transition-all border ${
  isSorted() 
  ? 'bg-[#D94F9D] text-white border-[#D94F9D] shadow-lg shadow-[#D94F9D]/20'
  : 'bg-white/40 border-[#E6D6F5] text-[#2D2D2D] hover:text-[#D94F9D] hover:bg-white/60'
  }`}
  >
  <Columns size={14} />
  Sort
  {isSorted() && (
  <span className="w-2.5 h-2.5 rounded-full bg-red-500 absolute -top-1 -right-1 border-2 border-white animate-pulse"></span>
  )}
  </button>
 
 <AnimatePresence>
 {showSort && (
 <SortDropdown onClose={() => setShowSort(false)} />
 )}
 </AnimatePresence>
 </div>
  <button className="flex items-center gap-2 px-4 py-2 text-sm font-black rounded-xl transition-all border bg-white/40 border-[#E6D6F5] text-[#2D2D2D] hover:text-[#D94F9D] hover:bg-white/60">
  <Zap size={14} />
  Automation
  </button>

  <div className="relative">
  <button 
  onClick={() => setShowNotifications(!showNotifications)}
  className={`relative p-2.5 rounded-xl transition-all border ${
  showNotifications 
  ? 'bg-[#D94F9D] text-white border-[#D94F9D]'
  : 'bg-white/40 border-[#E6D6F5] text-[#2D2D2D] hover:text-[#D94F9D] hover:bg-white/60'
  }`}
  >
  <Bell size={18} />
  {unreadCount > 0 && (
  <span className="w-2.5 h-2.5 rounded-full bg-red-500 absolute top-1 right-1 border-2 border-white animate-pulse"></span>
  )}
  </button>

 <AnimatePresence>
 {showNotifications && (
 <NotificationDropdown onClose={() => setShowNotifications(false)} />
 )}
 </AnimatePresence>
 </div>

  <div className="h-4 w-px bg-[#E6D6F5]"></div>
  <div className="relative">
  <button 
  onClick={() => setShowMenu(!showMenu)}
  className={`p-2.5 rounded-xl transition-all ${
  showMenu 
  ? 'bg-[#D94F9D] text-white' 
  : 'bg-white/40 text-[#6B6B6B] hover:text-[#D94F9D] hover:bg-white/60 border border-[#E6D6F5]'
  }`}
  >
  <MoreHorizontal size={20} />
  </button>
 
 <AnimatePresence>
 {showBackground && (
 <BackgroundDropdown onClose={() => setShowBackground(false)} />
 )}
 </AnimatePresence>

 <AnimatePresence>
 {showMenu && (
 <motion.div
 ref={menuRef}
 initial={{ opacity: 0, y: 10, scale: 0.95 }}
 animate={{ opacity: 1, y: 0, scale: 1 }}
 exit={{ opacity: 0, y: 10, scale: 0.95 }}
 key="board-menu"
 className="absolute right-0 mt-2 top-[calc(100%+8px)] w-48 bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-[#334155] rounded-2xl shadow-2xl z-50 overflow-hidden"
 >
 <div className="bg-white dark:bg-[#1E293B] py-1">
 <button 
 onClick={() => {
 handleShare();
 setShowMenu(false);
 }}
 className="w-full px-4 py-2 flex items-center gap-3 hover:bg-black/5 transition-colors text-sm font-bold text-gray-700 dark:text-gray-300 text-left"
 >
 <Share2 size={16} className="text-gray-500 dark:text-gray-400" />
 Share Board
 </button>
 <button 
 onClick={() => {
 setShowBackground(!showBackground);
 setShowMenu(false);
 }}
 className="w-full px-4 py-2 flex items-center gap-3 hover:bg-black/5 transition-colors text-sm font-bold text-gray-700 dark:text-gray-300 text-left"
 >
 <Palette size={16} className="text-gray-500 dark:text-gray-400" />
 Style Board
 </button>
 </div>
 <div className="h-px bg-gray-100" />

 <div className="bg-gray-50/50">
 <div className="p-1 px-3 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center h-7 mt-1">
 Archived Lists
 </div>
 <div className="max-h-48 overflow-y-auto pb-1">
 {lists.filter((l: List) => l.isArchived).length > 0 ? (
 lists.filter((l: List) => l.isArchived).map((list: List) => (
 <div key={list.id} className="px-3 py-2 flex items-center justify-between group/item">
 <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 truncate pr-2">{list.title}</span>
 <button 
 onClick={() => handleRestoreList(list.id)}
 className="text-[10px] font-black text-[#6A3DE8] hover:underline whitespace-nowrap"
 >
 Restore
 </button>
 </div>
 ))
 ) : (
 <div className="px-3 py-3 text-[10px] font-bold text-gray-400 italic text-center">
 No archived lists
 </div>
 )}
 </div>
 </div>
 </motion.div>
 )}
 </AnimatePresence>
 </div>
 </div>
 </header>

 {/* Board Canvas Area */}
 <div className="flex-1 overflow-hidden">
 <BoardCanvas board={activeBoard} />
 </div>

 <CardModal />
 </main>
 </div>
 );
}
