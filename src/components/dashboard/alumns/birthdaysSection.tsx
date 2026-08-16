import React, { useEffect, useState } from "react";
import { getBirthdaysOfMonth } from "../../../services/alumn";
import type { IBirthdayAlumn } from "../../../types/alumns";
import CalendarWidget from "../../CalendarWidget";

// Helper para parsear fechas como locales sin conversión UTC
const parseDateLocal = (dateString: string): Date => {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day); // month - 1 porque JavaScript usa 0-11
};

const BirthdaysSection: React.FC = () => {
  const [birthdays, setBirthdays] = useState<IBirthdayAlumn[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState<number>(today.getMonth());
  const [selectedYear, setSelectedYear] = useState<number>(today.getFullYear());

  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  useEffect(() => {
    const fetchBirthdays = async () => {
      setLoading(true);
      setError(null);
      const response = await getBirthdaysOfMonth({ month: selectedMonth });
      if (response.success) {
        // Ordenar por día del mes (1-31) de menor a mayor
        const sortedBirthdays = [...response.data].sort((a, b) => {
          const dayA = parseDateLocal(a.birth_date).getDate();
          const dayB = parseDateLocal(b.birth_date).getDate();
          return dayA - dayB;
        });
        setBirthdays(sortedBirthdays);
      } else {
        setError("Error al cargar cumpleaños");
      }
      setLoading(false);
    };

    fetchBirthdays();
  }, [selectedMonth]);

  const handleMonthChange = (month: number, year: number) => {
    setSelectedMonth(month);
    setSelectedYear(year);
  };

  // Extraer solo las fechas para el calendario
  const birthdayDates = birthdays.map(birthday => parseDateLocal(birthday.birth_date));

  if (loading) {
    return (
      <div className="bg-surface-container-lowest rounded-xl shadow-soft p-6 w-full border border-outline-variant">
        <div className="text-center text-on-surface-variant py-8">
          Cargando...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-surface-container-lowest rounded-xl shadow-soft p-6 w-full border border-outline-variant">
        <div className="text-center text-error py-8">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-stack-md">
      {/* Calendario */}
      <CalendarWidget
        selectedDates={birthdayDates}
        validateYear={false}
        month={selectedMonth}
        year={selectedYear}
        onMonthChange={handleMonthChange}
      />
      {/* Lista de cumpleaños del mes */}
      <div className="bg-surface-container-lowest rounded-xl shadow-soft p-6 w-full border border-outline-variant">
        <h3 className="text-headline-sm text-on-surface mb-4">
          Cumpleaños del mes 🎂
        </h3>
        {birthdays.length > 0 ? (
          <ul className="space-y-3 max-h-full overflow-y-auto">
            {birthdays.map((birthday, idx) => {
              const birthDate = parseDateLocal(birthday.birth_date);
              const day = birthDate.getDate();

              // Crear fecha del cumpleaños en el año actual
              const birthdayThisYear = new Date(today.getFullYear(), selectedMonth, day);
              const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
              const isPast = birthdayThisYear.getTime() < todayDate.getTime();

              return (
                <li
                  key={`${birthday.id}-${idx}`}
                  className={`text-body-md text-on-surface bg-surface-bright p-3 rounded-lg border border-outline-variant ${isPast ? 'opacity-50' : ''}`}
                >
                  <span className="text-label-md font-label-md font-bold text-primary">
                    {day} de {monthNames[selectedMonth]}
                  </span>
                  <br />
                  <p className="capitalize">{birthday.name} {birthday.last_name}</p>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-body-md text-on-surface-variant italic">
            No hay cumpleaños este mes
          </p>
        )}
      </div>
    </div>
  );
};

export default BirthdaysSection;
