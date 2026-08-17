import { useEffect, useState } from "react";
import { Transition, TransitionChild } from "@headlessui/react";
import type { IDueDate, ISubscriptionAlumnPlanRecord } from "../../../types/subscriptions";
import DatePicker from "../../utils/datePicker";
import { putSubscriptionDueDate } from "../../../services/subscription";
import { parseDateToYYYYMMDD } from "../../../utils/stringFormatters";

interface EditDueDateModalProps {
  isOpen: boolean;
  subscription: ISubscriptionAlumnPlanRecord | null;
  onClose: (reloaded: boolean) => void;
}

export default function EditDueDateModal({ isOpen, subscription, onClose }: EditDueDateModalProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [due_date, setDueDate] = useState<Date | null>(null);

  useEffect(() => {
    if (isOpen && subscription) {
      setDueDate(new Date(subscription.due_date));
    }
  }, [isOpen, subscription]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isLoading) {
        closeDialog();
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, isLoading]);

  function closeDialog() {
    setDueDate(null);
    onClose(false);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!subscription || !due_date) return;
    const data: IDueDate = {
      due_date: parseDateToYYYYMMDD(due_date),
    };
    setIsLoading(true);
    const response = await putSubscriptionDueDate({ id: subscription.id.toString(), data });
    setIsLoading(false);
    if (response.success) {
      setDueDate(null);
      onClose(true);
    }
  }

  if (!isOpen) return null;

  return (
    <Transition show={isOpen}>
      {/* Backdrop */}
      <TransitionChild
        enter="ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="fixed inset-0 z-10 bg-on-secondary-fixed/50 backdrop-blur-[2px] transition-opacity duration-300" />
      </TransitionChild>

      {/* Modal */}
      <TransitionChild
        enter="ease-out duration-300"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={closeDialog}>
          <div className="relative z-20 flex w-[92%] max-w-md flex-col overflow-hidden rounded-xl bg-surface shadow-2xl animate-[fadeIn_0.2s_ease-out]" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between px-gutter py-4 border-b border-outline-variant">
              <h2 className="font-headline-sm text-headline-sm text-on-surface">Edit Due Date</h2>
              <button
                type="button"
                onClick={() => !isLoading && closeDialog()}
                disabled={isLoading}
                className="p-1.5 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 focus:ring-offset-surface disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined text-[20px] leading-none block">close</span>
                <span className="sr-only">Close modal</span>
              </button>
            </div>

            {/* Body */}
            <form id="edit-due-date-form" onSubmit={handleSubmit} className={`p-gutter flex flex-col gap-stack-md ${isLoading ? "opacity-50 pointer-events-none" : ""}`}>
                <p className="font-body-lg text-body-lg text-on-surface font-medium capitalize">
                  {subscription?.alumn.name} {subscription?.alumn.last_name}
                </p>

                <div className="flex flex-col gap-base">
                  <label htmlFor="due_date" className="font-label-md text-label-md text-on-surface-variant">Due Date</label>
                  <DatePicker
                    value={due_date}
                    onChange={(date) => setDueDate(date)}
                    id="due_date"
                    name="due_date"
                  />
                </div>

            </form>
            <div className="mt-auto flex flex-row-reverse justify-start gap-stack-sm border-t border-outline-variant bg-surface-container-lowest px-gutter py-4">
              <button type="submit" form="edit-due-date-form" disabled={isLoading || !due_date} className="bg-primary text-on-primary font-label-md text-label-md px-6 py-2.5 rounded-lg hover:bg-surface-tint active:bg-on-primary-fixed-variant transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface disabled:opacity-50 disabled:cursor-not-allowed">{isLoading ? "Saving..." : "Save"}</button>
              <button type="button" onClick={closeDialog} disabled={isLoading} className="bg-transparent border border-outline text-on-surface font-label-md text-label-md px-6 py-2.5 rounded-lg hover:bg-surface-container-high active:bg-surface-variant transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface disabled:opacity-50 disabled:cursor-not-allowed">Cancel</button>
            </div>
          </div>
        </div>
      </TransitionChild>
    </Transition>
  );
}
