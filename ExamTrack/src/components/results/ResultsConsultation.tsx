import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { useExamStore } from '../../stores/examStore';
import { useResultStore } from '../../stores/resultStore';
import { 
  Search, 
  Filter, 
  Download, 
  Printer,
  Eye,
  TrendingUp,
  Award,
  Users,
  BarChart3,
  FileText
} from 'lucide-react';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface StudentResult {
  studentId: string;
  studentNumber: number;
  matricule: string;
  lastName: string;
  firstName: string;
  class: string;
  grades: { [subject: string]: number };
  average: number;
  rank: number;
  mention: string;
  status: 'Admis' | 'Ajourné' | 'Exclu';
}

const mentions = [
  { name: 'Excellence', min: 18, color: 'text-purple-600 bg-purple-100' },
  { name: 'Très Bien', min: 16, color: 'text-green-600 bg-green-100' },
  { name: 'Bien', min: 14, color: 'text-blue-600 bg-blue-100' },
  { name: 'Assez Bien', min: 12, color: 'text-yellow-600 bg-yellow-100' },
  { name: 'Passable', min: 10, color: 'text-orange-600 bg-orange-100' },
  { name: 'Insuffisant', min: 0, color: 'text-red-600 bg-red-100' }
];

export const ResultsConsultation: React.FC = () => {
  const { user, tenant } = useAuthStore();
  const { exams } = useExamStore();
  const { results, fetchResults, isLoading } = useResultStore();
  
  const [selectedExam, setSelectedExam] = useState<string>('');
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<string>('rank');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);

  // Mock results data
  const mockResults: StudentResult[] = [
    {
      studentId: '1', studentNumber: 1, matricule: 'MAT001', lastName: 'ADJOVI', firstName: 'Paul', class: '6ème A',
      grades: { 'MATH': 16, 'FR': 14, 'ANG': 15, 'SVT': 13 }, average: 14.5, rank: 3, mention: 'Bien', status: 'Admis'
    },
    {
      studentId: '2', studentNumber: 2, matricule: 'MAT002', lastName: 'AGBODJAN', firstName: 'Marie', class: '6ème A',
      grades: { 'MATH': 18, 'FR': 17, 'ANG': 16, 'SVT': 18 }, average: 17.25, rank: 1, mention: 'Très Bien', status: 'Admis'
    },
    {
      studentId: '3', studentNumber: 3, matricule: 'MAT003', lastName: 'AKPOVI', firstName: 'Jean', class: '6ème A',
      grades: { 'MATH': 12, 'FR': 13, 'ANG': 11, 'SVT': 14 }, average: 12.5, rank: 8, mention: 'Assez Bien', status: 'Admis'
    },
    {
      studentId: '4', studentNumber: 4, matricule: 'MAT004', lastName: 'ASSOGBA', firstName: 'Sylvie', class: '6ème A',
      grades: { 'MATH': 15, 'FR': 16, 'ANG': 14, 'SVT': 17 }, average: 15.5, rank: 2, mention: 'Bien', status: 'Admis'
    },
    {
      studentId: '5', studentNumber: 5, matricule: 'MAT005', lastName: 'DOSSOU', firstName: 'Michel', class: '6ème A',
      grades: { 'MATH': 8, 'FR': 9, 'ANG': 7, 'SVT': 10 }, average: 8.5, rank: 15, mention: 'Insuffisant', status: 'Ajourné'
    }
  ];

  const [filteredResults, setFilteredResults] = useState<StudentResult[]>(mockResults);

  useEffect(() => {
    let filtered = mockResults;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(result =>
        result.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.matricule.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by class
    if (selectedClass) {
      filtered = filtered.filter(result => result.class === selectedClass);
    }

    // Sort results
    filtered.sort((a, b) => {
      const aValue = a[sortField as keyof StudentResult];
      const bValue = b[sortField as keyof StudentResult];
      
      if (sortDirection === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    setFilteredResults(filtered);
  }, [searchTerm, selectedClass, sortField, sortDirection]);

  const getMentionStyle = (mention: string) => {
    const mentionData = mentions.find(m => m.name === mention);
    return mentionData ? mentionData.color : 'text-gray-600 bg-gray-100';
  };

  const calculateStatistics = () => {
    const total = filteredResults.length;
    const admitted = filteredResults.filter(r => r.status === 'Admis').length;
    const average = total > 0 ? filteredResults.reduce((sum, r) => sum + r.average, 0) / total : 0;
    const distribution = mentions.reduce((acc, mention) => {
      acc[mention.name] = filteredResults.filter(r => r.mention === mention.name).length;
      return acc;
    }, {} as { [key: string]: number });

    return {
      total,
      admitted,
      successRate: total > 0 ? Math.round((admitted / total) * 100) : 0,
      average: Math.round(average * 100) / 100,
      distribution
    };
  };

  const stats = calculateStatistics();
  const selectedExamData = exams.find(e => e.id === selectedExam);

  // Pagination
  const totalPages = Math.ceil(filteredResults.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedResults = filteredResults.slice(startIndex, startIndex + pageSize);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Consultation des Résultats</h1>
            <p className="text-gray-600 mt-1">
              Résultats d'examens et bulletins - Interface EducMaster.bj
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-primary-color" />
            <span className="text-sm font-medium text-primary-color">
              Année Scolaire {tenant?.settings.academicYear}
            </span>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Examen
            </label>
            <select
              value={selectedExam}
              onChange={(e) => setSelectedExam(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-color focus:border-transparent"
            >
              <option value="">Tous les examens</option>
              {exams.map(exam => (
                <option key={exam.id} value={exam.id}>
                  {exam.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Classe
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-color focus:border-transparent"
            >
              <option value="">Toutes les classes</option>
              <option value="6ème A">6ème A</option>
              <option value="6ème B">6ème B</option>
              <option value="5ème A">5ème A</option>
              <option value="5ème B">5ème B</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Recherche
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Nom, prénom, matricule..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-color focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tri
            </label>
            <select
              value={`${sortField}-${sortDirection}`}
              onChange={(e) => {
                const [field, direction] = e.target.value.split('-');
                setSortField(field);
                setSortDirection(direction as 'asc' | 'desc');
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-color focus:border-transparent"
            >
              <option value="rank-asc">Rang (croissant)</option>
              <option value="rank-desc">Rang (décroissant)</option>
              <option value="average-desc">Moyenne (décroissant)</option>
              <option value="average-asc">Moyenne (croissant)</option>
              <option value="lastName-asc">Nom (A-Z)</option>
              <option value="lastName-desc">Nom (Z-A)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Élèves</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
            </div>
            <div className="bg-blue-500 rounded-lg p-3 text-white">
              <Users className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Taux de Réussite</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{stats.successRate}%</p>
            </div>
            <div className="bg-green-500 rounded-lg p-3 text-white">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Moyenne Générale</p>
              <p className="text-2xl font-bold text-primary-color mt-1">{stats.average}/20</p>
            </div>
            <div className="bg-primary-color rounded-lg p-3 text-white">
              <BarChart3 className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Admis</p>
              <p className="text-2xl font-bold text-orange-600 mt-1">{stats.admitted}</p>
            </div>
            <div className="bg-orange-500 rounded-lg p-3 text-white">
              <Award className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Résultats d'Examen
            </h3>
            <div className="flex items-center space-x-2">
              <button className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors">
                <Download className="w-4 h-4" />
                <span>Exporter</span>
              </button>
              <button className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors">
                <Printer className="w-4 h-4" />
                <span>Imprimer</span>
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rang
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Matricule
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nom et Prénoms
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Classe
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Moyenne
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mention
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
              {paginatedResults.map((result) => (
                <tr key={result.studentId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {result.rank <= 3 && (
                        <Award className={`w-4 h-4 mr-2 ${
                          result.rank === 1 ? 'text-yellow-500' :
                          result.rank === 2 ? 'text-gray-400' :
                          'text-orange-500'
                        }`} />
                      )}
                      <span className="text-sm font-medium text-gray-900">
                        {result.rank}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {result.matricule}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {result.lastName} {result.firstName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {result.class}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-bold text-primary-color">
                      {result.average}/20
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getMentionStyle(result.mention)}`}>
                      {result.mention}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      result.status === 'Admis' 
                        ? 'bg-green-100 text-green-800'
                        : result.status === 'Ajourné'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {result.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-primary-color hover:text-green-700 transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Précédent
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Suivant
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Affichage de <span className="font-medium">{startIndex + 1}</span> à{' '}
                  <span className="font-medium">
                    {Math.min(startIndex + pageSize, filteredResults.length)}
                  </span>{' '}
                  sur <span className="font-medium">{filteredResults.length}</span> résultats
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        page === currentPage
                          ? 'z-10 bg-primary-color border-primary-color text-white'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};