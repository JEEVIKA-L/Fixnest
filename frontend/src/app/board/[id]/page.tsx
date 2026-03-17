'use client';

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { BoardCanvas } from '@/components/boards/BoardCanvas';
import { useBoardStore } from '@/stores/useBoardStore';
import { useListStore } from '@/stores/useListStore';
import { useLists } from '@/hooks/useLists';
import { List } from '@/types';
import { Share2, MoreHorizontal, Plus, Search, Filter, Settings, Zap, Edit2, Columns, Star, Users, Palette } from 'lucide-react';
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

export default function BoardPage() {
  const { id } = useParams();
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

  useOutsideClick(menuRef, () => setShowMenu(false), showMenu);

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
      <div className="min-h-screen bg-[#F6F7FB] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6A3DE8]"></div>
      </div>
    );
  }

  return (
    <div 
      className="h-screen flex flex-col overflow-hidden text-[#1F2937] transition-all duration-700 ease-in-out"
      style={{ 
        background: activeBoard.background || '#F6F7FB',
        backgroundColor: activeBoard.background?.startsWith('#') ? activeBoard.background : undefined
      }}
    >
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
                    className="text-xl font-black text-[#1F2937] bg-transparent border-b-2 border-[#6A3DE8] focus:outline-none w-64"
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
                      className="text-xl font-black text-[#1F2937] tracking-tight hover:bg-gray-100/80 px-3 py-1.5 -ml-3 rounded-xl transition-all inline-block min-w-[50px]"
                    >
                      {activeBoard.title}
                    </h1>
                    <div className="bg-[#6A3DE8]/10 p-1.5 rounded-lg">
                      <Edit2 size={14} className="text-[#6A3DE8]" />
                    </div>
                  </div>
                )}
                <button className="text-[#1F2937]/10 hover:text-yellow-400 transition-colors">
                   <Star size={18} />
                </button>
             </div>

             <div className="h-4 w-px bg-[#E5E7EB]"></div>

             <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                   {mockUsers.slice(0, 3).map(user => (
                     <MemberAvatar key={user.id} name={user.name} src={user.avatar} size="sm" />
                   ))}
                </div>
                <button 
                  onClick={handleShare}
                  className="bg-[#6A3DE8] text-white px-4 py-1.5 rounded-xl text-xs font-black hover:bg-[#7C3AED] transition-all flex items-center gap-2 shadow-lg shadow-[#6A3DE8]/20 ml-2 uppercase tracking-widest"
                >
                   <Share2 size={14} />
                   Share
                </button>
             </div>
          </div>

          <div className="flex items-center gap-3">
           <div className="relative">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-3 py-1.5 text-sm font-bold rounded-lg transition-all border ${
                  isFilterActive() 
                    ? 'text-[#6A3DE8] bg-[#6A3DE8]/5 border-[#6A3DE8]/20' 
                    : 'text-[#1F2937]/60 hover:text-[#6A3DE8] hover:bg-[#F6F7FB] border-transparent hover:border-[#6A3DE8]/10'
                }`}
              >
                 <Filter size={14} />
                 Filters
                 {isFilterActive() && (
                   <span className="w-2 h-2 rounded-full bg-[#6A3DE8] absolute -top-0.5 -right-0.5 animate-pulse"></span>
                 )}
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
                className={`flex items-center gap-2 px-3 py-1.5 text-sm font-bold rounded-lg transition-all border ${
                  isSorted() 
                    ? 'text-[#6A3DE8] bg-[#6A3DE8]/5 border-[#6A3DE8]/20' 
                    : 'text-[#1F2937]/60 hover:text-[#6A3DE8] hover:bg-[#F6F7FB] border-transparent hover:border-[#6A3DE8]/10'
                }`}
              >
                 <Columns size={14} />
                 Sort
                 {isSorted() && (
                   <span className="w-2 h-2 rounded-full bg-[#6A3DE8] absolute -top-0.5 -right-0.5 animate-pulse"></span>
                 )}
              </button>
              
              <AnimatePresence>
                {showSort && (
                  <SortDropdown onClose={() => setShowSort(false)} />
                )}
              </AnimatePresence>
           </div>
             <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-bold text-[#1F2937]/60 hover:text-[#6A3DE8] hover:bg-[#F6F7FB] rounded-lg transition-all border border-transparent hover:border-[#6A3DE8]/10">
                <Zap size={14} />
                Automation
             </button>

             <div className="relative">
                <button 
                  onClick={() => setShowBackground(!showBackground)}
                  className={`flex items-center gap-2 px-3 py-1.5 text-sm font-bold rounded-lg transition-all border ${
                    showBackground 
                      ? 'text-[#6A3DE8] bg-[#6A3DE8]/5 border-[#6A3DE8]/20' 
                      : 'text-[#1F2937]/60 hover:text-[#6A3DE8] hover:bg-[#F6F7FB] border-transparent hover:border-[#6A3DE8]/10'
                  }`}
                >
                   <Palette size={14} />
                   Style
                </button>
                
                <AnimatePresence>
                  {showBackground && (
                    <BackgroundDropdown onClose={() => setShowBackground(false)} />
                  )}
                </AnimatePresence>
             </div>
             <div className="h-4 w-px bg-[#E5E7EB]"></div>
             <div className="relative">
                <button 
                  onClick={() => setShowMenu(!showMenu)}
                  className={`p-2 hover:bg-[#F6F7FB] rounded-lg transition-all ${showMenu ? 'text-[#6A3DE8] bg-[#F6F7FB]' : 'text-[#1F2937]/60'}`}
                >
                   <MoreHorizontal size={20} />
                </button>
                
                <AnimatePresence>
                  {showMenu && (
                    <motion.div
                      ref={menuRef}
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      key="board-menu"
                      className="absolute right-0 mt-2 top-[calc(100%+8px)] w-48 bg-white border border-[#E5E7EB] rounded-2xl shadow-2xl z-50 overflow-hidden"
                    >
                      <div className="bg-gray-50/50">
                        <div className="p-1 px-3 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center h-7 mt-1">
                          Archived Lists
                        </div>
                        <div className="max-h-48 overflow-y-auto pb-1">
                          {lists.filter((l: List) => l.isArchived).length > 0 ? (
                            lists.filter((l: List) => l.isArchived).map((list: List) => (
                              <div key={list.id} className="px-3 py-2 flex items-center justify-between group/item">
                                <span className="text-[11px] font-bold text-gray-500 truncate pr-2">{list.title}</span>
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
