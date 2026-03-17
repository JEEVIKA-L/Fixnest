import React from 'react';
import Link from 'next/link';
import { Layout, Bell, User, Search, Plus, Moon, Sun } from 'lucide-react';
import { useUIStore } from '@/stores/useUIStore';
import { useNotificationStore } from '@/stores/useNotificationStore';
import { useUserStore } from '@/stores/useUserStore';
import { NotificationDropdown } from '../notifications/NotificationDropdown';
import { AnimatePresence } from 'framer-motion';

export const Navbar = () => {
  const { notifications, fetchNotifications } = useNotificationStore();
  const { currentUser } = useUserStore();
  const [showNotifications, setShowNotifications] = React.useState(false);

  React.useEffect(() => {
    if (currentUser) {
      fetchNotifications(currentUser.id);
    }
  }, [currentUser, fetchNotifications]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <nav className="h-16 w-full bg-gradient-to-r from-[#8E2DE2] to-[#4A00E0] text-white flex items-center justify-between px-6 fixed top-0 z-50 shadow-md">
      <div className="flex items-center gap-8">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight">
          <div className="bg-white p-1 rounded-lg">
            <Layout className="text-[#6A3DE8] w-6 h-6" />
          </div>
          FixNest
        </Link>
        
        <div className="hidden md:flex items-center gap-6 text-sm font-medium opacity-90">
          <Link href="/dashboard" className="hover:opacity-100 transition-opacity">Workspaces</Link>
          <Link href="/dashboard" className="hover:opacity-100 transition-opacity">Recent</Link>
          <Link href="/dashboard" className="hover:opacity-100 transition-opacity">Starred</Link>
          <button className="bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5">
            <Plus size={16} />
            Create
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60" size={16} />
          <input 
            type="text" 
            placeholder="Search..." 
            className="bg-white/20 border-none rounded-md pl-10 pr-4 py-1.5 focus:ring-2 focus:ring-white/40 placeholder:text-white/60 text-sm outline-none w-64"
          />
        </div>
        
        <button 
          onClick={() => {
            document.documentElement.classList.toggle('dark');
          }}
          className="p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <Moon size={20} className="dark:hidden" />
          <Sun size={20} className="hidden dark:block" />
        </button>

        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={`p-2 rounded-full transition-colors relative ${showNotifications ? 'bg-white text-[#6A3DE8]' : 'hover:bg-white/10'}`}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[#5b15d9]"></span>
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <NotificationDropdown onClose={() => setShowNotifications(false)} />
            )}
          </AnimatePresence>
        </div>
        
        <div className="w-8 h-8 rounded-full bg-white/20 border border-white/40 flex items-center justify-center overflow-hidden cursor-pointer hover:border-white transition-colors">
          <User size={20} />
        </div>
      </div>
    </nav>
  );
};
