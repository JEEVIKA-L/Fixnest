import React from 'react';
import Link from 'next/link';
import { Logo } from '../common/Logo';
import { Bell, User, Search, Plus, Moon, Sun } from 'lucide-react';
import { useUIStore } from '@/stores/useUIStore';
import { useNotificationStore } from '@/stores/useNotificationStore';
import { useUserStore } from '@/stores/useUserStore';
import { NotificationDropdown } from '../notifications/NotificationDropdown';
import { UserMenu } from './UserMenu';
import { CreateBoardModal } from '../boards/CreateBoardModal';
import { AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

export const Navbar = () => {
 const { notifications, fetchNotifications } = useNotificationStore();
 const { currentUser } = useUserStore();
 const { setCreateBoardModalOpen } = useUIStore();
 const [showNotifications, setShowNotifications] = React.useState(false);
 const [showUserMenu, setShowUserMenu] = React.useState(false);
 const searchInputRef = React.useRef<HTMLInputElement>(null);
 const pathname = usePathname();
 const isBoardRoute = pathname?.startsWith('/board/');

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

 React.useEffect(() => {
 if (currentUser) {
 fetchNotifications(currentUser.id);
 }
 }, [currentUser, fetchNotifications]);

 const unreadCount = notifications.filter(n => !n.isRead).length;

 return (
 <nav 
      className="h-16 w-full text-[#2D2D2D] flex items-center justify-between px-6 fixed top-0 z-50 glass-panel transition-all duration-500"
    >
 <div className="flex items-center gap-8">
        <Link href="/" className="flex items-center gap-3 text-2xl font-black tracking-tight text-[#2D2D2D] hover:opacity-80 transition-opacity">
          <Logo size={36} />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#C8A2D6] to-[#D94F9D]">FixNest</span>
        </Link>
 
 <div className="hidden md:flex items-center gap-6 text-sm font-medium opacity-90">
 <Link href="/dashboard" className="hover:opacity-100 transition-opacity">Workspaces</Link>
 <Link href="/dashboard" className="hover:opacity-100 transition-opacity">Recent</Link>
 <Link href="/dashboard" className="hover:opacity-100 transition-opacity">Starred</Link>
          <button 
            onClick={() => setCreateBoardModalOpen(true)}
            className="bg-[#D94F9D] hover:bg-[#B83280] text-white px-4 py-1.5 rounded-xl transition-all flex items-center gap-1.5 active:scale-95 shadow-md shadow-[#D94F9D]/20 font-bold text-xs uppercase tracking-wider"
          >
            <Plus size={16} />
            Create
          </button>
 </div>
 </div>

 <div className="flex items-center gap-4">
 {!isBoardRoute && (
 <>
 <div className="relative hidden sm:block">
 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60" size={16} />
 <input 
 ref={searchInputRef}
 type="text" 
 placeholder="Search... (/)" 
 className="bg-white/20 border-none rounded-md pl-10 pr-4 py-1.5 focus:ring-2 focus:ring-white/40 placeholder:text-white/60 text-sm outline-none w-64 transition-all focus:w-80"
 />
 </div>
 
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={`p-2 rounded-xl transition-all relative ${showNotifications ? 'bg-[#D94F9D] text-white shadow-lg' : 'hover:bg-[#E6D6F5] text-[#6B6B6B]'}`}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            )}
          </button>

 <AnimatePresence>
 {showNotifications && (
 <NotificationDropdown onClose={() => setShowNotifications(false)} />
 )}
 </AnimatePresence>
 </div>
 </>
 )}
 
 <div className="relative">
          <div 
            onClick={() => setShowUserMenu(!showUserMenu)}
            className={`w-9 h-9 rounded-full bg-[#E6D6F5] border-2 border-white flex items-center justify-center overflow-hidden cursor-pointer hover:border-[#D94F9D] transition-all ${showUserMenu ? 'ring-2 ring-[#D94F9D]/30 border-[#D94F9D]' : 'shadow-sm'}`}
          >
 {currentUser?.avatar ? (
 <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
 ) : (
 <User size={20} />
 )}
 </div>

 <AnimatePresence>
 {showUserMenu && (
 <UserMenu onClose={() => setShowUserMenu(false)} />
 )}
 </AnimatePresence>
 </div>
 </div>
 <CreateBoardModal />
 </nav>
 );
};
