import { Activity } from '../types';

export const mockActivities: Activity[] = [
 // ── Card c1 ──────────────────────────────────────────────────────────────
 {
 id: 'a1',
 userId: 'u1',
 entityId: 'c1',
 entityType: 'card',
 action: 'created',
 createdAt: new Date(Date.now() - 7 * 24 * 3600_000).toISOString(),
 },
 {
 id: 'a2',
 userId: 'u2',
 entityId: 'c1',
 entityType: 'card',
 action: 'member_added',
 details: 'u3',
 createdAt: new Date(Date.now() - 5 * 24 * 3600_000).toISOString(),
 },
 {
 id: 'a3',
 userId: 'u2',
 entityId: 'c1',
 entityType: 'card',
 action: 'due_date_updated',
 details: new Date(Date.now() + 3 * 24 * 3600_000).toISOString(),
 createdAt: new Date(Date.now() - 3 * 24 * 3600_000).toISOString(),
 },

 // ── Card c2 ──────────────────────────────────────────────────────────────
 {
 id: 'a4',
 userId: 'u3',
 entityId: 'c2',
 entityType: 'card',
 action: 'created',
 createdAt: new Date(Date.now() - 10 * 24 * 3600_000).toISOString(),
 },
 {
 id: 'a5',
 userId: 'u1',
 entityId: 'c2',
 entityType: 'card',
 action: 'member_added',
 details: 'u2',
 createdAt: new Date(Date.now() - 8 * 24 * 3600_000).toISOString(),
 },

 // ── Card c3 ──────────────────────────────────────────────────────────────
 {
 id: 'a6',
 userId: 'u2',
 entityId: 'c3',
 entityType: 'card',
 action: 'created',
 createdAt: new Date(Date.now() - 14 * 24 * 3600_000).toISOString(),
 },
 {
 id: 'a7',
 userId: 'u3',
 entityId: 'c3',
 entityType: 'card',
 action: 'due_date_updated',
 details: new Date(Date.now() - 2 * 24 * 3600_000).toISOString(),
 createdAt: new Date(Date.now() - 12 * 24 * 3600_000).toISOString(),
 },
 {
 id: 'a8',
 userId: 'u1',
 entityId: 'c3',
 entityType: 'card',
 action: 'member_added',
 details: 'u3',
 createdAt: new Date(Date.now() - 10 * 24 * 3600_000).toISOString(),
 },

 // ── Card c4 ──────────────────────────────────────────────────────────────
 {
 id: 'a9',
 userId: 'u1',
 entityId: 'c4',
 entityType: 'card',
 action: 'created',
 createdAt: new Date(Date.now() - 6 * 24 * 3600_000).toISOString(),
 },
 {
 id: 'a10',
 userId: 'u2',
 entityId: 'c4',
 entityType: 'card',
 action: 'due_date_updated',
 details: new Date(Date.now() + 7 * 24 * 3600_000).toISOString(),
 createdAt: new Date(Date.now() - 5 * 24 * 3600_000).toISOString(),
 },
];
