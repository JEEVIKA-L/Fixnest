'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { X, RefreshCw, Archive, Trash2 } from 'lucide-react';
import { List } from '../../types';
import { useListStore } from '../../stores/useListStore';

interface ArchivedListsModalProps {
  lists: List[];
  onClose: () => void;
}

export const ArchivedListsModal = ({ lists, onClose }: ArchivedListsModalProps) => {
  const { restoreList, deleteList } = useListStore();

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-[#E5E7EB] overflow-hidden"
      >
        <div className="flex items-center justify-between p-6 border-b border-[#E5E7EB]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#6A3DE8]/10 rounded-xl">
              <Archive size={20} className="text-[#6A3DE8]" />
            </div>
            <div>
              <h2 className="text-xl font-black text-[#1F2937]">Archived Lists</h2>
              <p className="text-xs font-bold text-[#1F2937]/40 uppercase tracking-widest mt-0.5">Restore or remove items permanently</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-[#F6F7FB] rounded-full text-[#1F2937]/40 hover:text-[#1F2937] transition-all"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 max-h-[400px] overflow-y-auto">
          {lists.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="w-16 h-16 bg-[#F6F7FB] rounded-full flex items-center justify-center mb-4">
                <Archive size={24} className="text-[#1F2937]/10" />
              </div>
              <h3 className="text-sm font-black text-[#1F2937]">No archived lists</h3>
              <p className="text-xs text-[#1F2937]/40 font-bold uppercase tracking-wider mt-1">Lists you archive will appear here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {lists.map(list => (
                <div 
                  key={list.id}
                  className="flex items-center justify-between p-4 bg-[#F6F7FB] rounded-2xl border border-transparent hover:border-[#6A3DE8]/10 transition-all group"
                >
                  <div>
                    <h4 className="font-bold text-[#1F2937]">{list.title}</h4>
                    <p className="text-[10px] font-black text-[#1F2937]/30 uppercase tracking-widest mt-0.5">
                      Updated {new Date(list.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => restoreList(list.id)}
                      className="flex items-center gap-2 px-3 py-1.5 bg-[#6A3DE8] text-white text-[10px] font-black uppercase tracking-wider rounded-xl hover:bg-[#7C3AED] transition-all"
                    >
                      <RefreshCw size={12} />
                      Restore
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this list permanently?')) {
                          deleteList(list.id);
                        }
                      }}
                      className="p-2 text-[#1F2937]/20 hover:text-red-500 hover:bg-red-50/50 rounded-xl transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="p-6 bg-[#F6F7FB]/50 border-t border-[#E5E7EB] flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-xs font-black uppercase tracking-widest text-[#1F2937] hover:bg-white rounded-xl border border-transparent hover:border-[#E5E7EB] transition-all"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};
