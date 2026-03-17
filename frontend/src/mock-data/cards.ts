import { Card } from '../types';

export const mockCards: Card[] = [
  {
    id: 'c1',
    title: 'Research competition for Q4',
    description: 'Analyze competitors marketing strategies and product updates.',
    listId: 'li1',
    boardId: 'b1',
    order: 0,
    memberIds: ['u1', 'u2'],
    labelIds: ['l5', 'l7'],
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString(),
    checklists: [
      {
        id: 'ck1',
        title: 'Competitors',
        items: [
          { id: 'cki1', title: 'Competitor A', isCompleted: true },
          { id: 'cki2', title: 'Competitor B', isCompleted: false },
        ]
      }
    ],
    attachments: [],
    commentIds: ['co1'],
    activityIds: ['a1'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'u1'
  },
  {
    id: 'c2',
    title: 'Design system update',
    description: 'Implement new typography and color tokens.',
    listId: 'li1',
    boardId: 'b1',
    order: 1,
    memberIds: ['u2'],
    labelIds: ['l7'],
    dueDate: new Date(Date.now() + 86400000 * 5).toISOString(),
    attachments: [],
    checklists: [],
    commentIds: [],
    activityIds: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'u2'
  },
  {
    id: 'c3',
    title: 'API Performance audit',
    description: 'Identify bottlenecks in the analytics endpoints.',
    listId: 'li2',
    boardId: 'b1',
    order: 0,
    memberIds: ['u1', 'u3'],
    labelIds: ['l1', 'l6'],
    dueDate: new Date(Date.now() - 86400000).toISOString(),
    attachments: [
      {
        id: 'at1',
        name: 'Performance bottlenecks.png',
        url: 'https://images.unsplash.com/photo-1551288049-bbbda536339a?auto=format&fit=crop&w=800&q=80',
        type: 'image',
        createdAt: new Date().toISOString()
      }
    ],
    coverImageId: 'at1',
    checklists: [],
    commentIds: [],
    activityIds: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'u3'
  },
  {
    id: 'c4',
    title: 'User feedback collection',
    description: 'Reach out to top 10 power users for feedback.',
    listId: 'li4',
    boardId: 'b1',
    order: 0,
    memberIds: ['u4'],
    labelIds: ['l5'],
    attachments: [],
    checklists: [],
    commentIds: [],
    activityIds: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'u1'
  },
  {
    id: 'c5',
    title: 'Landing page copy',
    description: 'Rewrite the landing page hero section copy.',
    listId: 'li5',
    boardId: 'b2',
    order: 0,
    memberIds: ['u3'],
    labelIds: ['l7'],
    attachments: [],
    checklists: [],
    commentIds: [],
    activityIds: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'u4'
  },
];

// Generate more cards to reach ~50
for (let i = 6; i <= 50; i++) {
  const listIds = ['li1', 'li2', 'li3', 'li4', 'li5', 'li6', 'li7', 'li8'];
  const listId = listIds[Math.floor(Math.random() * listIds.length)];
  const boardId = listId.startsWith('li1') || listId.startsWith('li2') || listId.startsWith('li3') || listId.startsWith('li4') ? 'b1' : 'b2';
  
  mockCards.push({
    id: `c${i}`,
    title: `Card ${i}: Automate ${['testing', 'deployment', 'reporting', 'onboarding'][i % 4]} processes`,
    description: `Detailed description for card ${i}`,
    listId,
    boardId,
    order: i,
    memberIds: [`u${(i % 6) + 1}`],
    labelIds: [`l${(i % 7) + 1}`],
    dueDate: i % 3 === 0 ? new Date(Date.now() + 86400000 * (i % 10)).toISOString() : undefined,
    attachments: [],
    checklists: [],
    commentIds: [],
    activityIds: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: `u${(i % 6) + 1}`
  });
}
