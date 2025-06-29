import React, { useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { useMessageStore } from '../../stores/messageStore';
import { 
  Reply, 
  ReplyAll, 
  Forward, 
  Archive, 
  Trash2,
  Star,
  Download,
  Paperclip,
  AlertCircle,
  Clock,
  Users,
  X,
  Eye,
  Check
} from 'lucide-react';

interface MessageViewerProps {
  message: any;
  onReply: () => void;
  onClose: () => void;
}

export const MessageViewer: React.FC<MessageViewerProps> = ({ message, onReply, onClose }) => {
  const { user, tenant } = useAuthStore();
  const { archiveMessages, deleteMessages } = useMessageStore();
  
  const [showRecipients, setShowRecipients] = useState(false);

  const handleArchive = async () => {
    await archiveMessages([message.id]);
    onClose();
  };

  const handleDelete = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) {
      await deleteMessages([message.id]);
      onClose();
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-600 bg-red-100';
      case 'high':
        return 'text-orange-600 bg-orange-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return 'text-green-600';
      case 'delivered':
        return 'text-blue-600';
      case 'read':
        return 'text-green-600';
      case 'failed':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const downloadAttachment = (attachment: any) => {
    // Simulate download
    const link = document.createElement('a');
    link.href = attachment.fileUrl;
    link.download = attachment.fileName;
    link.click();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <h2 className="text-lg font-semibold text-gray-900 line-clamp-1">
              {message.subject}
            </h2>
            {message.priority !== 'normal' && (
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(message.priority)}`}>
                {message.priority === 'urgent' ? 'Urgent' : 'Priorité élevée'}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={onReply}
              className="flex items-center space-x-1 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Reply className="w-4 h-4" />
              <span>Répondre</span>
            </button>
            <button className="flex items-center space-x-1 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
              <ReplyAll className="w-4 h-4" />
              <span>Répondre à tous</span>
            </button>
            <button className="flex items-center space-x-1 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
              <Forward className="w-4 h-4" />
              <span>Transférer</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-400 hover:text-yellow-500 transition-colors">
              <Star className="w-4 h-4" />
            </button>
            <button
              onClick={handleArchive}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Archive className="w-4 h-4" />
            </button>
            <button
              onClick={handleDelete}
              className="p-2 text-gray-400 hover:text-red-600 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Message Content */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          {/* Message Header */}
          <div className="border-b border-gray-200 pb-4 mb-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary-color rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-sm">
                    {message.senderName.split(' ').map((n: string) => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{message.senderName}</h3>
                  <p className="text-sm text-gray-600">
                    {message.senderType === 'patronat' ? 'Patronat' : 'École'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDate(message.sentAt)}
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <div className={`inline-flex items-center space-x-1 text-sm ${getStatusColor(message.status)}`}>
                  {message.status === 'sent' && <Check className="w-4 h-4" />}
                  {message.status === 'delivered' && <Check className="w-4 h-4" />}
                  {message.status === 'failed' && <AlertCircle className="w-4 h-4" />}
                  <span className="capitalize">{message.status}</span>
                </div>
              </div>
            </div>

            {/* Recipients */}
            <div className="mt-4">
              <button
                onClick={() => setShowRecipients(!showRecipients)}
                className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                <Users className="w-4 h-4" />
                <span>
                  À: {message.recipients.length} destinataire{message.recipients.length > 1 ? 's' : ''}
                </span>
              </button>

              {showRecipients && (
                <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                  <div className="space-y-2">
                    {message.recipients.map((recipient: any) => (
                      <div key={recipient.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-900">
                            {recipient.tenantName}
                          </span>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            recipient.tenantType === 'patronat' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {recipient.tenantType === 'patronat' ? 'Patronat' : 'École'}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {recipient.isRead ? (
                            <div className="flex items-center space-x-1 text-green-600">
                              <Eye className="w-3 h-3" />
                              <span className="text-xs">Lu</span>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-1 text-gray-500">
                              <Clock className="w-3 h-3" />
                              <span className="text-xs">Non lu</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Tags */}
            {message.tags && message.tags.length > 0 && (
              <div className="mt-3 flex items-center space-x-2">
                {message.tags.map((tag: string) => (
                  <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Message Body */}
          <div className="prose max-w-none">
            <div className="whitespace-pre-wrap text-gray-900 leading-relaxed">
              {message.content}
            </div>
          </div>

          {/* Attachments */}
          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="font-medium text-gray-900 mb-3 flex items-center space-x-2">
                <Paperclip className="w-4 h-4" />
                <span>Pièces jointes ({message.attachments.length})</span>
              </h4>
              <div className="space-y-2">
                {message.attachments.map((attachment: any) => (
                  <div key={attachment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                        <Paperclip className="w-4 h-4 text-gray-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{attachment.fileName}</p>
                        <p className="text-xs text-gray-500">
                          {(attachment.fileSize / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => downloadAttachment(attachment)}
                      className="flex items-center space-x-1 px-3 py-2 text-primary-color hover:text-green-700 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span>Télécharger</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};