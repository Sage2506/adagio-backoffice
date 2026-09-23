import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { deleteDiscipline, getDisciplines } from "../../../services/discipline";
import type { IDisciplineRecord } from "../../../types/disciplines";
import ConfirmationModal from "../../utils/confirmationModal";
import DisciplineRow from "./row";

export default function DisciplinesTable() {
  const navigate = useNavigate();
  const [disciplines, setDisciplines] = useState<IDisciplineRecord[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState<{ msj: string }[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [disciplineToDelete, setDisciplineToDelete] = useState<IDisciplineRecord>();

  useEffect(() => {
    loadDisciplines();
  }, []);

  async function loadDisciplines() {
    setIsLoading(true);
    const response = await getDisciplines();
    if (response.success) {
      setDisciplines(response.data);
      setErrors([]);
    } else {
      setErrors(response.errors);
    }
    setIsLoading(false);
  }

  const filteredDisciplines = useMemo(() => {
    const query = searchValue.trim().toLowerCase();
    return query ? disciplines.filter(discipline => discipline.name.toLowerCase().includes(query)) : disciplines;
  }, [disciplines, searchValue]);

  const handleDelete = useCallback((event: React.MouseEvent, discipline: IDisciplineRecord) => {
    event.stopPropagation();
    setDisciplineToDelete(discipline);
    setIsModalOpen(true);
  }, []);

  const handleEdit = useCallback((discipline: IDisciplineRecord) => {
    navigate(`/dashboard/disciplines/form/${discipline.id}`);
  }, [navigate]);

  async function confirmDelete(accepted: boolean) {
    setIsModalOpen(false);
    if (!accepted || !disciplineToDelete) return;

    setIsLoading(true);
    const response = await deleteDiscipline({ id: disciplineToDelete.id });
    if (response.success) {
      setDisciplines(current => current.filter(discipline => discipline.id !== disciplineToDelete.id));
      setDisciplineToDelete(undefined);
    } else {
      setErrors(response.errors);
    }
    setIsLoading(false);
  }

  return (
    <main className="w-full min-w-0 flex flex-col gap-stack-md">
      <header className="flex flex-col gap-stack-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-headline-md text-on-surface">Disciplines</h1>
          <p className="mt-1 text-body-md font-body-md text-on-surface-variant">Manage the disciplines available in the academy.</p>
        </div>
        <button type="button" onClick={() => navigate("/dashboard/disciplines/form")} className="flex items-center gap-2 self-start rounded-lg bg-primary px-6 py-2.5 text-label-md font-label-md text-on-primary shadow-soft transition-colors hover:bg-surface-tint">
          Create
          <span className="material-symbols-outlined text-[20px]">add</span>
        </button>
      </header>

      {errors.length > 0 && <div role="alert" className="rounded-xl border border-error-container bg-error-container px-4 py-3 text-body-md text-on-error-container">{errors.map(error => error.msj).join(" ")}</div>}

      <div className="flex w-full flex-col gap-stack-sm sm:flex-row sm:items-end sm:justify-between">
        <div className="w-full sm:max-w-sm">
          <label htmlFor="discipline-search" className="block text-label-md font-label-md text-on-surface-variant">Search</label>
          <input id="discipline-search" type="search" value={searchValue} onChange={event => setSearchValue(event.target.value)} placeholder="Search disciplines" className="mt-1 w-full rounded-lg border border-outline-variant bg-surface-lowest px-3 py-2.5 text-body-md font-body-md text-on-surface outline-none transition-shadow focus:border-primary focus:ring-1 focus:ring-primary" />
        </div>
        <p className="text-body-md text-on-surface-variant">{filteredDisciplines.length} disciplines</p>
      </div>

      <ConfirmationModal
        titleText="Delete Discipline"
        bodyText={`You're about to delete ${disciplineToDelete?.name}. Are you sure?`}
        confirmText="Yes"
        rejectText="No"
        isModalOpen={isModalOpen}
        onConfirmResponse={confirmDelete}
      />

      <section className="overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-outline-variant bg-surface">
                <th scope="col" className="px-6 py-4 text-table-header font-table-header uppercase tracking-wider text-on-surface-variant">ID</th>
                <th scope="col" className="px-6 py-4 text-table-header font-table-header uppercase tracking-wider text-on-surface-variant">Name</th>
                <th scope="col" className="px-6 py-4 text-table-header font-table-header uppercase tracking-wider text-on-surface-variant">Status</th>
                <th scope="col" className="px-6 py-4 text-table-header font-table-header uppercase tracking-wider text-on-surface-variant text-center">Actions</th>
              </tr>
            </thead>
            <tbody className={isLoading ? "pointer-events-none opacity-50" : "text-body-md font-body-md"}>
              {isLoading && disciplines.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-12 text-center text-body-md text-on-surface-variant">Loading...</td></tr>
              ) : filteredDisciplines.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-12 text-center text-body-md text-on-surface-variant">No disciplines found.</td></tr>
              ) : (
                filteredDisciplines.map(discipline => <DisciplineRow key={`discipline_${discipline.id}`} discipline={discipline} onEdit={handleEdit} onDelete={handleDelete} />)
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
