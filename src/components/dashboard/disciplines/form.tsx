import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { getDiscipline, postDiscipline, putDiscipline } from "../../../services/discipline";
import type { IDisciplineNew } from "../../../types/disciplines";

const emptyForm: IDisciplineNew = { name: "", is_active: true };

export default function DisciplineForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form, setForm] = useState<IDisciplineNew>(emptyForm);
  const [isLoading, setIsLoading] = useState(Boolean(id));
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    getDiscipline({ id }).then(response => {
      if (response.success) {
        setForm({ name: response.data.name, is_active: response.data.is_active });
      } else {
        setError(response.errors[0]?.msj || "Unable to load discipline.");
      }
    }).finally(() => setIsLoading(false));
  }, [id]);

  function updateField(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = event.target;
    setForm(current => ({ ...current, [name]: type === "checkbox" ? checked : value }));
  }

  async function submitForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError("");
    const response = id
      ? await putDiscipline({ id, data: { discipline: form } })
      : await postDiscipline({ data: { discipline: form } });

    if (response.success) {
      navigate("/dashboard/disciplines");
    } else {
      setError(response.errors[0]?.msj || "Unable to save discipline.");
      setIsLoading(false);
    }
  }

  return (
    <main className="w-full min-w-0 flex flex-col gap-stack-md">
      <header>
        <h1 className="text-headline-md text-on-surface">{id ? "Edit Discipline" : "Create Discipline"}</h1>
        <p className="mt-1 text-body-md font-body-md text-on-surface-variant">Manage the discipline name and availability.</p>
      </header>

      {error && <div role="alert" className="rounded-xl border border-error-container bg-error-container px-4 py-3 text-body-md text-on-error-container">{error}</div>}

      <form onSubmit={submitForm} className={`w-full max-w-2xl rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-soft flex flex-col gap-stack-md ${isLoading ? "pointer-events-none opacity-50" : ""}`}>
        <div className="flex flex-col gap-base">
          <label htmlFor="discipline-name" className="text-label-md font-label-md text-on-surface-variant">Name</label>
          <input id="discipline-name" name="name" value={form.name} onChange={updateField} required className="w-full rounded-lg border border-outline-variant bg-surface-lowest px-3 py-2.5 text-body-md font-body-md text-on-surface outline-none transition-shadow focus:border-primary focus:ring-1 focus:ring-primary" />
        </div>
        <label className="flex items-center gap-3 text-body-md font-body-md text-on-surface">
          <input type="checkbox" name="is_active" checked={form.is_active} onChange={updateField} className="size-4 accent-primary" />
          Active
        </label>
        <div className="flex flex-row-reverse gap-stack-sm">
          <button type="submit" disabled={isLoading} className="rounded-lg bg-primary px-6 py-2.5 text-label-md font-label-md text-on-primary shadow-soft transition-colors hover:bg-surface-tint disabled:cursor-not-allowed disabled:opacity-50">{id ? "Save Changes" : "Create Discipline"}</button>
          <button type="button" onClick={() => navigate("/dashboard/disciplines")} className="rounded-lg border border-outline text-label-md font-label-md text-on-surface transition-colors hover:bg-surface-container-high">Cancel</button>
        </div>
      </form>
    </main>
  );
}
