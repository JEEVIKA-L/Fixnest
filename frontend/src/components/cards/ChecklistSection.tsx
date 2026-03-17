'use client';

import React, { useState } from 'react';
import { Checklist, ChecklistItem } from '@/types';
import { useCardStore } from '@/stores/useCardStore';
import { 
  CheckSquare, 
  Trash2, 
  Plus, 
  X,
  Check,
  User,
  Calendar,
  ChevronDown,
  Tag
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { mockUsers } from '@/mock-data/users';
import { mockLabels } from '@/mock-data/labels';
import { MemberAvatar } from '../common/MemberAvatar';
import { ConfirmDialog } from '../common/ConfirmDialog';

interface ChecklistSectionProps {
  cardId: string;
  checklists: Checklist[];
}

export const ChecklistSection = ({ cardId, checklists }: ChecklistSectionProps) => {
  const [newChecklistTitle, setNewChecklistTitle] = useState('');
  const [isAddingChecklist, setIsAddingChecklist] = useState(false);
  const [addingItemToChecklistId, setAddingItemToChecklistId] = useState<string | null>(null);
  const [newItemTitle, setNewItemTitle] = useState('');

  // Per-checklist action panels
  const [memberPickerForChecklist, setMemberPickerForChecklist] = useState<string | null>(null);
  const [datePickerForChecklist, setDatePickerForChecklist] = useState<string | null>(null);

  // Per-item action panels
  const [memberPickerItemId, setMemberPickerItemId] = useState<string | null>(null);
  const [datePickerItemId, setDatePickerItemId] = useState<string | null>(null);
  const [labelPickerItemId, setLabelPickerItemId] = useState<string | null>(null);
  
  // Confirmation dialog states
  const [checklistToDelete, setChecklistToDelete] = useState<string | null>(null);
  const [itemToDelete, setItemToDelete] = useState<{ checklistId: string; itemId: string; title: string } | null>(null);

  const { 
    toggleChecklistItem, 
    addChecklistItem, 
    addChecklist, 
    updateCard, 
    updateChecklistItem,
    deleteChecklistItem,
    toggleChecklistItemLabel
  } = useCardStore();

  const handleAddChecklist = async () => {
    if (!newChecklistTitle.trim()) return;
    await addChecklist(cardId, newChecklistTitle);
    setNewChecklistTitle('');
    setIsAddingChecklist(false);
  };

  const handleAddItem = async (checklistId: string) => {
    if (!newItemTitle.trim()) return;
    await addChecklistItem(cardId, checklistId, newItemTitle);
    setNewItemTitle('');
    setAddingItemToChecklistId(null);
  };

  const deleteChecklist = async (checklistId: string) => {
    setChecklistToDelete(checklistId);
  };

  const confirmDeleteChecklist = async () => {
    if (!checklistToDelete) return;
    const updatedChecklists = (checklists || []).filter(cl => cl.id !== checklistToDelete);
    await updateCard(cardId, { checklists: updatedChecklists });
    setChecklistToDelete(null);
  };

  const calculateProgress = (items: ChecklistItem[]) => {
    if (!items || items.length === 0) return 0;
    const completed = items.filter(i => i.isCompleted).length;
    return Math.round((completed / items.length) * 100);
  };

  const toggleItemMember = async (checklistId: string, itemId: string, userId: string, currentMemberIds: string[] = []) => {
    const newMemberIds = currentMemberIds.includes(userId)
      ? currentMemberIds.filter(id => id !== userId)
      : [...currentMemberIds, userId];
    await updateChecklistItem(cardId, checklistId, itemId, { memberIds: newMemberIds });
  };

  const setItemDueDate = async (checklistId: string, itemId: string, dueDate: string) => {
    await updateChecklistItem(cardId, checklistId, itemId, { dueDate: dueDate || undefined });
    setDatePickerItemId(null);
  };

  return (
    <div className="space-y-8">
      {(checklists || []).map((checklist) => {
        const progress = calculateProgress(checklist.items || []);
        return (
          <div key={checklist.id} className="group">
            {/* Checklist Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-[#1F2937]">{checklist.title}</h3>
              </div>
              <div className="flex items-center gap-1">
                {/* Add Member to checklist (disabled if progress == 100) */}
                <div className="relative">
                  <button
                    disabled={progress === 100}
                    onClick={() => {
                      setMemberPickerForChecklist(memberPickerForChecklist === checklist.id ? null : checklist.id);
                      setDatePickerForChecklist(null);
                    }}
                    title={progress === 100 ? "Checklist completed" : "Assign member"}
                    className={`flex items-center gap-1 px-2 py-1 text-[10px] font-bold transition-all rounded-lg ${
                      progress === 100 ? 'text-[#1F2937]/20 cursor-not-allowed' : 'text-[#1F2937]/50 hover:text-[#6A3DE8] hover:bg-[#F6F7FB]'
                    }`}
                  >
                    <User size={12} />
                    Member
                  </button>
                  <AnimatePresence>
                    {memberPickerForChecklist === checklist.id && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -6 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -6 }}
                        className="absolute top-full right-0 mt-1 w-60 bg-white rounded-2xl shadow-2xl border border-[#E5E7EB] z-[200] overflow-hidden"
                      >
                        <div className="flex items-center justify-between p-3 border-b border-[#E5E7EB]">
                          <span className="text-xs font-black text-[#1F2937]">Assign Member</span>
                          <button onClick={() => setMemberPickerForChecklist(null)} className="p-1 hover:bg-[#F6F7FB] rounded-full text-[#1F2937]/30">
                            <X size={14} />
                          </button>
                        </div>
                        <div className="p-2 max-h-48 overflow-y-auto">
                          {mockUsers.map(user => (
                            <button
                              key={user.id}
                              onClick={() => {
                                /* For checklist-level member, we set on the first item or show note */
                                setMemberPickerForChecklist(null);
                                setMemberPickerItemId(null);
                              }}
                              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#F6F7FB] transition-all text-left"
                            >
                              <MemberAvatar name={user.name} src={user.avatar} size="sm" />
                              <span className="text-sm font-semibold text-[#1F2937]">{user.name}</span>
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Add Due Date to checklist */}
                <div className="relative">
                  <button
                    disabled={progress === 100}
                    onClick={() => {
                      setDatePickerForChecklist(datePickerForChecklist === checklist.id ? null : checklist.id);
                      setMemberPickerForChecklist(null);
                    }}
                    title={progress === 100 ? "Checklist completed" : "Set due date"}
                    className={`flex items-center gap-1 px-2 py-1 text-[10px] font-bold transition-all rounded-lg ${
                      progress === 100 ? 'text-[#1F2937]/20 cursor-not-allowed' : 'text-[#1F2937]/50 hover:text-[#6A3DE8] hover:bg-[#F6F7FB]'
                    }`}
                  >
                    <Calendar size={12} />
                    Date
                  </button>
                  <AnimatePresence>
                    {datePickerForChecklist === checklist.id && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -6 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -6 }}
                        className="absolute top-full right-0 mt-1 w-56 bg-white rounded-2xl shadow-2xl border border-[#E5E7EB] z-[200] p-4"
                      >
                        <p className="text-[10px] font-bold text-[#1F2937]/40 uppercase tracking-widest mb-3">Due Date</p>
                        <input
                          type="datetime-local"
                          className="w-full border-2 border-[#E5E7EB] focus:border-[#6A3DE8] rounded-xl p-2 text-sm focus:outline-none"
                          onChange={(e) => {
                            /* Checklist-level date — for now just close */
                            setDatePickerForChecklist(null);
                          }}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Delete Checklist — always visible */}
                <button 
                  onClick={() => deleteChecklist(checklist.id)}
                  title="Delete checklist"
                  className="flex items-center gap-1 px-2 py-1 text-[10px] font-bold text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                >
                  <Trash2 size={12} />
                  Delete
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-[10px] font-black text-[#1F2937]/40 w-8">{progress}%</span>
              <div className="flex-1 h-2 bg-[#F6F7FB] rounded-full overflow-hidden border border-[#E5E7EB]/50">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className={`h-full rounded-full ${progress === 100 ? 'bg-green-500' : 'bg-[#6A3DE8]'}`}
                />
              </div>
            </div>

            {/* Checklist Items */}
            <div className="space-y-1">
              {(checklist.items || []).map((item) => {
                const itemMembers = mockUsers.filter(u => item.memberIds?.includes(u.id));
                return (
                  <div 
                    key={item.id}
                    className="flex items-start gap-3 p-2 hover:bg-[#F6F7FB] rounded-xl transition-all group/item"
                  >
                    <button 
                      onClick={() => toggleChecklistItem(cardId, checklist.id, item.id)}
                      className={`mt-0.5 w-5 h-5 rounded-md border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                        item.isCompleted 
                          ? 'bg-[#6A3DE8] border-[#6A3DE8] text-white shadow-sm shadow-[#6A3DE8]/20' 
                          : 'border-[#E5E7EB] bg-white hover:border-[#6A3DE8]'
                      }`}
                    >
                      {item.isCompleted && <Check size={12} strokeWidth={4} />}
                    </button>

                    <div className="flex-1 min-w-0">
                      <span className={`text-sm leading-relaxed transition-all ${
                        item.isCompleted ? 'text-[#1F2937]/40 line-through' : 'text-[#1F2937]'
                      }`}>
                        {item.title}
                      </span>

                      {/* Item meta: assigned members + due date + labels */}
                      {(itemMembers.length > 0 || item.dueDate || (item.labelIds && item.labelIds.length > 0)) && (
                        <div className="flex flex-wrap items-center gap-2 mt-1.5 px-0.5">
                          {itemMembers.length > 0 && (
                            <div className="flex -space-x-1.5">
                              {itemMembers.map(u => <MemberAvatar key={u.id} name={u.name} src={u.avatar} size="xs" />)}
                            </div>
                          )}
                          {item.dueDate && (
                            <span className="text-[10px] font-bold text-[#1F2937]/50 bg-[#F6F7FB] border border-[#E5E7EB] px-2 py-0.5 rounded-full flex items-center gap-1.5 whitespace-nowrap">
                              <Calendar size={10} className="text-[#6A3DE8]" />
                              {new Date(item.dueDate).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </span>
                          )}
                          {item.labelIds && item.labelIds.length > 0 && (
                            <div className="flex flex-wrap items-center gap-1">
                              {item.labelIds.map((labelId, lIdx) => {
                                const label = mockLabels.find(l => l.id === labelId);
                                if (!label) return null;
                                return (
                                  <span 
                                    key={`item-label-${labelId}-${lIdx}`}
                                    className="flex items-center gap-1 px-1.5 py-0.5 rounded-md border border-[#E5E7EB] bg-white text-[9px] font-black text-[#1F2937]/60" 
                                    title={label.title}
                                  >
                                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: label.color }} />
                                    {label.title}
                                  </span>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Per-item quick actions (always visible for clarity) */}
                    <div className="flex items-center gap-0.5 transition-all">
                      {/* Assign member to item */}
                      <div className="relative">
                        <button
                          disabled={item.isCompleted}
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            setMemberPickerItemId(memberPickerItemId === item.id ? null : item.id); 
                            setDatePickerItemId(null); 
                          }}
                          title={item.isCompleted ? "Task completed" : "Assign member"}
                          className={`p-1 rounded-lg transition-all ${
                            item.isCompleted ? 'text-[#1F2937]/10 cursor-not-allowed' : 'text-[#1F2937]/30 hover:text-[#6A3DE8] hover:bg-white'
                          }`}
                        >
                          <User size={13} />
                        </button>
                        <AnimatePresence>
                          {memberPickerItemId === item.id && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95, y: -6 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, y: -6 }}
                              className="absolute top-full right-0 mt-1 w-56 bg-white rounded-2xl shadow-2xl border border-[#E5E7EB] z-[200] overflow-hidden"
                            >
                              <div className="flex items-center justify-between p-3 border-b border-[#E5E7EB]">
                                <span className="text-xs font-black text-[#1F2937]">Assign Member</span>
                                <button onClick={() => setMemberPickerItemId(null)} className="p-1 hover:bg-[#F6F7FB] rounded-full text-[#1F2937]/30"><X size={14} /></button>
                              </div>
                              <div className="p-2 max-h-48 overflow-y-auto">
                                {mockUsers.map(user => {
                                  const isAssigned = item.memberIds?.includes(user.id);
                                  return (
                                    <button
                                      key={user.id}
                                      onClick={() => toggleItemMember(checklist.id, item.id, user.id, item.memberIds || [])}
                                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-[#F6F7FB] transition-all text-left"
                                    >
                                      <div className="flex items-center gap-2">
                                        <MemberAvatar name={user.name} src={user.avatar} size="sm" />
                                        <span className="text-sm font-semibold text-[#1F2937]">{user.name}</span>
                                      </div>
                                      {isAssigned && <Check size={14} className="text-[#6A3DE8]" />}
                                    </button>
                                  );
                                })}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Set due date on item */}
                      <div className="relative">
                        <button
                          disabled={item.isCompleted}
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            setDatePickerItemId(datePickerItemId === item.id ? null : item.id); 
                            setMemberPickerItemId(null); 
                            setLabelPickerItemId(null); 
                          }}
                          title={item.isCompleted ? "Task completed" : "Set due date"}
                          className={`p-1 rounded-lg transition-all ${
                            item.isCompleted ? 'text-[#1F2937]/10 cursor-not-allowed' : 'text-[#1F2937]/30 hover:text-[#6A3DE8] hover:bg-white'
                          }`}
                        >
                          <Calendar size={13} />
                        </button>
                        <AnimatePresence>
                          {datePickerItemId === item.id && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95, y: -6 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, y: -6 }}
                              className="absolute top-full right-0 mt-1 w-64 bg-white rounded-2xl shadow-2xl border border-[#E5E7EB] z-[200] p-4"
                            >
                              <p className="text-[10px] font-bold text-[#1F2937]/40 uppercase tracking-widest mb-3">Due Date & Time</p>
                              <input
                                type="datetime-local"
                                defaultValue={item.dueDate ? new Date(item.dueDate).toISOString().slice(0, 16) : ''}
                                className="w-full border-2 border-[#E5E7EB] focus:border-[#6A3DE8] rounded-xl p-2 text-xs focus:outline-none"
                                onChange={(e) => setItemDueDate(checklist.id, item.id, e.target.value ? new Date(e.target.value).toISOString() : '')}
                              />
                              {item.dueDate && (
                                <button
                                  onClick={() => setItemDueDate(checklist.id, item.id, '')}
                                  className="mt-2 w-full text-[10px] font-bold text-red-400 hover:text-red-600 hover:bg-red-50 px-2 py-1 rounded-lg transition-all text-center"
                                >
                                  Remove date
                                </button>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Add Label to item */}
                      <div className="relative">
                        <button
                          disabled={item.isCompleted}
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            setLabelPickerItemId(labelPickerItemId === item.id ? null : item.id); 
                            setMemberPickerItemId(null); 
                            setDatePickerItemId(null); 
                          }}
                          title={item.isCompleted ? "Task completed" : "Add label"}
                          className={`p-1 rounded-lg transition-all ${
                            item.isCompleted ? 'text-[#1F2937]/10 cursor-not-allowed' : 'text-[#1F2937]/30 hover:text-[#6A3DE8] hover:bg-white'
                          }`}
                        >
                          <Tag size={13} />
                        </button>
                        <AnimatePresence>
                          {labelPickerItemId === item.id && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95, y: -6 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, y: -6 }}
                              className="absolute top-full right-0 mt-1 w-56 bg-white rounded-2xl shadow-2xl border border-[#E5E7EB] z-[200] overflow-hidden"
                            >
                              <div className="flex items-center justify-between p-3 border-b border-[#E5E7EB]">
                                <span className="text-xs font-black text-[#1F2937]">Labels</span>
                                <button onClick={() => setLabelPickerItemId(null)} className="p-1 hover:bg-[#F6F7FB] rounded-full text-[#1F2937]/30"><X size={14} /></button>
                              </div>
                              <div className="p-2 max-h-48 overflow-y-auto">
                                {mockLabels.map(label => {
                                  const hasLabel = item.labelIds?.includes(label.id);
                                  return (
                                    <button
                                      key={label.id}
                                      onClick={() => toggleChecklistItemLabel(cardId, checklist.id, item.id, label.id)}
                                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-[#F6F7FB] transition-all text-left"
                                    >
                                      <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: label.color }} />
                                        <span className="text-sm font-semibold text-[#1F2937]">{label.title}</span>
                                      </div>
                                      {hasLabel && <Check size={14} className="text-[#6A3DE8]" />}
                                    </button>
                                  );
                                })}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Delete Item */}
                      <button
                        disabled={item.isCompleted}
                        onClick={() => setItemToDelete({ checklistId: checklist.id, itemId: item.id, title: item.title })}
                        title={item.isCompleted ? "Checklist items cannot be deleted once completed" : "Delete item"}
                        className={`p-1 rounded-lg transition-all ${
                          item.isCompleted 
                            ? 'text-[#1F2937]/10 cursor-not-allowed' 
                            : 'text-[#1F2937]/30 hover:text-red-500 hover:bg-white'
                        }`}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {addingItemToChecklistId === checklist.id ? (
              <div className="mt-4 ml-8 space-y-3">
                <textarea
                  autoFocus
                  placeholder="Add an item"
                  className="w-full bg-white border-2 border-[#6A3DE8] rounded-xl p-3 text-sm focus:outline-none shadow-lg shadow-[#6A3DE8]/5"
                  value={newItemTitle}
                  onChange={(e) => setNewItemTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleAddItem(checklist.id);
                    }
                  }}
                />
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleAddItem(checklist.id)}
                    className="bg-[#6A3DE8] text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-[#7C3AED] transition-all"
                  >
                    Add
                  </button>
                  <button 
                    onClick={() => {
                      setAddingItemToChecklistId(null);
                      setNewItemTitle('');
                    }}
                    className="p-2 hover:bg-[#F6F7FB] rounded-lg text-[#1F2937]/40 transition-all"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <button 
                onClick={() => setAddingItemToChecklistId(checklist.id)}
                className="mt-2 ml-8 text-xs font-bold text-[#1F2937]/40 hover:text-[#6A3DE8] hover:bg-[#F6F7FB] px-3 py-1.5 rounded-lg transition-all"
              >
                + Add an item
              </button>
            )}
          </div>
        );
      })}

      {isAddingChecklist ? (
        <div className="bg-white border-2 border-[#6A3DE8] rounded-2xl p-4 shadow-xl shadow-[#6A3DE8]/5">
          <p className="text-xs font-black text-[#1F2937] mb-2">Checklist Title</p>
          <input
            autoFocus
            type="text"
            placeholder="e.g. Tasks, Review steps..."
            className="w-full bg-[#F6F7FB] border border-[#E5E7EB] rounded-xl px-3 py-2 text-sm font-bold focus:outline-none focus:border-[#6A3DE8] transition-all mb-4"
            value={newChecklistTitle}
            onChange={(e) => setNewChecklistTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAddChecklist();
            }}
          />
          <div className="flex items-center gap-2">
            <button 
              onClick={handleAddChecklist}
              className="bg-[#6A3DE8] text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-[#7C3AED] transition-all"
            >
              Add Checklist
            </button>
            <button 
              onClick={() => {
                setIsAddingChecklist(false);
                setNewChecklistTitle('');
              }}
              className="p-2 hover:bg-[#F6F7FB] rounded-lg text-[#1F2937]/40 transition-all"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsAddingChecklist(true)}
          className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-[#1F2937]/40 bg-[#F6F7FB] hover:bg-[#E5E7EB] hover:text-[#1F2937] rounded-2xl transition-all border border-dashed border-[#E5E7EB]"
        >
          <Plus size={16} />
          Add a checklist
        </button>
      )}

      {/* Confirmation Dialogs */}
      <ConfirmDialog
        isOpen={!!checklistToDelete}
        title="Delete Checklist?"
        message={`Are you sure you want to delete this checklist? All items within it will be permanently removed.`}
        onConfirm={confirmDeleteChecklist}
        onCancel={() => setChecklistToDelete(null)}
      />

      <ConfirmDialog
        isOpen={!!itemToDelete}
        title="Delete Item?"
        message={`Delete "${itemToDelete?.title}" from the checklist?`}
        onConfirm={async () => {
          if (itemToDelete) {
            await deleteChecklistItem(cardId, itemToDelete.checklistId, itemToDelete.itemId);
            setItemToDelete(null);
          }
        }}
        onCancel={() => setItemToDelete(null)}
      />
    </div>
  );
};
