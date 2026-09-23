import { memo, useEffect, useState } from "react";
import { Transition, TransitionChild } from "@headlessui/react";
import api from "../../../services/api";

interface NewAdditionalIncomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
  onError: (message: string) => void;
}

const categories = ["space_rental", "events", "initial_balance", "other"];
const paymentMethods = ["cash", "transfer", "card"];
const emptyForm = { amount: "", date: "", description: "", category: "space_rental", payment_method: "cash" };

function labelFor(value: string) {
  return value.replaceAll("_", " ").replace(/\b\w/g, character => character.toUpperCase());
}

function getRequestErrorMessage(error: unknown) {
  if (typeof error !== "object" || error === null || !("response" in error)) {
    return "Unable to create additional income.";
  }

  const response = error.response;
  if (typeof response !== "object" || response === null || !("data" in response)) {
    return "Unable to create additional income.";
  }

  const data = response.data;
  if (typeof data !== "object" || data === null) return "Unable to create additional income.";

  if ("errors" in data && typeof data.errors === "object" && data.errors !== null) {
    return Object.values(data.errors).flat().join(" ");
  }

  return "error" in data && typeof data.error === "string" ? data.error : "Unable to create additional income.";
}

function NewAdditionalIncomeModal({ isOpen, onClose, onCreated, onError }: NewAdditionalIncomeModalProps) {
  const [form, setForm] = useState(emptyForm);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isSaving) onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, isSaving, onClose]);

  function updateField(event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = event.target;
    setForm(current => ({ ...current, [name]: value }));
  }

  async function submitIncome(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    try {
      await api.post("/additional_incomes", { additional_income: { ...form, amount: Number(form.amount) } });
      setForm(emptyForm);
      onCreated();
      onClose();
    } catch (error: unknown) {
      onError(getRequestErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Transition show={isOpen}>
      <TransitionChild
        enter="ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="fixed inset-0 bg-on-secondary-fixed/50 z-10 backdrop-blur-[2px] transition-opacity duration-300" />
      </TransitionChild>

      <TransitionChild
        enter="ease-out duration-300"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => !isSaving && onClose()}>
          <div className="relative z-20 w-[92%] max-w-md bg-surface rounded-xl shadow-2xl flex flex-col overflow-hidden animate-[fadeIn_0.2s_ease-out]" onClick={event => event.stopPropagation()}>
            <div className="flex items-center justify-between px-gutter py-4 border-b border-outline-variant">
              <h2 className="font-headline-sm text-headline-sm text-on-surface">New Additional Income</h2>
              <button
                type="button"
                onClick={onClose}
                disabled={isSaving}
                aria-label="Close"
                className="text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high p-1.5 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 focus:ring-offset-surface"
              >
                <span className="material-symbols-outlined text-[20px] leading-none block">close</span>
              </button>
            </div>

            <form id="new-additional-income-form" onSubmit={submitIncome} className={`p-gutter flex flex-col gap-stack-md overflow-y-auto max-h-[70vh] ${isSaving ? "opacity-50 pointer-events-none" : ""}`}>
              <div className="flex flex-col gap-base">
                <label htmlFor="additional_income_amount" className="font-label-md text-label-md text-on-surface-variant">Amount</label>
                <input id="additional_income_amount" required min="0.01" step="0.01" type="number" name="amount" value={form.amount} onChange={updateField} className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2.5 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-shadow placeholder-outline" />
              </div>
              <div className="flex flex-col gap-base">
                <label htmlFor="additional_income_date" className="font-label-md text-label-md text-on-surface-variant">Date</label>
                <input id="additional_income_date" required type="date" name="date" value={form.date} onChange={updateField} className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2.5 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-shadow" />
              </div>
              <div className="flex flex-col gap-base">
                <label htmlFor="additional_income_description" className="font-label-md text-label-md text-on-surface-variant">Description</label>
                <input id="additional_income_description" required type="text" name="description" value={form.description} onChange={updateField} className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2.5 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-shadow" />
              </div>
              <div className="flex flex-col gap-base">
                <label htmlFor="additional_income_category" className="font-label-md text-label-md text-on-surface-variant">Category</label>
                <select id="additional_income_category" name="category" value={form.category} onChange={updateField} className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2.5 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-shadow">
                  {categories.map(category => <option key={category} value={category}>{labelFor(category)}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-base">
                <label htmlFor="additional_income_payment_method" className="font-label-md text-label-md text-on-surface-variant">Payment Method</label>
                <select id="additional_income_payment_method" name="payment_method" value={form.payment_method} onChange={updateField} className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2.5 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-shadow">
                  {paymentMethods.map(method => <option key={method} value={method}>{labelFor(method)}</option>)}
                </select>
              </div>
            </form>

            <div className="px-gutter py-4 bg-surface-container-lowest border-t border-outline-variant flex flex-row-reverse justify-start gap-stack-sm mt-auto">
              <button type="submit" form="new-additional-income-form" disabled={isSaving} className="bg-primary text-on-primary font-label-md text-label-md px-6 py-2.5 rounded-lg hover:bg-surface-tint active:bg-on-primary-fixed-variant transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface disabled:cursor-not-allowed disabled:opacity-50">
                {isSaving ? "Saving..." : "Save"}
              </button>
              <button type="button" onClick={onClose} disabled={isSaving} className="bg-transparent border border-outline text-on-surface font-label-md text-label-md px-6 py-2.5 rounded-lg hover:bg-surface-container-high active:bg-surface-variant transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </TransitionChild>
    </Transition>
  );
}

export default memo(NewAdditionalIncomeModal);
