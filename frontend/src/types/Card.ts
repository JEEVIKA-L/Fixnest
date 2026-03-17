import { Checklist } from './Checklist';
import { Attachment } from './Attachment';

export interface Card {
  id: string;
  title: string;
  description: string;
  listId: string;
  boardId: string;
  order: number;
  memberIds: string[];
  labelIds: string[];
  dueDate?: string;
  attachments: Attachment[];
  coverImageId?: string;
  checklists: Checklist[];
  commentIds: string[];
  activityIds: string[];
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  overdueReason?: string;
  overdueReasonDate?: string;
  overdueReasonBy?: string;
  originalDueDate?: string; // first due date, preserved across reschedules
  lastMovedAt?: string;
  reminderAt?: string;
  isArchived?: boolean;
}
