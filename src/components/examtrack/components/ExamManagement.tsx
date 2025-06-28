import React, { useState, useEffect } from 'react';
import { Plus, Filter, Search, Edit, Trash2, Eye } from 'lucide-react';
import { ExamService } from '../services/examService';
import { Exam, ExamStatus, ExamType } from '../types';

const ExamManagement: React.FC = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    const fetchExams = async () => {
      try {
        setLoading(true);
        const examsData = await ExamService.getExams();
        setExams(examsData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching exams:', err);
        setError('Impossible de charger les examens');
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterStatus(e.target.value);
  };

  const filteredExams = exams
    .filter(exam => 
      exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(exam => filterStatus === 'all' || exam.status === filterStatus);

  const formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(date);
  };

  const getStatusBadgeClass = (status: ExamStatus) => {
    switch (status) {
      case ExamStatus.DRAFT:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      case ExamStatus.SCHEDULED:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case ExamStatus.IN_PROGRESS:
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
      case ExamStatus.COMPLETED:
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case ExamStatus.GRADED:
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      case ExamStatus.PUBLISHED:
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400';
      case ExamStatus.CANCELLED:
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getExamTypeLabel = (type: ExamType) => {
    switch (type) {
      case ExamType.TRIMESTER: return 'Trimestriel';
      case ExamType.MIDTERM: return 'Mi-parcours';
      case ExamType.FINAL: return 'Final';
      case ExamType.QUIZ: return 'Interrogation';
      case ExamType.ASSIGNMENT: return 'Devoir';
      case ExamType.OFFICIAL: return 'Officiel';
      default: return 'Inconnu';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
        <p>{error}</p>
        <button 
          className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
          onClick={() => window.location.reload()}
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Gestion des Examens</h1>
        
        <button className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-sm transition-colors">
          <Plus className="h-5 w-5 mr-2" />
          Nouvel Examen
        </button>
      </div>
      
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Filters and Search */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:items-center sm:justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:text-gray-300"
                value={filterStatus}
                onChange={handleFilterChange}
                aria-label="Filtrer par statut"
              >
                <option value="all">Tous les statuts</option>
                <option value={ExamStatus.DRAFT}>Brouillons</option>
                <option value={ExamStatus.SCHEDULED}>Programmés</option>
                <option value={ExamStatus.IN_PROGRESS}>En cours</option>
                <option value={ExamStatus.COMPLETED}>Terminés</option>
                <option value={ExamStatus.GRADED}>Notés</option>
                <option value={ExamStatus.PUBLISHED}>Publiés</option>
                <option value={ExamStatus.CANCELLED}>Annulés</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <Filter className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
          
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher un examen..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={searchTerm}
              onChange={handleSearch}
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>
        
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Examen
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Coef.
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Statut
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredExams.length > 0 ? (
                filteredExams.map((exam) => (
                  <tr key={exam.id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{exam.title}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{exam.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {getExamTypeLabel(exam.type)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(exam.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {exam.coefficient}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(exam.status)}`}>
                        {exam.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button 
                          className="p-1 rounded-full text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                          aria-label="Voir les détails de l'examen"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                        <button 
                          className="p-1 rounded-full text-gray-400 hover:text-amber-500 dark:hover:text-amber-400"
                          aria-label="Modifier l'examen"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button 
                          className="p-1 rounded-full text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                          aria-label="Supprimer l'examen"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-sm text-center text-gray-500 dark:text-gray-400">
                    Aucun examen trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="bg-white dark:bg-gray-800 px-4 py-3 border-t border-gray-200 dark:border-gray-700 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-400">
                  Affichage de <span className="font-medium">{filteredExams.length}</span> examens
                </p>
              </div>
              <div>
                {/* Pagination components would go here */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamManagement;
