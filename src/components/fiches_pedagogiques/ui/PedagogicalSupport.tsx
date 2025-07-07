import React, { useState } from 'react';
import { MessageSquare, User, Clock, FileText, HelpCircle } from 'lucide-react';

interface SupportMessage {
  id: string;
  sender: 'user' | 'support';
  content: string;
  timestamp: string;
  type: 'text' | 'document' | 'link';
  status: 'unread' | 'read' | 'processing';
}

interface PedagogicalSupportProps {
  onClose: () => void;
  onSearch?: (query: string) => void;
}

const PedagogicalSupport: React.FC<PedagogicalSupportProps> = ({ onClose, onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<SupportMessage | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  // Données de support (exemples)
  const supportMessages: SupportMessage[] = [
    {
      id: '1',
      sender: 'support',
      content: 'Bonjour ! Comment puis-je vous aider aujourd\'hui ?',
      timestamp: new Date().toISOString(),
      type: 'text',
      status: 'unread'
    },
    {
      id: '2',
      sender: 'support',
      content: 'Voici un document utile sur la création de fiches pédagogiques.',
      timestamp: new Date().toISOString(),
      type: 'document',
      status: 'read'
    },
    {
      id: '3',
      sender: 'user',
      content: 'J\'ai besoin d\'aide pour valider une fiche.',
      timestamp: new Date().toISOString(),
      type: 'text',
      status: 'read'
    }
  ];

  // Filtrer les messages selon la recherche
  const filteredMessages = supportMessages.filter(message =>
    message.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Gestion des messages
  const handleMessage = (message: string) => {
    if (message.trim()) {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: 'user',
          content: message,
          timestamp: new Date().toISOString(),
          type: 'text',
          status: 'unread'
        }
      ]);
      setNewMessage('');
    }
  };

  // Gestion des fichiers
  const handleFile = (file: File) => {
    setMessages(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        sender: 'user',
        content: file.name,
        timestamp: new Date().toISOString(),
        type: 'document',
        status: 'unread'
      }
    ]);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            <MessageSquare className="w-5 h-5 inline-block mr-2" />
            Support pédagogique
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Barre de recherche */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher dans les messages..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300"
              />
            </div>
          </div>

          {/* Historique */}
          <div className="mb-6">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            >
              <Clock className="w-4 h-4" />
              <span>{showHistory ? 'Masquer' : 'Afficher'} l\'historique</span>
            </button>
            {showHistory && (
              <div className="mt-2 space-y-2">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`p-4 rounded-lg ${
                      message.sender === 'user'
                        ? 'bg-gray-100 dark:bg-gray-700'
                        : 'bg-blue-50 dark:bg-blue-900'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center space-x-2">
                        {message.sender === 'user' ? (
                          <User className="w-4 h-4 text-gray-500" />
                        ) : (
                          <HelpCircle className="w-4 h-4 text-blue-500" />
                        )}
                        <span className="font-medium">
                          {message.sender === 'user' ? 'Vous' : 'Support'}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(message.timestamp).toLocaleTimeString('fr-FR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {message.type === 'text' && (
                        <p className="text-gray-600 dark:text-gray-400">
                          {message.content}
                        </p>
                      )}
                      {message.type === 'document' && (
                        <div className="flex items-center space-x-2">
                          <FileText className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {message.content}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Zone de saisie */}
          <div className="flex items-center space-x-4 mb-4">
            <input
              type="file"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFile(e.target.files[0]);
                }
              }}
              className="hidden"
              id="fileInput"
            />
            <label
              htmlFor="fileInput"
              className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              <FileText className="w-4 h-4 mr-2" />
              Joindre un fichier
            </label>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Votre message..."
              className="flex-1 rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300 p-3"
            />
            <button
              onClick={() => handleMessage(newMessage)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Envoyer
            </button>
          </div>

          {/* Suggestions d'aide */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Suggestions d'aide
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => {
                  setNewMessage('Je besoin d\'aide pour créer une fiche pédagogique.');
                  handleMessage(newMessage);
                }}
                className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                <h4 className="font-medium">Création de fiches</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Assistance pour la création de fiches pédagogiques
                </p>
              </button>
              <button
                onClick={() => {
                  setNewMessage('Je besoin d\'aide pour la validation par compétences.');
                  handleMessage(newMessage);
                }}
                className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                <h4 className="font-medium">Validation par compétences</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Assistance pour la validation selon les compétences
                </p>
              </button>
              <button
                onClick={() => {
                  setNewMessage('Je besoin d\'aide pour personnaliser l\'interface.');
                  handleMessage(newMessage);
                }}
                className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                <h4 className="font-medium">Personnalisation</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Assistance pour la personnalisation de l\'interface
                </p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PedagogicalSupport;
