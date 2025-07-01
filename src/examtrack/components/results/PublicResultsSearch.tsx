import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  ArrowLeft, 
  FileText, 
  Download, 
  Printer,
  User,
  Calendar,
  Award,
  TrendingUp,
  Eye,
  RefreshCw,
  Filter,
  Share2
} from 'lucide-react';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface StudentResult {
  matricule: string;
  firstName: string;
  lastName: string;
  school: string;
  class: string;
  examName: string;
  examDate: string;
  subjects: { [key: string]: number };
  average: number;
  rank: number;
  mention: string;
  status: 'Admis' | 'Ajourné' | 'Exclu';
}

export const PublicResultsSearch: React.FC = () => {
  const [searchType, setSearchType] = useState<'matricule' | 'name'>('matricule');
  const [matricule, setMatricule] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [school, setSchool] = useState('');
  const [examFilter, setExamFilter] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<StudentResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<StudentResult | null>(null);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  // Mock data pour la démonstration
  const mockResults: StudentResult[] = [
    {
      matricule: 'MAT001',
      firstName: 'Paul',
      lastName: 'ADJOVI',
      school: 'École Sainte Marie',
      class: '6ème A',
      examName: 'Composition du 1er Trimestre',
      examDate: '2024-10-25',
      subjects: {
        'Mathématiques': 16,
        'Français': 14,
        'Anglais': 15,
        'SVT': 13,
        'Histoire-Géo': 12
      },
      average: 14.5,
      rank: 3,
      mention: 'Bien',
      status: 'Admis'
    },
    {
      matricule: 'MAT002',
      firstName: 'Marie',
      lastName: 'AGBODJAN',
      school: 'École Sainte Marie',
      class: '6ème A',
      examName: 'Composition du 1er Trimestre',
      examDate: '2024-10-25',
      subjects: {
        'Mathématiques': 18,
        'Français': 17,
        'Anglais': 16,
        'SVT': 18,
        'Histoire-Géo': 16
      },
      average: 17.25,
      rank: 1,
      mention: 'Très Bien',
      status: 'Admis'
    }
  ];

  const handleSearch = async () => {
    setIsLoading(true);
    
    // Ajouter à l'historique
    const searchTerm = searchType === 'matricule' ? matricule : `${firstName} ${lastName}`;
    if (searchTerm.trim() && !searchHistory.includes(searchTerm)) {
      setSearchHistory([searchTerm, ...searchHistory.slice(0, 4)]);
    }
    
    // Simulation d'une recherche
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (searchType === 'matricule') {
      const found = mockResults.filter(r => 
        r.matricule.toLowerCase().includes(matricule.toLowerCase())
      );
      setResults(found);
    } else {
      const found = mockResults.filter(r => 
        r.firstName.toLowerCase().includes(firstName.toLowerCase()) &&
        r.lastName.toLowerCase().includes(lastName.toLowerCase())
      );
      setResults(found);
    }
    
    setIsLoading(false);
  };

  const handleClearSearch = () => {
    setMatricule('');
    setFirstName('');
    setLastName('');
    setSchool('');
    setExamFilter('');
    setResults([]);
    setSelectedResult(null);
  };

  const handleQuickSearch = (term: string) => {
    if (term.includes(' ')) {
      const [first, last] = term.split(' ');
      setFirstName(first);
      setLastName(last);
      setSearchType('name');
    } else {
      setMatricule(term);
      setSearchType('matricule');
    }
  };

  const getMentionColor = (mention: string) => {
    switch (mention) {
      case 'Excellent': return 'text-purple-600 bg-purple-100';
      case 'Très Bien': return 'text-green-600 bg-green-100';
      case 'Bien': return 'text-blue-600 bg-blue-100';
      case 'Assez Bien': return 'text-yellow-600 bg-yellow-100';
      case 'Passable': return 'text-orange-600 bg-orange-100';
      default: return 'text-red-600 bg-red-100';
    }
  };

  const generateBulletin = (result: StudentResult) => {
    // Simulation de génération de bulletin
    const bulletinData = {
      student: `${result.firstName} ${result.lastName}`,
      matricule: result.matricule,
      school: result.school,
      class: result.class,
      exam: result.examName,
      date: result.examDate,
      subjects: result.subjects,
      average: result.average,
      rank: result.rank,
      mention: result.mention,
      status: result.status
    };
    
    const blob = new Blob([JSON.stringify(bulletinData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bulletin-${result.matricule}-${result.examName.replace(/\s+/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const printBulletin = (result: StudentResult) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Bulletin - ${result.firstName} ${result.lastName}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .header { text-align: center; margin-bottom: 30px; }
              .student-info { margin-bottom: 20px; }
              .grades-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
              .grades-table th, .grades-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              .grades-table th { background-color: #f2f2f2; }
              .summary { margin-top: 20px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>BULLETIN DE NOTES</h1>
              <h2>${result.school}</h2>
              <p>${result.examName} - ${result.examDate}</p>
            </div>
            <div class="student-info">
              <p><strong>Nom:</strong> ${result.lastName}</p>
              <p><strong>Prénoms:</strong> ${result.firstName}</p>
              <p><strong>Matricule:</strong> ${result.matricule}</p>
              <p><strong>Classe:</strong> ${result.class}</p>
            </div>
            <table class="grades-table">
              <thead>
                <tr>
                  <th>Matière</th>
                  <th>Note/20</th>
                </tr>
              </thead>
              <tbody>
                ${Object.entries(result.subjects).map(([subject, grade]) => 
                  `<tr><td>${subject}</td><td>${grade}/20</td></tr>`
                ).join('')}
              </tbody>
            </table>
            <div class="summary">
              <p><strong>Moyenne générale:</strong> ${result.average}/20</p>
              <p><strong>Rang:</strong> ${result.rank}</p>
              <p><strong>Mention:</strong> ${result.mention}</p>
              <p><strong>Statut:</strong> ${result.status}</p>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const shareResult = (result: StudentResult) => {
    if (navigator.share) {
      navigator.share({
        title: `Résultats de ${result.firstName} ${result.lastName}`,
        text: `${result.firstName} ${result.lastName} - Moyenne: ${result.average}/20 - Mention: ${result.mention}`,
        url: window.location.href
      });
    } else {
      // Fallback pour les navigateurs qui ne supportent pas l'API Web Share
      const text = `${result.firstName} ${result.lastName} - Moyenne: ${result.average}/20 - Mention: ${result.mention}`;
      navigator.clipboard.writeText(text).then(() => {
        alert('Résultats copiés dans le presse-papiers !');
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link 
                to="/examtrack" 
                className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Retour à l'accueil</span>
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary-color rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">EM</span>
                </div>
                <div>
                  <h1 className="text-lg font-bold text-primary-color">
                    EducMaster Academia Hub
                  </h1>
                  <p className="text-xs text-gray-600">Consultation des Résultats</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleClearSearch}
                className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Réinitialiser</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Page Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Consultation des Résultats d'Examens
          </h1>
          <p className="text-gray-600">
            Recherchez et consultez les résultats d'examens en ligne
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Rechercher un Élève
              </h2>
              {searchHistory.length > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Recherches récentes:</span>
                  {searchHistory.slice(0, 3).map((term, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickSearch(term)}
                      className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Search Type Toggle */}
            <div className="flex space-x-4 mb-6">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="matricule"
                  checked={searchType === 'matricule'}
                  onChange={(e) => setSearchType(e.target.value as 'matricule')}
                  className="mr-2 text-primary-color focus:ring-primary-color"
                />
                <span className="text-sm font-medium text-gray-700">
                  Recherche par Matricule
                </span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="name"
                  checked={searchType === 'name'}
                  onChange={(e) => setSearchType(e.target.value as 'name')}
                  className="mr-2 text-primary-color focus:ring-primary-color"
                />
                <span className="text-sm font-medium text-gray-700">
                  Recherche par Nom
                </span>
              </label>
            </div>

            {/* Search Fields */}
            {searchType === 'matricule' ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Matricule de l'Élève *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={matricule}
                      onChange={(e) => setMatricule(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-color focus:border-transparent"
                      placeholder="Ex: MAT001, MAT002..."
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Examen (optionnel)
                  </label>
                  <select
                    value={examFilter}
                    onChange={(e) => setExamFilter(e.target.value)}
                    className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-color focus:border-transparent"
                  >
                    <option value="">Tous les examens</option>
                    <option value="composition-1er-trimestre">Composition 1er Trimestre</option>
                    <option value="composition-2eme-trimestre">Composition 2ème Trimestre</option>
                    <option value="examen-blanc">Examen Blanc</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={handleSearch}
                    disabled={!matricule.trim() || isLoading}
                    className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-primary-color text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-color disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isLoading ? (
                      <>
                        <LoadingSpinner size="sm" color="text-white" />
                        <span>Recherche...</span>
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4" />
                        <span>Rechercher</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prénom *
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-color focus:border-transparent"
                    placeholder="Prénom de l'élève"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom *
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-color focus:border-transparent"
                    placeholder="Nom de l'élève"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    École (optionnel)
                  </label>
                  <input
                    type="text"
                    value={school}
                    onChange={(e) => setSchool(e.target.value)}
                    className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-color focus:border-transparent"
                    placeholder="Nom de l'école"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Examen (optionnel)
                  </label>
                  <select
                    value={examFilter}
                    onChange={(e) => setExamFilter(e.target.value)}
                    className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-color focus:border-transparent"
                  >
                    <option value="">Tous les examens</option>
                    <option value="composition-1er-trimestre">Composition 1er Trimestre</option>
                    <option value="composition-2eme-trimestre">Composition 2ème Trimestre</option>
                    <option value="examen-blanc">Examen Blanc</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={handleSearch}
                    disabled={!firstName.trim() || !lastName.trim() || isLoading}
                    className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-primary-color text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-color disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isLoading ? (
                      <>
                        <LoadingSpinner size="sm" color="text-white" />
                        <span>Recherche...</span>
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4" />
                        <span>Rechercher</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick Search Examples */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Exemples de recherche :</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-blue-700">
              <div>
                <strong>Par matricule :</strong>
                <div className="space-y-1 mt-1">
                  <button 
                    onClick={() => setMatricule('MAT001')}
                    className="block text-blue-600 hover:text-blue-800 underline"
                  >
                    MAT001 (Paul ADJOVI)
                  </button>
                  <button 
                    onClick={() => setMatricule('MAT002')}
                    className="block text-blue-600 hover:text-blue-800 underline"
                  >
                    MAT002 (Marie AGBODJAN)
                  </button>
                </div>
              </div>
              <div>
                <strong>Par nom :</strong>
                <div className="space-y-1 mt-1">
                  <button 
                    onClick={() => {
                      setFirstName('Paul');
                      setLastName('ADJOVI');
                      setSearchType('name');
                    }}
                    className="block text-blue-600 hover:text-blue-800 underline"
                  >
                    Paul ADJOVI
                  </button>
                  <button 
                    onClick={() => {
                      setFirstName('Marie');
                      setLastName('AGBODJAN');
                      setSearchType('name');
                    }}
                    className="block text-blue-600 hover:text-blue-800 underline"
                  >
                    Marie AGBODJAN
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search Results */}
        {results.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden mb-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Résultats de la Recherche ({results.length})
                </h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      results.forEach(result => generateBulletin(result));
                    }}
                    className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Tout télécharger</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="divide-y divide-gray-200">
              {results.map((result, index) => (
                <div key={index} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-3">
                        <div className="w-12 h-12 bg-primary-color rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            {result.firstName.charAt(0)}{result.lastName.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">
                            {result.firstName} {result.lastName}
                          </h4>
                          <p className="text-sm text-gray-600">
                            Matricule: {result.matricule} • {result.school} • {result.class}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{result.examName}</p>
                            <p className="text-xs text-gray-500">{result.examDate}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <TrendingUp className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-primary-color">{result.average}/20</p>
                            <p className="text-xs text-gray-500">Moyenne générale</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Award className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Rang {result.rank}</p>
                            <span className={`text-xs px-2 py-1 rounded-full ${getMentionColor(result.mention)}`}>
                              {result.mention}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${
                            result.status === 'Admis' ? 'bg-green-500' : 
                            result.status === 'Ajourné' ? 'bg-yellow-500' : 'bg-red-500'
                          }`}></div>
                          <span className={`text-sm font-medium ${
                            result.status === 'Admis' ? 'text-green-700' : 
                            result.status === 'Ajourné' ? 'text-yellow-700' : 'text-red-700'
                          }`}>
                            {result.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => setSelectedResult(result)}
                        className="flex items-center space-x-1 px-3 py-2 text-primary-color border border-primary-color rounded-lg hover:bg-primary-color hover:text-white transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Détails</span>
                      </button>
                      <button
                        onClick={() => generateBulletin(result)}
                        className="flex items-center space-x-1 px-3 py-2 bg-primary-color text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        <span>Bulletin</span>
                      </button>
                      <button
                        onClick={() => printBulletin(result)}
                        className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => shareResult(result)}
                        className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Detailed Result Modal */}
        {selectedResult && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    Détail des Résultats
                  </h2>
                  <button
                    onClick={() => setSelectedResult(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>

                {/* Student Info */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-primary-color rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {selectedResult.firstName.charAt(0)}{selectedResult.lastName.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {selectedResult.firstName} {selectedResult.lastName}
                      </h3>
                      <p className="text-gray-600">
                        {selectedResult.matricule} • {selectedResult.school} • {selectedResult.class}
                      </p>
                      <p className="text-sm text-gray-500">
                        {selectedResult.examName} - {selectedResult.examDate}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Grades Table */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Notes par Matière</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full border border-gray-200 rounded-lg">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Matière</th>
                          <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Note/20</th>
                          <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Appréciation</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {Object.entries(selectedResult.subjects).map(([subject, grade]) => (
                          <tr key={subject}>
                            <td className="px-4 py-3 text-sm text-gray-900">{subject}</td>
                            <td className="px-4 py-3 text-center text-sm font-medium text-primary-color">
                              {grade}/20
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                grade >= 16 ? 'bg-green-100 text-green-800' :
                                grade >= 14 ? 'bg-blue-100 text-blue-800' :
                                grade >= 12 ? 'bg-yellow-100 text-yellow-800' :
                                grade >= 10 ? 'bg-orange-100 text-orange-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {grade >= 16 ? 'Très Bien' :
                                 grade >= 14 ? 'Bien' :
                                 grade >= 12 ? 'Assez Bien' :
                                 grade >= 10 ? 'Passable' : 'Insuffisant'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Summary */}
                <div className="bg-primary-color/5 rounded-lg p-4 mb-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-primary-color">{selectedResult.average}</p>
                      <p className="text-sm text-gray-600">Moyenne</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{selectedResult.rank}</p>
                      <p className="text-sm text-gray-600">Rang</p>
                    </div>
                    <div>
                      <p className={`text-lg font-bold ${getMentionColor(selectedResult.mention).split(' ')[0]}`}>
                        {selectedResult.mention}
                      </p>
                      <p className="text-sm text-gray-600">Mention</p>
                    </div>
                    <div>
                      <p className={`text-lg font-bold ${
                        selectedResult.status === 'Admis' ? 'text-green-600' : 
                        selectedResult.status === 'Ajourné' ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {selectedResult.status}
                      </p>
                      <p className="text-sm text-gray-600">Statut</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end space-x-3">
                  <button
                    onClick={() => setSelectedResult(null)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Fermer
                  </button>
                  <button
                    onClick={() => printBulletin(selectedResult)}
                    className="flex items-center space-x-2 px-4 py-2 border border-primary-color text-primary-color rounded-lg hover:bg-primary-color hover:text-white transition-colors"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Imprimer</span>
                  </button>
                  <button
                    onClick={() => generateBulletin(selectedResult)}
                    className="flex items-center space-x-2 px-4 py-2 bg-primary-color text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Télécharger Bulletin</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* No Results */}
        {results.length === 0 && !isLoading && (matricule || (firstName && lastName)) && (
          <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucun résultat trouvé
            </h3>
            <p className="text-gray-600 mb-4">
              Aucun résultat ne correspond à votre recherche. Vérifiez les informations saisies.
            </p>
            <div className="text-sm text-gray-500">
              <p>Conseils :</p>
              <ul className="mt-2 space-y-1">
                <li>• Vérifiez l'orthographe du matricule ou du nom</li>
                <li>• Assurez-vous que les résultats ont été publiés</li>
                <li>• Contactez votre école en cas de problème</li>
              </ul>
            </div>
          </div>
        )}

        {/* Help Section */}
        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="font-medium text-blue-900 mb-3">Aide et Support</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
            <div>
              <h4 className="font-medium mb-2">Comment rechercher ?</h4>
              <ul className="space-y-1">
                <li>• Utilisez le matricule exact de l'élève</li>
                <li>• Ou saisissez le nom et prénom complets</li>
                <li>• Les résultats sont disponibles après publication</li>
                <li>• Vous pouvez filtrer par examen spécifique</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Problème de recherche ?</h4>
              <ul className="space-y-1">
                <li>• Contactez votre établissement scolaire</li>
                <li>• Email : support@educmaster-hub.com</li>
                <li>• Téléphone : +229 21 23 45 67</li>
                <li>• Horaires : Lun-Ven 8h-17h</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};