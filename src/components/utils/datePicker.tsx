import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeftIcon, ChevronRightIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';
import { formatDateDDMMYYYY, maskDateInput, parseDateDDMMYYYY } from '../../utils/dateInput';

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
  required?: boolean;
}

type CalendarView = 'days' | 'months';

const INVALID_DATE_MESSAGE = 'Enter a valid date (dd/mm/yyyy)';

const DatePicker = ({ value, onChange, id, name, placeholder, required }: DatePickerProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(value || null);
  const [dateText, setDateText] = useState<string>(formatDateDDMMYYYY(value ?? null));
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const inputRef = useRef<HTMLInputElement>(null);
  // Last date this component reported through onChange, to tell typed changes apart from external ones.
  const lastEmittedTime = useRef<number | null>(value ? value.getTime() : null);
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

  const updatePopupPosition = (): void => {
    const calendar = calendarRef.current;
    if (!calendar) return;

    const rect = calendar.getBoundingClientRect();
    const popupHeight = popupRef.current?.offsetHeight ?? 380;
    const popupWidth = Math.max(rect.width, 288);
    const margin = 8;
    const spaceBelow = window.innerHeight - rect.bottom - margin;
    const fitsBelow = spaceBelow >= popupHeight;
    const top = fitsBelow
      ? rect.bottom + 4
      : Math.max(margin, rect.top - popupHeight - 4);
    const left = Math.min(
      Math.max(margin, rect.left),
      Math.max(margin, window.innerWidth - popupWidth - margin)
    );

    setPopupPosition({ top, left, width: popupWidth });
  };

  useEffect(() => {
    if (!isOpen) return;

    const frameId = window.requestAnimationFrame(updatePopupPosition);
    window.addEventListener('resize', updatePopupPosition);
    window.addEventListener('scroll', updatePopupPosition, true);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener('resize', updatePopupPosition);
      window.removeEventListener('scroll', updatePopupPosition, true);
    };
  }, [isOpen, currentView]);

  // Update internal state if value prop changes (compared by time because parents often pass a new Date each render)
  const valueTime = value === undefined ? undefined : value ? value.getTime() : null;
  useEffect(() => {
    if (valueTime === undefined || valueTime === lastEmittedTime.current) return;
    const nextValue = valueTime === null ? null : new Date(valueTime);
    lastEmittedTime.current = valueTime;
    setSelectedDate(nextValue);
    setDateText(formatDateDDMMYYYY(nextValue));
    if (nextValue) {
      setCurrentDate(new Date(nextValue.getFullYear(), nextValue.getMonth(), 1));
    }
  }, [valueTime]);

  // Typed text that is not a complete valid date blocks form submission with a message
  useEffect(() => {
    const isInvalid = dateText !== '' && parseDateDDMMYYYY(dateText) === null;
    inputRef.current?.setCustomValidity(isInvalid ? INVALID_DATE_MESSAGE : '');
  }, [dateText]);

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

  const emitDate = (date: Date | null): void => {
    lastEmittedTime.current = date ? date.getTime() : null;
    setSelectedDate(date);
    onChange?.(date);
  };

  const handleDateSelect = (date: Date): void => {
    setDateText(formatDateDDMMYYYY(date));
    emitDate(date);
    setIsOpen(false);
    setCurrentView('days');
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const text = maskDateInput(event.target.value, dateText);
    setDateText(text);
    const parsed = parseDateDDMMYYYY(text);
    if (parsed) {
      setCurrentDate(new Date(parsed.getFullYear(), parsed.getMonth(), 1));
    }
    // Incomplete or invalid text clears the date so a stale value is never submitted
    if (parsed?.getTime() !== selectedDate?.getTime()) {
      emitDate(parsed);
    }
  };

  const handleMonthSelect = (month: number): void => {
    setCurrentDate(new Date(currentDate.getFullYear(), month, 1));
    setCurrentView('days');
  };

  const handleMonthClick = (): void => {
    setCurrentView('months');
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

    updatePopupPosition();
    setIsOpen(true);
  };

  return (
    <div className="relative" ref={calendarRef}>
      <div className="flex items-center w-full px-4 py-2.5 rounded-lg border border-outline-variant bg-surface-lowest text-on-surface focus-within:ring-2 focus-within:ring-primary focus-within:border-primary transition-all font-body-md">
        <input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          maxLength={10}
          value={dateText}
          onChange={handleTextChange}
          placeholder={placeholder || "dd/mm/yyyy"}
          required={required}
          className="flex-grow outline-none bg-transparent"
          onKeyDown={e => {
            // Enter or ArrowDown open the calendar from the keyboard
            if (e.key === 'Enter' || e.key === 'ArrowDown') {
              e.preventDefault();
              if (!isOpen) toggleCalendar();
            }
          }}
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
        <div ref={popupRef} className="fixed z-[100] max-h-[calc(100vh-1rem)] overflow-y-auto bg-surface-container-lowest border border-outline-variant rounded-lg shadow-soft p-4" style={popupPosition}>
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