import { Board } from '../types';

export const mockBoards: Board[] = [
  {
    id: 'b1',
    title: 'Product Roadmap 2024',
    background: 'linear-gradient(to right, #8E2DE2, #4A00E0)',
    color: '#8E2DE2',
    isStarred: true,
    workspaceId: 'w1',
    ownerId: 'u1',
    memberIds: ['u1', 'u2', 'u3'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'b2',
    title: 'Mobile App Redesign',
    background: 'linear-gradient(to right, #00c6ff, #0072ff)',
    color: '#00c6ff',
    isStarred: false,
    workspaceId: 'w1',
    ownerId: 'u2',
    memberIds: ['u1', 'u2', 'u4'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'b3',
    title: 'Marketing Campaigns',
    background: 'linear-gradient(to right, #f953c6, #b91d73)',
    color: '#f953c6',
    isStarred: true,
    workspaceId: 'w2',
    ownerId: 'u3',
    memberIds: ['u3', 'u5'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'b4',
    title: 'Security Audit',
    background: 'linear-gradient(to right, #3a7bd5, #3a6073)',
    color: '#3a7bd5',
    isStarred: false,
    workspaceId: 'w2',
    ownerId: 'u1',
    memberIds: ['u1', 'u6'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'b5',
    title: 'Customer Onboarding',
    background: 'linear-gradient(to right, #6a11cb, #2575fc)',
    color: '#6a11cb',
    isStarred: false,
    workspaceId: 'w3',
    ownerId: 'u4',
    memberIds: ['u2', 'u4', 'u5'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
];
