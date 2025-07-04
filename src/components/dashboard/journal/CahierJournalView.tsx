import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Edit, X, Check, Clock, Calendar, BookOpen, Users } from 'lucide-react';
import { JournalEntry } from '../../../types/journal';

interface CahierJournalViewProps {
  entry: JournalEntry;
  onClose: () => void;
  onEdit: (entry: JournalEntry) => void;
}

const CahierJournalView: React.FC<CahierJournalViewProps> = ({
  entry,
  onClose,
  onEdit
}) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Non planifié';
    try {
      return format(new Date(dateString), 'EEEE d MMMM yyyy', { locale: fr });
    } catch (e) {
      return dateString;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="badge badge-success">Terminé</span>;
      case 'in-progress':
        return <span className="badge badge-info">En cours</span>;
      case 'planned':
        return <span className="badge badge-primary">Planifié</span>;
      case 'cancelled':
        return <span className="badge badge-error">Annulé</span>;
      default:
        return <span className="badge">Non défini</span>;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">{entry.title}</h2>
        <div className="flex space-x-2">
          <button 
            className="btn btn-primary btn-sm"
            onClick={() => onEdit(entry)}
          >
            <Edit className="w-4 h-4 mr-2" />
            Modifier
          </button>
          <button 
            className="btn btn-ghost btn-sm"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-gray-500" />
          <div>
            <div className="text-sm text-gray-500">Date</div>
            <div>{formatDate(entry.date)}</div>
          </div>
        </div>
        <div className="flex items-center">
          <Clock className="w-5 h-5 mr-2 text-gray-500" />
          <div>
            <div className="text-sm text-gray-500">Durée</div>
            <div>{entry.duration} minutes</div>
          </div>
        </div>
        <div className="flex items-center">
          <div>
            <div className="text-sm text-gray-500">Statut</div>
            <div>{getStatusBadge(entry.status)}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="flex items-center">
          <Users className="w-5 h-5 mr-2 text-gray-500" />
          <div>
            <div className="text-sm text-gray-500">Classe</div>
            <div>{entry.class}</div>
          </div>
        </div>
        <div className="flex items-center">
          <BookOpen className="w-5 h-5 mr-2 text-gray-500" />
          <div>
            <div className="text-sm text-gray-500">Matière</div>
            <div>{entry.subject}</div>
          </div>
        </div>
      </div>

      {entry.description && (
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Description</h3>
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            {entry.description}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {entry.objectives && entry.objectives.length > 0 && (
          <div>
            <h3 className="text-lg font-medium mb-2">Objectifs</h3>
            <ul className="space-y-2">
              {entry.objectives.map(obj => (
                <li key={obj.id} className="flex items-start">
                  <div className={`p-1 rounded-full mr-2 ${obj.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                    {obj.completed ? <Check className="w-4 h-4" /> : <div className="w-4 h-4" />}
                  </div>
                  <span>{obj.description}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {entry.steps && entry.steps.length > 0 && (
          <div>
            <h3 className="text-lg font-medium mb-2">Étapes de la séance</h3>
            <ul className="space-y-2">
              {entry.steps.map(step => (
                <li key={step.id} className="flex items-start">
                  <div className={`p-1 rounded-full mr-2 ${step.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                    {step.completed ? <Check className="w-4 h-4" /> : <div className="w-4 h-4" />}
                  </div>
                  <div>
                    <span>{step.description}</span>
                    {step.duration && (
                      <span className="text-sm text-gray-500 ml-2">({step.duration} min)</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {entry.materials && (
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-2">Matériel nécessaire</h3>
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            {entry.materials}
          </div>
        </div>
      )}

      {entry.notes && (
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-2">Notes</h3>
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            {entry.notes}
          </div>
        </div>
      )}

      <div className="mt-6 text-sm text-gray-500">
        <div>Créé le {format(new Date(entry.createdAt), 'dd/MM/yyyy à HH:mm')}</div>
        {entry.updatedAt && entry.updatedAt !== entry.createdAt && (
          <div>Dernière modification le {format(new Date(entry.updatedAt), 'dd/MM/yyyy à HH:mm')}</div>
        )}
        {entry.offline && (
          <div className="text-yellow-500 mt-1">⚠️ Cette entrée n'a pas encore été synchronisée</div>
        )}
      </div>
    </div>
  );
};

export default CahierJournalView;
