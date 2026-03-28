'use client';

import React from 'react';
import { useUIStore } from '@/stores/useUIStore';
import { useCardStore } from '@/stores/useCardStore';
import { useUserStore } from '@/stores/useUserStore';
import { useBoardStore } from '@/stores/useBoardStore';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

// Tiptap Editor integration
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import BulletList from '@tiptap/extension-bullet-list';
import ListItem from '@tiptap/extension-list-item';
import Placeholder from '@tiptap/extension-placeholder';
import { 
 X, 
 AlignLeft, 
 Calendar, 
 Clock,
 Tag, 
 User, 
 Trash2,
 Copy,
 Share2,
 MoreHorizontal,
 Paperclip,
 MessageSquare,
 Layout,
 Plus,
 Bold,
 Italic,
 Save,
 List,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LabelTag } from '../common/LabelTag';
import { MemberAvatar } from '../common/MemberAvatar';
import { MemberSelector } from './MemberSelector';
import { LabelSelector } from './LabelSelector';
import { DatePickerPopover } from './DatePickerPopover';
import { AttachmentSection } from './AttachmentSection';
import { DateAlert } from './DateAlert';
import { CommentThread } from './CommentThread';
import { ChecklistSection } from './ChecklistSection';
import { OverdueDateDialog } from './OverdueDateDialog';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { mockUsers } from '@/mock-data/users';
import { mockLabels } from '@/mock-data/labels';
import { toast } from 'sonner';
import { Attachment } from '@/types';
import { usePasteImage } from '@/hooks/usePasteImage';

export const CardModal = () => {
 const { isCardModalOpen, activeCardId, closeCardModal } = useUIStore();
 const { cards, updateCard, deleteCard, addCard } = useCardStore();
 const { currentUser } = useUserStore();
 const { activeBoard } = useBoardStore();
 const [isEditingDescription, setIsEditingDescription] = React.useState(false);
 const [description, setDescription] = React.useState('');
 const [isEditingTitle, setIsEditingTitle] = React.useState(false);
 const [title, setTitle] = React.useState('');
 const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = React.useState(false);
 
 // Popover states
 const [activePopover, setActivePopover] = React.useState<string | null>(null);

 // Image zoom state
 const [isImageZoomed, setIsImageZoomed] = React.useState(false);

 // Overdue dialog — dismissed per-session by the user
 const [overdueDismissed, setOverdueDismissed] = React.useState(false);
 const [showManualOverdue, setShowManualOverdue] = React.useState(false);



 const quillModules = React.useMemo(() => ({
 toolbar: [
 ['bold', 'italic'],
 [{ 'list': 'bullet' }],
 ],
 }), []);

 const quillFormats = React.useMemo(() => [
 'bold', 'italic', 'list'
 ], []);

 // Find the active card across all lists
 let activeCard = null;
 if (activeCardId) {
 for (const listId in cards) {
 const card = cards[listId].find(c => c.id === activeCardId);
 if (card) {
 activeCard = card;
 break;
 }
 }
 }
 const editor = useEditor({
 extensions: [
 StarterKit.configure({
 bulletList: false,
 listItem: false,
 }),
 BulletList,
 ListItem,
 Placeholder.configure({
 placeholder: 'Describe your task with style...',
 showOnlyWhenEditable: true,
 showOnlyCurrent: false,
 }),
 ],
 immediatelyRender: false,
 content: description,
 onUpdate: ({ editor }) => {
 // We don't save instantly anymore, but we track the content
 },
 editorProps: {
 attributes: {
 class: 'w-full focus:outline-none min-h-[200px] max-w-none text-[#1F2937]/80',
 },
 },
 });

 React.useEffect(() => {
 if (activeCard) {
 setDescription(activeCard.description || '');
 setTitle(activeCard.title || '');
 setOverdueDismissed(false); // reset dismissal each time a new card opens
 setActivePopover(null); // Reset popover when switching cards
 
 if (editor && !editor.isDestroyed) {
 editor.commands.setContent(activeCard.description || '');
 }
 }
 }, [activeCard?.id, editor]);

 const handleImagePaste = async (base64: string) => {
 if (activeCard) {
 const newAttachment: Attachment = {
 id: `at${Math.random().toString(36).substr(2, 9)}`,
 name: `Pasted Image - ${new Date().toLocaleTimeString()}`,
 url: base64,
 type: 'image',
 createdAt: new Date().toISOString()
 };
 
 const currentAttachments = activeCard.attachments || [];
 await updateCard(activeCard.id, { 
 attachments: [...currentAttachments, newAttachment] 
 });
 
 toast.success('Image added as attachment');
 }
 };

 const { handlePaste } = usePasteImage(handleImagePaste);

 if (!isCardModalOpen || !activeCard) return null;

 const handleDescriptionSave = async () => {
 if (activeCard && editor) {
 const html = editor.getHTML();
 await updateCard(activeCard.id, { description: html });
 setIsEditingDescription(false);
 toast.success('Description updated');
 }
 };

 const handleDescriptionDiscard = () => {
 if (activeCard && editor) {
 editor.commands.setContent(activeCard.description || '');
 setIsEditingDescription(false);
 }
 };

 const handleDeleteCard = async () => {
 if (!activeCard) return;
 setIsConfirmDeleteOpen(true);
 };

 const handleConfirmDelete = async () => {
 if (!activeCard) return;
 await deleteCard(activeCard.id);
 setIsConfirmDeleteOpen(false);
 closeCardModal();
 toast.error('Card deleted');
 };

 const handleTitleSave = async () => {
 if (activeCard && title.trim() && title !== activeCard.title) {
 await updateCard(activeCard.id, { title: title.trim() });
 setIsEditingTitle(false);
 toast.success('Title updated');
 } else {
 setTitle(activeCard?.title || '');
 setIsEditingTitle(false);
 }
 };

 const handleDuplicateCard = async () => {
 if (activeCard) {
 const { id, createdAt, updatedAt, ...rest } = activeCard;
 await addCard({
 ...rest,
 title: `${rest.title} (Copy)`,
 createdBy: currentUser?.id,
 });
 closeCardModal();
 toast.success('Card duplicated');
 }
 };

 const handleShare = () => {
 if (typeof window !== 'undefined') {
 const url = window.location.href;
 navigator.clipboard.writeText(url);
 toast.info('Link copied to clipboard');
 }
 };

 const cardMembers = mockUsers.filter(u => activeCard?.memberIds?.includes(u.id));
 const coverImage = activeCard.attachments?.find(at => at.id === activeCard.coverImageId);

 // Determine if overdue dialog should show:
 // - card has a dueDate that is in the past
 // - user hasn't dismissed it this session OR a reminder has reached its time
 // - no reason has been saved yet for this dueDate cycle
 const isOverdue = activeCard.dueDate ? new Date(activeCard.dueDate) < new Date() : false;
 
 const hasReasonForCurrentDue = activeCard.overdueReasonDate
 ? new Date(activeCard.overdueReasonDate) > new Date(activeCard.dueDate!)
 : false;

 const reminderReached = activeCard.reminderAt 
 ? new Date() > new Date(activeCard.reminderAt)
 : false;

 const showOverdueDialog = isOverdue && !hasReasonForCurrentDue && reminderReached;

 const handleRemindLater = async () => {
 if (activeCard) {
 const oneHourLater = new Date(Date.now() + 3600000).toISOString();
 await updateCard(activeCard.id, { reminderAt: oneHourLater });
 setOverdueDismissed(true);
 toast.info('We will remind you again in 1 hour');
 }
 };

 const isCardCompleted = activeCard?.checklists?.length > 0 && activeCard.checklists.every(cl => 
 cl.items.length > 0 && cl.items.every(item => item.isCompleted)
 ) || false;



 const boardColor = activeBoard?.color || '#6A3DE8';
 
 // Get first label color for title branding
 const firstLabel = activeCard?.labelIds && activeCard.labelIds.length > 0 
 ? mockLabels.find(l => l.id === activeCard.labelIds[0])
 : null;
 const titleColor = firstLabel?.color || '#1F2937';
 const headerIconBg = firstLabel ? `${firstLabel.color}20` : `${boardColor}20`;
 const headerIconColor = firstLabel ? firstLabel.color : boardColor;


 return (
 <AnimatePresence key="modal-presence">
 <div key="modal-overlay" className="fixed inset-0 z-[100] flex items-center justify-center p-4">
 {/* Full Image Overlay */}
 <AnimatePresence key="zoom-presence">
 {isImageZoomed && coverImage && (
 <motion.div 
 key="zoomed-image-backdrop"
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
 onClick={() => setIsImageZoomed(false)}
 >
 <button 
 onClick={() => setIsImageZoomed(false)}
 className="absolute top-8 right-8 text-white/50 hover:text-white transition-all"
 >
 <X size={32} />
 </button>
 <motion.img 
 key="zoomed-image-element"
 initial={{ scale: 0.9, opacity: 0 }}
 animate={{ scale: 1, opacity: 1 }}
 exit={{ scale: 0.9, opacity: 0 }}
 src={coverImage.url} 
 alt="Cover Full" 
 className="max-w-full max-h-full object-contain rounded-xl shadow-2xl" 
 onClick={(e) => e.stopPropagation()}
 />
 </motion.div>
 )}
 </AnimatePresence>

 <motion.div 
 key="modal-content-panel"
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 onClick={closeCardModal}
 className="absolute inset-0 bg-black/40 backdrop-blur-sm"
 />
 
 <motion.div
 key="modal-main-container"
 initial={{ opacity: 0, scale: 0.95, y: 20 }}
 animate={{ opacity: 1, scale: 1, y: 0 }}
 exit={{ opacity: 0, scale: 0.95, y: 20 }}
 className="glass-panel w-full max-w-4xl rounded-[2rem] shadow-2xl shadow-[#D94F9D]/10 relative z-10 overflow-hidden flex flex-col h-[90vh]"
 >
 {/* Overdue Dialog Overlay */}
 <AnimatePresence key="overdue-presence">
 {(showOverdueDialog || showManualOverdue) && (
 <OverdueDateDialog
 key="overdue-dialog-comp"
 card={activeCard}
 onClose={() => {
 handleRemindLater();
 setShowManualOverdue(false);
 }}
 isReminder={reminderReached}
 />
 )}
 </AnimatePresence>
 <div className="flex-1 overflow-y-auto">
 {/* Cover Image */}
 {coverImage && (
 <div className="w-full h-48 bg-[#F1F2F4] relative group cursor-pointer" onClick={() => setIsImageZoomed(true)}>
 <img src={coverImage.url} alt="Cover" className="w-full h-full object-cover" />
 <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all flex items-center justify-center">
 <div className="opacity-0 group-hover:opacity-100 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-white font-bold text-sm border border-white/20 transition-all">
 Click to enlarge
 </div>
 </div>
 <button 
 onClick={(e) => {
 e.stopPropagation();
 updateCard(activeCard.id, { coverImageId: undefined });
 }}
 className="absolute top-4 right-4 bg-black/20 hover:bg-black/40 text-white px-3 py-1.5 rounded-lg text-xs font-bold backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all flex items-center gap-2"
 >
 <Layout size={14} />
 Remove Cover
 </button>
 </div>
 )}

 <div 
 style={{ backgroundColor: `rgba(230, 214, 245, 0.3)` }} 
 className="sticky top-0 z-20 pl-6 pr-10 py-6 border-b border-[#E6D6F5] backdrop-blur-xl"
 >
 {/* Title row */}
 <div className="flex items-start justify-between gap-4">
 <div className="flex flex-col flex-1">
 <div className="flex items-center gap-3">
 <div 
 style={{ backgroundColor: headerIconBg, color: headerIconColor }} 
 className="p-2 rounded-lg flex-shrink-0"
 >
 <AlignLeft size={20} />
 </div>
 {isEditingTitle ? (
 <input
 autoFocus
 className="text-2xl font-black text-[#2D2D2D] bg-white/20 border-b-2 border-[#D94F9D] focus:outline-none w-full px-2"
 value={title}
 onChange={(e) => setTitle(e.target.value)}
 onBlur={handleTitleSave}
 onKeyDown={(e) => {
 if (e.key === 'Enter') handleTitleSave();
 if (e.key === 'Escape') {
 setTitle(activeCard.title);
 setIsEditingTitle(false);
 }
 }}
 />
 ) : (
 <h2 
 onClick={() => !isCardCompleted && setIsEditingTitle(true)}
 className={`text-2xl font-black text-[#2D2D2D] ${!isCardCompleted ? 'cursor-pointer hover:bg-white/40' : ''} px-2 py-1 -ml-2 rounded-xl transition-all tracking-tight`}
 >
 {activeCard.title}
 </h2>
 )}
 </div>
 {(() => {
 const creator = mockUsers.find(u => u.id === activeCard.createdBy);
 const dateStr = new Date(activeCard.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
 return (
 <p className="ml-11 text-[10px] font-black text-[#6B6B6B] uppercase tracking-[0.2em] mt-1">
 {creator ? `Created by ${creator.name} · ${dateStr}` : `Created by Team · ${dateStr}`}
 </p>
 );
 })()}
 </div>
 <button 
 onClick={closeCardModal} 
 className="p-2 hover:bg-[#F6F7FB] rounded-full text-[#1F2937]/40 hover:text-[#1F2937] transition-all flex-shrink-0 -mr-2"
 >
 <X size={20} />
 </button>
 </div>
 </div>

 <div className="p-8">
 <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
 {/* Main Content */}
 <div className="md:col-span-3 space-y-10">
 {/* Members · Labels · Dates · Attachment — all inline */}
 <div className="flex flex-wrap gap-8">

 {/* Members */}
 <div>
 <h3 className="text-xs font-bold text-[#1F2937]/40 uppercase tracking-widest mb-3">Members</h3>
 <div className="flex -space-x-1.5 flex-wrap items-center">
 {cardMembers.map((member, idx) => (
 <MemberAvatar key={`member-${member.id}-${idx}`} name={member.name} src={member.avatar} size="md" />
 ))}
 {!isCardCompleted && (
 <div className="relative ml-1">
 <button
 onClick={() => setActivePopover(activePopover === 'inline-members' ? null : 'inline-members')}
 className="w-8 h-8 rounded-full bg-[#F6F7FB] dark:bg-[#0F172A] border-2 border-white flex items-center justify-center text-[#1F2937]/40 hover:text-[#6A3DE8] hover:bg-white transition-all ring-1 ring-gray-100"
 >
 <span className="text-sm font-bold">+</span>
 </button>
 <AnimatePresence key="member-selection-presence">
 {activePopover === 'inline-members' && (
 <MemberSelector key="member-selector-comp" cardId={activeCard.id} selectedMemberIds={activeCard.memberIds || []} onClose={() => setActivePopover(null)} />
 )}
 </AnimatePresence>
 </div>
 )}
 </div>
 </div>

 {/* Labels */}
 <div>
 <h3 className="text-xs font-bold text-[#1F2937]/40 uppercase tracking-widest mb-3">Labels</h3>
 <div className="flex flex-wrap gap-2 items-center">
 {activeCard.labelIds?.map((labelId, idx) => (
 <LabelTag key={`label-${labelId}-${idx}`} text={labelId} />
 ))}
 {!isCardCompleted && (
 <div className="relative">
 <button
 onClick={() => setActivePopover(activePopover === 'inline-labels' ? null : 'inline-labels')}
 className="w-8 h-6 rounded bg-[#F6F7FB] dark:bg-[#0F172A] flex items-center justify-center text-[#1F2937]/40 hover:text-[#6A3DE8] hover:bg-white transition-all border border-transparent hover:border-[#6A3DE8]/10 text-xs font-bold"
 >
 +
 </button>
 <AnimatePresence key="label-selection-presence">
 {activePopover === 'inline-labels' && (
 <LabelSelector key="label-selector-comp" cardId={activeCard.id} selectedLabelIds={activeCard.labelIds || []} onClose={() => setActivePopover(null)} />
 )}
 </AnimatePresence>
 </div>
 )}
 </div>
 </div>

 {/* Dates */}
 <div>
 <h3 className="text-xs font-bold text-[#1F2937]/40 uppercase tracking-widest mb-3">Dates</h3>
 <div className="relative inline-block">
 {activeCard.dueDate ? (
 <div className="flex flex-col gap-2">
 <button 
 disabled={isCardCompleted}
 onClick={() => {
 if (isOverdue && !hasReasonForCurrentDue) {
 setShowManualOverdue(true);
 } else {
 setActivePopover(activePopover === 'inline-dates' ? null : 'inline-dates');
 }
 }}
 >
 <DateAlert card={activeCard} />
 </button>
 
 {isOverdue && !hasReasonForCurrentDue && !reminderReached && !isCardCompleted && (
 <button
 onClick={handleRemindLater}
 className="flex items-center justify-center gap-1.5 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-[#6A3DE8] bg-[#6A3DE8]/5 hover:bg-[#6A3DE8]/10 rounded-xl transition-all border border-[#6A3DE8]/10"
 >
 <Clock size={12} />
 Remind in 1h
 </button>
 )}
 </div>
 ) : !isCardCompleted && (
 <button
 onClick={() => setActivePopover(activePopover === 'inline-dates' ? null : 'inline-dates')}
 className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#1F2937]/40 bg-[#F6F7FB] dark:bg-[#0F172A] hover:bg-[#E5E7EB] rounded-lg transition-all border border-dashed border-[#E5E7EB] dark:border-[#334155]"
 >
 <Calendar size={12} /> Add date
 </button>
 )}
 <AnimatePresence key="date-selection-presence">
 {activePopover === 'inline-dates' && (
 <DatePickerPopover key="date-selector-comp" cardId={activeCard.id} currentDate={activeCard.dueDate} onClose={() => setActivePopover(null)} />
 )}
 </AnimatePresence>
 </div>
 </div>

 </div>

 {/* Description */}
 <div>
 <div className="flex items-center justify-between mb-4">
 <div className="flex items-center gap-2">
 <AlignLeft size={18} className="text-[#D94F9D]" />
 <h3 className="font-black text-[#2D2D2D] uppercase tracking-wider text-xs">Description</h3>
 </div>
 {!isEditingDescription && !isCardCompleted && (
 <button 
 onClick={() => setIsEditingDescription(true)}
 className="text-xs font-bold text-[#1F2937]/40 hover:text-[#6A3DE8] px-2 py-1 hover:bg-[#F6F7FB] rounded transition-all"
 >
 {activeCard.description ? 'Edit' : 'Add'}
 </button>
 )}
 </div>
 {isEditingDescription ? (
 <div className="space-y-4">
 <div className="bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-[#334155] rounded-2xl overflow-hidden shadow-sm transition-all focus-within:ring-2 focus-within:ring-[#6A3DE8]/10 focus-within:border-[#6A3DE8]">
 {/* Editor Toolbar */}
 <div className="flex items-center gap-1 p-2 bg-[#F6F7FB]/50 border-b border-[#E5E7EB] dark:border-[#334155]">
 <button
 onClick={() => editor?.chain().focus().toggleBold().run()}
 className={`p-2 rounded-lg transition-all ${editor?.isActive('bold') ? 'bg-[#6A3DE8] text-white' : 'text-[#1F2937]/40 hover:bg-[#F6F7FB] hover:text-[#6A3DE8]'}`}
 title="Bold"
 >
 <Bold size={14} />
 </button>
 <button
 onClick={() => editor?.chain().focus().toggleItalic().run()}
 className={`p-2 rounded-lg transition-all ${editor?.isActive('italic') ? 'bg-[#6A3DE8] text-white' : 'text-[#1F2937]/40 hover:bg-[#F6F7FB] hover:text-[#6A3DE8]'}`}
 title="Italic"
 >
 <Italic size={14} />
 </button>
 <div className="w-[1px] h-4 bg-[#E5E7EB] mx-1" />
 <button
 onClick={() => editor?.chain().focus().toggleBulletList().run()}
 className={`p-2 rounded-lg transition-all ${editor?.isActive('bulletList') ? 'bg-[#6A3DE8] text-white' : 'text-[#1F2937]/40 hover:bg-[#F6F7FB] hover:text-[#6A3DE8]'}`}
 title="Bullet List"
 >
 <List size={14} />
 </button>
 </div>

 {/* Editor Content */}
 <div className="p-4">
 <EditorContent editor={editor} />
 </div>
 </div>

 <div className="flex items-center gap-2 pt-2">
 <button 
 onClick={handleDescriptionSave}
 className="flex items-center gap-2 px-4 py-2 bg-[#6A3DE8] hover:bg-[#7C3AED] rounded-lg text-xs font-bold text-white transition-all shadow-md uppercase tracking-widest"
 >
 <Save size={14} />
 Save Changes
 </button>
 <button 
 onClick={handleDescriptionDiscard}
 className="px-4 py-2 hover:bg-[#F6F7FB] rounded-xl text-[#1F2937]/40 transition-all font-bold text-xs uppercase tracking-widest"
 >
 Discard
 </button>
 </div>
 </div>
 ) : (
 <div 
 onClick={() => !isCardCompleted && setIsEditingDescription(true)}
 className={`bg-[#F6F7FB] dark:bg-[#0F172A] p-4 rounded-2xl border border-transparent ${!isCardCompleted ? 'hover:border-[#E5E7EB] cursor-pointer' : ''} transition-all group min-h-[100px]`}
 >
 {activeCard.description ? (
 <div 
 className="text-sm text-[#1F2937]/80 leading-relaxed rich-text-view max-w-none"
 dangerouslySetInnerHTML={{ __html: activeCard.description }}
 />
 ) : (
 <p className="text-[#1F2937]/80 text-sm leading-relaxed opacity-50 italic">
 Add a more detailed description...
 </p>
 )}
 </div>
 )}
 </div>

 {/* Checklists */}
 <div>
 <div className="flex items-center gap-2 mb-4">
 <Layout size={18} className="text-[#1F2937]/40" />
 <h3 className="font-bold text-[#1F2937] dark:text-gray-100">Checklists</h3>
 </div>
 <ChecklistSection cardId={activeCard.id} checklists={activeCard.checklists} />
 </div>

 {/* Attachments */}
 <AttachmentSection card={activeCard} />

 </div>


 {/* Sidebar: Activity + Actions + Overdue History */}
 <div className="md:col-span-2 space-y-6">

 {/* Activity / Comments */}
 <div className="bg-[#F6F7FB] dark:bg-[#0F172A] rounded-2xl p-4 border border-[#E5E7EB] dark:border-[#334155]">
 <div className="flex items-center gap-2 mb-4">
 <MessageSquare size={15} className="text-[#6A3DE8]" />
 <h3 className="text-sm font-black text-[#1F2937] dark:text-gray-100">Activity</h3>
 </div>
 <CommentThread cardId={activeCard.id} card={activeCard} />
 </div>

 {/* Actions */}
 <div>
 <h3 className="text-xs font-bold text-[#1F2937]/40 uppercase tracking-widest mb-3">Actions</h3>
 <div className="space-y-2">
 <button 
 onClick={handleDuplicateCard}
 className="w-full flex items-center gap-3 px-3 py-2 text-sm font-semibold text-[#1F2937]/70 bg-[#F6F7FB] dark:bg-[#0F172A] hover:bg-[#E5E7EB] rounded-lg transition-all text-left"
 >
 <Copy size={14} />
 Duplicate
 </button>
 <button 
 onClick={handleShare}
 className="w-full flex items-center gap-3 px-3 py-2 text-sm font-semibold text-[#1F2937]/70 bg-[#F6F7FB] dark:bg-[#0F172A] hover:bg-[#E5E7EB] rounded-lg transition-all text-left"
 >
 <Share2 size={14} />
 Share
 </button>
 <button 
 onClick={handleDeleteCard}
 className="w-full flex items-center gap-3 px-3 py-2 text-sm font-semibold text-red-500 bg-[#F6F7FB] dark:bg-[#0F172A] hover:bg-red-50 rounded-lg transition-all text-left"
 >
 <Trash2 size={14} />
 Delete
 </button>
 </div>
 </div>

 {/* Overdue History */}
 {activeCard.overdueReason && (() => {
 const reasonBy = mockUsers.find(u => u.id === activeCard.overdueReasonBy);
 return (
 <div>
 <h3 className="text-xs font-bold text-[#1F2937]/40 uppercase tracking-widest mb-3">Overdue History</h3>
 <div className="bg-red-50 border border-red-100 rounded-2xl p-4 space-y-3">
 {/* Original due date */}
 {(activeCard.originalDueDate || activeCard.overdueReasonDate) && (
 <div>
 <p className="text-[10px] font-black text-[#1F2937]/40 uppercase tracking-wide mb-0.5">Original Due Date</p>
 <p className="text-[10px] font-bold text-red-600">
 {new Date(activeCard.originalDueDate || activeCard.dueDate!).toLocaleDateString('en-US', {
 month: 'short', day: 'numeric', year: 'numeric'
 })}
 </p>
 </div>
 )}
 {/* Who changed it */}
 {reasonBy && (
 <div className="flex items-center gap-2">
 <MemberAvatar name={reasonBy.name} src={reasonBy.avatar} size="sm" />
 <div>
 <p className="text-[10px] font-black text-[#1F2937]/40 uppercase tracking-wide">Rescheduled by</p>
 <p className="text-[10px] font-bold text-[#1F2937] dark:text-gray-100">{reasonBy.name}</p>
 </div>
 </div>
 )}
 {/* Reschedule date */}
 {activeCard.overdueReasonDate && (
 <div>
 <p className="text-[10px] font-black text-[#1F2937]/40 uppercase tracking-wide mb-0.5">Logged on</p>
 <p className="text-xs font-bold text-[#1F2937] dark:text-gray-100">
 {new Date(activeCard.overdueReasonDate).toLocaleDateString('en-US', {
 month: 'short', day: 'numeric', year: 'numeric'
 })}
 </p>
 </div>
 )}
 {/* Reason */}
 <div>
 <p className="text-[10px] font-black text-[#1F2937]/40 uppercase tracking-wide mb-1">Reason</p>
 <p className="text-[10px] text-red-700 leading-relaxed bg-white/60 rounded-xl px-3 py-2 border border-red-100">
 {activeCard.overdueReason}
 </p>
 </div>
 </div>
 </div>
 );
 })()}
 </div>
 </div>
 </div>
 </div>
 </motion.div>
 </div>
 <ConfirmDialog
 key="confirm-delete-dialog"
 isOpen={isConfirmDeleteOpen}
 title="Delete Card?"
 message={`Are you sure you want to delete "${activeCard.title}"? This action cannot be undone.`}
 confirmLabel="Delete Card"
 onConfirm={handleConfirmDelete}
 onCancel={() => setIsConfirmDeleteOpen(false)}
 />
 </AnimatePresence>
 );
};
