import { useState, useRef, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
}

interface DatePickerProps {
  value?: Date | null;
  onChange?: (date: Date | null) => void;
  id?: string;
  name?: string;
}

const DatePicker = ({ value, onChange, id, name }: DatePickerProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(value || null);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const calendarRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Update internal state if value prop changes
  useEffect(() => {
    if (value !== undefined) {
      setSelectedDate(value);
    }
  }, [value]);

  const getMonthName = (date: Date): string => {
    return date.toLocaleString('default', { month: 'long' });
  };

  const getYear = (date: Date): number => {
    return date.getFullYear();
  };

  const prevMonth = (): void => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = (): void => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const getDaysInMonth = (): CalendarDay[] => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const startingDayOfWeek = firstDayOfMonth.getDay();

    const lastDayOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();

    const days: CalendarDay[] = [];

    for (let i = 0; i < startingDayOfWeek; i++) {
      const prevDate = new Date(year, month, -i);
      days.push({ date: prevDate, isCurrentMonth: false });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      days.push({ date, isCurrentMonth: true });
    }

    const totalDaysDisplayed = 42;
    const trailingDays = totalDaysDisplayed - days.length;
    for (let i = 1; i <= trailingDays; i++) {
      const date = new Date(year, month + 1, i);
      days.push({ date, isCurrentMonth: false });
    }

    return days;
  };

  const handleDateSelect = (date: Date): void => {
    setSelectedDate(date);
    onChange?.(date);
    setIsOpen(false);
  };

  const formatDate = (date: Date | null): string => {
    if (!date) return '';
    return date.toLocaleDateString('en-CA');
  };

  return (
    <div className="relative" ref={calendarRef}>
      <div className="flex items-center bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
        <input
          type="text"
          readOnly
          value={formatDate(selectedDate)}
          placeholder="Select date"
          className="flex-grow outline-none bg-transparent dark:bg-gray-700"
          onClick={() => setIsOpen(!isOpen)}
          id={id}
          name={name}
        />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
        >
          <CalendarDaysIcon className="h-5 w-5" />
        </button>
      </div>
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={prevMonth}
              type="button"
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
            <span className="font-semibold text-gray-900 dark:text-white">
              {getMonthName(currentDate)} {getYear(currentDate)}
            </span>
            <button
              onClick={nextMonth}
              type="button"
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
              <div key={day} className="text-center text-sm font-medium text-gray-500 dark:text-gray-400 py-1">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {getDaysInMonth().map((day, index) => {
              const isSelected = selectedDate && day.date.toDateString() === selectedDate.toDateString();
              const isToday = new Date().toDateString() === day.date.toDateString();

              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleDateSelect(day.date)}
                  className={`
                    m-auto h-8 w-8 text-sm rounded-lg transition-colors
                    ${day.isCurrentMonth
                      ? ' text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600'
                      : 'text-gray-400 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-600'
                    }
                    ${isSelected
                      ? 'bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700'
                      : ''
                    }
                    ${isToday && !isSelected && day.isCurrentMonth
                      ? 'border border-blue-500 dark:border-blue-400'
                      : ''
                    }
                    focus:outline-none focus:ring-2 focus:ring-blue-500
                  `}
                >
                  {day.date.getDate()}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default DatePicker;