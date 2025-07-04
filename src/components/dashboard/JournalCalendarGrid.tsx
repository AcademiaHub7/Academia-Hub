import React from 'react';
import { format, startOfWeek, startOfMonth, addDays, addWeeks, isSameMonth } from 'date-fns';
import { fr } from 'date-fns/locale';
import { JournalEntry } from '../../types/journal';

interface JournalCalendarGridProps {
  view: 'week' | 'month';
  currentDate: Date;
  entries: JournalEntry[];
  onDrop: (e: React.DragEvent, date: string) => void;
  onDragOver: (e: React.DragEvent) => void;
}

const JournalCalendarGrid: React.FC<JournalCalendarGridProps> = ({
  view,
  currentDate,
  entries,
  onDrop,
  onDragOver
}) => {
  const startDate = view === 'week' ? startOfWeek(currentDate, { locale: fr }) : startOfMonth(currentDate);
  const weeks = view === 'week' ? 1 : 6;
  const weekDays = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

  const renderEntries = (date: Date) => {
    const dayEntries = entries.filter(entry => 
      entry.date === format(date, 'yyyy-MM-dd')
    );

    return dayEntries.map(entry => (
      <div
        key={entry.id}
        className={`p-2 mb-1 rounded text-sm ${
          entry.status === 'completed' ? 'bg-green-100' :
          entry.status === 'in_progress' ? 'bg-blue-100' :
          entry.status === 'postponed' ? 'bg-yellow-100' :
          'bg-gray-100'
        }`}
      >
        <div className="font-medium truncate">{entry.title}</div>
        <div className="text-xs text-gray-600">
          {entry.subject} - {entry.duration}min
        </div>
      </div>
    ));
  };

  return (
    <div className="h-full">
      {/* Header */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {weekDays.map(day => (
          <div key={day} className="text-center font-medium p-2">
            {day}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-rows-[repeat(var(--weeks),1fr)] gap-2">
        {[...Array(weeks)].map((_, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 gap-2">
            {weekDays.map((_, dayIndex) => {
              const date = addDays(addWeeks(startDate, weekIndex), dayIndex);
              const isCurrentMonth = view === 'week' || isSameMonth(date, currentDate);

              return (
                <div
                  key={dayIndex}
                  className={`min-h-[120px] p-2 border rounded ${
                    isCurrentMonth ? 'bg-white' : 'bg-gray-50'
                  } ${
                    format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
                      ? 'ring-2 ring-blue-500'
                      : ''
                  }`}
                  onDrop={(e) => onDrop(e, format(date, 'yyyy-MM-dd'))}
                  onDragOver={onDragOver}
                >
                  <div className="text-right text-sm text-gray-500 mb-2">
                    {format(date, 'd')}
                  </div>
                  <div className="space-y-1 overflow-y-auto max-h-[calc(100%-2rem)]">
                    {renderEntries(date)}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default JournalCalendarGrid;
