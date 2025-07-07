import React, { useState } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Clock, Search } from 'lucide-react';

const ValidationAdmin: React.FC = () => {
  // État pour les filtres
  const [filters, setFilters] = useState({
    class: '',
    subject: '',
    status: 'all', // 'all', 'pending', 'validated', 'rejected'
    teacher: ''
  });

  // État pour la recherche
  const [searchQuery, setSearchQuery] = useState('');

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

  // Données factices pour les entrées à valider
  const [validationEntries, setValidationEntries] = useState([
    {
      id: 1,
      date: '2025-07-02',
      class: '5ème B',
      subject: 'Français',
      title: 'Analyse de texte - Les Misérables',
      content: 'Étude du personnage de Jean Valjean et analyse de son évolution',
      teacher: 'M. Martin',
      status: 'pending',
      submittedAt: '2025-07-02T14:30:00',
      comments: []
    },
    {
      id: 2,
      date: '2025-07-03',
      class: '4ème C',
      subject: 'Histoire-Géographie',
      title: 'La Révolution française',
      content: 'Les causes et les principales étapes de la Révolution française',
      teacher: 'Mme Laurent',
      status: 'pending',
      submittedAt: '2025-07-03T16:15:00',
      comments: []
    },
    {
      id: 3,
      date: '2025-07-01',
      class: '6ème A',
      subject: 'Mathématiques',
      title: 'Fractions et nombres décimaux',
      content: 'Introduction aux fractions et conversion en nombres décimaux',
      teacher: 'Mme Dubois',
      status: 'validated',
      submittedAt: '2025-07-01T10:45:00',
      validatedAt: '2025-07-01T15:20:00',
      validatedBy: 'M. Dupont (Directeur)',
      comments: [
        { author: 'M. Dupont', text: 'Contenu conforme au programme', date: '2025-07-01T15:20:00' }
      ]
    },
    {
      id: 4,
      date: '2025-06-30',
      class: '3ème D',
      subject: 'Sciences',
      title: 'Électricité - Circuits en série et en parallèle',
      content: 'Étude des circuits électriques et des lois qui les régissent',
      teacher: 'M. Bernard',
      status: 'rejected',
      submittedAt: '2025-06-30T09:15:00',
      rejectedAt: '2025-06-30T14:10:00',
      rejectedBy: 'Mme Moreau (Coordinatrice)',
      comments: [
        { author: 'Mme Moreau', text: 'Contenu trop avancé pour le niveau. Veuillez simplifier et ajouter plus d\'exemples pratiques.', date: '2025-06-30T14:10:00' }
      ]
    },
  ]);

  // État pour les commentaires
  const [commentText, setCommentText] = useState('');
  const [selectedEntryId, setSelectedEntryId] = useState<number | null>(null);

  // Filtrer les entrées en fonction des filtres et de la recherche
  const filteredEntries = validationEntries.filter(entry => {
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
    
    // Filtrer par statut
    if (filters.status !== 'all' && entry.status !== filters.status) {
      return false;
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

  // Fonction pour valider une entrée
  const handleValidate = (id: number) => {
    setValidationEntries(validationEntries.map(entry => {
      if (entry.id === id) {
        return {
          ...entry,
          status: 'validated',
          validatedAt: new Date().toISOString(),
          validatedBy: 'M. Dupont (Directeur)', // À remplacer par l'utilisateur actuel
          comments: [
            ...entry.comments,
            { 
              author: 'M. Dupont', // À remplacer par l'utilisateur actuel
              text: commentText || 'Contenu validé',
              date: new Date().toISOString() 
            }
          ]
        };
      }
      return entry;
    }));
    setCommentText('');
    setSelectedEntryId(null);
  };

  // Fonction pour rejeter une entrée
  const handleReject = (id: number) => {
    if (!commentText) {
      alert('Veuillez fournir un commentaire expliquant la raison du rejet.');
      return;
    }
    
    setValidationEntries(validationEntries.map(entry => {
      if (entry.id === id) {
        return {
          ...entry,
          status: 'rejected',
          rejectedAt: new Date().toISOString(),
          rejectedBy: 'M. Dupont (Directeur)', // À remplacer par l'utilisateur actuel
          comments: [
            ...entry.comments,
            { 
              author: 'M. Dupont', // À remplacer par l'utilisateur actuel
              text: commentText,
              date: new Date().toISOString() 
            }
          ]
        };
      }
      return entry;
    }));
    setCommentText('');
    setSelectedEntryId(null);
  };

  // Fonction pour obtenir la couleur du statut
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'validated':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
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
      case 'rejected':
        return 'Rejeté';
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
        return <Clock className="w-4 h-4 mr-1" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 mr-1" />;
      default:
        return <AlertTriangle className="w-4 h-4 mr-1" />;
    }
  };

  // Formater la date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec filtres et recherche */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Sélecteurs de filtres */}
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
                value={filters.teacher}
                onChange={(e) => setFilters({ ...filters, teacher: e.target.value })}
                aria-label="Filtrer par enseignant"
              >
                <option value="">Tous les enseignants</option>
                {teachers.map((teacher) => (
                  <option key={teacher.id} value={teacher.name}>{teacher.name}</option>
                ))}
              </select>
            </div>
            
            <div className="relative">
              <select
                className="pl-3 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value as 'all' | 'pending' | 'validated' | 'rejected' })}
                aria-label="Filtrer par statut"
              >
                <option value="all">Tous les statuts</option>
                <option value="pending">En attente</option>
                <option value="validated">Validés</option>
                <option value="rejected">Rejetés</option>
              </select>
            </div>
          </div>
          
          {/* Barre de recherche */}
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </div>
            <input
              type="text"
              className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>
      
      {/* Liste des entrées à valider */}
      <div className="space-y-4">
        {filteredEntries.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 text-center">
            <p className="text-gray-600 dark:text-gray-400">Aucune entrée trouvée pour les critères sélectionnés.</p>
          </div>
        ) : (
          filteredEntries.map(entry => (
            <div key={entry.id} className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex flex-col space-y-4">
                {/* En-tête avec informations principales */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(entry.status)}`}>
                        {getStatusIcon(entry.status)}
                        {getStatusLabel(entry.status)}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Soumis le {formatDate(entry.submittedAt)}
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
                  </div>
                  
                  {/* Informations de validation/rejet */}
                  {entry.status === 'validated' && (
                    <div className="text-right text-sm text-gray-600 dark:text-gray-400">
                      <p>Validé par {entry.validatedBy}</p>
                      <p>le {formatDate(entry.validatedAt!)}</p>
                    </div>
                  )}
                  
                  {entry.status === 'rejected' && (
                    <div className="text-right text-sm text-gray-600 dark:text-gray-400">
                      <p>Rejeté par {entry.rejectedBy}</p>
                      <p>le {formatDate(entry.rejectedAt!)}</p>
                    </div>
                  )}
                </div>
                
                {/* Contenu */}
                <div className="bg-gray-50 dark:bg-gray-900/30 p-4 rounded-lg">
                  <p className="text-gray-700 dark:text-gray-300">{entry.content}</p>
                </div>
                
                {/* Commentaires */}
                {entry.comments.length > 0 && (
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Commentaires</h4>
                    <div className="space-y-2">
                      {entry.comments.map((comment, index) => (
                        <div key={index} className="bg-gray-50 dark:bg-gray-900/30 p-3 rounded-lg">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-medium text-sm text-gray-900 dark:text-gray-100">{comment.author}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">{formatDate(comment.date)}</span>
                          </div>
                          <p className="text-sm text-gray-700 dark:text-gray-300">{comment.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Actions pour les entrées en attente */}
                {entry.status === 'pending' && (
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    {selectedEntryId === entry.id ? (
                      <div className="space-y-3">
                        <textarea
                          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                          rows={3}
                          placeholder="Ajouter un commentaire..."
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                        ></textarea>
                        
                        <div className="flex justify-end space-x-2">
                          <button
                            className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
                            onClick={() => {
                              setSelectedEntryId(null);
                              setCommentText('');
                            }}
                          >
                            Annuler
                          </button>
                          <button
                            className="px-4 py-2 bg-red-600 dark:bg-red-700 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-800"
                            onClick={() => handleReject(entry.id)}
                          >
                            Rejeter
                          </button>
                          <button
                            className="px-4 py-2 bg-green-600 dark:bg-green-700 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-800"
                            onClick={() => handleValidate(entry.id)}
                          >
                            Valider
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-end space-x-2">
                        <button
                          className="inline-flex items-center px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800"
                          onClick={() => setSelectedEntryId(entry.id)}
                        >
                          Examiner
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ValidationAdmin;
