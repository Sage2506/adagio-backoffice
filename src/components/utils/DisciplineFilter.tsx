import { CheckIcon, ChevronDownIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { getDisciplines } from "../../services/discipline";
import type { IDisciplineRecord } from "../../types/disciplines";

interface DisciplineFilterProps {
  idPrefix: string;
}

export default function DisciplineFilter({ idPrefix }: DisciplineFilterProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [disciplines, setDisciplines] = useState<IDisciplineRecord[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>(() => searchParams.getAll("discipline_ids[]"));
  const [draftIds, setDraftIds] = useState<string[]>(() => searchParams.getAll("discipline_ids[]"));
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const searchString = searchParams.toString();

  useEffect(() => {
    getDisciplines().then(response => {
      if (response.success) setDisciplines(response.data);
    }).finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    const currentIds = new URLSearchParams(searchString).getAll("discipline_ids[]");
    setSelectedIds(currentIds);
    setDraftIds(currentIds);
  }, [searchString]);

  function applyFilter() {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("discipline_ids[]");
    draftIds.forEach(id => newParams.append("discipline_ids[]", id));
    newParams.delete("page[page]");
    setSelectedIds(draftIds);
    setIsOpen(false);
    navigate(`?${newParams.toString()}`, { replace: true });
  }

  function clearFilter() {
    setDraftIds([]);
    setSelectedIds([]);
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("discipline_ids[]");
    newParams.delete("page[page]");
    setIsOpen(false);
    navigate(`?${newParams.toString()}`, { replace: true });
  }

  function toggleDiscipline(id: string) {
    setDraftIds(current => current.includes(id) ? current.filter(currentId => currentId !== id) : [...current, id]);
  }

  const selectedNames = disciplines.filter(discipline => selectedIds.includes(discipline.id.toString())).map(discipline => discipline.name);
  const buttonLabel = selectedNames.length === 0 ? "Disciplines" : selectedNames.length <= 2 ? selectedNames.join(", ") : `${selectedNames.length} disciplines`;

  return (
    <div className="relative w-full lg:w-auto">
      <span className="block text-label-md font-label-md text-on-surface-variant">Discipline</span>
      <button type="button" onClick={() => setIsOpen(open => !open)} aria-expanded={isOpen} aria-controls={`${idPrefix}-discipline-options`} className="mt-1 flex min-h-10 w-full min-w-48 items-center justify-between gap-3 rounded-lg border border-outline-variant bg-surface-lowest px-3 py-2 text-left text-body-md font-body-md text-on-surface transition-colors hover:bg-surface-container focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary">
        <span className="truncate">{buttonLabel}</span>
        <ChevronDownIcon className={`size-4 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
      {isOpen && (
        <div id={`${idPrefix}-discipline-options`} className="absolute left-0 z-30 mt-2 w-full min-w-64 rounded-xl border border-outline-variant bg-surface-container-lowest p-3 shadow-soft">
          {isLoading ? (
            <p className="px-2 py-2 text-body-md text-on-surface-variant">Loading...</p>
          ) : disciplines.length === 0 ? (
            <p className="px-2 py-2 text-body-md text-on-surface-variant">No disciplines available.</p>
          ) : (
            <div className="max-h-60 overflow-y-auto">
              {disciplines.map(discipline => {
                const id = discipline.id.toString();
                return (
                  <label key={discipline.id} className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 text-body-md text-on-surface transition-colors hover:bg-surface-container-low">
                    <input type="checkbox" checked={draftIds.includes(id)} onChange={() => toggleDiscipline(id)} className="peer sr-only" />
                    <span className={`flex size-5 items-center justify-center rounded border ${draftIds.includes(id) ? "border-primary bg-primary text-on-primary" : "border-outline text-transparent"}`}><CheckIcon className="size-3.5" /></span>
                    <span className="flex-1">{discipline.name}</span>
                    {!discipline.is_active && <span className="text-label-md text-on-surface-variant">Inactive</span>}
                  </label>
                );
              })}
            </div>
          )}
          <div className="mt-2 flex justify-end gap-2 border-t border-outline-variant pt-3">
            <button type="button" onClick={clearFilter} className="flex size-9 items-center justify-center rounded-lg border border-outline-variant text-on-surface-variant transition-colors hover:bg-surface-container" title="Clear discipline filter"><XMarkIcon className="size-5" /><span className="sr-only">Clear discipline filter</span></button>
            <button type="button" onClick={applyFilter} className="rounded-lg bg-primary px-4 py-2 text-label-md font-label-md text-on-primary transition-colors hover:bg-surface-tint">Apply</button>
          </div>
        </div>
      )}
    </div>
  );
}
