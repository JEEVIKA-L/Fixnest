import { useCallback } from 'react';
import { useBoardStore } from '../stores/useBoardStore';
import { Board } from '../types';

export const useBoards = () => {
  const { boards, activeBoard, isLoading, error, fetchBoards, fetchBoardById, addBoard, updateBoard, deleteBoard, starBoard } = useBoardStore();

  const getBoard = useCallback((id: string) => boards.find(b => b.id === id), [boards]);

  return {
    boards,
    activeBoard,
    isLoading,
    error,
    fetchBoards,
    fetchBoardById,
    addBoard,
    updateBoard,
    deleteBoard,
    starBoard,
    getBoard,
  };
};
