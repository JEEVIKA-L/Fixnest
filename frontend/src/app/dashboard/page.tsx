'use client';

import React, { useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { BoardGrid } from '@/components/boards/BoardGrid';
import { useBoardStore } from '@/stores/useBoardStore';
import { Layout, Clock, Star } from 'lucide-react';
import { useUserStore } from '@/stores/useUserStore'; // Added import for useUserStore

export default function DashboardPage() {
 const { boards, fetchBoards, isLoading } = useBoardStore();
 const { fetchCurrentUser } = useUserStore();

 useEffect(() => {
 fetchBoards();
 fetchCurrentUser();
 }, [fetchBoards, fetchCurrentUser]);

 return (
 <div className="min-h-screen bg-transparent">
 <Navbar />
 <Sidebar />
 
 <main className="pl-64 pt-16 min-h-screen">
 <div className="max-w-7xl mx-auto px-8 py-10">
 <header className="mb-12">
 <h1 className="text-4xl font-black text-[#2D2D2D] flex items-center gap-4 tracking-tight">
 <div className="bg-[#D94F9D]/10 p-2 rounded-2xl">
 <Layout className="text-[#D94F9D] w-8 h-8" />
 </div>
 Your Boards
 </h1>
 <p className="text-[#6B6B6B] mt-2 font-medium">Manage your projects and team collaboration with style.</p>
 </header>

 <section className="mb-12">
 <div className="flex items-center gap-3 mb-8 text-[#6B6B6B]">
 <Star size={20} className="text-[#D94F9D]" />
 <h2 className="text-[11px] font-black uppercase tracking-[0.3em]">Starred Boards</h2>
 </div>
 {isLoading ? (
 <div className="grid grid-cols-4 gap-6">
 {[1, 2].map(i => (
 <div key={i} className="h-32 bg-gray-200 animate-pulse rounded-xl"></div>
 ))}
 </div>
 ) : (
 <BoardGrid boards={boards.slice(0, 1)} />
 )}
 </section>

 <section>
 <div className="flex items-center gap-3 mb-8 text-[#6B6B6B]">
 <Clock size={20} className="text-[#D94F9D]" />
 <h2 className="text-[11px] font-black uppercase tracking-[0.3em]">Recently Viewed</h2>
 </div>
 {isLoading ? (
 <div className="grid grid-cols-4 gap-6">
 {[1, 2, 3, 4].map(i => (
 <div key={i} className="h-32 bg-gray-200 animate-pulse rounded-xl"></div>
 ))}
 </div>
 ) : (
 <BoardGrid boards={boards} />
 )}
 </section>
 </div>
 </main>
 </div>
 );
}
