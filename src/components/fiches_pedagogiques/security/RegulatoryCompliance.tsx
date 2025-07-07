import React, { useState } from 'react';
import { 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Clock,
  Archive 
} from 'lucide-react';

interface ComplianceCheck {
  id: string;
  title: string;
  category: string;
  status: 'pending' | 'compliant' | 'non_compliant';
  lastCheck: string;
  documents: string[];
}

interface ComplianceLog {
  id: string;
  checkId: string;
  action: string;
  timestamp: string;
  result: boolean;
  details: string;
}

interface RegulatoryComplianceProps {
  checks: ComplianceCheck[];
  logs: ComplianceLog[];
  onValidate: (check: ComplianceCheck) => void;
  onExport: (check: ComplianceCheck) => void;
}

const RegulatoryCompliance: React.FC<RegulatoryComplianceProps> = ({
  checks,
  logs,
  onValidate,
  onExport
}) => {
  const [selectedCheck, setSelectedCheck] = useState<ComplianceCheck | null>(null);
  const [showLogs, setShowLogs] = useState(false);

  // Statuts visuels
  const statusColors = {
    pending: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300',
    compliant: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300',
    non_compliant: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300'
  };

  // Catégories de conformité
  const complianceCategories = {
    memp: {
      icon: FileText,
      label: 'Circulaires MEMP'
    },
    format: {
      icon: Archive,
      label: 'Formats officiels'
    },
    validation: {
      icon: CheckCircle2,
      label: 'Validation réglementaire'
    },
    conservation: {
      icon: Clock,
      label: 'Conservation légale'
    }
  };

  return (
    <div className="space-y-6">
      {/* Vérifications de conformité */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center">
          <CheckCircle2 className="w-5 h-5 inline-block mr-2" />
          Vérifications de conformité
        </h3>
        <div className="mt-4 space-y-4">
          {checks.map((check) => (
            <div
              key={check.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 p-4"
            >
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center space-x-2">
                  {complianceCategories[check.category].icon && (
                    <complianceCategories[check.category].icon className="w-4 h-4 text-gray-400" />
                  )}
                  <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {check.title}
                  </h4>
                </div>
                <div
                  className={`px-2 py-1 rounded-full text-xs ${
                    statusColors[check.status]
                  }`}
                >
                  {check.status.charAt(0).toUpperCase() + check.status.slice(1)}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Dernière vérification: {new Date(check.lastCheck).toLocaleDateString('fr-FR')}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onValidate(check)}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  </button>
                  <button
                    onClick={() => onExport(check)}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Archive className="w-4 h-4 text-blue-500" />
                  </button>
                </div>
              </div>
              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Documents requis
                </h5>
                <ul className="space-y-1 text-sm text-gray-500 dark:text-gray-400">
                  {check.documents.map((doc, index) => (
                    <li key={index}>
                      <FileText className="w-4 h-4 inline-block mr-1" />
                      {doc}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Journal de conformité */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center">
          <Clock className="w-5 h-5 inline-block mr-2" />
          Journal de conformité
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
                        log.result ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300' :
                        'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300'
                      }`}
                    >
                      {log.result ? 'Conforme' : 'Non conforme'}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {log.action}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {log.details}
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

export default RegulatoryCompliance;
