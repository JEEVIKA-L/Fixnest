'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'danger' | 'warning' | 'info';
}

export const ConfirmDialog = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'danger'
}: ConfirmDialogProps) => {
  const colors = {
    danger: {
      bg: 'bg-red-500',
      hover: 'hover:bg-red-600',
      icon: 'text-red-500',
      lightBg: 'bg-red-50',
      shadow: 'shadow-red-100'
    },
    warning: {
      bg: 'bg-amber-500',
      hover: 'hover:bg-amber-600',
      icon: 'text-amber-500',
      lightBg: 'bg-amber-50',
      shadow: 'shadow-amber-100'
    },
    info: {
      bg: 'bg-blue-500',
      hover: 'hover:bg-blue-600',
      icon: 'text-blue-500',
      lightBg: 'bg-blue-50',
      shadow: 'shadow-blue-100'
    }
  }[variant];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-white w-full max-w-sm rounded-3xl shadow-2xl relative z-10 overflow-hidden"
          >
            <div className={`p-6 flex flex-col items-center text-center`}>
              <div className={`${colors.lightBg} p-4 rounded-2xl mb-4`}>
                <AlertTriangle size={32} className={colors.icon} />
              </div>
              
              <h3 className="text-lg font-black text-[#1F2937] mb-2">{title}</h3>
              <p className="text-sm text-[#1F2937]/60 leading-relaxed mb-8">
                {message}
              </p>

              <div className="flex gap-3 w-full">
                <button
                  onClick={onCancel}
                  className="flex-1 px-4 py-3 rounded-2xl text-sm font-bold text-[#1F2937]/50 bg-[#F6F7FB] hover:bg-[#E5E7EB] transition-all"
                >
                  {cancelLabel}
                </button>
                <button
                  onClick={onConfirm}
                  className={`flex-1 px-4 py-3 rounded-2xl text-sm font-black text-white ${colors.bg} ${colors.hover} transition-all shadow-lg ${colors.shadow}`}
                >
                  {confirmLabel}
                </button>
              </div>
            </div>

            <button
              onClick={onCancel}
              className="absolute top-4 right-4 p-2 text-[#1F2937]/20 hover:text-[#1F2937]/60 transition-all"
            >
              <X size={18} />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
