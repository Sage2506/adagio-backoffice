import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
  placeholder?: string;
}

type CalendarView = 'days' | 'months';

const DatePicker = ({ value, onChange, id, name, placeholder }: DatePickerProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(value || null);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentView, setCurrentView] = useState<CalendarView>('days');
  const [popupPosition, setPopupPosition] = useState<{ top: number, left: number, width: number } | null>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        calendarRef.current && !calendarRef.current.contains(event.target as Node) &&
        popupRef.current && !popupRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        // Reset to days view when closing
        setCurrentView('days');
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
      if (value) {
        setCurrentDate(new Date(value.getFullYear(), value.getMonth(), 1));
      }
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

  const prevYear = (): void => {
    setCurrentDate(new Date(currentDate.getFullYear() - 1, currentDate.getMonth(), 1));
  };

  const nextYear = (): void => {
    setCurrentDate(new Date(currentDate.getFullYear() + 1, currentDate.getMonth(), 1));
  };

  const getDaysInMonth = (): CalendarDay[] => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const startingDayOfWeek = firstDayOfMonth.getDay();

    const lastDayOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();

    const days: CalendarDay[] = [];

    // Previous month days
    for (let i = 0; i < startingDayOfWeek; i++) {
      const prevDate = new Date(year, month, -i);
      days.unshift({ date: prevDate, isCurrentMonth: false });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      days.push({ date, isCurrentMonth: true });
    }

    // Next month days to fill the grid (42 cells total for 6 rows)
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
    setCurrentView('days');
  };

  const handleMonthSelect = (month: number): void => {
    setCurrentDate(new Date(currentDate.getFullYear(), month, 1));
    setCurrentView('days');
  };

  const handleMonthClick = (): void => {
    setCurrentView('months');
  };

  const formatDate = (date: Date | null): string => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  };

  const getMonthNames = (): string[] => {
    return Array.from({ length: 12 }, (_, i) =>
      new Date(0, i).toLocaleString('default', { month: 'long' })
    );
  };

  const toggleCalendar = (): void => {
    if (isOpen) {
      setIsOpen(false);
      return;
    }

    const rect = calendarRef.current?.getBoundingClientRect();
    if (rect) {
      setPopupPosition({ top: rect.bottom + 4, left: rect.left, width: Math.max(rect.width, 288) });
    }
    setIsOpen(true);
  };

  return (
    <div className="relative" ref={calendarRef}>
      <div className="flex items-center w-full px-4 py-2.5 rounded-lg border border-outline-variant bg-surface-lowest text-on-surface focus-within:ring-2 focus-within:ring-primary focus-within:border-primary transition-all font-body-md">
        <input
          type="text"
          readOnly
          value={formatDate(selectedDate)}
          placeholder={placeholder || "Select date"}
          className="flex-grow outline-none bg-transparent"
          onClick={toggleCalendar}
          id={id}
          name={name}
        />
        <button
          type="button"
          onClick={toggleCalendar}
          className="p-1 text-on-surface-variant hover:text-primary focus:outline-none focus:ring-1 focus:ring-primary rounded-lg"
        >
          <CalendarDaysIcon className="h-5 w-5" />
        </button>
      </div>
      {isOpen && popupPosition && createPortal(
        <div ref={popupRef} className="fixed z-[100] bg-surface-container-lowest border border-outline-variant rounded-lg shadow-soft p-4" style={popupPosition}>
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={currentView === 'days' ? prevMonth : prevYear}
              type="button"
              className="p-1 hover:bg-surface-container rounded-full text-on-surface-variant hover:text-primary"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>

            <button
              onClick={currentView === 'days' ? handleMonthClick : undefined}
              type="button"
              className={`
                font-semibold text-on-surface px-2 py-1 rounded
                ${currentView === 'days' ? 'hover:bg-surface-container' : ''}
              `}
            >
              {currentView === 'days' ? (
                <>
                  {getMonthName(currentDate)} {getYear(currentDate)}
                </>
              ) : (
                getYear(currentDate)
              )}
            </button>

            <button
              onClick={currentView === 'days' ? nextMonth : nextYear}
              type="button"
              className="p-1 hover:bg-surface-container rounded-full text-on-surface-variant hover:text-primary"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </div>

          {currentView === 'days' ? (
            <>
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
            </>
          ) : (
            // Months view
            <div className="grid grid-cols-3 gap-3">
              {getMonthNames().map((monthName, index) => {
                const isCurrentMonth = currentDate.getMonth() === index;
                const isSelectedMonth = selectedDate && selectedDate.getMonth() === index && selectedDate.getFullYear() === currentDate.getFullYear();

                return (
                  <button
                    key={monthName}
                    type="button"
                    onClick={() => handleMonthSelect(index)}
                    className={`
                      py-2 px-3 text-sm font-medium rounded-lg transition-colors
                      ${isCurrentMonth
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-gray-900 dark:text-white'
                      }
                      ${isSelectedMonth
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-600'
                      }
                      focus:outline-none focus:ring-2 focus:ring-blue-500
                    `}
                  >
                    {monthName.substring(0, 3)}
                  </button>
                );
              })}
            </div>
          )}
        </div>,
        document.body
      )}
    </div>
  );
};

export default DatePicker;