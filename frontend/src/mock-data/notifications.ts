import { Notification } from '../types';

export const mockNotifications: Notification[] = [
 {
 id: 'n1',
 userId: 'u1',
 title: 'Card assigned',
 message: 'Sarah Chen assigned you to "Research competition for Q4"',
 isRead: false,
 type: 'assignment',
 link: '/board/b1?cardId=c1',
 createdAt: new Date(Date.now() - 7200000).toISOString()
 },
 {
 id: 'n2',
 userId: 'u1',
 title: 'Mentioned in comment',
 message: 'Sarah Chen mentioned you in a comment on "Research competition for Q4"',
 isRead: true,
 type: 'mention',
 link: '/board/b1?cardId=c1',
 createdAt: new Date(Date.now() - 3600000).toISOString()
 }
];
