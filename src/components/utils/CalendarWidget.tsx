import { memo, useMemo } from "react";

interface CalendarWidgetProps {
  selectedDates: Date[];
  validateYear?: boolean;
  month?: number;
  year?: number;
  onMonthChange?: (month: number, year: number) => void;
}

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const CalendarWidget: React.FC<CalendarWidgetProps> = ({
  selectedDates,
  validateYear = true,
  month: propMonth,
  year: propYear,
  onMonthChange
}) => {
  const today = new Date();
  const year = propYear ?? today.getFullYear();
  const month = propMonth ?? today.getMonth();

  // Generar los días del mes actual
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startDay = firstDay.getDay();

  const handlePreviousMonth = () => {
    if (onMonthChange) {
      const newMonth = month === 0 ? 11 : month - 1;
      const newYear = month === 0 ? year - 1 : year;
      onMonthChange(newMonth, newYear);
    }
  };

  const handleNextMonth = () => {
    if (onMonthChange) {
      const newMonth = month === 11 ? 0 : month + 1;
      const newYear = month === 11 ? year + 1 : year;
      onMonthChange(newMonth, newYear);
    }
  };

  // Crear un Set con los días seleccionados para el mes actual
  const selectedDays = useMemo(() => {
    const days = new Set<number>();
    selectedDates.forEach(date => {
      const matchesMonth = date.getMonth() === month;
      const matchesYear = validateYear ? date.getFullYear() === year : true;
      if (matchesMonth && matchesYear) {
        days.add(date.getDate());
      }
    });
    return days;
  }, [selectedDates, validateYear, month, year]);

  const days = useMemo(() => {
    const calendarDays: (number | null)[] = Array(startDay).fill(null);
    for (let i = 1; i <= daysInMonth; i++) {
      calendarDays.push(i);
    }
    while (calendarDays.length % 7 !== 0) {
      calendarDays.push(null);
    }
    return calendarDays;
  }, [startDay, daysInMonth]);

  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-soft border border-outline-variant p-6">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={handlePreviousMonth}
          className="text-on-surface-variant hover:text-primary cursor-pointer"
          aria-label="Previous month"
        >
          <span className="material-symbols-outlined"
            data-icon="chevron_left">chevron_left</span>
        </button>
        <h3 className="text-center font-semibold text-lg text-on-surface">
          {monthNames[month]} {year}
        </h3>
        <button
          onClick={handleNextMonth}
          className="text-on-surface-variant hover:text-primary cursor-pointer"
          aria-label="Next month"
        >
          <span className="material-symbols-outlined"
            data-icon="chevron_right">chevron_right</span>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, idx) => (
          <div key={`day-${idx}`} className="text-label-md font-label-md text-on-surface-variant">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-body-md font-body-md">
        {days.map((day, idx) => {
          const isSelected = day && selectedDays.has(day);
          return (
            <div
              key={idx}
              className={day ? `border cursor-pointer p-2  ${isSelected
                  ? 'bg-primary-container border-primary font-bold rounded-md text-on-primary-container '
                  : 'border-outline-variant hover:bg-surface-container rounded-md '
                }` : 'p-2'}

            >
              {day ? day : ""}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default memo(CalendarWidget);
