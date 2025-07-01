import { create } from 'zustand';

interface ForumPost {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  author: any;
  createdAt: Date;
  updatedAt: Date;
  views: number;
  replies: number;
  likes: number;
  dislikes: number;
  isPinned: boolean;
  isLocked: boolean;
  isSolved: boolean;
}

interface ForumReply {
  id: string;
  postId: string;
  content: string;
  author: any;
  createdAt: Date;
  likes: number;
  dislikes: number;
  isAccepted: boolean;
}

interface ForumState {
  posts: ForumPost[];
  replies: ForumReply[];
  isLoading: boolean;
  
  fetchPosts: (filters?: any) => Promise<void>;
  createPost: (postData: any) => Promise<void>;
  updatePost: (postId: string, updates: any) => Promise<void>;
  deletePost: (postId: string) => Promise<void>;
  likePost: (postId: string) => Promise<void>;
  replyToPost: (postId: string, content: string) => Promise<void>;
}

export const useForumStore = create<ForumState>((set, get) => ({
  posts: [],
  replies: [],
  isLoading: false,

  fetchPosts: async (filters?: any) => {
    set({ isLoading: true });
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock posts data would be fetched here
      const mockPosts: ForumPost[] = [];
      
      set({ posts: mockPosts, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  createPost: async (postData: any) => {
    set({ isLoading: true });
    try {
      // Mock API call to create post
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newPost: ForumPost = {
        id: Date.now().toString(),
        title: postData.title,
        content: postData.content,
        category: postData.category,
        tags: postData.tags || [],
        author: {
          id: '1',
          name: 'Current User',
          role: 'Enseignant'
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        views: 0,
        replies: 0,
        likes: 0,
        dislikes: 0,
        isPinned: false,
        isLocked: false,
        isSolved: false
      };

      set(state => ({
        posts: [newPost, ...state.posts],
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  updatePost: async (postId: string, updates: any) => {
    set({ isLoading: true });
    try {
      // Mock API call to update post
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      set(state => ({
        posts: state.posts.map(post =>
          post.id === postId ? { ...post, ...updates, updatedAt: new Date() } : post
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  deletePost: async (postId: string) => {
    set({ isLoading: true });
    try {
      // Mock API call to delete post
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      set(state => ({
        posts: state.posts.filter(post => post.id !== postId),
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  likePost: async (postId: string) => {
    try {
      // Mock API call to like post
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set(state => ({
        posts: state.posts.map(post =>
          post.id === postId ? { ...post, likes: post.likes + 1 } : post
        ),
      }));
    } catch (error) {
      throw error;
    }
  },

  replyToPost: async (postId: string, content: string) => {
    set({ isLoading: true });
    try {
      // Mock API call to reply to post
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newReply: ForumReply = {
        id: Date.now().toString(),
        postId,
        content,
        author: {
          id: '1',
          name: 'Current User',
          role: 'Enseignant'
        },
        createdAt: new Date(),
        likes: 0,
        dislikes: 0,
        isAccepted: false
      };

      set(state => ({
        replies: [...state.replies, newReply],
        posts: state.posts.map(post =>
          post.id === postId ? { ...post, replies: post.replies + 1 } : post
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
}));