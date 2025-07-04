import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Calendar,
  Filter,
  Copy,
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
import JournalCalendarGrid from './JournalCalendarGrid';

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
    class: '',
    subject: '',
    period: 'all'
  });
  const [unplannedEntries, setUnplannedEntries] = useState<JournalEntry[]>([]);
  const [isDragging, setIsDragging] = useState(false);

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

  // Handle drag and drop
  const handleDragStart = (e: React.DragEvent, entry: JournalEntry) => {
    e.dataTransfer.setData('text/plain', JSON.stringify(entry));
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

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

  // Template management
  const duplicateTemplate = (template: JournalTemplate) => {
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

  return (
    <div className="h-full flex flex-col">
      {/* Header with controls */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-4">
          <button className="btn btn-primary">
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle séance
          </button>
          <div className="flex items-center space-x-2">
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
          <div className="flex items-center space-x-2 ml-4">
            <button 
              className="btn btn-ghost btn-sm"
              onClick={handlePrevious}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button 
              className="btn btn-ghost btn-sm"
              onClick={handleToday}
            >
              Aujourd'hui
            </button>
            <button 
              className="btn btn-ghost btn-sm"
              onClick={handleNext}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <span className="font-medium">
              {format(currentDate, view === 'week' ? "'Semaine du' d MMMM yyyy" : 'MMMM yyyy', { locale: fr })}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          {onlineStatus ? (
            <Wifi className="w-5 h-5 text-green-500" />
          ) : (
            <div className="flex items-center">
              <WifiOff className="w-5 h-5 text-yellow-500 mr-2" />
              <span className="text-sm text-yellow-500">Mode hors ligne</span>
            </div>
          )}
          <button className="btn btn-ghost">
            <Filter className="w-4 h-4 mr-2" />
            Filtrer
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 grid grid-cols-4 gap-4 p-4">
        {/* Left sidebar - Templates */}
        <div className="col-span-1 border rounded-lg p-4">
          <h3 className="font-semibold mb-4">Templates</h3>
          <div className="space-y-2">
            {templates.map(template => (
              <div 
                key={template.id}
                className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span>{template.title}</span>
                  <button 
                    className="btn btn-ghost btn-sm"
                    onClick={() => duplicateTemplate(template)}
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-sm text-gray-500">
                  {template.subject} - {template.level}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main calendar view */}
        <div className="col-span-2 border rounded-lg p-4">
          <JournalCalendarGrid
            view={view}
            currentDate={currentDate}
            entries={entries}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          />
        </div>

        {/* Right sidebar - Unplanned sessions */}
        <div className="col-span-1 border rounded-lg p-4">
          <h3 className="font-semibold mb-4">Séances non planifiées</h3>
          <div className="space-y-2">
            {unplannedEntries.map(entry => (
              <div
                key={entry.id}
                draggable
                onDragStart={(e) => handleDragStart(e, entry)}
                onDragEnd={handleDragEnd}
                className="p-3 border rounded-lg hover:bg-gray-50 cursor-move"
              >
                <div className="font-medium">{entry.title}</div>
                <div className="text-sm text-gray-500">
                  {entry.subject} - {entry.class}
                </div>
                <div className="text-sm text-gray-500">
                  {entry.duration} min
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Offline sync notification */}
      {!onlineStatus && entries.some(e => e.offline) && (
        <div className="fixed bottom-4 right-4 bg-yellow-100 text-yellow-800 p-4 rounded-lg shadow-lg flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2" />
          <span>Certaines modifications seront synchronisées lors de la reconnexion</span>
          <button className="ml-4 btn btn-sm">
            <Save className="w-4 h-4 mr-2" />
            Forcer la synchro
          </button>
        </div>
      )}
    </div>
  );
};

export default JournalTab;
