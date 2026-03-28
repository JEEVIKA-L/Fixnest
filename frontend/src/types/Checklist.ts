export interface ChecklistItem {
 id: string;
 title: string;
 isCompleted: boolean;
 memberIds?: string[];
 dueDate?: string;
 labelIds?: string[];
}

export interface Checklist {
 id: string;
 title: string;
 items: ChecklistItem[];
}
