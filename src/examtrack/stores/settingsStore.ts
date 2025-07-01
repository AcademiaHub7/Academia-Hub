import { create } from 'zustand';

interface SettingsState {
  settings: any;
  isLoading: boolean;
  
  fetchSettings: (tenantId: string) => Promise<void>;
  updateSettings: (section: string, data: any) => Promise<void>;
  resetSettings: (section: string) => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  settings: {},
  isLoading: false,

  fetchSettings: async (tenantId: string) => {
    set({ isLoading: true });
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock settings data
      const mockSettings = {
        profile: {},
        organization: {},
        notifications: {},
        security: {},
        appearance: {}
      };
      
      set({ settings: mockSettings, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  updateSettings: async (section: string, data: any) => {
    set({ isLoading: true });
    try {
      // Mock API call to update settings
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Settings updated:', { section, data });
      
      set(state => ({
        settings: {
          ...state.settings,
          [section]: { ...state.settings[section], ...data }
        },
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  resetSettings: async (section: string) => {
    set({ isLoading: true });
    try {
      // Mock API call to reset settings
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Settings reset:', { section });
      
      set({ isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
}));