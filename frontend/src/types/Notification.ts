export interface Notification {
 id: string;
 userId: string;
 title: string;
 message: string;
 isRead: boolean;
 type: 'mention' | 'assignment' | 'due_date' | 'card_moved' | 'comment_added' | 'user_joined' | 'system';
 link?: string;
 createdAt: string;
}
