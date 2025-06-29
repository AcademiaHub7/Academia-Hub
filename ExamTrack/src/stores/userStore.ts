import { create } from 'zustand';
import { User } from '../types';

interface UserState {
  users: User[];
  isLoading: boolean;
  
  fetchUsers: (tenantId: string) => Promise<void>;
  createUser: (userData: Partial<User>) => Promise<void>;
  updateUser: (userId: string, updates: Partial<User>) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  resetPassword: (userId: string) => Promise<string>;
}

export const useUserStore = create<UserState>((set, get) => ({
  users: [],
  isLoading: false,

  fetchUsers: async (tenantId: string) => {
    set({ isLoading: true });
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock users data would be fetched here
      const mockUsers: User[] = [];
      
      set({ users: mockUsers, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  createUser: async (userData: Partial<User>) => {
    set({ isLoading: true });
    try {
      // Mock API call to create user
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newUser: User = {
        id: Date.now().toString(),
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: userData.email || '',
        role: userData.role || 'teacher',
        tenantId: userData.tenantId || '',
        tenantType: userData.tenantType || 'school',
        isActive: true,
        createdAt: new Date(),
      };

      set(state => ({
        users: [...state.users, newUser],
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  updateUser: async (userId: string, updates: Partial<User>) => {
    set({ isLoading: true });
    try {
      // Mock API call to update user
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      set(state => ({
        users: state.users.map(user =>
          user.id === userId ? { ...user, ...updates } : user
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  deleteUser: async (userId: string) => {
    set({ isLoading: true });
    try {
      // Mock API call to delete user
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      set(state => ({
        users: state.users.filter(user => user.id !== userId),
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  resetPassword: async (userId: string) => {
    set({ isLoading: true });
    try {
      // Mock API call to reset password
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newPassword = 'TempPass' + Math.random().toString(36).substring(2, 8);
      
      set({ isLoading: false });
      return newPassword;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
}));