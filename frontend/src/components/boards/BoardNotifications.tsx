import React, { useEffect, useRef } from 'react';
import { useBoardStore } from '@/stores/useBoardStore';
import { useCardStore } from '@/stores/useCardStore';
import { useNotificationStore } from '@/stores/useNotificationStore';
import { useUserStore } from '@/stores/useUserStore';

export const BoardNotifications = () => {
 const { activeBoard } = useBoardStore();
 const { cards } = useCardStore();
 const { addNotification } = useNotificationStore();
 const { currentUser } = useUserStore();
 
 const notifiedDueDates = useRef<Set<string>>(new Set());
 const prevMemberIds = useRef<string[]>([]);

 // 1. Due Date Check
 useEffect(() => {
 if (!activeBoard || !cards || !currentUser) return;

 const checkDueDates = () => {
 const now = new Date();
 const next24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);

 Object.values(cards).flat().forEach(card => {
 if (!card.dueDate) return;

 const dueDate = new Date(card.dueDate);
 const isDueSoon = dueDate > now && dueDate <= next24Hours;

 if (isDueSoon && !notifiedDueDates.current.has(card.id)) {
 // Notify members and admins
 const boardMembers = useUserStore.getState().users.filter(u => activeBoard.memberIds.includes(u.id));
 const boardAdmins = boardMembers.filter(u => u.role === 'admin').map(u => u.id);
 const recipients = [...new Set([...card.memberIds, activeBoard.ownerId, ...boardAdmins])];
 recipients.forEach(userId => {
 addNotification({
 userId,
 title: 'Task Due Soon',
 message: `"${card.title}" is due within 24 hours!`,
 type: 'due_date',
 link: `/board/${activeBoard.id}?cardId=${card.id}`
 });
 });
 notifiedDueDates.current.add(card.id);
 }
 });
 };

 const interval = setInterval(checkDueDates, 60000); // Check every minute
 checkDueDates(); // Initial check

 return () => clearInterval(interval);
 }, [cards, activeBoard, currentUser, addNotification]);

 // 2. New Member Check
 useEffect(() => {
 if (!activeBoard || !currentUser) return;

 if (prevMemberIds.current.length > 0 && activeBoard.memberIds.length > prevMemberIds.current.length) {
 const newIds = activeBoard.memberIds.filter(id => !prevMemberIds.current.includes(id));
 
 newIds.forEach(newUserId => {
 // Notify board owner and existing members
 const boardMembers = useUserStore.getState().users.filter(u => activeBoard.memberIds.includes(u.id));
 const boardAdmins = boardMembers.filter(u => u.role === 'admin').map(u => u.id);
 const recipients = [...new Set([...prevMemberIds.current, activeBoard.ownerId, ...boardAdmins])];
 recipients.forEach(rid => {
 if (rid !== currentUser.id) {
 addNotification({
 userId: rid,
 title: 'New Member Joined',
 message: `A new member has joined the board!`,
 type: 'user_joined',
 link: `/board/${activeBoard.id}`
 });
 }
 });
 });
 }

 prevMemberIds.current = activeBoard.memberIds;
 }, [activeBoard?.memberIds, activeBoard?.ownerId, currentUser, addNotification]);

 return null;
};
