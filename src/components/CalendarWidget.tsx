import React from "react";

interface CalendarWidgetProps {
  selectedDates: Date[];
  validateYear?: boolean;
  month?: number;
  year?: number;
  onMonthChange?: (month: number, year: number) => void;
}

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

  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

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
  const selectedDays = new Set<number>();
  selectedDates.forEach(date => {
    const matchesMonth = date.getMonth() === month;
    const matchesYear = validateYear ? date.getFullYear() === year : true;
    if (matchesMonth && matchesYear) {
      selectedDays.add(date.getDate());
    }
  });

  let days: (number | null)[] = Array(startDay).fill(null);
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  // Rellenar la última semana si es necesario
  while (days.length % 7 !== 0) {
    days.push(null);
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg shadow-lg p-4 w-full border border-gray-300 dark:border-gray-600">
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={handlePreviousMonth}
          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
          aria-label="Mes anterior"
        >
          <svg className="w-5 h-5 text-gray-700 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="text-center font-semibold text-lg text-gray-700 dark:text-gray-200">
          {monthNames[month]} {year}
        </div>
        <button
          onClick={handleNextMonth}
          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
          aria-label="Mes siguiente"
        >
          <svg className="w-5 h-5 text-gray-700 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-xs">
        {["D", "L", "M", "M", "J", "V", "S"].map((d, idx) => (
          <div key={`day-${idx}`} className="font-bold text-gray-500 dark:text-gray-400 text-center">{d}</div>
        ))}
        {days.map((day, idx) => {
          const isSelected = day && selectedDays.has(day);
          return (
            <div
              key={idx}
              className={`h-6 flex items-center justify-center text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded ${
                isSelected
                  ? 'bg-pink-300 dark:bg-pink-600 font-bold border-pink-500'
                  : 'bg-white dark:bg-gray-800'
              }`}
            >
              {day ? day : ""}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarWidget;
