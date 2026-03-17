'use client';

import React from 'react';
import { Paperclip, Image as ImageIcon, Trash2, Layout, Plus, ExternalLink } from 'lucide-react';
import { Card, Attachment } from '@/types';
import { useCardStore } from '@/stores/useCardStore';
import { toast } from 'sonner';

interface AttachmentSectionProps {
  card: Card;
}

export const AttachmentSection = ({ card }: AttachmentSectionProps) => {
  const { updateCard } = useCardStore();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Simulate file upload
    const newAttachment: Attachment = {
      id: `at-${Math.random().toString(36).substr(2, 9)}`,
      name: file.name,
      url: URL.createObjectURL(file),
      type: file.type.startsWith('image/') ? 'image' : 'file',
      createdAt: new Date().toISOString(),
    };

    const updatedAttachments = [...(card.attachments || []), newAttachment];
    await updateCard(card.id, { attachments: updatedAttachments });
    toast.success('File uploaded');
  };

  const handleDelete = async (id: string) => {
    const updatedAttachments = (card.attachments || []).filter(at => at.id !== id);
    const updates: Partial<Card> = { attachments: updatedAttachments };
    if (card.coverImageId === id) {
      updates.coverImageId = undefined;
    }
    await updateCard(card.id, updates);
    toast.error('Attachment removed');
  };

  const setAsCover = async (id: string) => {
    await updateCard(card.id, { coverImageId: id });
    toast.success('Cover image set');
  };

  const removeCover = async () => {
    await updateCard(card.id, { coverImageId: undefined });
    toast.success('Cover image removed');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Paperclip size={18} className="text-[#1F2937]/40" />
          <h3 className="font-bold text-[#1F2937]">Attachments</h3>
        </div>
        <label className="cursor-pointer bg-[#F6F7FB] hover:bg-[#E5E7EB] px-3 py-1 rounded-lg text-xs font-bold text-[#1F2937]/70 transition-all flex items-center gap-2">
          <Plus size={14} />
          Add
          <input type="file" className="hidden" onChange={handleFileUpload} />
        </label>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {(card.attachments || []).map((at) => (
          <div key={at.id} className="group flex items-start gap-4 p-3 rounded-2xl hover:bg-[#F6F7FB] transition-all border border-transparent hover:border-[#E5E7EB]">
            {/* Thumbnail */}
            <div className="w-24 h-20 rounded-xl overflow-hidden bg-white border border-[#E5E7EB] flex-shrink-0 flex items-center justify-center relative shadow-sm">
              {at.type === 'image' ? (
                <img 
                  src={at.url} 
                  alt={at.name} 
                  className="w-full h-full object-cover" 
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://images.unsplash.com/photo-1544391496-1ca7c97457cb?auto=format&fit=crop&w=200&q=80'; // Fallback to a nice abstract project image
                  }}
                />
              ) : (
                <Paperclip size={20} className="text-[#1F2937]/20" />
              )}
              {card.coverImageId === at.id && (
                <div className="absolute top-1 right-1 bg-[#6A3DE8] text-white p-1 rounded-lg">
                  <Layout size={10} />
                </div>
              )}
            </div>
            
            {/* Info */}
            <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch py-0.5">
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-bold text-sm text-[#1F2937] truncate block flex-1">{at.name}</span>
                  <a href={at.url} target="_blank" rel="noreferrer" className="text-[#1F2937]/30 hover:text-[#6A3DE8] transition-all flex-shrink-0">
                    <ExternalLink size={14} />
                  </a>
                </div>
                <p className="text-[10px] font-black text-[#1F2937]/30 uppercase tracking-widest">
                  Added {new Date(at.createdAt).toLocaleDateString()}
                </p>
              </div>
              
              <div className="flex items-center gap-4 mt-2">
                {at.type === 'image' && (
                  card.coverImageId === at.id ? (
                    <button onClick={removeCover} className="text-[10px] font-black uppercase tracking-wider text-[#1F2937]/40 hover:text-red-500 flex items-center gap-1.5 transition-all">
                      <Layout size={12} />
                      Remove cover
                    </button>
                  ) : (
                    <button onClick={() => setAsCover(at.id)} className="text-[10px] font-black uppercase tracking-wider text-[#1F2937]/40 hover:text-[#6A3DE8] flex items-center gap-1.5 transition-all">
                      <Layout size={12} />
                      Make cover
                    </button>
                  )
                )}
                <button onClick={() => handleDelete(at.id)} className="text-[10px] font-black uppercase tracking-wider text-[#1F2937]/40 hover:text-red-500 flex items-center gap-1.5 transition-all">
                  <Trash2 size={12} />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {(card.attachments || []).length === 0 && (
        <div className="bg-[#F6F7FB]/50 border-2 border-dashed border-[#E5E7EB] rounded-2xl p-8 text-center">
          <Paperclip size={24} className="mx-auto text-[#1F2937]/10 mb-2" />
          <p className="text-xs font-bold text-[#1F2937]/30">No attachments yet</p>
        </div>
      )}
    </div>
  );
};
