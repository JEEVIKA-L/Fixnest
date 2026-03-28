export interface Board {
 id: string;
 title: string;
 background?: string;
 color?: string;
 isStarred: boolean;
 workspaceId: string;
 ownerId: string;
 memberIds: string[];
 createdAt: string;
 updatedAt: string;
 isArchived?: boolean;
}
