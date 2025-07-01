import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { useUserStore } from '../../stores/userStore';
import { 
  Users, 
  Plus, 
  Search, 
  Filter,
  Edit,
  Trash2,
  Key,
  Mail,
  Phone,
  Shield,
  UserCheck,
  UserX,
  MoreVertical
} from 'lucide-react';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: string;
  tenantId: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
}

const roleLabels = {
  'super_admin': 'Super Administrateur',
  'patronat_admin': 'Administrateur Patronat',
  'school_admin': 'Administrateur École',
  'teacher': 'Enseignant',
  'student': 'Élève',
  'parent': 'Parent'
};

const roleColors = {
  'super_admin': 'bg-purple-100 text-purple-800',
  'patronat_admin': 'bg-blue-100 text-blue-800',
  'school_admin': 'bg-green-100 text-green-800',
  'teacher': 'bg-yellow-100 text-yellow-800',
  'student': 'bg-gray-100 text-gray-800',
  'parent': 'bg-pink-100 text-pink-800'
};

export const UserManagement: React.FC = () => {
  const { user, tenant } = useAuthStore();
  const { users, fetchUsers, createUser, updateUser, deleteUser, isLoading } = useUserStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Mock users data
  const mockUsers: User[] = [
    {
      id: '1',
      firstName: 'Paul',
      lastName: 'ADJOVI',
      email: 'paul.adjovi@sainte-marie.edu.bj',
      phone: '+229 97 12 34 56',
      role: 'school_admin',
      tenantId: tenant?.id || '',
      isActive: true,
      lastLogin: new Date('2024-12-10T08:30:00'),
      createdAt: new Date('2024-01-15')
    },
    {
      id: '2',
      firstName: 'Marie',
      lastName: 'AGBODJAN',
      email: 'marie.agbodjan@sainte-marie.edu.bj',
      phone: '+229 96 23 45 67',
      role: 'teacher',
      tenantId: tenant?.id || '',
      isActive: true,
      lastLogin: new Date('2024-12-10T09:15:00'),
      createdAt: new Date('2024-02-01')
    },
    {
      id: '3',
      firstName: 'Jean',
      lastName: 'AKPOVI',
      email: 'jean.akpovi@sainte-marie.edu.bj',
      phone: '+229 95 34 56 78',
      role: 'teacher',
      tenantId: tenant?.id || '',
      isActive: true,
      lastLogin: new Date('2024-12-09T16:45:00'),
      createdAt: new Date('2024-02-15')
    },
    {
      id: '4',
      firstName: 'Sylvie',
      lastName: 'ASSOGBA',
      email: 'sylvie.assogba@sainte-marie.edu.bj',
      role: 'teacher',
      tenantId: tenant?.id || '',
      isActive: false,
      createdAt: new Date('2024-03-01')
    }
  ];

  const [filteredUsers, setFilteredUsers] = useState<User[]>(mockUsers);

  useEffect(() => {
    let filtered = mockUsers;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by role
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => 
        statusFilter === 'active' ? user.isActive : !user.isActive
      );
    }

    setFilteredUsers(filtered);
  }, [searchTerm, roleFilter, statusFilter]);

  const getAvailableRoles = () => {
    if (user?.role === 'super_admin') {
      return ['super_admin', 'patronat_admin'];
    } else if (user?.role === 'patronat_admin') {
      return ['school_admin'];
    } else if (user?.role === 'school_admin') {
      return ['teacher', 'student', 'parent'];
    }
    return [];
  };

  const handleCreateUser = () => {
    setSelectedUser(null);
    setShowCreateModal(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setShowCreateModal(true);
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      await deleteUser(userId);
    }
  };

  const handleToggleStatus = async (userId: string, currentStatus: boolean) => {
    await updateUser(userId, { isActive: !currentStatus });
  };

  const handleResetPassword = async (userId: string) => {
    if (window.confirm('Générer un nouveau mot de passe pour cet utilisateur ?')) {
      // Mock password reset
      const newPassword = 'TempPass' + Math.random().toString(36).substring(2, 8);
      alert(`Nouveau mot de passe généré: ${newPassword}\nVeuillez le transmettre à l'utilisateur de manière sécurisée.`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestion des Utilisateurs</h1>
            <p className="text-gray-600 mt-1">
              {tenant?.type === 'patronat' 
                ? 'Utilisateurs du patronat et des écoles affiliées'
                : 'Utilisateurs de l\'établissement'
              }
            </p>
          </div>
          <button
            onClick={handleCreateUser}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-color text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Nouvel Utilisateur</span>
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Recherche
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Nom, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-color focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rôle
            </label>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-color focus:border-transparent"
            >
              <option value="all">Tous les rôles</option>
              {getAvailableRoles().map(role => (
                <option key={role} value={role}>
                  {roleLabels[role as keyof typeof roleLabels]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Statut
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-color focus:border-transparent"
            >
              <option value="all">Tous les statuts</option>
              <option value="active">Actifs</option>
              <option value="inactive">Inactifs</option>
            </select>
          </div>

          <div className="flex items-end">
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="w-4 h-4" />
              <span>Filtres avancés</span>
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Utilisateurs</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{filteredUsers.length}</p>
            </div>
            <div className="bg-blue-500 rounded-lg p-3 text-white">
              <Users className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Utilisateurs Actifs</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {filteredUsers.filter(u => u.isActive).length}
              </p>
            </div>
            <div className="bg-green-500 rounded-lg p-3 text-white">
              <UserCheck className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Enseignants</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">
                {filteredUsers.filter(u => u.role === 'teacher').length}
              </p>
            </div>
            <div className="bg-yellow-500 rounded-lg p-3 text-white">
              <Shield className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Connexions Récentes</p>
              <p className="text-2xl font-bold text-purple-600 mt-1">
                {filteredUsers.filter(u => u.lastLogin && 
                  new Date().getTime() - u.lastLogin.getTime() < 24 * 60 * 60 * 1000
                ).length}
              </p>
            </div>
            <div className="bg-purple-500 rounded-lg p-3 text-white">
              <UserCheck className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Liste des Utilisateurs
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Utilisateur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rôle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dernière Connexion
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-primary-color flex items-center justify-center">
                          <span className="text-sm font-medium text-white">
                            {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {user.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div className="flex items-center space-x-1">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span>{user.email}</span>
                      </div>
                      {user.phone && (
                        <div className="flex items-center space-x-1 mt-1">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span>{user.phone}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      roleColors[user.role as keyof typeof roleColors]
                    }`}>
                      {roleLabels[user.role as keyof typeof roleLabels]}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.isActive 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.isActive ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.lastLogin ? (
                      <div>
                        <div>{user.lastLogin.toLocaleDateString('fr-FR')}</div>
                        <div className="text-xs">
                          {user.lastLogin.toLocaleTimeString('fr-FR', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-400">Jamais connecté</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="relative">
                      <button
                        onClick={() => setActiveDropdown(activeDropdown === user.id ? null : user.id)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>
                      
                      {activeDropdown === user.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                          <button
                            onClick={() => handleEditUser(user)}
                            className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <Edit className="w-4 h-4" />
                            <span>Modifier</span>
                          </button>
                          <button
                            onClick={() => handleResetPassword(user.id)}
                            className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <Key className="w-4 h-4" />
                            <span>Réinitialiser mot de passe</span>
                          </button>
                          <button
                            onClick={() => handleToggleStatus(user.id, user.isActive)}
                            className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            {user.isActive ? (
                              <>
                                <UserX className="w-4 h-4" />
                                <span>Désactiver</span>
                              </>
                            ) : (
                              <>
                                <UserCheck className="w-4 h-4" />
                                <span>Activer</span>
                              </>
                            )}
                          </button>
                          <hr className="my-1" />
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Supprimer</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun utilisateur trouvé</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || roleFilter !== 'all' || statusFilter !== 'all'
                ? 'Aucun utilisateur ne correspond à vos critères de recherche.'
                : 'Commencez par créer votre premier utilisateur.'
              }
            </p>
            <button
              onClick={handleCreateUser}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-color text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Créer un Utilisateur</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};