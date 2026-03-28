import React from 'react';
import Link from 'next/link';
import { 
 LayoutDashboard, 
 Settings, 
 Users, 
 Calendar, 
 Star, 
 ChevronRight,
 Plus
} from 'lucide-react';
import { Logo } from '../common/Logo';

export const Sidebar = () => {
 const menuItems = [
 { icon: <LayoutDashboard size={18} />, label: 'Boards', href: '/dashboard' },
 { icon: <Users size={18} />, label: 'Members', href: '#' },
 { icon: <Settings size={18} />, label: 'Settings', href: '#' },
 ];

 const workspaceItems = [
 { label: 'Marketing Team', color: 'bg-orange-500' },
 { label: 'Engineering', color: 'bg-blue-500' },
 { label: 'Design System', color: 'bg-purple-500' },
 ];

 return (
    <aside className="w-64 h-screen glass-panel pb-6 flex flex-col fixed left-0 top-0 overflow-y-auto border-r border-[#E6D6F5] shadow-none pt-6">
      <div className="px-6 mb-8 mt-2">
        <Link href="/" className="flex items-center gap-3 text-xl font-black tracking-tight text-[#2D2D2D] hover:opacity-80 transition-opacity">
          <Logo size={32} />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#C8A2D6] to-[#D94F9D]">FixNest</span>
        </Link>
      </div>
 <div className="px-4 py-2">
 <ul className="space-y-1">
 {menuItems.map((item) => (
 <li key={item.label}>
  <Link 
  href={item.href} 
  className="flex items-center gap-3 px-3 py-2.5 text-[#2D2D2D] hover:bg-white/60 hover:text-[#D94F9D] rounded-xl transition-all font-black text-xs uppercase tracking-widest group"
  >
  <span className="text-[#6B6B6B] group-hover:text-[#D94F9D] transition-colors">{item.icon}</span>
  {item.label}
  </Link>
 </li>
 ))}
 </ul>
 </div>

 <div className="mt-8 px-4 py-2">
  <div className="flex items-center justify-between px-3 mb-3">
  <h3 className="text-[10px] font-black text-[#6B6B6B] uppercase tracking-[0.2em]">Workspaces</h3>
  <button className="hover:bg-white/60 p-1.5 rounded-lg transition-all text-[#D94F9D]">
  <Plus size={16} />
  </button>
  </div>
 <ul className="space-y-1">
 {workspaceItems.map((item) => (
 <li key={item.label}>
  <button className="w-full flex items-center justify-between px-3 py-2.5 text-[#2D2D2D] hover:bg-white/60 rounded-xl transition-all text-xs font-black uppercase tracking-widest group">
  <div className="flex items-center gap-3">
  <div className={`w-2 h-2 rounded-full ${item.color} shadow-sm shadow-black/20`}></div>
  {item.label}
  </div>
  <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 text-[#D94F9D] transition-all" />
  </button>
 </li>
 ))}
 </ul>
 </div>

 <div className="mt-auto px-4 py-2">
  <div className="bg-gradient-to-br from-[#E6D6F5] to-[#D94F9D] p-5 rounded-2xl shadow-lg shadow-[#D94F9D]/10 border border-white/40">
  <p className="text-xs font-black text-white mb-1 uppercase tracking-widest">FixNest Pro</p>
  <p className="text-[10px] text-white/90 leading-relaxed font-medium">
  Get unlimited boards and advanced team features.
  </p>
  <button className="mt-4 w-full bg-white text-[#D94F9D] text-[10px] font-black py-2.5 rounded-xl hover:bg-white/90 transition-all shadow-sm active:scale-95 uppercase tracking-widest">
  UPGRADE NOW
  </button>
  </div>
 </div>
 </aside>
 );
};
