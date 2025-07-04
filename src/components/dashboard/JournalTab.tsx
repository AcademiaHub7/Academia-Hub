import React, { useState } from 'react';
import { 
  Plus, 
  Calendar,
  Filter,
  Save,
  Wifi,
  WifiOff,
  AlertTriangle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { format, addMonths, addWeeks, subMonths, subWeeks } from 'date-fns';
import { fr } from 'date-fns/locale';
import { JournalEntry, JournalTemplate, JournalFilter } from '../../types/journal';

// Import des nouveaux composants
import CahierJournalDashboard from './journal/CahierJournalDashboard';
import CahierJournalForm from './journal/CahierJournalForm';
import CahierJournalView from './journal/CahierJournalView';
import CahierJournalList from './journal/CahierJournalList';
import PlanificationSemaine from './journal/PlanificationSemaine';
import TemplateSelection from './journal/TemplateSelection';

interface JournalTabProps {
  onlineStatus: boolean;
}

const JournalTab: React.FC<JournalTabProps> = ({ onlineStatus }) => {
  // State management
  const [view, setView] = useState<'week' | 'month'>('week');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [templates, setTemplates] = useState<JournalTemplate[]>([]);
  const [filter, setFilter] = useState<JournalFilter>({
    search: '',
    class: '',
    subject: '',
    period: 'all',
    status: undefined
  });
  const [unplannedEntries, setUnplannedEntries] = useState<JournalEntry[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'list'>('dashboard');
  
  // Modal states
  const [showEntryForm, setShowEntryForm] = useState(false);
  const [showEntryView, setShowEntryView] = useState(false);
  const [showTemplateForm, setShowTemplateForm] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<JournalTemplate | null>(null);

  // Sample data for demo purposes
  const classes = ['CP', 'CE1', 'CE2', 'CM1', 'CM2'];
  const subjects = ['Français', 'Mathématiques', 'Histoire', 'Géographie', 'Sciences', 'Arts', 'EPS'];

  // Navigation handlers
  const handlePrevious = () => {
    setCurrentDate(prev => 
      view === 'week' ? subWeeks(prev, 1) : subMonths(prev, 1)
    );
  };

  const handleNext = () => {
    setCurrentDate(prev => 
      view === 'week' ? addWeeks(prev, 1) : addMonths(prev, 1)
    );
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Entry management
  const handleAddEntry = () => {
    setSelectedEntry(null);
    setShowEntryForm(true);
  };

  const handleEditEntry = (entry: JournalEntry) => {
    setSelectedEntry(entry);
    setShowEntryForm(true);
  };

  const handleViewEntry = (entry: JournalEntry) => {
    setSelectedEntry(entry);
    setShowEntryView(true);
  };

  const handleSaveEntry = (entry: JournalEntry) => {
    if (selectedEntry) {
      // Update existing entry
      setEntries(entries.map(e => e.id === entry.id ? entry : e));
    } else {
      // Add new entry
      if (entry.date) {
        setEntries([...entries, entry]);
      } else {
        setUnplannedEntries([...unplannedEntries, entry]);
      }
    }
    setShowEntryForm(false);
  };

  const handleDeleteEntry = (id: string) => {
    setEntries(entries.filter(e => e.id !== id));
    setUnplannedEntries(unplannedEntries.filter(e => e.id !== id));
    setShowEntryForm(false);
    setShowEntryView(false);
  };

  // Template management
  const handleAddTemplate = () => {
    setSelectedTemplate(null);
    setShowTemplateForm(true);
  };

  const handleEditTemplate = (template: JournalTemplate) => {
    setSelectedTemplate(template);
    setShowTemplateForm(true);
  };

  const handleSaveTemplate = (template: JournalTemplate) => {
    if (selectedTemplate) {
      // Update existing template
      setTemplates(templates.map(t => t.id === template.id ? template : t));
    } else {
      // Add new template
      setTemplates([...templates, template]);
    }
    setShowTemplateForm(false);
  };

  const handleDeleteTemplate = (id: string) => {
    setTemplates(templates.filter(t => t.id !== id));
    setShowTemplateForm(false);
  };

  const handleUseTemplate = (template: JournalTemplate) => {
    const newEntry: JournalEntry = {
      ...template,
      id: `JRN-${new Date().getTime()}`,
      date: '',
      status: 'planned',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      offline: !onlineStatus
    };
    setUnplannedEntries([...unplannedEntries, newEntry]);
  };

  // Handle drag and drop
  const handleDrop = (e: React.DragEvent, date: string) => {
    e.preventDefault();
    const entry = JSON.parse(e.dataTransfer.getData('text/plain')) as JournalEntry;
    // Update entry with new date and move from unplanned to planned
    const updatedEntry = { ...entry, date };
    setEntries([...entries, updatedEntry]);
    setUnplannedEntries(unplannedEntries.filter(e => e.id !== entry.id));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleFilterChange = (newFilter: JournalFilter) => {
    setFilter(newFilter);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header with controls */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-4">
          <button 
            className="btn btn-primary"
            onClick={handleAddEntry}
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle séance
          </button>
          <div className="flex items-center space-x-2">
            <button 
              className={`btn ${activeTab === 'dashboard' ? 'btn-active' : 'btn-ghost'}`}
              onClick={() => setActiveTab('dashboard')}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Calendrier
            </button>
            <button 
              className={`btn ${activeTab === 'list' ? 'btn-active' : 'btn-ghost'}`}
              onClick={() => setActiveTab('list')}
            >
              <Filter className="w-4 h-4 mr-2" />
              Liste
            </button>
          </div>
          {activeTab === 'dashboard' && (
            <div className="flex items-center space-x-2 ml-4">
              <button 
                className={`btn ${view === 'week' ? 'btn-active' : 'btn-ghost'}`}
                onClick={() => setView('week')}
              >
                Vue semaine
              </button>
              <button 
                className={`btn ${view === 'month' ? 'btn-active' : 'btn-ghost'}`}
                onClick={() => setView('month')}
              >
                Vue mois
              </button>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-4">
          {onlineStatus ? (
            <div className="flex items-center" title="En ligne">
              <Wifi className="w-5 h-5 text-green-500" />
            </div>
          ) : (
            <div className="flex items-center" title="Hors ligne">
              <WifiOff className="w-5 h-5 text-yellow-500 mr-2" />
              <span className="text-sm text-yellow-500">Mode hors ligne</span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation controls for calendar view */}
      {activeTab === 'dashboard' && (
        <div className="flex items-center justify-between px-4 py-2 border-b">
          <div className="flex items-center space-x-2">
            <button 
              className="btn btn-ghost btn-sm"
              onClick={handlePrevious}
              title="Précédent"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button 
              className="btn btn-ghost btn-sm"
              onClick={handleToday}
              title="Aujourd'hui"
            >
              Aujourd'hui
            </button>
            <button 
              className="btn btn-ghost btn-sm"
              onClick={handleNext}
              title="Suivant"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <span className="font-medium">
              {format(currentDate, view === 'week' ? "'Semaine du' d MMMM yyyy" : 'MMMM yyyy', { locale: fr })}
            </span>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 p-4">
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-4 gap-4 h-full">
            {/* Left sidebar - Templates */}
            <div className="col-span-1">
              <TemplateSelection 
                templates={templates}
                onUseTemplate={handleUseTemplate}
                onCreateTemplate={handleAddTemplate}
                onEditTemplate={handleEditTemplate}
                onDeleteTemplate={handleDeleteTemplate}
              />
            </div>

            {/* Main calendar view */}
            <div className="col-span-2">
              {view === 'week' ? (
                <PlanificationSemaine 
                  currentDate={currentDate}
                  entries={entries}
                  onEntryClick={handleViewEntry}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                />
              ) : (
                <CahierJournalDashboard 
                  view={view}
                  currentDate={currentDate}
                  entries={entries}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                />
              )}
            </div>

            {/* Right sidebar - Unplanned sessions */}
            <div className="col-span-1 border rounded-lg p-4">
              <h3 className="font-semibold mb-4">Séances non planifiées</h3>
              <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
                {unplannedEntries.map(entry => (
                  <div
                    key={entry.id}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('text/plain', JSON.stringify(entry));
                    }}
                    className="p-3 border rounded-lg hover:bg-gray-50 cursor-move"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">{entry.title}</div>
                        <div className="text-sm text-gray-500">
                          {entry.subject} - {entry.class}
                        </div>
                        <div className="text-sm text-gray-500">
                          {entry.duration} min
                        </div>
                      </div>
                      <button 
                        className="btn btn-ghost btn-xs"
                        onClick={() => handleViewEntry(entry)}
                        title="Voir les détails"
                      >
                        Voir
                      </button>
                    </div>
                  </div>
                ))}
                {unplannedEntries.length === 0 && (
                  <div className="text-center text-gray-500 py-4">
                    Aucune séance non planifiée
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'list' && (
          <CahierJournalList 
            entries={[...entries, ...unplannedEntries]}
            filter={filter}
            onFilterChange={handleFilterChange}
            onViewEntry={handleViewEntry}
            onEditEntry={handleEditEntry}
            classes={classes}
            subjects={subjects}
          />
        )}
      </div>

      {/* Entry form modal */}
      {showEntryForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <CahierJournalForm 
            entry={selectedEntry}
            onSave={handleSaveEntry}
            onCancel={() => setShowEntryForm(false)}
            onDelete={handleDeleteEntry}
            classes={classes}
            subjects={subjects}
          />
        </div>
      )}

      {/* Entry view modal */}
      {showEntryView && selectedEntry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <CahierJournalView 
            entry={selectedEntry}
            onClose={() => setShowEntryView(false)}
            onEdit={handleEditEntry}
          />
        </div>
      )}

      {/* Template form modal */}
      {showTemplateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {selectedTemplate ? 'Modifier le modèle' : 'Nouveau modèle'}
              </h2>
              <button 
                className="btn btn-ghost btn-sm" 
                onClick={() => setShowTemplateForm(false)}
                title="Fermer"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const template: JournalTemplate = {
                id: selectedTemplate?.id || `TPL-${new Date().getTime()}`,
                title: formData.get('title') as string,
                subject: formData.get('subject') as string,
                level: formData.get('level') as string,
                duration: parseInt(formData.get('duration') as string) || 60,
                objectives: formData.get('objectives') as string,
                steps: formData.get('steps') as string,
                materials: formData.get('materials') as string,
                notes: formData.get('notes') as string,
                createdAt: selectedTemplate?.createdAt || new Date().toISOString(),
                updatedAt: new Date().toISOString()
              };
              handleSaveTemplate(template);
            }}>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Titre</label>
                  <input 
                    type="text" 
                    name="title" 
                    className="input input-bordered w-full" 
                    defaultValue={selectedTemplate?.title || ''}
                    required 
                    placeholder="Titre du modèle"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Matière</label>
                  <select 
                    name="subject" 
                    className="select select-bordered w-full" 
                    defaultValue={selectedTemplate?.subject || ''}
                    required
                    title="Sélectionner une matière"
                  >
                    <option value="" disabled>Sélectionner une matière</option>
                    {subjects.map(subject => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Niveau</label>
                  <select 
                    name="level" 
                    className="select select-bordered w-full" 
                    defaultValue={selectedTemplate?.level || ''}
                    required
                    title="Sélectionner un niveau"
                  >
                    <option value="" disabled>Sélectionner un niveau</option>
                    {classes.map(cls => (
                      <option key={cls} value={cls}>{cls}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Durée (minutes)</label>
                  <input 
                    type="number" 
                    name="duration" 
                    className="input input-bordered w-full" 
                    defaultValue={selectedTemplate?.duration || 60}
                    min="5"
                    max="240"
                    required
                    placeholder="Durée en minutes"
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Objectifs</label>
                <textarea 
                  name="objectives" 
                  className="textarea textarea-bordered w-full h-24" 
                  defaultValue={selectedTemplate?.objectives || ''}
                  placeholder="Objectifs de la séance"
                ></textarea>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Étapes</label>
                <textarea 
                  name="steps" 
                  className="textarea textarea-bordered w-full h-32" 
                  defaultValue={selectedTemplate?.steps || ''}
                  placeholder="Étapes de la séance"
                ></textarea>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Matériel</label>
                  <textarea 
                    name="materials" 
                    className="textarea textarea-bordered w-full h-24" 
                    defaultValue={selectedTemplate?.materials || ''}
                    placeholder="Matériel nécessaire"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Notes</label>
                  <textarea 
                    name="notes" 
                    className="textarea textarea-bordered w-full h-24" 
                    defaultValue={selectedTemplate?.notes || ''}
                    placeholder="Notes supplémentaires"
                  ></textarea>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                {selectedTemplate && (
                  <button 
                    type="button" 
                    className="btn btn-error" 
                    onClick={() => {
                      if (confirm('Êtes-vous sûr de vouloir supprimer ce modèle ?')) {
                        handleDeleteTemplate(selectedTemplate.id);
                      }
                    }}
                    title="Supprimer le modèle"
                  >
                    Supprimer
                  </button>
                )}
                <button 
                  type="button" 
                  className="btn btn-ghost" 
                  onClick={() => setShowTemplateForm(false)}
                  title="Annuler"
                >
                  Annuler
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  title="Enregistrer le modèle"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Offline sync notification */}
      {!onlineStatus && entries.some(e => e.offline) && (
        <div className="fixed bottom-4 right-4 bg-yellow-100 text-yellow-800 p-4 rounded-lg shadow-lg flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2" />
          <span>Certaines modifications seront synchronisées lors de la reconnexion</span>
          <button className="ml-4 btn btn-sm" title="Forcer la synchronisation">
            <Save className="w-4 h-4 mr-2" />
            Forcer la synchro
          </button>
        </div>
      )}
    </div>
  );
};

export default JournalTab;
