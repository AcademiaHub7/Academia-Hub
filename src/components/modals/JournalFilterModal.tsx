import React from 'react';
import { Filter } from 'lucide-react';
import { JournalFilter } from '../../types/journal';

interface JournalFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filter: JournalFilter) => void;
  currentFilter: JournalFilter;
  classes: string[];
  subjects: string[];
}

const JournalFilterModal: React.FC<JournalFilterModalProps> = ({
  isOpen,
  onClose,
  onApply,
  currentFilter,
  classes,
  subjects
}) => {
  const [filter, setFilter] = React.useState<JournalFilter>(currentFilter);

  const handleApply = () => {
    onApply(filter);
    onClose();
  };

  const handleReset = () => {
    const resetFilter: JournalFilter = {
      class: '',
      subject: '',
      period: 'all',
      status: undefined
    };
    setFilter(resetFilter);
    onApply(resetFilter);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            <h2 className="text-xl font-semibold">Filtrer les séances</h2>
          </div>
          <button 
            type="button"
            className="btn btn-ghost"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div>
            <label className="label">Classe</label>
            <select
              className="select select-bordered w-full"
              value={filter.class}
              onChange={e => setFilter(prev => ({ ...prev, class: e.target.value }))}
            >
              <option value="">Toutes les classes</option>
              {classes.map(cls => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Matière</label>
            <select
              className="select select-bordered w-full"
              value={filter.subject}
              onChange={e => setFilter(prev => ({ ...prev, subject: e.target.value }))}
            >
              <option value="">Toutes les matières</option>
              {subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Période</label>
            <select
              className="select select-bordered w-full"
              value={filter.period}
              onChange={e => setFilter(prev => ({ ...prev, period: e.target.value as JournalFilter['period'] }))}
            >
              <option value="all">Toutes les périodes</option>
              <option value="today">Aujourd'hui</option>
              <option value="week">Cette semaine</option>
              <option value="month">Ce mois</option>
            </select>
          </div>

          <div>
            <label className="label">Statut</label>
            <select
              className="select select-bordered w-full"
              value={filter.status || ''}
              onChange={e => setFilter(prev => ({ ...prev, status: e.target.value || undefined }))}
            >
              <option value="">Tous les statuts</option>
              <option value="planned">Planifiée</option>
              <option value="in_progress">En cours</option>
              <option value="completed">Terminée</option>
              <option value="postponed">Reportée</option>
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t flex justify-end space-x-4">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={handleReset}
          >
            Réinitialiser
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleApply}
          >
            Appliquer
          </button>
        </div>
      </div>
    </div>
  );
};

export default JournalFilterModal;
