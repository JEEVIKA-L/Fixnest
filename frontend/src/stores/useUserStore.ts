import { create } from 'zustand';
import { User } from '../types';
import { userService } from '../services/userService';

interface UserState {
  users: User[];
  currentUser: User | null;
  isLoading: boolean;
  error: string | null;
  fetchUsers: () => Promise<void>;
  fetchCurrentUser: () => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
  users: [],
  currentUser: null,
  isLoading: false,
  error: null,

  fetchUsers: async () => {
    set({ isLoading: true, error: null });
    try {
      const users = await userService.getUsers();
      set({ users, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchCurrentUser: async () => {
    try {
      const currentUser = await userService.getCurrentUser();
      set({ currentUser });
    } catch (error: any) {
      set({ error: error.message });
    }
  },
}));
