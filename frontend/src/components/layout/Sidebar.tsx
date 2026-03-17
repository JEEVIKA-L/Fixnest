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
    <aside className="w-64 h-screen bg-white border-r border-[#E5E7EB] pt-20 pb-6 flex flex-col fixed left-0 top-0 overflow-y-auto">
      <div className="px-4 py-2">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.label}>
              <Link 
                href={item.href} 
                className="flex items-center gap-3 px-3 py-2 text-[#1F2937] hover:bg-[#F6F7FB] rounded-lg transition-colors font-medium text-sm"
              >
                <span className="text-[#6A3DE8]">{item.icon}</span>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8 px-4 py-2">
        <div className="flex items-center justify-between px-3 mb-2">
          <h3 className="text-xs font-bold text-[#1F2937]/50 uppercase tracking-wider">Workspaces</h3>
          <button className="hover:bg-[#F6F7FB] p-1 rounded transition-colors text-[#6A3DE8]">
            <Plus size={14} />
          </button>
        </div>
        <ul className="space-y-1">
          {workspaceItems.map((item) => (
            <li key={item.label}>
              <button className="w-full flex items-center justify-between px-3 py-2 text-[#1F2937] hover:bg-[#F6F7FB] rounded-lg transition-colors text-sm group">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${item.color}`}></div>
                  {item.label}
                </div>
                <ChevronRight size={14} className="opacity-0 group-hover:opacity-40 transition-opacity" />
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-auto px-4 py-2">
        <div className="bg-gradient-to-br from-[#8E2DE2]/10 to-[#4A00E0]/10 p-4 rounded-xl border border-[#8A63F6]/20">
          <p className="text-xs font-semibold text-[#6A3DE8] mb-1">FixNest Pro</p>
          <p className="text-[10px] text-[#1F2937]/70 leading-relaxed">
            Get unlimited boards and advanced team features.
          </p>
          <button className="mt-3 w-full bg-[#6A3DE8] text-white text-[11px] font-bold py-2 rounded-lg hover:bg-[#7C3AED] transition-colors shadow-sm shadow-[#6A3DE8]/20">
            UPGRADE NOW
          </button>
        </div>
      </div>
    </aside>
  );
};
