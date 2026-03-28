import { create } from 'zustand';
import { Notification } from '../types';
import { notificationService } from '../services/notificationService';
import { useUserStore } from './useUserStore';
import { toast } from 'sonner';

interface NotificationState {
 notifications: Notification[];
 isLoading: boolean;
 error: string | null;
 fetchNotifications: (userId: string) => Promise<void>;
 markAsRead: (id: string) => Promise<void>;
 markAllAsRead: (userId: string) => Promise<void>;
 addNotification: (notification: Partial<Notification>) => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
 notifications: [],
 isLoading: false,
 error: null,

 fetchNotifications: async (userId: string) => {
 set({ isLoading: true, error: null });
 try {
 const notifications = await notificationService.getNotifications(userId);
 set({ notifications, isLoading: false });
 } catch (error: any) {
 set({ error: error.message, isLoading: false });
 }
 },

 addNotification: async (notificationData) => {
 try {
 const newNotification = await notificationService.createNotification(notificationData);
 
 // Only add to local state if the notification is for the current user
 const currentUser = useUserStore.getState().currentUser;
 if (currentUser && newNotification.userId === currentUser.id) {
 set((state) => ({
 notifications: [newNotification, ...state.notifications]
 }));
 }
 
 // Visual feedback if it's the current user
 if (currentUser && newNotification.userId === currentUser.id) {
 toast(newNotification.title, {
 description: newNotification.message,
 action: newNotification.link ? {
 label: 'View',
 onClick: () => window.location.href = newNotification.link!
 } : undefined,
 duration: 5000,
 });
 }
 } catch (error: any) {
 set({ error: error.message });
 }
 },

 markAsRead: async (id) => {
 try {
 await notificationService.markAsRead(id);
 set((state) => ({
 notifications: state.notifications.map(n => n.id === id ? { ...n, isRead: true } : n)
 }));
 } catch (error: any) {
 set({ error: error.message });
 }
 },

 markAllAsRead: async (userId) => {
 try {
 await notificationService.markAllAsRead(userId);
 set((state) => ({
 notifications: state.notifications.map(n => ({ ...n, isRead: true }))
 }));
 } catch (error: any) {
 set({ error: error.message });
 }
 },
}));
