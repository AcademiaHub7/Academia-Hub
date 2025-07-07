import React, { useState } from 'react';
import { Plus, Search, X, Calendar } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import CahierTexteEntry from './CahierTexteEntry';
import CahierTexteHistory from './CahierTexteHistory';
import ValidationAdmin from './ValidationAdmin';
import RapportAvancement from './RapportAvancement';
import ExportRapports from './ExportRapports';

interface CahierTexteBoardProps {
  onlineStatus: boolean;
  // Cette prop est conservée pour compatibilité avec le composant parent,
  // mais n'est plus utilisée pour éviter les problèmes de double modal
  onAddEntry?: () => void;
}

const CahierTexteBoard: React.FC<CahierTexteBoardProps> = ({ onlineStatus }) => {
  // État pour gérer l'onglet actif dans le tableau de bord
  const [activeView, setActiveView] = useState<'entry' | 'history' | 'validation' | 'rapport'>('entry');
  
  // État pour les filtres
  const [filters, setFilters] = useState({
    class: '',
    subject: '',
    period: 'all' // 'all', 'today', 'week', 'month'
  });

  // État pour la recherche
  const [searchQuery, setSearchQuery] = useState('');
  
  // État pour le modal d'ajout/édition d'entrée
  // Ces états sont utilisés par les sous-composants via les props
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<Record<string, unknown> | null>(null);
  
  // État pour le formulaire d'édition d'entrée
  const [entryForm, setEntryForm] = useState({
    id: 0,
    date: new Date().toISOString().split('T')[0],
    class: '',
    subject: '',
    title: '',
    content: '',
    homework: '',
    homeworkDueDate: '',
    resources: [''],
    status: 'draft',
    teacher: ''
  });

  // Données factices pour les classes et matières (à remplacer par des données réelles)
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

  // Fonction pour ouvrir le modal d'ajout d'entrée
  const handleAddEntry = () => {
    // Réinitialiser le formulaire pour une nouvelle entrée
    setEntryForm({
      id: Date.now(), // ID temporaire basé sur le timestamp
      date: new Date().toISOString().split('T')[0],
      class: filters.class || '',
      subject: filters.subject || '',
      title: '',
      content: '',
      homework: '',
      homeworkDueDate: '',
      resources: [''],
      status: 'draft',
      teacher: ''
    });
    
    setSelectedEntry(null);
    setIsEntryModalOpen(true);
    
    // Note: Nous n'appelons plus onAddEntry ici pour éviter le double modal
  };

  // Fonction pour ouvrir le modal d'édition d'entrée
  const handleEditEntry = (entry: Record<string, unknown>) => {
    console.log('Édition de l\'entrée:', entry);
    setSelectedEntry(entry);
    
    // Pré-remplir le formulaire avec les données de l'entrée
    setEntryForm({
      id: entry.id as number,
      date: entry.date as string,
      class: entry.class as string,
      subject: entry.subject as string,
      title: entry.title as string,
      content: entry.content as string,
      homework: entry.homework as string || '',
      homeworkDueDate: entry.homeworkDueDate as string || '',
      resources: (entry.resources as string[]) || [''],
      status: entry.status as string,
      teacher: entry.teacher as string
    });
    
    setIsEntryModalOpen(true);
    
    // Note: Nous n'appelons plus onAddEntry ici pour éviter le double modal
  };

  // Fonction pour fermer le modal
  const handleCloseModal = () => {
    setIsEntryModalOpen(false);
    setSelectedEntry(null);
  };
  
  // Fonction pour gérer les changements dans le formulaire
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEntryForm({
      ...entryForm,
      [name]: value
    });
  };
  
  // Fonction pour gérer les changements dans l'éditeur de texte enrichi
  const handleEditorChange = (name: string) => (value: string) => {
    setEntryForm({
      ...entryForm,
      [name]: value
    });
  };
  
  // Fonction pour gérer les changements dans les ressources
  const handleResourceChange = (index: number, value: string) => {
    const updatedResources = [...entryForm.resources];
    updatedResources[index] = value;
    setEntryForm(prev => ({
      ...prev,
      resources: updatedResources
    }));
  };
  
  // Fonction pour ajouter une ressource
  const addResource = () => {
    setEntryForm(prev => ({
      ...prev,
      resources: [...prev.resources, '']
    }));
  };
  
  // Fonction pour supprimer une ressource
  const removeResource = (index: number) => {
    if (entryForm.resources.length <= 1) return;
    
    const updatedResources = entryForm.resources.filter((_, i) => i !== index);
    setEntryForm(prev => ({
      ...prev,
      resources: updatedResources
    }));
  };
  
  // Fonction pour sauvegarder l'entrée
  const handleSaveEntry = () => {
    // Ici, vous pouvez implémenter la logique pour sauvegarder l'entrée
    // Par exemple, envoyer les données à une API ou mettre à jour l'état local
    console.log('Sauvegarde de l\'entrée:', entryForm);
    
    // Simuler une sauvegarde réussie
    setTimeout(() => {
      // Fermer le modal après la sauvegarde
      handleCloseModal();
      
      // Afficher une notification de succès (à implémenter)
      alert(selectedEntry ? 'Entrée modifiée avec succès!' : 'Nouvelle entrée ajoutée avec succès!');
    }, 500);
  };

  return (
    <div className="h-full flex flex-col">
      {/* En-tête avec filtres et recherche */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Sélecteurs de filtres */}
          <div className="flex flex-wrap gap-2 items-center">
            <div className="relative">
              <select
                aria-label="Filtrer par classe"
                className="pl-3 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                value={filters.class}
                onChange={(e) => setFilters({ ...filters, class: e.target.value })}
              >
                <option value="">Toutes les classes</option>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.name}>{cls.name}</option>
                ))}
              </select>
            </div>
            
            <div className="relative">
              <select
                aria-label="Filtrer par matière"
                className="pl-3 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                value={filters.subject}
                onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
              >
                <option value="">Toutes les matières</option>
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.name}>{subject.name}</option>
                ))}
              </select>
            </div>
            
            <div className="relative">
              <select
                aria-label="Filtrer par période"
                className="pl-3 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                value={filters.period}
                onChange={(e) => setFilters({ ...filters, period: e.target.value })}
              >
                <option value="all">Toutes les périodes</option>
                <option value="today">Aujourd'hui</option>
                <option value="week">Cette semaine</option>
                <option value="month">Ce mois</option>
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
      
      {/* Navigation entre les différentes vues */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-4">
        <button
          className={`px-4 py-2 font-medium text-sm ${activeView === 'entry' ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
          onClick={() => setActiveView('entry')}
        >
          Saisie quotidienne
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm ${activeView === 'history' ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
          onClick={() => setActiveView('history')}
        >
          Historique
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm ${activeView === 'validation' ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
          onClick={() => setActiveView('validation')}
        >
          Validation
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm ${activeView === 'rapport' ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
          onClick={() => setActiveView('rapport')}
        >
          Rapport d'avancement
        </button>
      </div>
      
      {/* Bouton d'ajout d'entrée */}
      <div className="flex justify-end mb-4">
        <button 
          className="inline-flex items-center px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800"
          onClick={handleAddEntry}
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle entrée
        </button>
      </div>
      
      {/* Contenu principal basé sur la vue active */}
      <div className="flex-grow overflow-auto">
        {activeView === 'entry' && (
          <CahierTexteEntry 
            onEditEntry={handleEditEntry}
            filters={filters} 
            searchQuery={searchQuery} 
          />
        )}
        
        {activeView === 'history' && (
          <CahierTexteHistory 
            filters={filters} 
            searchQuery={searchQuery} 
          />
        )}
        
        {activeView === 'validation' && (
          <ValidationAdmin 
            filters={filters}
            searchQuery={searchQuery}
          />
        )}
        
        {activeView === 'rapport' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Suivi et Rapports</h3>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Avancement du programme</h4>
                <RapportAvancement />
              </div>
              
              <div>
                <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Exports et Rapports</h4>
                <ExportRapports />
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Modal pour l'édition d'entrée */}
      {isEntryModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {selectedEntry ? 'Modifier une entrée' : 'Ajouter une entrée'}
              </h2>
              <button 
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
                onClick={handleCloseModal}
                aria-label="Fermer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Date */}
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Date
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  </div>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                    value={entryForm.date}
                    onChange={handleFormChange}
                    required
                  />
                </div>
              </div>
              
              {/* Classe et Matière */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="class" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Classe
                  </label>
                  <select
                    id="class"
                    name="class"
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500 py-2 px-3"
                    value={entryForm.class}
                    onChange={handleFormChange}
                    required
                  >
                    <option value="">Sélectionner une classe</option>
                    {classes.map((cls) => (
                      <option key={cls.id} value={cls.name}>{cls.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Matière
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500 py-2 px-3"
                    value={entryForm.subject}
                    onChange={handleFormChange}
                    required
                  >
                    <option value="">Sélectionner une matière</option>
                    {subjects.map((subject) => (
                      <option key={subject.id} value={subject.name}>{subject.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              {/* Titre */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Titre
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500 py-2 px-3"
                  placeholder="Titre de la séance"
                  value={entryForm.title}
                  onChange={handleFormChange}
                  required
                />
              </div>
              
              {/* Contenu */}
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Contenu
                </label>
                <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                  <ReactQuill
                    id="content"
                    theme="snow"
                    value={entryForm.content}
                    onChange={handleEditorChange('content')}
                    placeholder="Description du contenu de la séance"
                    modules={{
                      toolbar: [
                        [{ 'header': [1, 2, 3, false] }],
                        ['bold', 'italic', 'underline', 'strike'],
                        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                        ['link', 'image'],
                        ['clean']
                      ],
                    }}
                  />
                </div>
              </div>
              
              {/* Devoirs */}
              <div>
                <label htmlFor="homework" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Devoirs
                </label>
                <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                  <ReactQuill
                    id="homework"
                    theme="snow"
                    value={entryForm.homework}
                    onChange={handleEditorChange('homework')}
                    placeholder="Devoirs à faire (optionnel)"
                    modules={{
                      toolbar: [
                        ['bold', 'italic', 'underline'],
                        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                        ['link'],
                        ['clean']
                      ],
                    }}
                  />
                </div>
              </div>
              
              {/* Date limite des devoirs */}
              <div>
                <label htmlFor="homeworkDueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Date limite des devoirs
                </label>
                <input
                  type="date"
                  id="homeworkDueDate"
                  name="homeworkDueDate"
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500 py-2 px-3"
                  value={entryForm.homeworkDueDate}
                  onChange={handleFormChange}
                />
              </div>
              
              {/* Ressources */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Ressources
                </label>
                {entryForm.resources.map((resource, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <input
                      type="text"
                      className="flex-grow border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500 py-2 px-3"
                      placeholder={`Ressource ${index + 1}`}
                      value={resource}
                      onChange={(e) => handleResourceChange(index, e.target.value)}
                    />
                    <button
                      type="button"
                      className="ml-2 p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full"
                      onClick={() => removeResource(index)}
                      aria-label="Supprimer cette ressource"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  onClick={addResource}
                >
                  + Ajouter une ressource
                </button>
              </div>
              
              {/* Statut */}
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Statut
                </label>
                <select
                  id="status"
                  name="status"
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500 py-2 px-3"
                  value={entryForm.status}
                  onChange={handleFormChange}
                >
                  <option value="draft">Brouillon</option>
                  <option value="pending">En attente de validation</option>
                  <option value="validated">Validé</option>
                  <option value="rejected">Rejeté</option>
                </select>
              </div>
              
              {/* Enseignant */}
              <div>
                <label htmlFor="teacher" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Enseignant
                </label>
                <input
                  type="text"
                  id="teacher"
                  name="teacher"
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500 py-2 px-3"
                  placeholder="Nom de l'enseignant"
                  value={entryForm.teacher}
                  onChange={handleFormChange}
                  required
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 mt-6">
              <button 
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
                onClick={handleCloseModal}
              >
                Annuler
              </button>
              <button 
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-800"
                onClick={handleSaveEntry}
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Indicateur de statut en ligne/hors ligne */}
      <div className="mt-4 text-right">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${onlineStatus ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'}`}>
          <span className={`w-2 h-2 mr-1 rounded-full ${onlineStatus ? 'bg-green-500' : 'bg-red-500'}`}></span>
          {onlineStatus ? 'En ligne' : 'Hors ligne'}
        </span>
      </div>
    </div>
  );
};

export default CahierTexteBoard;
