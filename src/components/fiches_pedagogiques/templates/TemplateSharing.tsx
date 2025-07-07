import React, { useState } from 'react';
import { Share2, User, Mail, CheckCircle, X, Download } from 'lucide-react';
import { Template } from './types';

interface TemplateSharingProps {
  template: Template;
  onShareSuccess: (template: Template) => void;
  onDownload: (template: Template) => void;
}

const TemplateSharing: React.FC<TemplateSharingProps> = ({
  template,
  onShareSuccess,
  onDownload
}) => {
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [showDownloadModal, setShowDownloadModal] = useState(false);

  const handleShare = async () => {
    if (selectedUsers.length === 0) {
      alert('Veuillez sélectionner au moins un utilisateur');
      return;
    }

    // Logique de partage
    const sharedTemplate = {
      ...template,
      sharedWith: selectedUsers,
      shareMessage: message
    };

    onShareSuccess(sharedTemplate);
    setShowShareModal(false);
  };

  const handleDownload = () => {
    onDownload(template);
    setShowDownloadModal(false);
  };

  return (
    <div className="space-y-4">
      {/* Bouton de partage */}
      <button
        onClick={() => setShowShareModal(true)}
        className="inline-flex items-center px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800"
      >
        <Share2 className="w-4 h-4 mr-2" />
        Partager le Template
      </button>

      {/* Modal de partage */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Partager le Template
              </h2>
              <button
                onClick={() => setShowShareModal(false)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Sélection des utilisateurs
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {/* Liste des utilisateurs */}
                    {['Collègue 1', 'Collègue 2', 'Collègue 3'].map((user, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setSelectedUsers(prev => 
                            prev.includes(user) 
                              ? prev.filter(u => u !== user) 
                              : [...prev, user]
                          );
                        }}
                        className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                          selectedUsers.includes(user)
                            ? 'bg-blue-600 dark:bg-blue-700 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        <User className="w-4 h-4" />
                        {user}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Message de partage
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300 h-32"
                    placeholder="Ajoutez un message pour accompagner le partage..."
                  />
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowShareModal(false)}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleShare}
                    className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Partager
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bouton de téléchargement */}
      <button
        onClick={() => setShowDownloadModal(true)}
        className="inline-flex items-center px-4 py-2 bg-green-600 dark:bg-green-700 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-800"
      >
        <Download className="w-4 h-4 mr-2" />
        Télécharger le Template
      </button>

      {/* Modal de téléchargement */}
      {showDownloadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Télécharger le Template
              </h2>
              <button
                onClick={() => setShowDownloadModal(false)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Formats disponibles
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Formats de téléchargement */}
                    <button
                      onClick={handleDownload}
                      className="flex items-center space-x-2 px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                    >
                      <FileText className="w-4 h-4 text-blue-500" />
                      <span>Format JSON</span>
                    </button>
                    <button
                      onClick={handleDownload}
                      className="flex items-center space-x-2 px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                    >
                      <Download className="w-4 h-4 text-green-500" />
                      <span>Format PDF</span>
                    </button>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={() => setShowDownloadModal(false)}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    Fermer
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

export default TemplateSharing;
