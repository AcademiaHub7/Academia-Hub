import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { JournalEntry } from '../../../types/journal';
import JournalCalendarGrid from '../JournalCalendarGrid';

interface CahierJournalDashboardProps {
  view: 'week' | 'month';
  currentDate: Date;
  entries: JournalEntry[];
  onDrop: (e: React.DragEvent, date: string) => void;
  onDragOver: (e: React.DragEvent) => void;
}

const CahierJournalDashboard: React.FC<CahierJournalDashboardProps> = ({
  view,
  currentDate,
  entries,
  onDrop,
  onDragOver
}) => {
  return (
    <div className="border rounded-lg p-4 h-full flex flex-col">
      <h3 className="font-semibold mb-4">
        {format(currentDate, view === 'week' ? "'Semaine du' d MMMM yyyy" : 'MMMM yyyy', { locale: fr })}
      </h3>
      <div className="flex-1">
        <JournalCalendarGrid
          view={view}
          currentDate={currentDate}
          entries={entries}
          onDrop={onDrop}
          onDragOver={onDragOver}
        />
      </div>
    </div>
  );
};

export default CahierJournalDashboard;
