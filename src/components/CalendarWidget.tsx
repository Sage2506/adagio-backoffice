import React from "react";

const CalendarWidget: React.FC = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  // Generar los días del mes actual
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startDay = firstDay.getDay();

  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

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
      <div className="text-center mb-2 font-semibold text-lg text-gray-700 dark:text-gray-200">
        {monthNames[month]} {year}
      </div>
      <div className="grid grid-cols-7 gap-1 text-xs">
        {["D", "L", "M", "M", "J", "V", "S"].map((d) => (
          <div key={d} className="font-bold text-gray-500 dark:text-gray-400 text-center">{d}</div>
        ))}
        {days.map((day, idx) => (
          <div key={idx} className="h-6 flex items-center justify-center text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded">
            {day ? day : ""}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarWidget;
