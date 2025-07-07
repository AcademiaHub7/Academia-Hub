import React, { useState } from 'react';
import { 
  Lock, 
  Signature, 
  Clock, 
  FileText,
  Shield,
  Archive 
} from 'lucide-react';

interface ProtectionItem {
  id: string;
  title: string;
  type: 'document' | 'template' | 'validation';
  status: 'encrypted' | 'signed' | 'timestamped' | 'archived';
  timestamp: string;
  signature: string;
  hash: string;
}

interface ProtectionLog {
  id: string;
  resourceId: string;
  action: string;
  timestamp: string;
  user: string;
  status: boolean;
}

interface IntellectualProtectionProps {
  items: ProtectionItem[];
  logs: ProtectionLog[];
  onEncrypt: (item: ProtectionItem) => void;
  onSign: (item: ProtectionItem) => void;
  onArchive: (item: ProtectionItem) => void;
}

const IntellectualProtection: React.FC<IntellectualProtectionProps> = ({
  items,
  logs,
  onEncrypt,
  onSign,
  onArchive
}) => {
  const [selectedItem, setSelectedItem] = useState<ProtectionItem | null>(null);
  const [showLogs, setShowLogs] = useState(false);

  // Statuts visuels
  const statusColors = {
    encrypted: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300',
    signed: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300',
    timestamped: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300',
    archived: 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-300'
  };

  // Types de ressources
  const resourceTypes = {
    document: {
      icon: FileText,
      label: 'Document'
    },
    template: {
      icon: Shield,
      label: 'Modèle'
    },
    validation: {
      icon: Signature,
      label: 'Validation'
    }
  };

  return (
    <div className="space-y-6">
      {/* Protection des ressources */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center">
          <Lock className="w-5 h-5 inline-block mr-2" />
          Protection des ressources
        </h3>
        <div className="mt-4 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 p-4"
            >
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center space-x-2">
                  {resourceTypes[item.type].icon && (
                    <resourceTypes[item.type].icon className="w-4 h-4 text-gray-400" />
                  )}
                  <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {item.title}
                  </h4>
                </div>
                <div
                  className={`px-2 py-1 rounded-full text-xs ${
                    statusColors[item.status]
                  }`}
                >
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(item.timestamp).toLocaleString('fr-FR')}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onEncrypt(item)}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Lock className="w-4 h-4 text-blue-500" />
                  </button>
                  <button
                    onClick={() => onSign(item)}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Signature className="w-4 h-4 text-green-500" />
                  </button>
                  <button
                    onClick={() => onArchive(item)}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Archive className="w-4 h-4 text-purple-500" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Journal de protection */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center">
          <Clock className="w-5 h-5 inline-block mr-2" />
          Journal de protection
        </h3>
        <div className="mt-4">
          <button
            onClick={() => setShowLogs(!showLogs)}
            className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 mb-4"
          >
            <FileText className="w-4 h-4 mr-2" />
            {showLogs ? 'Masquer' : 'Afficher'} les logs
          </button>
          {showLogs && (
            <div className="space-y-4">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700"
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(log.timestamp).toLocaleString('fr-FR')}
                      </span>
                    </div>
                    <div
                      className={`px-2 py-1 rounded-full text-xs ${
                        log.status ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300' :
                        'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300'
                      }`}
                    >
                      {log.status ? 'Succès' : 'Échec'}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {log.user}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Signature className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {log.action}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IntellectualProtection;
