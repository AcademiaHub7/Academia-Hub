import React, { useState } from 'react';
import { 
  Shield, 
  Users, 
  Key, 
  Eye, 
  EyeOff,
  Clock,
  FileText 
} from 'lucide-react';

interface UserRole {
  id: string;
  name: string;
  permissions: {
    read: string[];
    write: string[];
    validate: string[];
  };
  establishments: string[];
}

interface AccessLog {
  id: string;
  userId: string;
  action: string;
  resource: string;
  timestamp: string;
  success: boolean;
}

interface AccessControlProps {
  roles: UserRole[];
  logs: AccessLog[];
  onRoleChange: (role: UserRole) => void;
  onLogFilter: (filters: any) => void;
}

const AccessControl: React.FC<AccessControlProps> = ({
  roles,
  logs,
  onRoleChange,
  onLogFilter
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [showLogs, setShowLogs] = useState(false);
  const [logFilters, setLogFilters] = useState({
    dateRange: ['', ''],
    action: '',
    resource: '',
    success: ''
  });

  // Types de rôles
  const roleTypes = {
    teacher: {
      icon: Users,
      label: 'Enseignant'
    },
    director: {
      icon: Shield,
      label: 'Directeur'
    },
    advisor: {
      icon: Key,
      label: 'Conseiller pédagogique'
    },
    inspector: {
      icon: Eye,
      label: 'Inspecteur'
    }
  };

  // Statuts des accès
  const accessStatus = {
    success: {
      color: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300',
      label: 'Succès'
    },
    failure: {
      color: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300',
      label: 'Échec'
    }
  };

  return (
    <div className="space-y-6">
      {/* Gestion des rôles */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center">
          <Shield className="w-5 h-5 inline-block mr-2" />
          Gestion des rôles
        </h3>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {roles.map((role) => (
            <button
              key={role.id}
              onClick={() => {
                setSelectedRole(role);
                onRoleChange(role);
              }}
              className={`p-4 rounded-lg transition-all duration-300 ${
                selectedRole?.id === role.id
                  ? 'bg-blue-50 dark:bg-blue-900 text-blue-800 dark:text-blue-300'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <roleTypes[role.name].icon className="w-6 h-6 mb-2" />
              <h4 className="font-medium">{roleTypes[role.name].label}</h4>
              <div className="mt-2 space-y-1 text-sm text-gray-500 dark:text-gray-400">
                <div>
                  <Eye className="w-4 h-4 inline-block mr-1" />
                  {role.permissions.read.length} lectures
                </div>
                <div>
                  <Key className="w-4 h-4 inline-block mr-1" />
                  {role.permissions.write.length} écritures
                </div>
                <div>
                  <Shield className="w-4 h-4 inline-block mr-1" />
                  {role.permissions.validate.length} validations
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Historique des accès */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center">
          <Clock className="w-5 h-5 inline-block mr-2" />
          Historique des accès
        </h3>
        <div className="mt-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setShowLogs(!showLogs)}
              className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              <FileText className="w-4 h-4 mr-2" />
              {showLogs ? 'Masquer' : 'Afficher'} les logs
            </button>
            <div className="flex items-center space-x-2">
              <input
                type="date"
                value={logFilters.dateRange[0]}
                onChange={(e) => setLogFilters(prev => ({
                  ...prev,
                  dateRange: [e.target.value, prev.dateRange[1]]
                }))}
                className="rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300 p-2"
              />
              <input
                type="date"
                value={logFilters.dateRange[1]}
                onChange={(e) => setLogFilters(prev => ({
                  ...prev,
                  dateRange: [prev.dateRange[0], e.target.value]
                }))}
                className="rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300 p-2"
              />
            </div>
          </div>
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
                        log.success ? accessStatus.success.color : accessStatus.failure.color
                      }`}
                    >
                      {log.success ? 'Succès' : 'Échec'}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {log.userId}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Eye className="w-4 h-4 text-gray-400" />
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

export default AccessControl;
