import React, { useState } from 'react';
import { Download, Printer } from 'lucide-react';
import ProgressBar from '../../ui/ProgressBar';

const RapportAvancement: React.FC = () => {
  // État pour les filtres
  const [filters, setFilters] = useState({
    class: '',
    subject: '',
    period: 'year' // 'trimester1', 'trimester2', 'trimester3', 'year'
  });

  // Données factices pour les classes et matières
  const classes = [
    { id: 1, name: '6ème A' },
    { id: 2, name: '5ème B' },
    { id: 3, name: '4ème C' },
    { id: 4, name: '3ème D' },
  ];

  const subjects = [
    { id: 1, name: 'Mathématiques' },
    { id: 2, name: 'Français' },
    { id: 3, name: 'Histoire-Géographie' },
    { id: 4, name: 'Sciences' },
  ];

  // Données factices pour les rapports d'avancement
  const progressData = [
    {
      class: '6ème A',
      subject: 'Mathématiques',
      teacher: 'Mme Dubois',
      totalChapters: 12,
      completedChapters: 8,
      progress: 66.7,
      lastUpdate: '2025-07-01',
      chapters: [
        { id: 1, title: 'Nombres entiers et décimaux', status: 'completed', startDate: '2025-09-05', endDate: '2025-09-30' },
        { id: 2, title: 'Fractions', status: 'completed', startDate: '2025-10-01', endDate: '2025-10-25' },
        { id: 3, title: 'Géométrie plane', status: 'completed', startDate: '2025-10-26', endDate: '2025-11-20' },
        { id: 4, title: 'Symétrie axiale', status: 'completed', startDate: '2025-11-21', endDate: '2025-12-18' },
        { id: 5, title: 'Proportionnalité', status: 'completed', startDate: '2025-01-06', endDate: '2025-01-31' },
        { id: 6, title: 'Aires et périmètres', status: 'completed', startDate: '2025-02-01', endDate: '2025-02-28' },
        { id: 7, title: 'Angles', status: 'completed', startDate: '2025-03-01', endDate: '2025-03-31' },
        { id: 8, title: 'Statistiques', status: 'completed', startDate: '2025-04-01', endDate: '2025-04-30' },
        { id: 9, title: 'Volumes', status: 'in_progress', startDate: '2025-05-02', endDate: null },
        { id: 10, title: 'Equations', status: 'planned', startDate: null, endDate: null },
        { id: 11, title: 'Probabilités', status: 'planned', startDate: null, endDate: null },
        { id: 12, title: 'Théorème de Pythagore', status: 'planned', startDate: null, endDate: null },
      ]
    },
    {
      class: '5ème B',
      subject: 'Français',
      teacher: 'M. Martin',
      totalChapters: 10,
      completedChapters: 6,
      progress: 60,
      lastUpdate: '2025-07-02',
      chapters: [
        { id: 1, title: 'La poésie lyrique', status: 'completed', startDate: '2025-09-05', endDate: '2025-09-30' },
        { id: 2, title: 'Le récit d\'aventure', status: 'completed', startDate: '2025-10-01', endDate: '2025-10-25' },
        { id: 3, title: 'La description', status: 'completed', startDate: '2025-10-26', endDate: '2025-11-20' },
        { id: 4, title: 'Le théâtre', status: 'completed', startDate: '2025-11-21', endDate: '2025-12-18' },
        { id: 5, title: 'La nouvelle fantastique', status: 'completed', startDate: '2025-01-06', endDate: '2025-01-31' },
        { id: 6, title: 'L\'argumentation', status: 'completed', startDate: '2025-02-01', endDate: '2025-02-28' },
        { id: 7, title: 'La presse et les médias', status: 'in_progress', startDate: '2025-03-01', endDate: null },
        { id: 8, title: 'Le roman historique', status: 'planned', startDate: null, endDate: null },
        { id: 9, title: 'La poésie engagée', status: 'planned', startDate: null, endDate: null },
        { id: 10, title: 'L\'autobiographie', status: 'planned', startDate: null, endDate: null },
      ]
    },
    {
      class: '4ème C',
      subject: 'Histoire-Géographie',
      teacher: 'Mme Laurent',
      totalChapters: 14,
      completedChapters: 9,
      progress: 64.3,
      lastUpdate: '2025-07-03',
      chapters: [
        { id: 1, title: 'Le XVIIIe siècle', status: 'completed', startDate: '2025-09-05', endDate: '2025-09-20' },
        { id: 2, title: 'La Révolution française', status: 'completed', startDate: '2025-09-21', endDate: '2025-10-15' },
        { id: 3, title: 'L\'Empire et l\'Europe', status: 'completed', startDate: '2025-10-16', endDate: '2025-11-10' },
        { id: 4, title: 'L\'industrialisation', status: 'completed', startDate: '2025-11-11', endDate: '2025-12-05' },
        { id: 5, title: 'La colonisation', status: 'completed', startDate: '2025-12-06', endDate: '2025-12-18' },
        { id: 6, title: 'L\'urbanisation', status: 'completed', startDate: '2025-01-06', endDate: '2025-01-25' },
        { id: 7, title: 'Les régimes totalitaires', status: 'completed', startDate: '2025-01-26', endDate: '2025-02-20' },
        { id: 8, title: 'La Seconde Guerre mondiale', status: 'completed', startDate: '2025-02-21', endDate: '2025-03-20' },
        { id: 9, title: 'La Guerre froide', status: 'completed', startDate: '2025-03-21', endDate: '2025-04-15' },
        { id: 10, title: 'La décolonisation', status: 'in_progress', startDate: '2025-04-16', endDate: null },
        { id: 11, title: 'La construction européenne', status: 'planned', startDate: null, endDate: null },
        { id: 12, title: 'La mondialisation', status: 'planned', startDate: null, endDate: null },
        { id: 13, title: 'Les enjeux du développement durable', status: 'planned', startDate: null, endDate: null },
        { id: 14, title: 'Les conflits contemporains', status: 'planned', startDate: null, endDate: null },
      ]
    },
    {
      class: '3ème D',
      subject: 'Sciences',
      teacher: 'M. Bernard',
      totalChapters: 12,
      completedChapters: 7,
      progress: 58.3,
      lastUpdate: '2025-07-01',
      chapters: [
        { id: 1, title: 'L\'organisation du corps humain', status: 'completed', startDate: '2025-09-05', endDate: '2025-09-25' },
        { id: 2, title: 'La reproduction', status: 'completed', startDate: '2025-09-26', endDate: '2025-10-20' },
        { id: 3, title: 'La génétique', status: 'completed', startDate: '2025-10-21', endDate: '2025-11-15' },
        { id: 4, title: 'L\'évolution', status: 'completed', startDate: '2025-11-16', endDate: '2025-12-18' },
        { id: 5, title: 'Les circuits électriques', status: 'completed', startDate: '2025-01-06', endDate: '2025-01-31' },
        { id: 6, title: 'L\'énergie', status: 'completed', startDate: '2025-02-01', endDate: '2025-02-28' },
        { id: 7, title: 'La chimie', status: 'completed', startDate: '2025-03-01', endDate: '2025-03-31' },
        { id: 8, title: 'Le système solaire', status: 'in_progress', startDate: '2025-04-01', endDate: null },
        { id: 9, title: 'Les mouvements', status: 'planned', startDate: null, endDate: null },
        { id: 10, title: 'Les forces', status: 'planned', startDate: null, endDate: null },
        { id: 11, title: 'Les ondes', status: 'planned', startDate: null, endDate: null },
        { id: 12, title: 'L\'environnement', status: 'planned', startDate: null, endDate: null },
      ]
    },
  ];

  // Filtrer les données en fonction des filtres
  const filteredData = progressData.filter(data => {
    // Filtrer par classe
    if (filters.class && data.class !== filters.class) {
      return false;
    }
    
    // Filtrer par matière
    if (filters.subject && data.subject !== filters.subject) {
      return false;
    }
    
    return true;
  });

  // Calculer les statistiques globales
  const globalStats = {
    totalChapters: filteredData.reduce((sum, data) => sum + data.totalChapters, 0),
    completedChapters: filteredData.reduce((sum, data) => sum + data.completedChapters, 0),
    averageProgress: filteredData.length > 0 
      ? filteredData.reduce((sum, data) => sum + data.progress, 0) / filteredData.length 
      : 0
  };

  // Nous utilisons maintenant le composant ProgressBar qui gère ses propres couleurs

  // Fonction pour obtenir la classe CSS en fonction du statut
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'planned':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  // Fonction pour obtenir le libellé du statut
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Terminé';
      case 'in_progress':
        return 'En cours';
      case 'planned':
        return 'Planifié';
      default:
        return 'Inconnu';
    }
  };

  // Formater la date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  // Exporter le rapport au format PDF
  const exportToPDF = () => {
    alert('Fonctionnalité d\'export PDF à implémenter');
    // Logique d'export PDF à implémenter
  };

  // Imprimer le rapport
  const printReport = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec filtres et actions */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <div className="flex flex-wrap gap-2 items-center">
          <div className="relative">
            <select
              className="pl-3 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
              value={filters.class}
              onChange={(e) => setFilters({ ...filters, class: e.target.value })}
              aria-label="Filtrer par classe"
            >
              <option value="">Toutes les classes</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.name}>{cls.name}</option>
              ))}
            </select>
          </div>
          
          <div className="relative">
            <select
              className="pl-3 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
              value={filters.subject}
              onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
              aria-label="Filtrer par matière"
            >
              <option value="">Toutes les matières</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.name}>{subject.name}</option>
              ))}
            </select>
          </div>
          
          <div className="relative">
            <select
              className="pl-3 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
              value={filters.period}
              onChange={(e) => setFilters({ ...filters, period: e.target.value as 'year' | 'trimester1' | 'trimester2' | 'trimester3' })}
              aria-label="Filtrer par période"
            >
              <option value="year">Année complète</option>
              <option value="trimester1">1er trimestre</option>
              <option value="trimester2">2ème trimestre</option>
              <option value="trimester3">3ème trimestre</option>
            </select>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button
            className="inline-flex items-center px-3 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
            onClick={exportToPDF}
          >
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </button>
          <button
            className="inline-flex items-center px-3 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
            onClick={printReport}
          >
            <Printer className="w-4 h-4 mr-2" />
            Imprimer
          </button>
        </div>
      </div>
      
      {/* Statistiques globales */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Progression globale</h3>
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{globalStats.averageProgress.toFixed(1)}%</span>
          </div>
          <ProgressBar 
            value={globalStats.averageProgress} 
            max={100} 
            className="mb-4" 
            label="Progression moyenne du programme"
          />
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Chapitres terminés</h3>
          <div className="flex items-center justify-center">
            <div className="text-center">
              <span className="text-3xl font-bold text-green-600 dark:text-green-400">{globalStats.completedChapters}</span>
              <span className="text-lg text-gray-600 dark:text-gray-400"> / {globalStats.totalChapters}</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Répartition des statuts</h3>
          <div className="flex justify-around">
            <div className="text-center">
              <span className="inline-block w-3 h-3 rounded-full bg-green-500 dark:bg-green-600 mb-1"></span>
              <p className="text-sm text-gray-600 dark:text-gray-400">Terminé</p>
            </div>
            <div className="text-center">
              <span className="inline-block w-3 h-3 rounded-full bg-blue-500 dark:bg-blue-600 mb-1"></span>
              <p className="text-sm text-gray-600 dark:text-gray-400">En cours</p>
            </div>
            <div className="text-center">
              <span className="inline-block w-3 h-3 rounded-full bg-gray-400 dark:bg-gray-500 mb-1"></span>
              <p className="text-sm text-gray-600 dark:text-gray-400">Planifié</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Détail par classe/matière */}
      <div className="space-y-4">
        {filteredData.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 text-center">
            <p className="text-gray-600 dark:text-gray-400">Aucune donnée trouvée pour les critères sélectionnés.</p>
          </div>
        ) : (
          filteredData.map((data) => (
            <div key={`${data.class}-${data.subject}`} className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{data.subject} - {data.class}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Enseignant: {data.teacher} • Dernière mise à jour: {formatDate(data.lastUpdate)}</p>
                </div>
                
                <div className="flex items-center">
                  <div className="mr-4">
                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{data.progress.toFixed(1)}%</span>
                  </div>
                  <ProgressBar 
                    value={data.progress} 
                    max={100} 
                    className="w-32" 
                    label={`Progression ${data.subject}`}
                  />
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-900/50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Chapitre</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Statut</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date début</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date fin</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {data.chapters.map((chapter) => (
                      <tr key={chapter.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{chapter.title}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(chapter.status)}`}>
                            {getStatusLabel(chapter.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{formatDate(chapter.startDate)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{formatDate(chapter.endDate)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RapportAvancement;
