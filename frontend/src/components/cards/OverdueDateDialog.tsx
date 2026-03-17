'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Calendar, X, ChevronRight } from 'lucide-react';
import { Card } from '@/types';
import { useCardStore } from '@/stores/useCardStore';
import { useUserStore } from '@/stores/useUserStore';
import { toast } from 'sonner';

interface OverdueDateDialogProps {
  card: Card;
  onClose: () => void;
  isReminder?: boolean;
}

export const OverdueDateDialog = ({ card, onClose, isReminder }: OverdueDateDialogProps) => {
  const { updateCard } = useCardStore();
  const { currentUser } = useUserStore();
  const [reason, setReason] = useState('');
  const [newDate, setNewDate] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const originalDue = card.dueDate
    ? new Date(card.dueDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) +
      ' at ' + new Date(card.dueDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    : '';

  const handleSubmit = async () => {
    if (!reason.trim()) {
      toast.error('Please enter a reason for the delay.');
      return;
    }
    if (!newDate) {
      toast.error('Please select a new due date.');
      return;
    }
    const newDueISO = new Date(newDate).toISOString();
    setIsSaving(true);
    try {
      await updateCard(card.id, {
        dueDate: newDueISO,
        overdueReason: reason.trim(),
        overdueReasonDate: new Date().toISOString(),
        overdueReasonBy: currentUser?.id,
        reminderAt: undefined, // Clear any pending reminders since we are rescheduling
        // Preserve the very first due date — only set if not already captured
        originalDueDate: card.originalDueDate ?? card.dueDate,
      });
      toast.success('Due date updated and reason saved.');
      onClose();
    } catch {
      toast.error('Failed to save. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-[300] flex items-center justify-center p-6 bg-black/30 backdrop-blur-sm rounded-3xl"
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 16 }}
        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-[#E5E7EB] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-red-500 px-6 py-5 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-xl">
              <AlertCircle size={22} className="text-white" fill="currentColor" fillOpacity={0.25} />
            </div>
            <div>
              <h2 className="text-white font-black text-base leading-tight">Due Date Exceeded</h2>
              <p className="text-white/70 text-xs font-semibold mt-0.5">Was due: {originalDue}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Reason */}
          <div>
            <label className="block text-[10px] font-black text-[#1F2937]/50 uppercase tracking-widest mb-2">
              Reason for delay <span className="text-red-400">*</span>
            </label>
            <textarea
              autoFocus
              rows={3}
              placeholder="e.g. Waiting for client approval, dependency blocked, scope changed..."
              className="w-full bg-[#F6F7FB] border-2 border-[#E5E7EB] focus:border-red-400 rounded-2xl p-3 text-sm focus:outline-none transition-all resize-none"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>

          {/* New Due Date */}
          <div>
            <label className="block text-[10px] font-black text-[#1F2937]/50 uppercase tracking-widest mb-2">
              New due date <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1F2937]/40 pointer-events-none" />
              <input
                type="datetime-local"
                min={new Date().toISOString().slice(0, 16)}
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#F6F7FB] border-2 border-[#E5E7EB] focus:border-red-400 rounded-2xl text-sm focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Previous reason display (if any) */}
          {card.overdueReason && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3">
              <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1">Previous reason</p>
              <p className="text-xs text-amber-700 leading-relaxed">{card.overdueReason}</p>
              {card.overdueReasonDate && (
                <p className="text-[10px] text-amber-500 mt-1">
                  Logged {new Date(card.overdueReasonDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex items-center gap-3">
          {!isReminder && (
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-2xl text-sm font-bold text-[#1F2937]/50 bg-[#F6F7FB] hover:bg-[#E5E7EB] transition-all"
            >
              Remind me later
            </button>
          )}
          <button
            onClick={handleSubmit}
            disabled={isSaving || !reason.trim() || !newDate}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-2xl text-sm font-black text-white bg-red-500 hover:bg-red-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-red-200 ${isReminder ? 'w-full' : ''}`}
          >
            {isSaving ? 'Saving...' : 'Save & Reschedule'}
            {!isSaving && <ChevronRight size={16} />}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
