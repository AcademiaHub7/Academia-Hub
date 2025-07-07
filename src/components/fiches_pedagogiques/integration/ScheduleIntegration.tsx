import React, { useState } from 'react';
import { 
  Clock, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  Users,
  X 
} from 'lucide-react';

interface ScheduleEntry {
  id: string;
  ficheId: string;
  ficheTitle: string;
  date: string;
  timeSlot: {
    start: string;
    end: string;
  };
  room: string;
  teacher: string;
  students: number;
  status: 'scheduled' | 'confirmed' | 'cancelled' | 'rescheduled';
  constraints: {
    time: boolean;
    room: boolean;
    teacher: boolean;
    students: boolean;
  };
}

interface ScheduleIntegrationProps {
  entries: ScheduleEntry[];
  onConfirm: (entry: ScheduleEntry) => void;
  onReschedule: (entry: ScheduleEntry) => void;
  onCancel: (entry: ScheduleEntry) => void;
}

const ScheduleIntegration: React.FC<ScheduleIntegrationProps> = ({
  entries,
  onConfirm,
  onReschedule,
  onCancel
}) => {
  const [selectedEntry, setSelectedEntry] = useState<ScheduleEntry | null>(null);
  const [showConstraints, setShowConstraints] = useState(false);

  // Statuts visuels
  const statusColors = {
    scheduled: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300',
    confirmed: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300',
    cancelled: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300',
    rescheduled: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300'
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center">
          <Calendar className="w-5 h-5 inline-block mr-2" />
          Emploi du temps
        </h3>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowConstraints(!showConstraints)}
              className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              <AlertCircle className="w-4 h-4 mr-2" />
              {showConstraints ? 'Masquer' : 'Afficher'} les contraintes
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Total étudiants: {entries.reduce((acc, entry) => acc + entry.students, 0)}
            </span>
          </div>
        </div>
      </div>

      {/* Liste des entrées */}
      <div className="space-y-4">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 p-4"
          >
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                {entry.ficheTitle}
              </h4>
              <div
                className={`px-2 py-1 rounded-full text-xs ${
                  statusColors[entry.status]
                }`}
              >
                {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(entry.date).toLocaleDateString('fr-FR')} {entry.timeSlot.start} - {entry.timeSlot.end}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {entry.students} étudiants
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded-full" />
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {entry.room}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-200 dark:bg-blue-700 rounded-full" />
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {entry.teacher}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onConfirm(entry)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                </button>
                <button
                  onClick={() => onReschedule(entry)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <RefreshCw className="w-4 h-4 text-yellow-500" />
                </button>
                <button
                  onClick={() => onCancel(entry)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <X className="w-4 h-4 text-red-500" />
                </button>
              </div>
              {showConstraints && (
                <div className="flex items-center space-x-2">
                  {Object.entries(entry.constraints).map(([constraint, value]) => (
                    value && (
                      <div
                        key={constraint}
                        className="flex items-center space-x-1"
                      >
                        <AlertCircle className="w-4 h-4 text-red-500" />
                        <span className="text-sm text-red-600 dark:text-red-400">
                          {constraint.charAt(0).toUpperCase() + constraint.slice(1)}
                        </span>
                      </div>
                    )
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScheduleIntegration;
