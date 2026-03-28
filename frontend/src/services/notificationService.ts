import { Notification } from '../types';
import { mockNotifications } from '../mock-data/notifications';
import { delay, simulateError } from './serviceHelpers';

export const notificationService = {
 getNotifications: async (userId: string): Promise<Notification[]> => {
 await delay(300);
 simulateError();
 return mockNotifications.filter(n => n.userId === userId);
 },

 markAsRead: async (id: string): Promise<void> => {
 await delay(200);
 simulateError();
 const notification = mockNotifications.find(n => n.id === id);
 if (notification) notification.isRead = true;
 },

 markAllAsRead: async (userId: string): Promise<void> => {
 await delay(400);
 simulateError();
 mockNotifications.forEach(n => {
 if (n.userId === userId) n.isRead = true;
 });
 },

 createNotification: async (notificationData: Partial<Notification>): Promise<Notification> => {
 await delay(100);
 const newNotification: Notification = {
 id: `n-${Math.random().toString(36).substr(2, 9)}`,
 userId: notificationData.userId || '',
 title: notificationData.title || 'New Notification',
 message: notificationData.message || '',
 isRead: false,
 type: notificationData.type || 'system',
 link: notificationData.link,
 createdAt: new Date().toISOString(),
 };
 mockNotifications.push(newNotification);
 return newNotification;
 }
};
