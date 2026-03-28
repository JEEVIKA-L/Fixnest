import { useCallback } from 'react';
import { useListStore } from '../stores/useListStore';
import { List } from '../types';

export const useLists = (boardId?: string) => {
 const { lists, isLoading, error, fetchLists, createList, updateList, moveList, deleteList, archiveList, restoreList } = useListStore();

 const fetchBoardLists = useCallback(() => {
 if (boardId) {
 fetchLists(boardId);
 }
 }, [boardId, fetchLists]);

 const filteredLists = boardId ? lists.filter(l => l.boardId === boardId) : lists;

 return {
 lists: filteredLists,
 isLoading,
 error,
 fetchBoardLists,
 createList,
 updateList,
 moveList,
 deleteList,
 archiveList,
 restoreList,
 reorderLists: useListStore().reorderLists,
 };
};
