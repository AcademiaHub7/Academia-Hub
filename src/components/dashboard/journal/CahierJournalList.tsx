import React, { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Search, Filter, Eye, Edit, Check, Clock } from 'lucide-react';
import { JournalEntry, JournalFilter } from '../../../types/journal';

interface CahierJournalListProps {
  entries: JournalEntry[];
  filter: JournalFilter;
  onFilterChange: (filter: JournalFilter) => void;
  onViewEntry: (entry: JournalEntry) => void;
  onEditEntry: (entry: JournalEntry) => void;
  classes: string[];
  subjects: string[];
}

const CahierJournalList: React.FC<CahierJournalListProps> = ({
  entries,
  filter,
  onFilterChange,
  onViewEntry,
  onEditEntry,
  classes,
  subjects
}) => {
  const [showFilters, setShowFilters] = useState(false);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onFilterChange({ ...filter, [name]: value });
  };

  const filteredEntries = useMemo(() => {
    return entries.filter(entry => {
      // Search filter
      if (filter.search && !entry.title.toLowerCase().includes(filter.search.toLowerCase()) && 
          !entry.description?.toLowerCase().includes(filter.search.toLowerCase())) {
        return false;
      }
      
      // Class filter
      if (filter.class && entry.class !== filter.class) {
        return false;
      }
      
      // Subject filter
      if (filter.subject && entry.subject !== filter.subject) {
        return false;
      }
      
      // Period filter
      if (filter.period !== 'all') {
        const today = new Date();
        const entryDate = entry.date ? new Date(entry.date) : null;
        
        if (!entryDate) return filter.period === 'unplanned';
        
        const isThisWeek = (date: Date) => {
          const startOfWeek = new Date(today);
          startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Monday
          startOfWeek.setHours(0, 0, 0, 0);
          
          const endOfWeek = new Date(startOfWeek);
          endOfWeek.setDate(startOfWeek.getDate() + 6); // Sunday
          endOfWeek.setHours(23, 59, 59, 999);
          
          return date >= startOfWeek && date <= endOfWeek;
        };
        
        const isThisMonth = (date: Date) => {
          return date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
        };
        
        switch (filter.period) {
          case 'today':
            return entryDate.toDateString() === today.toDateString();
          case 'week':
            return isThisWeek(entryDate);
          case 'month':
            return isThisMonth(entryDate);
          case 'future':
            return entryDate > today;
          case 'past':
            return entryDate < today;
          case 'unplanned':
            return false; // Already handled above
          default:
            return true;
        }
      }
      
      // Status filter
      if (filter.status !== 'all' && entry.status !== filter.status) {
        return false;
      }
      
      return true;
    });
  }, [entries, filter]);

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Non planifié';
    try {
      return format(new Date(dateString), 'EEEE d MMMM', { locale: fr });
    } catch (e) {
      return dateString;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="badge badge-success badge-sm">Terminé</span>;
      case 'in-progress':
        return <span className="badge badge-info badge-sm">En cours</span>;
      case 'planned':
        return <span className="badge badge-primary badge-sm">Planifié</span>;
      case 'cancelled':
        return <span className="badge badge-error badge-sm">Annulé</span>;
      default:
        return <span className="badge badge-sm">Non défini</span>;
    }
  };

  return (
    <div className="border rounded-lg p-4 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">Liste des séances</h3>
        <div className="flex space-x-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="search"
              value={filter.search}
              onChange={handleFilterChange}
              placeholder="Rechercher..."
              className="input input-bordered input-sm pl-9 pr-4 w-48"
            />
          </div>
          <button 
            className="btn btn-ghost btn-sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4 mr-1" />
            Filtres
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Classe</label>
              <select
                name="class"
                value={filter.class}
                onChange={handleFilterChange}
                className="select select-bordered select-sm w-full"
              >
                <option value="">Toutes les classes</option>
                {classes.map(cls => (
                  <option key={cls} value={cls}>{cls}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Matière</label>
              <select
                name="subject"
                value={filter.subject}
                onChange={handleFilterChange}
                className="select select-bordered select-sm w-full"
              >
                <option value="">Toutes les matières</option>
                {subjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Période</label>
              <select
                name="period"
                value={filter.period}
                onChange={handleFilterChange}
                className="select select-bordered select-sm w-full"
              >
                <option value="all">Toutes les périodes</option>
                <option value="today">Aujourd'hui</option>
                <option value="week">Cette semaine</option>
                <option value="month">Ce mois</option>
                <option value="future">À venir</option>
                <option value="past">Passées</option>
                <option value="unplanned">Non planifiées</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Statut</label>
              <select
                name="status"
                value={filter.status}
                onChange={handleFilterChange}
                className="select select-bordered select-sm w-full"
              >
                <option value="all">Tous les statuts</option>
                <option value="planned">Planifiées</option>
                <option value="in-progress">En cours</option>
                <option value="completed">Terminées</option>
                <option value="cancelled">Annulées</option>
              </select>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        {filteredEntries.length > 0 ? (
          <div className="space-y-2">
            {filteredEntries.map(entry => (
              <div 
                key={entry.id} 
                className="p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium">{entry.title}</div>
                    <div className="text-sm text-gray-500">
                      {entry.class} - {entry.subject}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      className="btn btn-ghost btn-xs"
                      onClick={() => onViewEntry(entry)}
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      Voir
                    </button>
                    <button 
                      className="btn btn-ghost btn-xs"
                      onClick={() => onEditEntry(entry)}
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      Modifier
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center text-sm">
                    <Calendar className="w-3 h-3 mr-1 text-gray-500" />
                    <span className="text-gray-600">{formatDate(entry.date)}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center text-sm">
                      <Clock className="w-3 h-3 mr-1 text-gray-500" />
                      <span className="text-gray-600">{entry.duration} min</span>
                    </div>
                    {getStatusBadge(entry.status)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <div className="text-lg mb-2">Aucune séance trouvée</div>
            <div className="text-sm">Essayez de modifier vos filtres</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CahierJournalList;
