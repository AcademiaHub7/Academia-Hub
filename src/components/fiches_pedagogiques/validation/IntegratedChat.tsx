import React, { useState } from 'react';
import { MessageSquare, Clock, User, CheckCircle, AlertCircle } from 'lucide-react';

interface Message {
  id: string;
  auteur: string;
  contenu: string;
  date: string;
  statut: 'lu' | 'non_lu' | 'envoye';
}

interface IntegratedChatProps {
  messages: Message[];
  onSendMessage: (message: Message) => void;
  onUpdateMessage: (message: Message) => void;
  onDeleteMessage: (messageId: string) => void;
}

const IntegratedChat: React.FC<IntegratedChatProps> = ({
  messages,
  onSendMessage,
  onUpdateMessage,
  onDeleteMessage
}) => {
  const [newMessage, setNewMessage] = useState('');
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      onSendMessage({
        id: Date.now().toString(),
        auteur: 'Directeur',
        contenu: newMessage,
        date: new Date().toISOString(),
        statut: 'envoye'
      });
      setNewMessage('');
    }
  };

  const handleUpdateMessage = (message: Message) => {
    onUpdateMessage(message);
    setSelectedMessage(null);
    setShowMessageModal(false);
  };

  const handleDeleteMessage = (messageId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) {
      onDeleteMessage(messageId);
    }
  };

  return (
    <div className="h-[600px] flex flex-col">
      {/* En-tête */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
          <MessageSquare className="w-5 h-5 inline-block mr-2" />
          Messagerie
        </h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {messages.length} messages
          </span>
          <span className="px-2 py-1 rounded-full text-xs bg-blue-100 dark:bg-blue-900 text-blue-800">
            {messages.filter(m => m.statut === 'non_lu').length} non lus
          </span>
        </div>
      </div>

      {/* Liste des messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg ${
              message.auteur === 'Directeur'
                ? 'bg-blue-50 dark:bg-blue-900'
                : 'bg-gray-50 dark:bg-gray-700'
            }`}
          >
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-gray-500" />
                <span className="font-medium">{message.auteur}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(message.date).toLocaleTimeString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
                {message.statut === 'non_lu' && (
                  <span className="px-2 py-1 rounded-full text-xs bg-blue-100 dark:bg-blue-900 text-blue-800">
                    Non lu
                  </span>
                )}
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400">{message.contenu}</p>
            <div className="mt-2 flex justify-end space-x-2">
              <button
                onClick={() => {
                  setSelectedMessage(message);
                  setShowMessageModal(true);
                }}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Edit2 className="w-4 h-4 text-gray-500" />
              </button>
              <button
                onClick={() => handleDeleteMessage(message.id)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-red-500"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Zone de saisie */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Votre message..."
              className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300 h-24 p-3 resize-none"
            />
          </div>
          <button
            onClick={handleSendMessage}
            className="inline-flex items-center px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Envoyer
          </button>
        </div>
      </div>

      {/* Modal de modification */}
      {showMessageModal && selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Modifier le message
              </h2>
              <button
                onClick={() => setShowMessageModal(false)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Contenu
                  </label>
                  <textarea
                    value={selectedMessage.contenu}
                    onChange={(e) => {
                      setSelectedMessage(prev => ({
                        ...prev,
                        contenu: e.target.value
                      }));
                    }}
                    className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300 h-32"
                  />
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setShowMessageModal(false)}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={() => handleUpdateMessage(selectedMessage)}
                    className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800"
                  >
                    Enregistrer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IntegratedChat;
