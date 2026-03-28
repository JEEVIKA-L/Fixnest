export interface List {
 id: string;
 title: string;
 boardId: string;
 order: number;
 createdAt: string;
 updatedAt: string;
 isArchived?: boolean;
 color?: string;
}
