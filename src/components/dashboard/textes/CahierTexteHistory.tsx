import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Download, Printer } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface CahierTexteHistoryProps {
  filters: {
    class: string;
    subject: string;
    period: string;
  };
  searchQuery: string;
}

const CahierTexteHistory: React.FC<CahierTexteHistoryProps> = ({ filters, searchQuery }) => {
  // État pour la vue (liste ou calendrier)
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  
  // État pour le mois actuel (pour la vue calendrier)
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  // Données factices pour l'historique des cours
  const [historyData] = useState([
    {
      id: 1,
      date: '2025-06-15',
      class: '6ème A',
      subject: 'Mathématiques',
      title: 'Géométrie - Les angles',
      content: 'Introduction aux différents types d\'angles et leur mesure',
      teacher: 'Mme Dubois',
      status: 'completed'
    },
    {
      id: 2,
      date: '2025-06-18',
      class: '6ème A',
      subject: 'Mathématiques',
      title: 'Géométrie - Les triangles',
      content: 'Classification des triangles et propriétés',
      teacher: 'Mme Dubois',
      status: 'completed'
    },
    {
      id: 3,
      date: '2025-06-22',
      class: '5ème B',
      subject: 'Français',
      title: 'Grammaire - Le passé simple',
      content: 'Conjugaison et utilisation du passé simple',
      teacher: 'M. Martin',
      status: 'completed'
    },
    {
      id: 4,
      date: '2025-06-25',
      class: '5ème B',
      subject: 'Français',
      title: 'Littérature - Étude de texte',
      content: 'Analyse d\'un extrait des Fables de La Fontaine',
      teacher: 'M. Martin',
      status: 'completed'
    },
    {
      id: 5,
      date: '2025-06-28',
      class: '4ème C',
      subject: 'Histoire-Géographie',
      title: 'Histoire - Le siècle des Lumières',
      content: 'Les philosophes des Lumières et leurs idées',
      teacher: 'Mme Laurent',
      status: 'completed'
    },
    {
      id: 6,
      date: '2025-07-01',
      class: '3ème D',
      subject: 'Sciences',
      title: 'Physique - Les forces',
      content: 'Étude des forces et de leurs effets',
      teacher: 'M. Bernard',
      status: 'completed'
    },
  ]);

  // Filtrer les entrées en fonction des filtres et de la recherche
  const filteredHistory = historyData.filter(entry => {
    // Filtrer par classe
    if (filters.class && entry.class !== filters.class) {
      return false;
    }
    
    // Filtrer par matière
    if (filters.subject && entry.subject !== filters.subject) {
      return false;
    }
    
    // Filtrer par période
    if (filters.period !== 'all') {
      const entryDate = new Date(entry.date);
      const today = new Date();
      
      if (filters.period === 'today') {
        return entryDate.toDateString() === today.toDateString();
      }
      
      if (filters.period === 'week') {
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay() + 1); // Lundi de la semaine en cours
        return entryDate >= weekStart;
      }
      
      if (filters.period === 'month') {
        return entryDate.getMonth() === today.getMonth() && 
               entryDate.getFullYear() === today.getFullYear();
      }
    }
    
    // Filtrer par recherche
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        entry.title.toLowerCase().includes(query) ||
        entry.content.toLowerCase().includes(query) ||
        entry.subject.toLowerCase().includes(query) ||
        entry.class.toLowerCase().includes(query) ||
        entry.teacher.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  // Fonction pour naviguer au mois précédent
  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  // Fonction pour naviguer au mois suivant
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  // Fonction pour générer le calendrier du mois
  const generateCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    // Premier jour du mois
    const firstDay = new Date(year, month, 1);
    // Dernier jour du mois
    const lastDay = new Date(year, month + 1, 0);
    
    // Jour de la semaine du premier jour (0 = dimanche, 1 = lundi, ...)
    let dayOfWeek = firstDay.getDay();
    // Ajuster pour que la semaine commence le lundi (0 = lundi, 6 = dimanche)
    dayOfWeek = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    
    const calendar = [];
    
    // Ajouter les jours du mois précédent
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = dayOfWeek - 1; i >= 0; i--) {
      calendar.push({
        day: prevMonthLastDay - i,
        month: month - 1,
        year: month === 0 ? year - 1 : year,
        isCurrentMonth: false
      });
    }
    
    // Ajouter les jours du mois en cours
    for (let i = 1; i <= lastDay.getDate(); i++) {
      calendar.push({
        day: i,
        month: month,
        year: year,
        isCurrentMonth: true
      });
    }
    
    // Ajouter les jours du mois suivant
    const remainingDays = 42 - calendar.length; // 6 semaines * 7 jours = 42
    for (let i = 1; i <= remainingDays; i++) {
      calendar.push({
        day: i,
        month: month + 1,
        year: month === 11 ? year + 1 : year,
        isCurrentMonth: false
      });
    }
    
    return calendar;
  };

  // Formater la date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };
  
  // Référence pour le contenu à exporter
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Fonction pour exporter le contenu en PDF
  const exportToPDF = async () => {
    if (!contentRef.current) return;
    
    try {
      // Afficher un message de chargement
      alert('Préparation du PDF en cours...');
      
      // Capturer le contenu avec html2canvas
      const canvas = await html2canvas(contentRef.current, {
        scale: 2, // Meilleure qualité
        useCORS: true,
        logging: false
      });
      
      // Créer un nouveau document PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // Dimensions du PDF
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Ajouter l'image au PDF
      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      
      // Générer un nom de fichier avec la date actuelle
      const fileName = `cahier_de_textes_${new Date().toISOString().slice(0, 10)}.pdf`;
      
      // Télécharger le PDF
      pdf.save(fileName);
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
      alert('Une erreur est survenue lors de la génération du PDF.');
    }
  };
  
  // Fonction pour imprimer le contenu
  const printContent = () => {
    window.print();
  };
  
  // Obtenir les entrées pour une date spécifique
  const getEntriesForDate = (day: number, month: number, year: number) => {
    const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return filteredHistory.filter(entry => entry.date === dateString);
  };

  return (
    <div className="space-y-4">
      {/* En-tête avec options de vue et filtres */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <button
            className={`px-3 py-1 rounded-lg text-sm ${viewMode === 'list' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}
            onClick={() => setViewMode('list')}
          >
            Liste
          </button>
          <button
            className={`px-3 py-1 rounded-lg text-sm ${viewMode === 'calendar' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}
            onClick={() => setViewMode('calendar')}
          >
            Calendrier
          </button>
        </div>
        
        {/* Outils d'export et d'impression */}
        <div className="flex space-x-2">
          <button
            className="inline-flex items-center px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-sm"
            onClick={printContent}
          >
            <Printer className="w-4 h-4 mr-1" />
            Imprimer
          </button>
          <button
            className="inline-flex items-center px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-sm"
            onClick={exportToPDF}
          >
            <Download className="w-4 h-4 mr-1" />
            Exporter PDF
          </button>
        </div>
      </div>
      
      {/* Vue Liste */}
      {viewMode === 'list' && (
        <div className="space-y-4" ref={contentRef}>
          {filteredHistory.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 text-center">
              <p className="text-gray-600 dark:text-gray-400">Aucun historique trouvé pour les critères sélectionnés.</p>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900/50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Classe</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Matière</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Titre</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Enseignant</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredHistory.map((entry) => (
                    <tr key={entry.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{formatDate(entry.date)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{entry.class}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{entry.subject}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">{entry.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{entry.teacher}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
      
      {/* Vue Calendrier */}
      {viewMode === 'calendar' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* En-tête du calendrier */}
          <div className="p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
            <button
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={previousMonth}
              aria-label="Mois précédent"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              {currentMonth.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
            </h3>
            
            <button
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={nextMonth}
              aria-label="Mois suivant"
            >
              <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
          
          {/* Grille du calendrier */}
          <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700">
            {/* Jours de la semaine */}
            {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day) => (
              <div key={day} className="bg-gray-50 dark:bg-gray-900/50 p-2 text-center text-sm font-medium text-gray-700 dark:text-gray-300">
                {day}
              </div>
            ))}
            
            {/* Jours du mois */}
            {generateCalendar().map((date, index) => {
              const entries = getEntriesForDate(date.day, date.month, date.year);
              return (
                <div 
                  key={index} 
                  className={`min-h-[100px] p-2 ${date.isCurrentMonth ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-900/30 text-gray-400 dark:text-gray-600'}`}
                >
                  <div className="font-medium text-sm mb-1">{date.day}</div>
                  <div className="space-y-1">
                    {entries.map(entry => (
                      <div 
                        key={entry.id} 
                        className="text-xs p-1 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 truncate"
                        title={`${entry.subject} - ${entry.title}`}
                      >
                        {entry.subject}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CahierTexteHistory;
