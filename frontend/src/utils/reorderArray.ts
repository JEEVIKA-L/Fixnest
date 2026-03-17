import { arrayMove } from '@dnd-kit/sortable';

export const reorderArray = <T>(array: T[], fromIndex: number, toIndex: number): T[] => {
  return arrayMove(array, fromIndex, toIndex).map((item, index) => ({
    ...item,
    order: index,
  }));
};
