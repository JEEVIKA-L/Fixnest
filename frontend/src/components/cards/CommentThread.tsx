'use client';

import React, { useState, useEffect } from 'react';
import { MemberAvatar } from '../common/MemberAvatar';
import { mockUsers } from '../../mock-data/users';
import { mockLists } from '../../mock-data/lists';
import { commentService } from '../../services/commentService';
import { useUserStore } from '@/stores/useUserStore';
import { useCardStore } from '@/stores/useCardStore';
import { Comment, Card, Activity, Attachment } from '@/types';
import { Pencil, Trash2, Check, X, Send, UserPlus, UserMinus, Calendar, PlusCircle, ArrowRight, CheckSquare, List, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { usePasteImage } from '@/hooks/usePasteImage';

interface CommentThreadProps {
 cardId: string;
 card?: Card; // optional — used to derive activity events
}

// ─── A synthetic activity event derived from the card ─────────────────────────
interface DerivedEvent {
 id: string;
 kind: 'activity';
 icon: React.ReactNode;
 text: string;
 userId: string;
 ts: number;
 color: string;
}

type FeedItem =
 | { kind: 'comment'; data: Comment; ts: number }
 | { kind: 'activity'; data: Activity; ts: number };

// ─── Relative time ─────────────────────────────────────────────────────────────
function relativeTime(isoStr: string) {
 const diff = Date.now() - new Date(isoStr).getTime();
 const mins = Math.floor(diff / 60_000);
 if (mins < 1) return 'just now';
 if (mins < 60) return `${mins}m ago`;
 const hrs = Math.floor(mins / 60);
 if (hrs < 24) return `${hrs}h ago`;
 const days = Math.floor(hrs / 24);
 return `${days}d ago`;
}

// ─── Build activity display props from log entry ──────────────────────────────
function getActivityDisplay(activity: Activity): { icon: React.ReactNode; text: string; color: string } {
 switch (activity.action) {
 case 'created':
 return {
 icon: <PlusCircle size={11} className="text-[#6A3DE8] flex-shrink-0" />,
 text: 'created this card',
 color: 'text-[#6A3DE8]',
 };
 case 'moved':
 const listName = mockLists.find(l => l.id === activity.details)?.title || 'another list';
 return {
 icon: <ArrowRight size={11} className="text-blue-500 flex-shrink-0" />,
 text: `moved this card to ${listName}`,
 color: 'text-blue-600',
 };
 case 'duedate_updated':
 const formatted = new Date(activity.details!).toLocaleString('en-US', {
 month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
 });
 return {
 icon: <Calendar size={11} className="text-amber-500 flex-shrink-0" />,
 text: `set the due date to ${formatted}`,
 color: 'text-amber-600',
 };
 case 'checklist_added':
 return {
 icon: <CheckSquare size={11} className="text-[#6A3DE8] flex-shrink-0" />,
 text: `added checklist "${activity.details}"`,
 color: 'text-[#6A3DE8]',
 };
 case 'checklist_item_added':
 return {
 icon: <List size={11} className="text-[#6A3DE8] flex-shrink-0" />,
 text: `added item "${activity.details}" to checklist`,
 color: 'text-[#6A3DE8]',
 };
 case 'comment_added':
 return {
 icon: <MessageSquare size={11} className="text-[#6A3DE8] flex-shrink-0" />,
 text: `added a comment`,
 color: 'text-[#6A3DE8]',
 };
 case 'member_added':
 return {
 icon: <UserPlus size={11} className="text-green-500 flex-shrink-0" />,
 text: `added ${activity.details} to this card`,
 color: 'text-green-600',
 };
 case 'member_removed':
 return {
 icon: <UserMinus size={11} className="text-red-500 flex-shrink-0" />,
 text: `removed ${activity.details} from this card`,
 color: 'text-red-600',
 };
 default:
 return {
 icon: <PlusCircle size={11} />,
 text: activity.action,
 color: 'text-gray-500 dark:text-gray-400',
 };
 }
}

export const CommentThread = ({ cardId, card }: CommentThreadProps) => {
 const { currentUser } = useUserStore();
 const { activities, fetchActivities, updateCard, addComment } = useCardStore();

 const [comments, setComments] = useState<Comment[]>([]);
 const [newText, setNewText] = useState('');
 const [isSaving, setIsSaving] = useState(false);
 const [editingId, setEditingId] = useState<string | null>(null);
 const [editText, setEditText] = useState('');

 useEffect(() => {
 commentService.getCommentsByCardId(cardId).then(setComments);
 fetchActivities(cardId);
 }, [cardId, fetchActivities]);

 const activeUser = currentUser || mockUsers[0];

 // Merge and sort chronologically (oldest first)
 const feed: FeedItem[] = [
 ...comments.map(c => ({ kind: 'comment' as const, data: c, ts: new Date(c.createdAt).getTime() })),
 ...(activities[cardId] || []).map((a: Activity) => ({ kind: 'activity' as const, data: a, ts: new Date(a.createdAt).getTime() })),
 ].sort((a, b) => b.ts - a.ts);

 const handleSave = async () => {
 if (!newText.trim()) return;
 setIsSaving(true);
 try {
 await addComment(cardId, activeUser.id, newText.trim());
 // Refetch comments to get the new one (or we could return it from addComment)
 const updatedComments = await commentService.getCommentsByCardId(cardId);
 setComments(updatedComments);
 setNewText('');
 } catch {
 toast.error('Failed to add comment');
 } finally {
 setIsSaving(false);
 }
 };

 const handleEditSave = async (commentId: string) => {
 if (!editText.trim()) return;
 try {
 const updated = await commentService.updateComment(commentId, editText.trim());
 setComments(prev => prev.map(c => c.id === commentId ? updated : c));
 setEditingId(null);
 toast.success('Comment updated');
 } catch {
 toast.error('Failed to update comment');
 }
 };

 const handleDelete = async (commentId: string) => {
 try {
 await commentService.deleteComment(commentId);
 setComments(prev => prev.filter(c => c.id !== commentId));
 toast.success('Comment deleted');
 } catch {
 toast.error('Failed to delete comment');
 }
 };

 const handleImagePaste = async (base64: string) => {
 if (!card) return;
 
 const newAttachment: Attachment = {
 id: `at${Math.random().toString(36).substr(2, 9)}`,
 name: `Comment Image - ${new Date().toLocaleTimeString()}`,
 url: base64,
 type: 'image',
 createdAt: new Date().toISOString()
 };
 
 const currentAttachments = card.attachments || [];
 await updateCard(card.id, { 
 attachments: [...currentAttachments, newAttachment] 
 });
 
 toast.success('Image added as attachment');
 };

 const { handlePaste } = usePasteImage(handleImagePaste);

 return (
 <div className="space-y-4">

 {/* ── New comment input ── */}
 <div className="flex gap-3 items-start">
 <MemberAvatar name={activeUser.name} src={activeUser.avatar} size="sm" />
 <div className="flex-1 min-w-0">
 <textarea
 rows={2}
 placeholder="Write a comment…"
 className="w-full bg-[#F6F7FB] dark:bg-[#0F172A] border border-[#E5E7EB] dark:border-[#334155] rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-[#6A3DE8]/20 focus:border-[#6A3DE8] outline-none transition-all resize-none"
 value={newText}
 onChange={(e) => setNewText(e.target.value)}
 onPaste={handlePaste}
 onKeyDown={(e) => { if (e.key === 'Enter' && e.ctrlKey) handleSave(); }}
 />
 <div className="flex items-center justify-between mt-1.5">
 <span className="text-[10px] text-[#1F2937]/30 font-bold">Ctrl+Enter to save</span>
 <button
 onClick={handleSave}
 disabled={isSaving || !newText.trim()}
 className="flex items-center gap-1.5 bg-[#6A3DE8] text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-[#7C3AED] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
 >
 <Send size={11} />
 {isSaving ? 'Saving…' : 'Post'}
 </button>
 </div>
 </div>
 </div>

 {/* ── Feed ── */}
 {feed.length > 0 && <hr className="border-[#E5E7EB] dark:border-[#334155]" />}

 {feed.length === 0 && (
 <p className="text-xs text-[#1F2937]/30 font-bold py-2 text-center">No activity yet.</p>
 )}

 <div className="space-y-4">
 <AnimatePresence initial={false}>
 {feed.map((item, idx) => {
 const itemKey = `${item.kind}-${item.data.id}-${item.ts}-${idx}`;

 // ── Activity event ──
 if (item.kind === 'activity') {
 const activity = item.data;
 const { icon, text, color } = getActivityDisplay(activity);
 const user = mockUsers.find(u => u.id === activity.userId) || mockUsers[0];
 return (
 <motion.div
 key={itemKey}
 initial={{ opacity: 0, y: 4 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0 }}
 className="flex gap-3 items-start"
 >
 <MemberAvatar key={`avatar-${user.id}`} name={user.name} src={user.avatar} size="sm" />
 <div className="flex-1 min-w-0 pt-0.5">
 <p className="text-xs leading-snug">
 <span className="font-black text-[#1F2937] dark:text-gray-100">{user.name} </span>
 <span className={`inline-flex items-center gap-1 font-semibold ${color}`}>
 {icon}{text}
 </span>
 </p>
 <span className="text-[10px] text-[#1F2937]/35 font-bold">{relativeTime(activity.createdAt)}</span>
 </div>
 </motion.div>
 );
 }

 // ── Comment ──
 const comment = item.data;
 const user = mockUsers.find(u => u.id === comment.userId) || mockUsers[0];
 const isEditing = editingId === comment.id;
 const wasEdited = comment.updatedAt !== comment.createdAt;

 return (
 <motion.div
 key={itemKey}
 initial={{ opacity: 0, y: 4 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, y: -4 }}
 className="flex gap-3 items-start group"
 >
 <MemberAvatar key={`comment-avatar-${user.id}`} name={user.name} src={user.avatar} size="sm" />
 <div className="flex-1 min-w-0">
 <div className="flex items-baseline gap-2 mb-1">
 <span className="text-xs font-black text-[#1F2937] dark:text-gray-100">{user.name}</span>
 <span className="text-[10px] text-[#1F2937]/35 font-bold">
 {relativeTime(comment.createdAt)}{wasEdited && ' · edited'}
 </span>
 </div>
 {isEditing ? (
 <div className="space-y-2">
 <textarea
 autoFocus
 rows={2}
 className="w-full bg-white dark:bg-[#1E293B] border-2 border-[#6A3DE8] rounded-xl px-3 py-2 text-sm focus:outline-none resize-none"
 value={editText}
 onChange={(e) => setEditText(e.target.value)}
 onKeyDown={(e) => {
 if (e.key === 'Enter' && e.ctrlKey) handleEditSave(comment.id);
 if (e.key === 'Escape') setEditingId(null);
 }}
 />
 <div className="flex gap-2">
 <button onClick={() => handleEditSave(comment.id)} className="flex items-center gap-1 bg-[#6A3DE8] text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-[#7C3AED] transition-all">
 <Check size={11} /> Save
 </button>
 <button onClick={() => setEditingId(null)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-[#1F2937]/40 hover:bg-[#F6F7FB] transition-all">
 <X size={11} /> Cancel
 </button>
 </div>
 </div>
 ) : (
 <>
 <div className="bg-[#F6F7FB] dark:bg-[#0F172A] px-3 py-2 rounded-xl border border-[#E5E7EB] dark:border-[#334155] text-sm text-[#1F2937]/80 leading-relaxed whitespace-pre-wrap break-words">
 {comment.text}
 </div>
 <div className="flex gap-3 mt-1.5 opacity-0 group-hover:opacity-100 transition-all">
 <button onClick={() => { setEditingId(comment.id); setEditText(comment.text); }} className="flex items-center gap-1 text-[10px] font-bold text-[#1F2937]/40 hover:text-[#6A3DE8] uppercase tracking-wide transition-colors">
 <Pencil size={10} /> Edit
 </button>
 <button onClick={() => handleDelete(comment.id)} className="flex items-center gap-1 text-[10px] font-bold text-[#1F2937]/40 hover:text-red-500 uppercase tracking-wide transition-colors">
 <Trash2 size={10} /> Delete
 </button>
 </div>
 </>
 )}
 </div>
 </motion.div>
 );
 })}
 </AnimatePresence>
 </div>
 </div>
 );
};
