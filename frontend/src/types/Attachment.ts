export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'video' | 'file';
  createdAt: string;
}
