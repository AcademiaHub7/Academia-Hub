import { create } from 'zustand';

interface LibraryResource {
  id: string;
  title: string;
  description: string;
  type: string;
  category: string;
  subject: string;
  level: string;
  author: string;
  publishedDate: Date;
  fileSize: string;
  downloadCount: number;
  rating: number;
  tags: string[];
  thumbnailUrl: string;
  fileUrl: string;
  isOfficial: boolean;
}

interface LibraryState {
  resources: LibraryResource[];
  isLoading: boolean;
  
  fetchResources: (filters?: any) => Promise<void>;
  downloadResource: (resourceId: string) => Promise<void>;
  uploadResource: (resourceData: any) => Promise<void>;
  rateResource: (resourceId: string, rating: number) => Promise<void>;
}

export const useLibraryStore = create<LibraryState>((set, get) => ({
  resources: [],
  isLoading: false,

  fetchResources: async (filters?: any) => {
    set({ isLoading: true });
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock resources data would be fetched here
      const mockResources: LibraryResource[] = [];
      
      set({ resources: mockResources, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  downloadResource: async (resourceId: string) => {
    set({ isLoading: true });
    try {
      // Mock API call to download resource
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Resource downloaded:', { resourceId });
      
      // Update download count
      set(state => ({
        resources: state.resources.map(resource =>
          resource.id === resourceId 
            ? { ...resource, downloadCount: resource.downloadCount + 1 }
            : resource
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  uploadResource: async (resourceData: any) => {
    set({ isLoading: true });
    try {
      // Mock API call to upload resource
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Resource uploaded:', { resourceData });
      
      set({ isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  rateResource: async (resourceId: string, rating: number) => {
    set({ isLoading: true });
    try {
      // Mock API call to rate resource
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log('Resource rated:', { resourceId, rating });
      
      set({ isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
}));