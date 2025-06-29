import { create } from 'zustand';
import { Message, MessageThread, MessageFolder, MessageTemplate, MessageType, MessagePriority, TenantType } from '../types';

interface MessageState {
  messages: Message[];
  threads: MessageThread[];
  folders: MessageFolder[];
  templates: MessageTemplate[];
  currentThread: MessageThread | null;
  selectedMessages: string[];
  isLoading: boolean;
  unreadCount: number;
  
  // Actions
  fetchMessages: (folderId?: string) => Promise<void>;
  fetchThreads: () => Promise<void>;
  fetchFolders: () => Promise<void>;
  sendMessage: (messageData: any) => Promise<void>;
  replyToMessage: (messageId: string, content: string, attachments?: File[]) => Promise<void>;
  markAsRead: (messageIds: string[]) => Promise<void>;
  markAsUnread: (messageIds: string[]) => Promise<void>;
  deleteMessages: (messageIds: string[]) => Promise<void>;
  archiveMessages: (messageIds: string[]) => Promise<void>;
  moveToFolder: (messageIds: string[], folderId: string) => Promise<void>;
  searchMessages: (query: string, filters?: any) => Promise<void>;
  createTemplate: (templateData: any) => Promise<void>;
  updateTemplate: (templateId: string, updates: any) => Promise<void>;
  deleteTemplate: (templateId: string) => Promise<void>;
  setCurrentThread: (thread: MessageThread | null) => void;
  setSelectedMessages: (messageIds: string[]) => void;
  getAvailableRecipients: (tenantType: TenantType) => Promise<any[]>;
}

// Mock data
const mockFolders: MessageFolder[] = [
  {
    id: 'inbox',
    name: 'Boîte de réception',
    type: 'inbox',
    tenantId: '',
    messageCount: 15,
    unreadCount: 3,
    color: '#3B82F6',
    icon: 'inbox'
  },
  {
    id: 'sent',
    name: 'Messages envoyés',
    type: 'sent',
    tenantId: '',
    messageCount: 8,
    unreadCount: 0,
    color: '#10B981',
    icon: 'send'
  },
  {
    id: 'drafts',
    name: 'Brouillons',
    type: 'drafts',
    tenantId: '',
    messageCount: 2,
    unreadCount: 0,
    color: '#F59E0B',
    icon: 'file-text'
  },
  {
    id: 'archive',
    name: 'Archives',
    type: 'archive',
    tenantId: '',
    messageCount: 25,
    unreadCount: 0,
    color: '#6B7280',
    icon: 'archive'
  }
];

const mockMessages: Message[] = [
  {
    id: '1',
    subject: 'Calendrier des examens du 2ème trimestre',
    content: 'Veuillez trouver ci-joint le calendrier officiel des examens du 2ème trimestre. Merci de bien vouloir vous y conformer et de nous faire part de vos observations éventuelles.',
    senderId: 'patronat-atlantique',
    senderName: 'Patronat de l\'Atlantique',
    senderType: 'patronat',
    senderTenantId: 'patronat-atlantique',
    recipients: [
      {
        id: '1',
        tenantId: 'ecole-sainte-marie',
        tenantName: 'École Sainte Marie',
        tenantType: 'school',
        isRead: false,
        status: 'delivered',
        deliveredAt: new Date('2024-12-10T09:00:00')
      },
      {
        id: '2',
        tenantId: 'college-notre-dame',
        tenantName: 'Collège Notre Dame',
        tenantType: 'school',
        isRead: true,
        readAt: new Date('2024-12-10T10:30:00'),
        status: 'read',
        deliveredAt: new Date('2024-12-10T09:00:00')
      }
    ],
    type: 'group',
    priority: 'high',
    status: 'sent',
    threadId: 'thread-1',
    isRead: false,
    sentAt: new Date('2024-12-10T08:45:00'),
    tags: ['examens', 'calendrier']
  },
  {
    id: '2',
    subject: 'Demande de report d\'examen',
    content: 'Nous sollicitons un report de l\'examen de mathématiques prévu le 15 décembre en raison d\'un problème technique dans notre établissement.',
    senderId: 'ecole-sainte-marie',
    senderName: 'École Sainte Marie',
    senderType: 'school',
    senderTenantId: 'ecole-sainte-marie',
    recipients: [
      {
        id: '1',
        tenantId: 'patronat-atlantique',
        tenantName: 'Patronat de l\'Atlantique',
        tenantType: 'patronat',
        isRead: true,
        readAt: new Date('2024-12-09T14:20:00'),
        status: 'read',
        deliveredAt: new Date('2024-12-09T13:15:00')
      }
    ],
    type: 'individual',
    priority: 'normal',
    status: 'sent',
    threadId: 'thread-2',
    isRead: true,
    sentAt: new Date('2024-12-09T13:15:00'),
    tags: ['demande', 'report']
  }
];

const mockThreads: MessageThread[] = [
  {
    id: 'thread-1',
    subject: 'Calendrier des examens du 2ème trimestre',
    participants: [
      {
        tenantId: 'patronat-atlantique',
        tenantName: 'Patronat de l\'Atlantique',
        tenantType: 'patronat',
        lastReadAt: new Date('2024-12-10T08:45:00')
      },
      {
        tenantId: 'ecole-sainte-marie',
        tenantName: 'École Sainte Marie',
        tenantType: 'school'
      },
      {
        tenantId: 'college-notre-dame',
        tenantName: 'Collège Notre Dame',
        tenantType: 'school',
        lastReadAt: new Date('2024-12-10T10:30:00')
      }
    ],
    lastMessageAt: new Date('2024-12-10T08:45:00'),
    messageCount: 1,
    unreadCount: 1,
    isArchived: false,
    tags: ['examens', 'calendrier']
  },
  {
    id: 'thread-2',
    subject: 'Demande de report d\'examen',
    participants: [
      {
        tenantId: 'ecole-sainte-marie',
        tenantName: 'École Sainte Marie',
        tenantType: 'school',
        lastReadAt: new Date('2024-12-09T13:15:00')
      },
      {
        tenantId: 'patronat-atlantique',
        tenantName: 'Patronat de l\'Atlantique',
        tenantType: 'patronat',
        lastReadAt: new Date('2024-12-09T14:20:00')
      }
    ],
    lastMessageAt: new Date('2024-12-09T13:15:00'),
    messageCount: 1,
    unreadCount: 0,
    isArchived: false,
    tags: ['demande', 'report']
  }
];

const mockTemplates: MessageTemplate[] = [
  {
    id: '1',
    name: 'Convocation réunion',
    subject: 'Convocation à la réunion du [DATE]',
    content: 'Vous êtes convié(e) à la réunion qui se tiendra le [DATE] à [HEURE] concernant [SUJET]. Merci de confirmer votre présence.',
    category: 'Administratif',
    tenantId: 'patronat-atlantique',
    isPublic: true,
    createdBy: 'user-1',
    createdAt: new Date('2024-11-01')
  },
  {
    id: '2',
    name: 'Rappel échéance',
    subject: 'Rappel - Échéance du [DATE]',
    content: 'Nous vous rappelons que l\'échéance pour [OBJET] est fixée au [DATE]. Merci de prendre les dispositions nécessaires.',
    category: 'Rappel',
    tenantId: 'patronat-atlantique',
    isPublic: true,
    createdBy: 'user-1',
    createdAt: new Date('2024-11-05')
  }
];

export const useMessageStore = create<MessageState>((set, get) => ({
  messages: mockMessages,
  threads: mockThreads,
  folders: mockFolders,
  templates: mockTemplates,
  currentThread: null,
  selectedMessages: [],
  isLoading: false,
  unreadCount: 3,

  fetchMessages: async (folderId?: string) => {
    set({ isLoading: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let filteredMessages = mockMessages;
      if (folderId && folderId !== 'inbox') {
        // Filter messages based on folder type
        filteredMessages = mockMessages.filter(message => {
          switch (folderId) {
            case 'sent':
              return message.status === 'sent';
            case 'drafts':
              return message.status === 'draft';
            case 'archive':
              return false; // No archived messages in mock data
            default:
              return true;
          }
        });
      }
      
      set({ messages: filteredMessages, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  fetchThreads: async () => {
    set({ isLoading: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      set({ threads: mockThreads, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  fetchFolders: async () => {
    set({ isLoading: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      set({ folders: mockFolders, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  sendMessage: async (messageData: any) => {
    set({ isLoading: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newMessage: Message = {
        id: Date.now().toString(),
        subject: messageData.subject,
        content: messageData.content,
        senderId: messageData.senderId,
        senderName: messageData.senderName,
        senderType: messageData.senderType,
        senderTenantId: messageData.senderTenantId,
        recipients: messageData.recipients,
        type: messageData.type,
        priority: messageData.priority || 'normal',
        status: 'sent',
        threadId: `thread-${Date.now()}`,
        isRead: true,
        sentAt: new Date(),
        attachments: messageData.attachments,
        tags: messageData.tags
      };

      set(state => ({
        messages: [newMessage, ...state.messages],
        isLoading: false
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  replyToMessage: async (messageId: string, content: string, attachments?: File[]) => {
    set({ isLoading: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const originalMessage = get().messages.find(m => m.id === messageId);
      if (!originalMessage) throw new Error('Message original non trouvé');

      const replyMessage: Message = {
        id: Date.now().toString(),
        subject: `Re: ${originalMessage.subject}`,
        content,
        senderId: 'current-user',
        senderName: 'Utilisateur Actuel',
        senderType: 'patronat',
        senderTenantId: 'current-tenant',
        recipients: [
          {
            id: Date.now().toString(),
            tenantId: originalMessage.senderTenantId,
            tenantName: originalMessage.senderName,
            tenantType: originalMessage.senderType,
            isRead: false,
            status: 'delivered',
            deliveredAt: new Date()
          }
        ],
        type: 'individual',
        priority: 'normal',
        status: 'sent',
        parentMessageId: messageId,
        threadId: originalMessage.threadId,
        isRead: true,
        sentAt: new Date()
      };

      set(state => ({
        messages: [replyMessage, ...state.messages],
        isLoading: false
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  markAsRead: async (messageIds: string[]) => {
    set({ isLoading: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set(state => ({
        messages: state.messages.map(message =>
          messageIds.includes(message.id)
            ? { ...message, isRead: true, readAt: new Date() }
            : message
        ),
        unreadCount: Math.max(0, state.unreadCount - messageIds.length),
        isLoading: false
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  markAsUnread: async (messageIds: string[]) => {
    set({ isLoading: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set(state => ({
        messages: state.messages.map(message =>
          messageIds.includes(message.id)
            ? { ...message, isRead: false, readAt: undefined }
            : message
        ),
        unreadCount: state.unreadCount + messageIds.length,
        isLoading: false
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  deleteMessages: async (messageIds: string[]) => {
    set({ isLoading: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set(state => ({
        messages: state.messages.filter(message => !messageIds.includes(message.id)),
        isLoading: false
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  archiveMessages: async (messageIds: string[]) => {
    set({ isLoading: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In a real implementation, messages would be moved to archive folder
      console.log('Messages archived:', messageIds);
      
      set({ isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  moveToFolder: async (messageIds: string[], folderId: string) => {
    set({ isLoading: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log('Messages moved to folder:', { messageIds, folderId });
      
      set({ isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  searchMessages: async (query: string, filters?: any) => {
    set({ isLoading: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const filteredMessages = mockMessages.filter(message =>
        message.subject.toLowerCase().includes(query.toLowerCase()) ||
        message.content.toLowerCase().includes(query.toLowerCase()) ||
        message.senderName.toLowerCase().includes(query.toLowerCase())
      );
      
      set({ messages: filteredMessages, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  createTemplate: async (templateData: any) => {
    set({ isLoading: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newTemplate: MessageTemplate = {
        id: Date.now().toString(),
        name: templateData.name,
        subject: templateData.subject,
        content: templateData.content,
        category: templateData.category,
        tenantId: templateData.tenantId,
        isPublic: templateData.isPublic || false,
        createdBy: 'current-user',
        createdAt: new Date()
      };

      set(state => ({
        templates: [...state.templates, newTemplate],
        isLoading: false
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  updateTemplate: async (templateId: string, updates: any) => {
    set({ isLoading: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set(state => ({
        templates: state.templates.map(template =>
          template.id === templateId ? { ...template, ...updates } : template
        ),
        isLoading: false
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  deleteTemplate: async (templateId: string) => {
    set({ isLoading: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set(state => ({
        templates: state.templates.filter(template => template.id !== templateId),
        isLoading: false
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  setCurrentThread: (thread: MessageThread | null) => {
    set({ currentThread: thread });
  },

  setSelectedMessages: (messageIds: string[]) => {
    set({ selectedMessages: messageIds });
  },

  getAvailableRecipients: async (tenantType: TenantType) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (tenantType === 'patronat') {
      // Patronat can send to schools and other patronats
      return [
        { id: 'ecole-sainte-marie', name: 'École Sainte Marie', type: 'school' },
        { id: 'college-notre-dame', name: 'Collège Notre Dame', type: 'school' },
        { id: 'lycee-saint-joseph', name: 'Lycée Saint Joseph', type: 'school' },
        { id: 'patronat-zou', name: 'Patronat du Zou', type: 'patronat' },
        { id: 'patronat-oueme', name: 'Patronat de l\'Ouémé', type: 'patronat' }
      ];
    } else {
      // School can send to its patronat and other schools in same region
      return [
        { id: 'patronat-atlantique', name: 'Patronat de l\'Atlantique', type: 'patronat' },
        { id: 'college-notre-dame', name: 'Collège Notre Dame', type: 'school' },
        { id: 'lycee-saint-joseph', name: 'Lycée Saint Joseph', type: 'school' }
      ];
    }
  }
}));