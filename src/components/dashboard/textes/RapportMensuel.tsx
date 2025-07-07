import React, { useState, useRef } from 'react';
import { Download, Printer, FileText, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const RapportMensuel: React.FC = () => {
  // Référence pour le contenu à exporter
  const contentRef = useRef<HTMLDivElement>(null);

  // État pour les filtres
  const [filters, setFilters] = useState({
    class: '',
    subject: '',
    teacher: '',
    month: new Date().getMonth(),
    year: new Date().getFullYear()
  });

  // État pour les statistiques
  const [showStats, setShowStats] = useState(false);

  // Données factices pour les classes, matières et enseignants
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

  const teachers = [
    { id: 1, name: 'Mme Dubois' },
    { id: 2, name: 'M. Martin' },
    { id: 3, name: 'Mme Laurent' },
    { id: 4, name: 'M. Bernard' },
  ];

  // Données factices pour les entrées du cahier de textes
  const entries = [
    {
      id: 1,
      date: '2025-07-02',
      class: '5ème B',
      subject: 'Français',
      title: 'Analyse de texte - Les Misérables',
      content: 'Étude du personnage de Jean Valjean et analyse de son évolution',
      homework: 'Rédiger un portrait de Jean Valjean (500 mots)',
      homeworkDueDate: '2025-07-05',
      teacher: 'M. Martin',
      status: 'validated',
      duration: 120,
      resources: ['Manuel p.45-48', 'Extrait Les Misérables']
    },
    {
      id: 2,
      date: '2025-07-03',
      class: '4ème C',
      subject: 'Histoire-Géographie',
      title: 'La Révolution française',
      content: 'Les causes et les principales étapes de la Révolution française',
      homework: 'Créer une frise chronologique des événements majeurs',
      homeworkDueDate: '2025-07-06',
      teacher: 'Mme Laurent',
      status: 'validated',
      duration: 90,
      resources: ['Manuel p.78-85', 'Carte de France 1789']
    },
    {
      id: 3,
      date: '2025-07-05',
      class: '6ème A',
      subject: 'Mathématiques',
      title: 'Fractions et nombres décimaux',
      content: 'Introduction aux fractions et conversion en nombres décimaux',
      homework: 'Exercices 1 à 10 page 65',
      homeworkDueDate: '2025-07-08',
      teacher: 'Mme Dubois',
      status: 'validated',
      duration: 60,
      resources: ['Manuel p.62-65']
    },
    {
      id: 4,
      date: '2025-07-08',
      class: '3ème D',
      subject: 'Sciences',
      title: 'Électricité - Circuits en série et en parallèle',
      content: 'Étude des circuits électriques et des lois qui les régissent',
      homework: 'Compléter la fiche de TP et répondre aux questions',
      homeworkDueDate: '2025-07-12',
      teacher: 'M. Bernard',
      status: 'validated',
      duration: 120,
      resources: ['Manuel p.112-118', 'Fiche TP']
    },
    {
      id: 5,
      date: '2025-07-10',
      class: '5ème B',
      subject: 'Français',
      title: 'Poésie - Les figures de style',
      content: 'Identification et analyse des principales figures de style',
      homework: 'Analyser le poème distribué en classe',
      homeworkDueDate: '2025-07-15',
      teacher: 'M. Martin',
      status: 'validated',
      duration: 90,
      resources: ['Polycopié figures de style', 'Anthologie poétique']
    },
  ];

  // Noms des mois
  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  // Fonction pour changer de mois
  const changeMonth = (increment: number) => {
    let newMonth = filters.month + increment;
    let newYear = filters.year;
    
    if (newMonth > 11) {
      newMonth = 0;
      newYear += 1;
    } else if (newMonth < 0) {
      newMonth = 11;
      newYear -= 1;
    }
    
    setFilters({
      ...filters,
      month: newMonth,
      year: newYear
    });
  };

  // Filtrer les entrées en fonction des filtres
  const filteredEntries = entries.filter(entry => {
    const entryDate = new Date(entry.date);
    const entryMonth = entryDate.getMonth();
    const entryYear = entryDate.getFullYear();
    
    // Filtrer par mois et année
    if (entryMonth !== filters.month || entryYear !== filters.year) {
      return false;
    }
    
    // Filtrer par classe
    if (filters.class && entry.class !== filters.class) {
      return false;
    }
    
    // Filtrer par matière
    if (filters.subject && entry.subject !== filters.subject) {
      return false;
    }
    
    // Filtrer par enseignant
    if (filters.teacher && entry.teacher !== filters.teacher) {
      return false;
    }
    
    return true;
  });

  // Calculer les statistiques
  const calculateStats = () => {
    const stats = {
      totalEntries: filteredEntries.length,
      totalDuration: filteredEntries.reduce((sum, entry) => sum + entry.duration, 0),
      entriesBySubject: {} as Record<string, number>,
      entriesByClass: {} as Record<string, number>,
      entriesByTeacher: {} as Record<string, number>,
      averageDuration: 0
    };
    
    // Calculer la moyenne de durée
    stats.averageDuration = stats.totalEntries > 0 ? stats.totalDuration / stats.totalEntries : 0;
    
    // Compter les entrées par matière, classe et enseignant
    filteredEntries.forEach(entry => {
      // Par matière
      if (!stats.entriesBySubject[entry.subject]) {
        stats.entriesBySubject[entry.subject] = 0;
      }
      stats.entriesBySubject[entry.subject]++;
      
      // Par classe
      if (!stats.entriesByClass[entry.class]) {
        stats.entriesByClass[entry.class] = 0;
      }
      stats.entriesByClass[entry.class]++;
      
      // Par enseignant
      if (!stats.entriesByTeacher[entry.teacher]) {
        stats.entriesByTeacher[entry.teacher] = 0;
      }
      stats.entriesByTeacher[entry.teacher]++;
    });
    
    return stats;
  };

  // Statistiques calculées
  const stats = calculateStats();

  // Formater la date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  // Exporter le rapport au format PDF
  const exportToPDF = async () => {
    if (!contentRef.current) return;
    
    try {
      alert('Préparation du PDF en cours...');
      const canvas = await html2canvas(contentRef.current, { 
        scale: 2, 
        useCORS: true, 
        logging: false 
      });
      
      const pdf = new jsPDF({ 
        orientation: 'portrait', 
        unit: 'mm', 
        format: 'a4' 
      });
      
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const imgData = canvas.toDataURL('image/png');
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      
      const fileName = `rapport_mensuel_${monthNames[filters.month].toLowerCase()}_${filters.year}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
      alert('Erreur lors de la génération du PDF. Veuillez réessayer.');
    }
  };

  // Imprimer le rapport
  const printReport = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Rapport Mensuel</h2>
        
        <div className="flex items-center space-x-2 mt-4 md:mt-0">
          <button
            onClick={exportToPDF}
            className="inline-flex items-center px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800"
          >
            <Download className="h-4 w-4 mr-2" />
            Exporter en PDF
          </button>
          <button
            onClick={printReport}
            className="inline-flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            <Printer className="h-4 w-4 mr-2" />
            Imprimer
          </button>
        </div>
      </div>
      
      {/* Filtres */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label htmlFor="class-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Classe
            </label>
            <select
              id="class-filter"
              className="block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              value={filters.class}
              onChange={(e) => setFilters({ ...filters, class: e.target.value })}
            >
              <option value="">Toutes les classes</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.name}>{cls.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="subject-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Matière
            </label>
            <select
              id="subject-filter"
              className="block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              value={filters.subject}
              onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
            >
              <option value="">Toutes les matières</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.name}>{subject.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="teacher-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Enseignant
            </label>
            <select
              id="teacher-filter"
              className="block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              value={filters.teacher}
              onChange={(e) => setFilters({ ...filters, teacher: e.target.value })}
            >
              <option value="">Tous les enseignants</option>
              {teachers.map((teacher) => (
                <option key={teacher.id} value={teacher.name}>{teacher.name}</option>
              ))}
            </select>
          </div>
          
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Mois
            </label>
            <div className="flex items-center">
              <button
                onClick={() => changeMonth(-1)}
                className="p-2 rounded-l-md bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                title="Mois précédent"
                aria-label="Mois précédent"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div className="flex-1 text-center py-2 bg-white dark:bg-gray-700 border-t border-b border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100">
                {monthNames[filters.month]} {filters.year}
              </div>
              <button
                onClick={() => changeMonth(1)}
                className="p-2 rounded-r-md bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                title="Mois suivant"
                aria-label="Mois suivant"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Statistiques
            </label>
            <button
              onClick={() => setShowStats(!showStats)}
              className={`w-full p-2 rounded-md border ${
                showStats 
                  ? 'bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700 text-blue-800 dark:text-blue-300' 
                  : 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
              } hover:bg-gray-200 dark:hover:bg-gray-600`}
            >
              {showStats ? 'Masquer les statistiques' : 'Afficher les statistiques'}
            </button>
          </div>
        </div>
      </div>
      
      {/* Contenu du rapport */}
      <div ref={contentRef} className="space-y-6 print:p-6">
        {/* En-tête du rapport */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 print:border-none">
          <div className="flex flex-col items-center text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Rapport Mensuel du Cahier de Textes
            </h1>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mt-2">
              {monthNames[filters.month]} {filters.year}
            </h2>
            <div className="mt-4 text-gray-600 dark:text-gray-400">
              {filters.class && <span className="mr-3">Classe: {filters.class}</span>}
              {filters.subject && <span className="mr-3">Matière: {filters.subject}</span>}
              {filters.teacher && <span>Enseignant: {filters.teacher}</span>}
            </div>
          </div>
          
          {/* Statistiques */}
          {showStats && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Statistiques</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="text-sm text-blue-600 dark:text-blue-400">Total des séances</div>
                  <div className="text-2xl font-bold text-blue-800 dark:text-blue-300">{stats.totalEntries}</div>
                </div>
                
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="text-sm text-green-600 dark:text-green-400">Heures d'enseignement</div>
                  <div className="text-2xl font-bold text-green-800 dark:text-green-300">{(stats.totalDuration / 60).toFixed(1)}h</div>
                </div>
                
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                  <div className="text-sm text-purple-600 dark:text-purple-400">Durée moyenne</div>
                  <div className="text-2xl font-bold text-purple-800 dark:text-purple-300">{(stats.averageDuration / 60).toFixed(1)}h</div>
                </div>
                
                <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
                  <div className="text-sm text-amber-600 dark:text-amber-400">Taux de validation</div>
                  <div className="text-2xl font-bold text-amber-800 dark:text-amber-300">100%</div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Statistiques par matière */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Répartition par matière</h4>
                  <div className="space-y-2">
                    {Object.entries(stats.entriesBySubject).map(([subject, count]) => (
                      <div key={subject} className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">{subject}</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{count} séances</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Statistiques par classe */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Répartition par classe</h4>
                  <div className="space-y-2">
                    {Object.entries(stats.entriesByClass).map(([className, count]) => (
                      <div key={className} className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">{className}</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{count} séances</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Statistiques par enseignant */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Répartition par enseignant</h4>
                  <div className="space-y-2">
                    {Object.entries(stats.entriesByTeacher).map(([teacher, count]) => (
                      <div key={teacher} className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">{teacher}</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{count} séances</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Liste des entrées */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 print:border-none">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
            Détail des séances ({filteredEntries.length})
          </h3>
          
          {filteredEntries.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500" />
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Aucune entrée pour {monthNames[filters.month]} {filters.year} avec les filtres sélectionnés.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredEntries
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .map((entry) => (
                  <div 
                    key={entry.id} 
                    className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-b-0 last:pb-0"
                  >
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2 mb-3">
                      <div>
                        <h4 className="text-base font-medium text-gray-900 dark:text-gray-100">{entry.title}</h4>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          <span className="mr-3">{formatDate(entry.date)}</span>
                          <span className="mr-3">{entry.class}</span>
                          <span className="mr-3">{entry.subject}</span>
                          <span>{entry.teacher}</span>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Durée: {entry.duration} min
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <h5 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">Contenu</h5>
                      <p className="text-gray-700 dark:text-gray-300">{entry.content}</p>
                    </div>
                    
                    {entry.homework && (
                      <div className="mt-3">
                        <h5 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">
                          Devoirs (pour le {formatDate(entry.homeworkDueDate)})
                        </h5>
                        <p className="text-gray-700 dark:text-gray-300">{entry.homework}</p>
                      </div>
                    )}
                    
                    {entry.resources.length > 0 && (
                      <div className="mt-3">
                        <h5 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">Ressources</h5>
                        <div className="flex flex-wrap gap-2">
                          {entry.resources.map((resource, index) => (
                            <div 
                              key={index} 
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                            >
                              <FileText className="h-3 w-3 mr-1" />
                              {resource}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          )}
        </div>
        
        {/* Pied de page du rapport */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 print:border-none">
          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            <p>Rapport généré le {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            <p className="mt-1">Academia Hub - Système de gestion scolaire</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RapportMensuel;
