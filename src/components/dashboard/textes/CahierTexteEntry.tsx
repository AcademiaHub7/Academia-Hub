import React, { useState, useEffect } from 'react';
import { Calendar, Edit2, Trash2, Eye, CheckCircle, XCircle } from 'lucide-react';

interface CahierTexteEntryProps {
  onEditEntry: (entry: any) => void;
  filters: {
    class: string;
    subject: string;
    period: string;
  };
  searchQuery: string;
}

const CahierTexteEntry: React.FC<CahierTexteEntryProps> = ({ onEditEntry, filters, searchQuery }) => {
  // Données factices pour les entrées du cahier de textes
  const [entries, setEntries] = useState([
    {
      id: 1,
      date: '2025-07-01',
      class: '6ème A',
      subject: 'Mathématiques',
      title: 'Fractions et nombres décimaux',
      content: 'Introduction aux fractions et conversion en nombres décimaux',
      homework: 'Exercices 1 à 5 page 45',
      homeworkDueDate: '2025-07-03',
      resources: ['Manuel p.42-44', 'Fiche d\'exercices distribuée'],
      status: 'validated',
      teacher: 'Mme Dubois'
    },
    {
      id: 2,
      date: '2025-07-02',
      class: '5ème B',
      subject: 'Français',
      title: 'Analyse de texte - Les Misérables',
      content: 'Étude du personnage de Jean Valjean et analyse de son évolution',
      homework: 'Rédaction d\'un paragraphe sur le thème de la rédemption',
      homeworkDueDate: '2025-07-05',
      resources: ['Extrait du roman', 'Fiche d\'analyse'],
      status: 'pending',
      teacher: 'M. Martin'
    },
    {
      id: 3,
      date: '2025-07-03',
      class: '4ème C',
      subject: 'Histoire-Géographie',
      title: 'La Révolution française',
      content: 'Les causes et les principales étapes de la Révolution française',
      homework: 'Créer une frise chronologique des événements majeurs',
      homeworkDueDate: '2025-07-10',
      resources: ['Manuel p.78-85', 'Documents historiques'],
      status: 'draft',
      teacher: 'Mme Laurent'
    },
    {
      id: 4,
      date: '2025-07-04',
      class: '3ème D',
      subject: 'Sciences',
      title: 'Le système solaire',
      content: 'Étude des planètes et de leurs caractéristiques',
      homework: 'Recherche sur une planète au choix',
      homeworkDueDate: '2025-07-11',
      resources: ['Manuel p.120-125', 'Vidéo documentaire'],
      status: 'validated',
      teacher: 'M. Bernard'
    },
  ]);

  // Filtrer les entrées en fonction des filtres et de la recherche
  const filteredEntries = entries.filter(entry => {
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
        entry.homework.toLowerCase().includes(query) ||
        entry.subject.toLowerCase().includes(query) ||
        entry.class.toLowerCase().includes(query) ||
        entry.teacher.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  // Fonction pour supprimer une entrée
  const handleDeleteEntry = (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette entrée ?')) {
      setEntries(entries.filter(entry => entry.id !== id));
    }
  };

  // Fonction pour obtenir la couleur du statut
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'validated':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'draft':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  // Fonction pour obtenir le libellé du statut
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'validated':
        return 'Validé';
      case 'pending':
        return 'En attente';
      case 'draft':
        return 'Brouillon';
      default:
        return 'Inconnu';
    }
  };

  // Fonction pour obtenir l'icône du statut
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'validated':
        return <CheckCircle className="w-4 h-4 mr-1" />;
      case 'pending':
        return <Eye className="w-4 h-4 mr-1" />;
      case 'draft':
        return <Edit2 className="w-4 h-4 mr-1" />;
      default:
        return null;
    }
  };

  // Formater la date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  return (
    <div className="space-y-4">
      {filteredEntries.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 text-center">
          <p className="text-gray-600 dark:text-gray-400">Aucune entrée trouvée pour les critères sélectionnés.</p>
        </div>
      ) : (
        filteredEntries.map(entry => (
          <div key={entry.id} className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
              {/* Informations principales */}
              <div className="flex-grow">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">{formatDate(entry.date)}</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ml-2 ${getStatusColor(entry.status)}">
                    {getStatusIcon(entry.status)}
                    {getStatusLabel(entry.status)}
                  </span>
                </div>
                
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">{entry.title}</h3>
                
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                    {entry.class}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                    {entry.subject}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                    {entry.teacher}
                  </span>
                </div>
                
                <p className="text-gray-700 dark:text-gray-300 mb-3">{entry.content}</p>
                
                {entry.homework && (
                  <div className="mb-3">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">Travail à faire pour le {formatDate(entry.homeworkDueDate)}</h4>
                    <p className="text-gray-700 dark:text-gray-300">{entry.homework}</p>
                  </div>
                )}
                
                {entry.resources && entry.resources.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">Ressources</h4>
                    <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
                      {entry.resources.map((resource, index) => (
                        <li key={index}>{resource}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              
              {/* Actions */}
              <div className="flex md:flex-col gap-2">
                <button 
                  className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50"
                  onClick={() => onEditEntry(entry)}
                  title="Modifier"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button 
                  className="p-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50"
                  onClick={() => handleDeleteEntry(entry.id)}
                  title="Supprimer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default CahierTexteEntry;
