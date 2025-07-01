import React, { useEffect, useState } from 'react';
import { useSchoolStore } from '../../stores/schoolStore';
import { useAuthStore } from '../../stores/authStore';
import { School } from '../../types';
import { 
  School as SchoolIcon, 
  Users, 
  Phone, 
  Mail,
  MapPin,
  MoreVertical,
  Plus,
  Search,
  Edit,
  Trash2,
  Key,
  Activity
} from 'lucide-react';
import { LoadingSpinner } from '../ui/LoadingSpinner';

export const SchoolManagement: React.FC = () => {
  const { schools, fetchSchools, deleteSchool, generateCredentials, isLoading } = useSchoolStore();
  const { user, tenant } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    if (tenant?.id && user?.role === 'patronat_admin') {
      fetchSchools(tenant.id);
    }
  }, [tenant?.id, user?.role, fetchSchools]);

  const filteredSchools = schools.filter(school =>
    school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    school.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    school.directorName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteSchool = async (schoolId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette école ? Cette action est irréversible.')) {
      await deleteSchool(schoolId);
    }
  };

  const handleGenerateCredentials = async (schoolId: string) => {
    if (window.confirm('Générer de nouveaux identifiants pour cette école ? Les anciens identifiants ne fonctionneront plus.')) {
      const credentials = await generateCredentials(schoolId);
      alert(`Nouveaux identifiants générés:\nNom d'utilisateur: ${credentials.username}\nMot de passe: ${credentials.password}\n\nVeuillez les transmettre à l'école de manière sécurisée.`);
    }
  };

  if (user?.role !== 'patronat_admin') {
    return (
      <div className="text-center py-12">
        <SchoolIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Accès Restreint</h3>
        <p className="text-gray-600">
          Cette section est réservée aux administrateurs de patronat.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Écoles</h1>
          <p className="text-gray-600 mt-1">
            Écoles privées de la région {tenant?.region}
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-color text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Nouvelle École</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Écoles</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{schools.length}</p>
            </div>
            <div className="bg-blue-500 rounded-lg p-3 text-white">
              <SchoolIcon className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Élèves</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {schools.reduce((sum, school) => sum + school.currentStudents, 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-green-500 rounded-lg p-3 text-white">
              <Users className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Capacité Totale</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {schools.reduce((sum, school) => sum + school.studentCapacity, 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-purple-500 rounded-lg p-3 text-white">
              <Activity className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Taux d'Occupation</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {Math.round((schools.reduce((sum, school) => sum + school.currentStudents, 0) / 
                            schools.reduce((sum, school) => sum + school.studentCapacity, 0)) * 100)}%
              </p>
            </div>
            <div className="bg-orange-500 rounded-lg p-3 text-white">
              <Activity className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Rechercher une école..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-color focus:border-transparent"
          />
        </div>
      </div>

      {/* Schools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSchools.map((school) => (
          <div key={school.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary-color/10 rounded-lg flex items-center justify-center">
                    <SchoolIcon className="w-6 h-6 text-primary-color" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{school.name}</h3>
                    <p className="text-sm text-gray-600">Code: {school.code}</p>
                  </div>
                </div>
                
                <div className="relative">
                  <button
                    onClick={() => setActiveDropdown(activeDropdown === school.id ? null : school.id)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>
                  
                  {activeDropdown === school.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                      <button className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <Edit className="w-4 h-4" />
                        <span>Modifier</span>
                      </button>
                      <button
                        onClick={() => handleGenerateCredentials(school.id)}
                        className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Key className="w-4 h-4" />
                        <span>Regénérer Identifiants</span>
                      </button>
                      <hr className="my-1" />
                      <button
                        onClick={() => handleDeleteSchool(school.id)}
                        className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Supprimer</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* School Info */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Users className="w-4 h-4" />
                  <span>{school.currentStudents}/{school.studentCapacity} élèves</span>
                </div>
                
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span className="truncate">{school.address}</span>
                </div>
                
                {school.phone && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{school.phone}</span>
                  </div>
                )}
                
                {school.email && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span className="truncate">{school.email}</span>
                  </div>
                )}
              </div>

              {/* Director Info */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">Directeur</p>
                <p className="font-medium text-gray-900">{school.directorName}</p>
              </div>

              {/* Occupancy Rate */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                  <span>Taux d'occupation</span>
                  <span>{Math.round((school.currentStudents / school.studentCapacity) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary-color h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(school.currentStudents / school.studentCapacity) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Status */}
              <div className="mt-4 flex items-center justify-between">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  school.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {school.isActive ? 'Active' : 'Inactive'}
                </span>
                
                <div className="text-xs text-gray-500">
                  Créée le {new Date(school.createdAt).toLocaleDateString('fr-FR')}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredSchools.length === 0 && (
        <div className="text-center py-12">
          <SchoolIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? 'Aucune école trouvée' : 'Aucune école enregistrée'}
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm 
              ? 'Aucune école ne correspond à votre recherche.'
              : 'Commencez par ajouter une école à votre région.'
            }
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-color text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter une École</span>
          </button>
        </div>
      )}
    </div>
  );
};