'use client';

import React, { useState, useMemo } from 'react';
import { Board, List, Card } from '../../types';
import { LabelTag } from '../common/LabelTag';
import { MemberAvatar } from '../common/MemberAvatar';
import { mockUsers } from '../../mock-data/users';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Calendar,
  User,
  Tag,
  Layers,
  AlertTriangle,
  CheckSquare,
  Paperclip,
  MoreHorizontal,
  ExternalLink,
} from 'lucide-react';
import { useUIStore } from '@/stores/useUIStore';
import { useFilterStore } from '@/stores/useFilterStore';

interface TableViewProps {
  board: Board;
  lists: List[];
  allCards: Record<string, Card[]>;
}

type SortField = 'title' | 'list' | 'dueDate' | 'createdAt' | 'labels' | 'members';
type SortOrder = 'asc' | 'desc' | null;

function isOverdue(dueDate?: string) {
  if (!dueDate) return false;
  return new Date(dueDate) < new Date();
}

function isDueSoon(dueDate?: string) {
  if (!dueDate) return false;
  const now = new Date();
  const due = new Date(dueDate);
  const diff = (due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
  return diff >= 0 && diff <= 2;
}

function formatDate(dateStr?: string) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export const TableView = ({ board, lists, allCards }: TableViewProps) => {
  const { openCardModal } = useUIStore();
  const { searchText, selectedMemberIds, selectedLabelIds } = useFilterStore();

  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  // Build flat list of all cards with their list info
  const allRows = useMemo(() => {
    return lists
      .filter((l) => !l.isArchived)
      .flatMap((list) => {
        const cards = allCards[list.id] || [];
        return cards
          .filter((card) => !card.isArchived)
          .filter((card) => {
            const matchesSearch =
              searchText === '' ||
              card.title.toLowerCase().includes(searchText.toLowerCase());
            const matchesMembers =
              selectedMemberIds.length === 0 ||
              card.memberIds.some((id) => selectedMemberIds.includes(id));
            const matchesLabels =
              selectedLabelIds.length === 0 ||
              card.labelIds.some((id) => selectedLabelIds.includes(id));
            return matchesSearch && matchesMembers && matchesLabels;
          })
          .map((card) => ({ card, list }));
      });
  }, [lists, allCards, searchText, selectedMemberIds, selectedLabelIds]);

  // Sorting
  const sortedRows = useMemo(() => {
    if (!sortOrder) return allRows;
    return [...allRows].sort((a, b) => {
      let cmp = 0;
      if (sortField === 'title') {
        cmp = a.card.title.localeCompare(b.card.title);
      } else if (sortField === 'list') {
        cmp = a.list.title.localeCompare(b.list.title);
      } else if (sortField === 'dueDate') {
        const da = a.card.dueDate ? new Date(a.card.dueDate).getTime() : Infinity;
        const db = b.card.dueDate ? new Date(b.card.dueDate).getTime() : Infinity;
        cmp = da - db;
      } else if (sortField === 'createdAt') {
        cmp = new Date(a.card.createdAt).getTime() - new Date(b.card.createdAt).getTime();
      } else if (sortField === 'labels') {
        cmp = a.card.labelIds.length - b.card.labelIds.length;
      } else if (sortField === 'members') {
        cmp = a.card.memberIds.length - b.card.memberIds.length;
      }
      return sortOrder === 'asc' ? cmp : -cmp;
    });
  }, [allRows, sortField, sortOrder]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder((prev) =>
        prev === 'asc' ? 'desc' : prev === 'desc' ? null : 'asc'
      );
      if (sortOrder === null) setSortField(field);
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field || sortOrder === null)
      return <ChevronsUpDown size={12} className="opacity-40" />;
    return sortOrder === 'asc' ? (
      <ChevronUp size={12} className="text-[#D94F9D]" />
    ) : (
      <ChevronDown size={12} className="text-[#D94F9D]" />
    );
  };

  const headers: { label: string; field: SortField; icon: React.ReactNode }[] = [
    { label: 'Card Title', field: 'title', icon: <Layers size={12} /> },
    { label: 'List', field: 'list', icon: <Layers size={12} /> },
    { label: 'Labels', field: 'labels', icon: <Tag size={12} /> },
    { label: 'Members', field: 'members', icon: <User size={12} /> },
    { label: 'Due Date', field: 'dueDate', icon: <Calendar size={12} /> },
    { label: 'Created', field: 'createdAt', icon: <Calendar size={12} /> },
  ];

  return (
    <div className="flex-1 overflow-auto px-6 pb-6 pt-4">
      {/* Stats Bar */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white/60 rounded-xl text-xs font-bold text-[#6B6B6B] border border-[#E6D6F5]">
          <Layers size={12} className="text-[#D94F9D]" />
          <span>{sortedRows.length} cards</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white/60 rounded-xl text-xs font-bold text-[#6B6B6B] border border-[#E6D6F5]">
          <CheckSquare size={12} className="text-emerald-500" />
          <span>
            {sortedRows.filter((r) => !isOverdue(r.card.dueDate) && r.card.dueDate).length} on track
          </span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white/60 rounded-xl text-xs font-bold text-[#6B6B6B] border border-[#E6D6F5]">
          <AlertTriangle size={12} className="text-red-500" />
          <span>{sortedRows.filter((r) => isOverdue(r.card.dueDate)).length} overdue</span>
        </div>
      </div>

      <div className="rounded-2xl overflow-hidden border border-[#E6D6F5] shadow-xl shadow-[#D94F9D]/5 bg-white/80 backdrop-blur-md">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[#E6D6F5] bg-gradient-to-r from-[#F8F2FF] to-[#FFF0FA]">
              {headers.map((h) => (
                <th key={h.field} className="text-left">
                  <button
                    onClick={() => handleSort(h.field)}
                    className="w-full flex items-center gap-1.5 px-4 py-3.5 text-[10px] font-black uppercase tracking-widest text-[#6B6B6B] hover:text-[#D94F9D] transition-colors group"
                  >
                    <span className="text-[#D94F9D] opacity-70">{h.icon}</span>
                    {h.label}
                    <span className="ml-auto">
                      <SortIcon field={h.field} />
                    </span>
                  </button>
                </th>
              ))}
              <th className="px-4 py-3.5 text-[10px] font-black uppercase tracking-widest text-[#6B6B6B] text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence initial={false}>
              {sortedRows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-8 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 rounded-2xl bg-[#F8F2FF] flex items-center justify-center">
                        <Layers size={28} className="text-[#D94F9D]/40" />
                      </div>
                      <p className="text-sm font-black text-[#2D2D2D]">No cards found</p>
                      <p className="text-xs text-[#6B6B6B]">Try adjusting filters or adding cards to lists</p>
                    </div>
                  </td>
                </tr>
              ) : (
                sortedRows.map(({ card, list }, idx) => {
                  const overdue = isOverdue(card.dueDate);
                  const soon = isDueSoon(card.dueDate);
                  const isHovered = hoveredRow === card.id;
                  const checklistTotal = card.checklists?.reduce((s, c) => s + c.items.length, 0) ?? 0;
                  const checklistDone = card.checklists?.reduce(
                    (s, c) => s + c.items.filter((i) => i.isCompleted).length,
                    0
                  ) ?? 0;

                  return (
                    <motion.tr
                      key={card.id}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: idx * 0.02 }}
                      onMouseEnter={() => setHoveredRow(card.id)}
                      onMouseLeave={() => setHoveredRow(null)}
                      onClick={() => openCardModal(card.id)}
                      className={`border-b border-[#E6D6F5]/60 cursor-pointer transition-all duration-150 ${
                        isHovered ? 'bg-[#FBF5FF]' : idx % 2 === 0 ? 'bg-white/60' : 'bg-[#FAFAFA]/60'
                      }`}
                    >
                      {/* Title */}
                      <td className="px-4 py-3 max-w-[280px]">
                        <div className="flex items-start gap-2">
                          <div
                            className="w-1 self-stretch rounded-full flex-shrink-0 mt-0.5"
                            style={{
                              backgroundColor: list.color || '#D94F9D',
                              opacity: 0.7,
                            }}
                          />
                          <div>
                            <p className="text-sm font-bold text-[#2D2D2D] line-clamp-2 leading-tight">
                              {card.title}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              {checklistTotal > 0 && (
                                <span className="flex items-center gap-0.5 text-[10px] font-bold text-[#6B6B6B]">
                                  <CheckSquare size={10} className={checklistDone === checklistTotal ? 'text-emerald-500' : 'text-[#6B6B6B]'} />
                                  {checklistDone}/{checklistTotal}
                                </span>
                              )}
                              {(card.attachments?.length ?? 0) > 0 && (
                                <span className="flex items-center gap-0.5 text-[10px] font-bold text-[#6B6B6B]">
                                  <Paperclip size={10} />
                                  {card.attachments.length}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* List */}
                      <td className="px-4 py-3">
                        <span
                          className="px-2.5 py-1 rounded-lg text-[10px] font-black border truncate max-w-[120px] inline-block"
                          style={{
                            backgroundColor: list.color ? `${list.color}18` : '#F3EEF9',
                            color: list.color || '#D94F9D',
                            borderColor: list.color ? `${list.color}30` : '#E6D6F5',
                          }}
                        >
                          {list.title}
                        </span>
                      </td>

                      {/* Labels */}
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1 max-w-[160px]">
                          {card.labelIds.length === 0 ? (
                            <span className="text-[10px] text-[#6B6B6B]/40 font-medium">—</span>
                          ) : (
                            card.labelIds.slice(0, 3).map((id) => (
                              <LabelTag key={id} text={id} />
                            ))
                          )}
                          {card.labelIds.length > 3 && (
                            <span className="text-[10px] font-bold text-[#6B6B6B]">
                              +{card.labelIds.length - 3}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Members */}
                      <td className="px-4 py-3">
                        {card.memberIds.length === 0 ? (
                          <span className="text-[10px] text-[#6B6B6B]/40 font-medium">—</span>
                        ) : (
                          <div className="flex -space-x-1.5">
                            {card.memberIds.slice(0, 4).map((mid) => {
                              const user = mockUsers.find((u) => u.id === mid);
                              return user ? (
                                <MemberAvatar key={mid} name={user.name} src={user.avatar} size="sm" />
                              ) : null;
                            })}
                            {card.memberIds.length > 4 && (
                              <div className="w-7 h-7 rounded-full bg-[#E6D6F5] border-2 border-white flex items-center justify-center text-[9px] font-black text-[#D94F9D]">
                                +{card.memberIds.length - 4}
                              </div>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Due Date */}
                      <td className="px-4 py-3">
                        {card.dueDate ? (
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold border ${
                              overdue
                                ? 'bg-red-50 text-red-600 border-red-200'
                                : soon
                                ? 'bg-amber-50 text-amber-600 border-amber-200'
                                : 'bg-emerald-50 text-emerald-600 border-emerald-200'
                            }`}
                          >
                            <Calendar size={10} />
                            {formatDate(card.dueDate)}
                            {overdue && <AlertTriangle size={10} />}
                          </span>
                        ) : (
                          <span className="text-[10px] text-[#6B6B6B]/40 font-medium">—</span>
                        )}
                      </td>

                      {/* Created At */}
                      <td className="px-4 py-3">
                        <span className="text-xs text-[#6B6B6B] font-medium">
                          {formatDate(card.createdAt)}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openCardModal(card.id);
                          }}
                          className={`p-1.5 rounded-lg transition-all text-[#6B6B6B] hover:text-[#D94F9D] hover:bg-[#F8F2FF] ${
                            isHovered ? 'opacity-100' : 'opacity-0'
                          }`}
                          title="Open card"
                        >
                          <ExternalLink size={14} />
                        </button>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
};
