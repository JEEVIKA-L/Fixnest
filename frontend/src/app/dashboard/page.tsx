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
    <div className="min-h-screen bg-[#F6F7FB]">
      <Navbar />
      <Sidebar />
      
      <main className="pl-64 pt-16 min-h-screen">
        <div className="max-w-7xl mx-auto px-8 py-10">
          <header className="mb-10">
            <h1 className="text-3xl font-extrabold text-[#1F2937] flex items-center gap-3">
              <Layout className="text-[#6A3DE8]" />
              Your Boards
            </h1>
            <p className="text-[#1F2937]/60 mt-1">Manage your projects and team collaboration.</p>
          </header>

          <section className="mb-12">
            <div className="flex items-center gap-2 mb-6 text-[#1F2937]/50">
              <Star size={18} />
              <h2 className="text-sm font-bold uppercase tracking-widest text-xs">Starred Boards</h2>
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
            <div className="flex items-center gap-2 mb-6 text-[#1F2937]/50">
              <Clock size={18} />
              <h2 className="text-sm font-bold uppercase tracking-widest text-xs">Recently Viewed</h2>
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
