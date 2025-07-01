import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { useMessageStore } from '../../stores/messageStore';
import { 
  X, 
  Send, 
  Paperclip, 
  Users, 
  AlertCircle,
  FileText,
  Trash2,
  Plus,
  Search,
  Clock,
  Star
} from 'lucide-react';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface MessageComposerProps {
  onClose: () => void;
  replyTo?: any;
}

export const MessageComposer: React.FC<MessageComposerProps> = ({ onClose, replyTo }) => {
  const { user, tenant } = useAuthStore();
  const { sendMessage, replyToMessage, templates, getAvailableRecipients, isLoading } = useMessageStore();
  
  const [recipients, setRecipients] = useState<any[]>([]);
  const [availableRecipients, setAvailableRecipients] = useState<any[]>([]);
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState<'normal' | 'high' | 'urgent'>('normal');
  const [messageType, setMessageType] = useState<'individual' | 'group' | 'broadcast'>('individual');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [showRecipientSearch, setShowRecipientSearch] = useState(false);
  const [recipientSearch, setRecipientSearch] = useState('');
  const [showTemplates, setShowTemplates] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [scheduledFor, setScheduledFor] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    loadAvailableRecipients();
    
    if (replyTo) {
      setSubject(replyTo.subject.startsWith('Re:') ? replyTo.subject : `Re: ${replyTo.subject}`);
      setRecipients([{
        id: replyTo.senderTenantId,
        name: replyTo.senderName,
        type: replyTo.senderType
      }]);
      setMessageType('individual');
    }
  }, [replyTo]);

  const loadAvailableRecipients = async () => {
    try {
      const recipients = await getAvailableRecipients(tenant?.type || 'school');
      setAvailableRecipients(recipients);
    } catch (error) {
      console.error('Erreur lors du chargement des destinataires:', error);
    }
  };

  const handleAddRecipient = (recipient: any) => {
    if (!recipients.find(r => r.id === recipient.id)) {
      setRecipients([...recipients, recipient]);
      setRecipientSearch('');
      setShowRecipientSearch(false);
    }
  };

  const handleRemoveRecipient = (recipientId: string) => {
    setRecipients(recipients.filter(r => r.id !== recipientId));
  };

  const handleFileAttachment = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setAttachments([...attachments, ...files]);
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const handleUseTemplate = (template: any) => {
    setSubject(template.subject);
    setContent(template.content);
    setSelectedTemplate(template);
    setShowTemplates(false);
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleSend = async () => {
    if (!subject.trim() || !content.trim() || recipients.length === 0) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      const messageData = {
        subject,
        content,
        senderId: user?.id,
        senderName: `${user?.firstName} ${user?.lastName}`,
        senderType: tenant?.type,
        senderTenantId: tenant?.id,
        recipients: recipients.map(r => ({
          id: Date.now().toString() + Math.random(),
          tenantId: r.id,
          tenantName: r.name,
          tenantType: r.type,
          isRead: false,
          status: 'pending' as const,
          deliveredAt: new Date()
        })),
        type: messageType,
        priority,
        attachments: attachments.map(file => ({
          id: Date.now().toString() + Math.random(),
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          fileUrl: `https://storage.educmaster.com/attachments/${file.name}`,
          uploadedAt: new Date()
        })),
        tags,
        scheduledFor: scheduledFor ? new Date(scheduledFor) : undefined
      };

      if (replyTo) {
        await replyToMessage(replyTo.id, content, attachments);
      } else {
        await sendMessage(messageData);
      }

      onClose();
    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error);
      alert('Erreur lors de l\'envoi du message');
    }
  };

  const filteredRecipients = availableRecipients.filter(recipient =>
    recipient.name.toLowerCase().includes(recipientSearch.toLowerCase())
  );

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {replyTo ? 'Répondre au message' : 'Nouveau message'}
          </h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowTemplates(true)}
              className="flex items-center space-x-1 px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <FileText className="w-4 h-4" />
              <span>Modèles</span>
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Recipients */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Destinataires *
            </label>
            <div className="border border-gray-300 rounded-lg p-2 min-h-[40px] flex flex-wrap items-center gap-2">
              {recipients.map((recipient) => (
                <span
                  key={recipient.id}
                  className="inline-flex items-center space-x-1 px-2 py-1 bg-primary-color text-white text-sm rounded-full"
                >
                  <span>{recipient.name}</span>
                  <button
                    onClick={() => handleRemoveRecipient(recipient.id)}
                    className="text-white hover:text-gray-200"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              <button
                onClick={() => setShowRecipientSearch(true)}
                className="inline-flex items-center space-x-1 px-2 py-1 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Ajouter</span>
              </button>
            </div>

            {/* Recipient Search */}
            {showRecipientSearch && (
              <div className="mt-2 border border-gray-300 rounded-lg p-2">
                <div className="relative mb-2">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Rechercher un destinataire..."
                    value={recipientSearch}
                    onChange={(e) => setRecipientSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-color focus:border-transparent"
                  />
                </div>
                <div className="max-h-32 overflow-y-auto">
                  {filteredRecipients.map((recipient) => (
                    <button
                      key={recipient.id}
                      onClick={() => handleAddRecipient(recipient)}
                      className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{recipient.name}</span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          recipient.type === 'patronat' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {recipient.type === 'patronat' ? 'Patronat' : 'École'}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setShowRecipientSearch(false)}
                  className="mt-2 text-sm text-gray-600 hover:text-gray-800"
                >
                  Fermer
                </button>
              </div>
            )}
          </div>

          {/* Message Type and Priority */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type de message
              </label>
              <select
                value={messageType}
                onChange={(e) => setMessageType(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-color focus:border-transparent"
              >
                <option value="individual">Individuel</option>
                <option value="group">Groupe</option>
                <option value="broadcast">Diffusion</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priorité
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-color focus:border-transparent"
              >
                <option value="normal">Normale</option>
                <option value="high">Élevée</option>
                <option value="urgent">Urgente</option>
              </select>
            </div>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Objet *
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-color focus:border-transparent"
              placeholder="Objet du message..."
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message *
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-color focus:border-transparent"
              placeholder="Tapez votre message ici..."
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center space-x-1 px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                >
                  <span>{tag}</span>
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-color focus:border-transparent"
                placeholder="Ajouter un tag..."
              />
              <button
                onClick={handleAddTag}
                className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Ajouter
              </button>
            </div>
          </div>

          {/* Attachments */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pièces jointes
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <input
                type="file"
                multiple
                onChange={handleFileAttachment}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="flex flex-col items-center cursor-pointer"
              >
                <Paperclip className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-600">
                  Cliquez pour ajouter des fichiers ou glissez-déposez
                </span>
              </label>
            </div>

            {attachments.length > 0 && (
              <div className="mt-2 space-y-2">
                {attachments.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">{file.name}</span>
                      <span className="text-xs text-gray-500">({formatFileSize(file.size)})</span>
                    </div>
                    <button
                      onClick={() => handleRemoveAttachment(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Scheduled Send */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Programmer l'envoi (optionnel)
            </label>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <input
                type="datetime-local"
                value={scheduledFor}
                onChange={(e) => setScheduledFor(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-color focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-gray-200">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            {priority === 'high' && (
              <div className="flex items-center space-x-1 text-orange-600">
                <AlertCircle className="w-4 h-4" />
                <span>Priorité élevée</span>
              </div>
            )}
            {priority === 'urgent' && (
              <div className="flex items-center space-x-1 text-red-600">
                <AlertCircle className="w-4 h-4" />
                <span>Priorité urgente</span>
              </div>
            )}
            {scheduledFor && (
              <div className="flex items-center space-x-1 text-blue-600">
                <Clock className="w-4 h-4" />
                <span>Programmé</span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleSend}
              disabled={isLoading || !subject.trim() || !content.trim() || recipients.length === 0}
              className="flex items-center space-x-2 px-4 py-2 bg-primary-color text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <LoadingSpinner size="sm" color="text-white" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              <span>{scheduledFor ? 'Programmer' : 'Envoyer'}</span>
            </button>
          </div>
        </div>

        {/* Templates Modal */}
        {showTemplates && (
          <div className="absolute inset-0 bg-white z-10">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Modèles de messages</h3>
                <button
                  onClick={() => setShowTemplates(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
              {templates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => handleUseTemplate(template)}
                  className="p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-primary-color hover:bg-primary-color/5 transition-colors"
                >
                  <h4 className="font-medium text-gray-900 mb-1">{template.name}</h4>
                  <p className="text-sm text-gray-600 mb-2">{template.subject}</p>
                  <p className="text-xs text-gray-500 line-clamp-2">{template.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};