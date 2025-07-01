import React, { useEffect, useState } from 'react';
import { useExamStore } from '../../stores/examStore';
import { useAuthStore } from '../../stores/authStore';
import { Exam, ExamStatus, ExamType } from '../../types';
import { 
  BookOpen, 
  Calendar, 
  Users, 
  MoreVertical,
  Plus,
  Filter,
  Search,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const statusConfig = {
  draft: { label: 'Brouillon', color: 'bg-gray-100 text-gray-800' },
  scheduled: { label: 'Programmé', color: 'bg-blue-100 text-blue-800' },
  ongoing: { label: 'En cours', color: 'bg-orange-100 text-orange-800' },
  completed: { label: 'Terminé', color: 'bg-green-100 text-green-800' },
  results_published: { label: 'Résultats publiés', color: 'bg-purple-100 text-purple-800' },
};

const typeConfig = {
  'CEP': { label: 'CEP', color: 'bg-red-100 text-red-800' },
  'BEPC': { label: 'BEPC', color: 'bg-orange-100 text-orange-800' },
  'BAC': { label: 'BAC', color: 'bg-green-100 text-green-800' },
  'Contrôle Continu': { label: 'Contrôle Continu', color: 'bg-blue-100 text-blue-800' },
  'Composition': { label: 'Composition', color: 'bg-purple-100 text-purple-800' },
  'Examen Blanc': { label: 'Examen Blanc', color: 'bg-yellow-100 text-yellow-800' },
};

export const ExamList: React.FC = () => {
  const { exams, fetchExams, deleteExam, isLoading } = useExamStore();
  const { user, tenant } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ExamStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<ExamType | 'all'>('all');
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    if (tenant?.id) {
      fetchExams(tenant.id);
    }
  }, [tenant?.id, fetchExams]);

  const filteredExams = exams.filter(exam => {
    const matchesSearch = exam.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exam.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || exam.status === statusFilter;
    const matchesType = typeFilter === 'all' || exam.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleDeleteExam = async (examId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet examen ?')) {
      await deleteExam(examId);
    }
  };

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
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Examens</h1>
          <p className="text-gray-600 mt-1">
            {tenant?.type === 'patronat' 
              ? 'Examens régionaux et supervision des écoles'
              : 'Examens de l\'établissement'
            }
          </p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-primary-color text-white rounded-lg hover:bg-green-700 transition-colors">
          <Plus className="w-4 h-4" />
          <span>Nouvel Examen</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Rechercher un examen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-color focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ExamStatus | 'all')}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-color focus:border-transparent"
            >
              <option value="all">Tous les statuts</option>
              <option value="draft">Brouillon</option>
              <option value="scheduled">Programmé</option>
              <option value="ongoing">En cours</option>
              <option value="completed">Terminé</option>
              <option value="results_published">Résultats publiés</option>
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as ExamType | 'all')}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-color focus:border-transparent"
            >
              <option value="all">Tous les types</option>
              <option value="CEP">CEP</option>
              <option value="BEPC">BEPC</option>
              <option value="BAC">BAC</option>
              <option value="Contrôle Continu">Contrôle Continu</option>
              <option value="Composition">Composition</option>
              <option value="Examen Blanc">Examen Blanc</option>
            </select>
          </div>
        </div>
      </div>

      {/* Exam List */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {filteredExams.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun examen trouvé</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
                ? 'Aucun examen ne correspond à vos critères de recherche.'
                : 'Commencez par créer votre premier examen.'
              }
            </p>
            <button className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-color text-white rounded-lg hover:bg-green-700 transition-colors">
              <Plus className="w-4 h-4" />
              <span>Créer un Examen</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Examen
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dates
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Classes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredExams.map((exam) => (
                  <tr key={exam.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-primary-color/10 rounded-lg flex items-center justify-center">
                            <BookOpen className="w-5 h-5 text-primary-color" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {exam.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {exam.subjects.length} matière{exam.subjects.length > 1 ? 's' : ''}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${typeConfig[exam.type].color}`}>
                        {typeConfig[exam.type].label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>
                          {format(exam.startDate, 'dd MMM', { locale: fr })} - {format(exam.endDate, 'dd MMM yyyy', { locale: fr })}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span>{exam.targetClasses.join(', ')}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusConfig[exam.status].color}`}>
                        {statusConfig[exam.status].label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="relative">
                        <button
                          onClick={() => setActiveDropdown(activeDropdown === exam.id ? null : exam.id)}
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <MoreVertical className="w-5 h-5" />
                        </button>
                        
                        {activeDropdown === exam.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                            <button className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                              <Eye className="w-4 h-4" />
                              <span>Voir détails</span>
                            </button>
                            <button className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                              <Edit className="w-4 h-4" />
                              <span>Modifier</span>
                            </button>
                            <hr className="my-1" />
                            <button
                              onClick={() => handleDeleteExam(exam.id)}
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
        )}
      </div>
    </div>
  );
};