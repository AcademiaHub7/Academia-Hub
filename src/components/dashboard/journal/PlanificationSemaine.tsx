import React from 'react';
import { format, addDays, startOfWeek } from 'date-fns';
import { fr } from 'date-fns/locale';
import { JournalEntry } from '../../../types/journal';

interface PlanificationSemaineProps {
  currentDate: Date;
  entries: JournalEntry[];
  onEntryClick: (entry: JournalEntry) => void;
  onDrop: (e: React.DragEvent, date: string) => void;
  onDragOver: (e: React.DragEvent) => void;
}

const PlanificationSemaine: React.FC<PlanificationSemaineProps> = ({
  currentDate,
  entries,
  onEntryClick,
  onDrop,
  onDragOver
}) => {
  // Get the start of the week (Monday)
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  
  // Generate array of days for the week
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const day = addDays(weekStart, i);
    const dateStr = format(day, 'yyyy-MM-dd');
    const dayEntries = entries.filter(entry => entry.date?.startsWith(dateStr));
    
    return {
      date: day,
      dateStr,
      dayName: format(day, 'EEEE', { locale: fr }),
      dayNumber: format(day, 'd'),
      entries: dayEntries
    };
  });

  const getEntryColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 border-green-300 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 border-blue-300 text-blue-800';
      case 'planned':
        return 'bg-purple-100 border-purple-300 text-purple-800';
      case 'cancelled':
        return 'bg-red-100 border-red-300 text-red-800';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="grid grid-cols-7 gap-1 text-center py-2 border-b">
        {weekDays.map(day => (
          <div key={day.dateStr} className="text-sm">
            <div className="font-medium">{day.dayName}</div>
            <div className="text-lg">{day.dayNumber}</div>
          </div>
        ))}
      </div>
      
      <div className="flex-1 grid grid-cols-7 gap-1 overflow-y-auto">
        {weekDays.map(day => (
          <div 
            key={day.dateStr}
            className="border-r min-h-[600px] p-1"
            onDrop={(e) => onDrop(e, day.dateStr)}
            onDragOver={onDragOver}
          >
            <div className="space-y-1">
              {day.entries.map(entry => (
                <div
                  key={entry.id}
                  className={`p-2 rounded border text-sm cursor-pointer ${getEntryColor(entry.status)}`}
                  onClick={() => onEntryClick(entry)}
                >
                  <div className="font-medium truncate">{entry.title}</div>
                  <div className="flex justify-between items-center text-xs">
                    <span>{entry.subject}</span>
                    <span>{entry.duration} min</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlanificationSemaine;
