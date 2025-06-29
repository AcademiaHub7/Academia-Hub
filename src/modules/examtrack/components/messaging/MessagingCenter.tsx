import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { useMessageStore } from '../../stores/messageStore';
import { 
  Mail, 
  Send, 
  Inbox, 
  Archive, 
  Trash2,
  Plus,
  Search,
  Filter,
  Star,
  Paperclip,
  MoreVertical,
  Reply,
  ReplyAll,
  Forward,
  Eye,
  EyeOff,
  Clock,
  AlertCircle,
  Check,
  X,
  Users,
  FileText,
  Download
} from 'lucide-react';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { MessageComposer } from './MessageComposer';
import { MessageViewer } from './MessageViewer';

export const MessagingCenter: React.FC = () => {
  const { user, tenant } = useAuthStore();
  const { 
    messages, 
    folders, 
    templates,
    selectedMessages,
    unreadCount,
    isLoading,
    fetchMessages,
    fetchFolders,
    markAsRead,
    markAsUnread,
    deleteMessages,
    archiveMessages,
    setSelectedMessages,
    searchMessages
  } = useMessageStore();

  const [selectedFolder, setSelectedFolder] = useState('inbox');
  const [searchTerm, setSearchTerm] = useState('');
  const [showComposer, setShowComposer] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'conversation'>('list');

  useEffect(() => {
    fetchFolders();
    fetchMessages(selectedFolder);
  }, [selectedFolder, fetchFolders, fetchMessages]);

  const handleFolderSelect = (folderId: string) => {
    setSelectedFolder(folderId);
    setSelectedMessage(null);
    setSelectedMessages([]);
  };

  const handleMessageSelect = (messageId: string) => {
    const message = messages.find(m => m.id === messageId);
    if (message) {
      setSelectedMessage(message);
      if (!message.isRead) {
        markAsRead([messageId]);
      }
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedMessages.length === 0) return;

    switch (action) {
      case 'mark_read':
        await markAsRead(selectedMessages);
        break;
      case 'mark_unread':
        await markAsUnread(selectedMessages);
        break;
      case 'archive':
        await archiveMessages(selectedMessages);
        break;
      case 'delete':
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ces messages ?')) {
          await deleteMessages(selectedMessages);
        }
        break;
    }
    setSelectedMessages([]);
  };

  const handleSearch = async (query: string) => {
    setSearchTerm(query);
    if (query.trim()) {
      await searchMessages(query);
    } else {
      await fetchMessages(selectedFolder);
    }
  };

  const toggleMessageSelection = (messageId: string) => {
    const isSelected = selectedMessages.includes(messageId);
    if (isSelected) {
      setSelectedMessages(selectedMessages.filter(id => id !== messageId));
    } else {
      setSelectedMessages([...selectedMessages, messageId]);
    }
  };

  const selectAllMessages = () => {
    if (selectedMessages.length === messages.length) {
      setSelectedMessages([]);
    } else {
      setSelectedMessages(messages.map(m => m.id));
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'high':
        return <AlertCircle className="w-4 h-4 text-orange-500" />;
      default:
        return null;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <Check className="w-4 h-4 text-green-500" />;
      case 'delivered':
        return <Check className="w-4 h-4 text-blue-500" />;
      case 'failed':
        return <X className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'À l\'instant';
    if (diffInHours < 24) return `Il y a ${diffInHours}h`;
    if (diffInHours < 48) return 'Hier';
    
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'short',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Messagerie</h2>
            <button
              onClick={() => setShowComposer(true)}
              className="flex items-center space-x-1 px-3 py-2 bg-primary-color text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Nouveau</span>
            </button>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-color focus:border-transparent text-sm"
            />
          </div>
        </div>

        {/* Folders */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-2">
            {folders.map((folder) => (
              <button
                key={folder.id}
                onClick={() => handleFolderSelect(folder.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                  selectedFolder === folder.id
                    ? 'bg-primary-color text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {folder.type === 'inbox' && <Inbox className="w-4 h-4" />}
                  {folder.type === 'sent' && <Send className="w-4 h-4" />}
                  {folder.type === 'drafts' && <FileText className="w-4 h-4" />}
                  {folder.type === 'archive' && <Archive className="w-4 h-4" />}
                  {folder.type === 'trash' && <Trash2 className="w-4 h-4" />}
                  <span>{folder.name}</span>
                </div>
                {folder.unreadCount > 0 && (
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    selectedFolder === folder.id
                      ? 'bg-white text-primary-color'
                      : 'bg-primary-color text-white'
                  }`}>
                    {folder.unreadCount}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="p-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 space-y-1">
            <div className="flex justify-between">
              <span>Messages non lus</span>
              <span className="font-medium">{unreadCount}</span>
            </div>
            <div className="flex justify-between">
              <span>Total messages</span>
              <span className="font-medium">{messages.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Message List */}
      <div className="w-96 bg-white border-r border-gray-200 flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-gray-900">
              {folders.find(f => f.id === selectedFolder)?.name}
            </h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Filter className="w-4 h-4" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedMessages.length > 0 && (
            <div className="flex items-center space-x-2 mb-3">
              <button
                onClick={selectAllMessages}
                className="text-xs text-primary-color hover:text-green-700"
              >
                {selectedMessages.length === messages.length ? 'Tout désélectionner' : 'Tout sélectionner'}
              </button>
              <span className="text-xs text-gray-500">
                {selectedMessages.length} sélectionné{selectedMessages.length > 1 ? 's' : ''}
              </span>
              <div className="flex items-center space-x-1 ml-auto">
                <button
                  onClick={() => handleBulkAction('mark_read')}
                  className="p-1 text-gray-400 hover:text-gray-600"
                  title="Marquer comme lu"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleBulkAction('mark_unread')}
                  className="p-1 text-gray-400 hover:text-gray-600"
                  title="Marquer comme non lu"
                >
                  <EyeOff className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleBulkAction('archive')}
                  className="p-1 text-gray-400 hover:text-gray-600"
                  title="Archiver"
                >
                  <Archive className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleBulkAction('delete')}
                  className="p-1 text-gray-400 hover:text-red-600"
                  title="Supprimer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <LoadingSpinner size="md" />
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-8">
              <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun message</h3>
              <p className="text-gray-600">
                {searchTerm ? 'Aucun message ne correspond à votre recherche.' : 'Votre boîte de réception est vide.'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {messages.map((message) => (
                <div
                  key={message.id}
                  onClick={() => handleMessageSelect(message.id)}
                  className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedMessage?.id === message.id ? 'bg-blue-50 border-r-2 border-primary-color' : ''
                  } ${!message.isRead ? 'bg-blue-50/30' : ''}`}
                >
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      checked={selectedMessages.includes(message.id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        toggleMessageSelection(message.id);
                      }}
                      className="mt-1 text-primary-color focus:ring-primary-color border-gray-300 rounded"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center space-x-2">
                          <span className={`text-sm ${!message.isRead ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                            {message.senderName}
                          </span>
                          {getPriorityIcon(message.priority)}
                          {message.attachments && message.attachments.length > 0 && (
                            <Paperclip className="w-3 h-3 text-gray-400" />
                          )}
                        </div>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(message.status)}
                          <span className="text-xs text-gray-500">
                            {formatDate(message.sentAt)}
                          </span>
                        </div>
                      </div>
                      
                      <h4 className={`text-sm mb-1 truncate ${!message.isRead ? 'font-semibold text-gray-900' : 'text-gray-800'}`}>
                        {message.subject}
                      </h4>
                      
                      <p className="text-xs text-gray-600 line-clamp-2">
                        {message.content}
                      </p>
                      
                      {message.tags && message.tags.length > 0 && (
                        <div className="flex items-center space-x-1 mt-2">
                          {message.tags.slice(0, 2).map(tag => (
                            <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                              {tag}
                            </span>
                          ))}
                          {message.tags.length > 2 && (
                            <span className="text-xs text-gray-500">+{message.tags.length - 2}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Message Content */}
      <div className="flex-1 flex flex-col">
        {selectedMessage ? (
          <MessageViewer 
            message={selectedMessage} 
            onReply={() => setShowComposer(true)}
            onClose={() => setSelectedMessage(null)}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <Mail className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Sélectionnez un message
              </h3>
              <p className="text-gray-600">
                Choisissez un message dans la liste pour le lire
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Message Composer Modal */}
      {showComposer && (
        <MessageComposer
          onClose={() => setShowComposer(false)}
          replyTo={selectedMessage}
        />
      )}
    </div>
  );
};