import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { getPlan, postPlan, putPlan } from "../../../services/plan";
import type { IPlanNew } from "../../../types/plans";
import { getDisciplines } from "../../../services/discipline";
import type { IDisciplineRecord } from "../../../types/disciplines";
import { handlePriceInputChange } from "../../../utils/numbers";
import { RectangleStackIcon } from "@heroicons/react/24/outline";

export default function PlanForm() {
  const navigate = useNavigate()
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [name, setName] = useState<string>("")
  const [price, setPrice] = useState<string>("")
  const [subscription_duration, setSubscriptionDuration] = useState<string>("")
  const [tolerance_days, setToleranceDays] = useState<string>("")
  const [disciplines, setDisciplines] = useState<IDisciplineRecord[]>([]);
  const [selectedDisciplineIds, setSelectedDisciplineIds] = useState<string[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    loadFormData()
  }, [id]);

  async function loadFormData() {
    setIsLoading(true);
    setError("");
    const disciplinesResponse = await getDisciplines();
    if (disciplinesResponse.success) {
      setDisciplines(disciplinesResponse.data);
    } else {
      setError(disciplinesResponse.errors[0]?.msj || "Unable to load disciplines.");
    }

    if (id) {
      const response = await getPlan({ id });
      if (response.success) {
        const { name, price, subscription_duration, tolerance_days, disciplines: planDisciplines } = response.data
        setName(name);
        setPrice(price.toString());
        setSubscriptionDuration(subscription_duration.toString());
        setToleranceDays(tolerance_days.toString());
        setSelectedDisciplineIds((planDisciplines ?? []).map(discipline => discipline.id.toString()));
      } else {
        setError(response.errors[0]?.msj || "Unable to load plan.");
      }
    }
    setIsLoading(false);
  }

  function formSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (selectedDisciplineIds.length === 0) {
      setError("Select at least one discipline.");
      return;
    }
    const data: { plan: IPlanNew } = {
      plan: {
        name, price, tolerance_days, subscription_duration, discipline_ids: selectedDisciplineIds
      }
    }

    updateCreatePlan({ data });
  }

  async function updateCreatePlan(args: { data: { plan: IPlanNew } }) {
    setIsLoading(true)
    const { data } = args
    const response = await (id ? putPlan({ id, data }) : postPlan({ data }))
    if (response.success) {
      setIsLoading(false)
      if (id) {
        const { name, price, subscription_duration, tolerance_days } = response.data
        setName(name)
        setPrice(price.toString())
        setSubscriptionDuration(subscription_duration.toString())
        setToleranceDays(tolerance_days.toString())
        setSelectedDisciplineIds((response.data.disciplines ?? []).map(discipline => discipline.id.toString()));
      } else {
        navigate('/dashboard/plans')
      }
    } else {
      setError(response.errors[0]?.msj || "Unable to save plan.");
      setIsLoading(false);
    }
  }
  const fieldClass = "w-full px-4 py-2.5 rounded-lg border border-outline-variant bg-surface-lowest text-on-surface focus:ring-2 focus:ring-primary focus:border-primary transition-all font-body-md outline-none";
  const labelClass = "block text-label-md font-label-md text-on-surface-variant";

  return (
    <form onSubmit={event => formSubmit(event)} className={`w-full min-w-0 flex flex-col gap-stack-md ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}>
      <header className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-headline-lg text-on-surface">{id ? 'Edit Plan' : 'Create Plan'}</h1>
          <p className="text-body-md font-body-md text-on-surface-variant mt-1">{id ? name : 'Configure a new subscription plan.'}</p>
        </div>
        <button type="submit" disabled={isLoading || selectedDisciplineIds.length === 0} className={`px-6 py-2 rounded-lg bg-primary text-on-primary font-label-md text-label-md hover:bg-surface-tint transition-colors shadow-soft ${isLoading || selectedDisciplineIds.length === 0 ? 'cursor-not-allowed opacity-50' : ''}`}>{id ? 'Save Changes' : 'Create Plan'}</button>
      </header>

      {error && <div role="alert" className="rounded-xl border border-error-container bg-error-container px-4 py-3 text-body-md text-on-error-container">{error}</div>}

      <section className="w-full max-w-3xl bg-surface-lowest rounded-xl shadow-soft border border-surface-variant p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-surface-variant">
          <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary flex items-center justify-center"><RectangleStackIcon className="w-5 h-5" /></div>
          <h2 className="text-headline-md text-on-surface">Plan Details</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-stack-md">
          <div className="space-y-2 md:col-span-2">
            <label htmlFor="name" className={labelClass}>Name</label>
            <input onChange={e => setName(e.target.value)} value={name} type="text" id="name" name="name" className={fieldClass} placeholder="Ballet" required />
          </div>
          <div className="space-y-2">
            <label htmlFor="price" className={labelClass}>Price</label>
            <input onChange={e => handlePriceInputChange(e, setPrice)} value={price} type="text" id="price" name="price" className={fieldClass} placeholder="99.9" required />
          </div>
          <div className="space-y-2">
            <label htmlFor="subscription_duration" className={labelClass}>Duration</label>
            <input onChange={e => setSubscriptionDuration(e.target.value)} value={subscription_duration} type="text" id="subscription_duration" name="subscription_duration" className={fieldClass} placeholder="30 days" pattern="^\d+$" required />
          </div>
          <div className="space-y-2">
            <label htmlFor="tolerance_days" className={labelClass}>Tolerance Days</label>
            <input onChange={e => setToleranceDays(e.target.value)} value={tolerance_days} type="text" id="tolerance_days" name="tolerance_days" className={fieldClass} placeholder="5 days" pattern="^\d+$" required />
          </div>
        </div>
      </section>

      <section className="w-full max-w-3xl bg-surface-lowest rounded-xl shadow-soft border border-surface-variant p-6 sm:p-8">
        <div className="mb-6 border-b border-surface-variant pb-4">
          <h2 className="text-headline-md text-on-surface">Disciplines</h2>
          <p className="mt-1 text-body-md font-body-md text-on-surface-variant">Select at least one discipline for this plan.</p>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {disciplines.map(discipline => (
            <label key={discipline.id} className="flex items-center gap-3 rounded-lg border border-outline-variant p-3 text-body-md text-on-surface transition-colors hover:bg-surface-container-low">
              <input
                type="checkbox"
                checked={selectedDisciplineIds.includes(discipline.id.toString())}
                onChange={event => setSelectedDisciplineIds(current => event.target.checked
                  ? [...current, discipline.id.toString()]
                  : current.filter(idValue => idValue !== discipline.id.toString()))}
                className="size-4 accent-primary"
              />
              <span>{discipline.name}</span>
            </label>
          ))}
        </div>
        {disciplines.length === 0 && <p className="text-body-md text-on-surface-variant">No active disciplines are available.</p>}
      </section>
    </form>
  );
};