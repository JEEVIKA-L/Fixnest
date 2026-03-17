'use client';

import React from 'react';
import { Calendar, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Card } from '@/types';

interface DateAlertProps {
  card: Card;
  className?: string;
  showTime?: boolean;
}

export const DateAlert = ({ card, className = '', showTime = true }: DateAlertProps) => {
  if (!card.dueDate) return null;

  const dueDate = new Date(card.dueDate);
  const now = new Date();
  
  // Calculate differences
  const diffInMs = dueDate.getTime() - now.getTime();
  const diffInHours = diffInMs / (1000 * 60 * 60);
  const diffInDays = Math.floor(diffInHours / 24);

  // Check if completed (some logic needed, maybe from checklist)
  // For now, let's assume if it's not overdue and less than 24h, it's "Soon"
  
  let status: 'overdue' | 'soon' | 'today' | 'future' = 'future';
  let label = '';
  let colorClass = '';
  let icon = <Clock size={14} />;

  if (diffInMs < 0) {
    status = 'overdue';
    label = `Overdue · ${dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
    colorClass = 'bg-red-500 text-white border-red-600 shadow-sm shadow-red-200';
    icon = <AlertCircle size={14} fill="currentColor" fillOpacity={0.2} />;
  } else if (diffInHours < 24 && dueDate.getDate() === now.getDate()) {
    status = 'today';
    label = `Due Today · ${dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
    colorClass = 'bg-orange-500 text-white border-orange-600 shadow-sm shadow-orange-200';
    icon = <Clock size={14} fill="currentColor" fillOpacity={0.2} />;
  } else if (diffInHours < 48) {
    status = 'soon';
    label = `Due Soon · ${dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
    colorClass = 'bg-amber-100 text-amber-700 border-amber-200';
    icon = <Clock size={14} />;
  } else {
    label = dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    colorClass = 'bg-[#F6F7FB] text-[#1F2937]/70 border-[#E5E7EB]';
    icon = <Calendar size={14} />;
  }

  const timeString = showTime ? ` at ${dueDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : '';

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border font-black text-[10px] uppercase tracking-wider transition-all hover:scale-105 active:scale-95 cursor-default ${colorClass} ${className}`}>
      {icon}
      <span>{label}{timeString}</span>
    </div>
  );
};
