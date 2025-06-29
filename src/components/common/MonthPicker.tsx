import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import { format } from 'date-fns';
import 'react-datepicker/dist/react-datepicker.css';

interface MonthPickerProps {
  value: string | undefined;
  onChange: (value: string) => void;
  label: string;
  className?: string;
}

const MonthPicker: React.FC<MonthPickerProps> = ({ value, onChange, label, className = '' }) => {
  const [date, setDate] = useState<Date | null>(
    value ? new Date(value + '-01') : null
  );

  const handleDateChange = (newDate: Date | null) => {
    if (newDate) {
      const formattedDate = format(newDate, 'yyyy-MM');
      onChange(formattedDate);
      setDate(newDate);
    }
  };

  return (
    <div className={`flex flex-col ${className}`}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
      <DatePicker
        selected={date}
        onChange={handleDateChange}
        dateFormat="yyyy-MM"
        showMonthYearPicker
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        placeholderText="Select month"
        maxDate={new Date()}
      />
    </div>
  );
};

export default MonthPicker;
