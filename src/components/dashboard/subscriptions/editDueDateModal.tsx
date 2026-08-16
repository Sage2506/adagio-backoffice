import { useEffect, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
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
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 dark:bg-opacity-80 z-40" />
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
          <div
            className="relative bg-white rounded-lg shadow dark:bg-gray-800 w-full max-w-sm"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Edit Due Date
              </h3>
              <button
                type="button"
                onClick={() => !isLoading && closeDialog()}
                disabled={isLoading}
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <XMarkIcon className="w-4 h-4" />
                <span className="sr-only">Close modal</span>
              </button>
            </div>

            {/* Body */}
            <div className="p-4 md:p-5">
              <form
                onSubmit={handleSubmit}
                className={`space-y-6 ${isLoading ? "opacity-50 pointer-events-none" : ""}`}
              >
                <p className="capitalize text-gray-900 dark:text-white">
                  {subscription?.alumn.name} {subscription?.alumn.last_name}
                </p>

                <div>
                  <label
                    htmlFor="due_date"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Due Date
                  </label>
                  <DatePicker
                    value={due_date}
                    onChange={(date) => setDueDate(date)}
                    id="due_date"
                    name="due_date"
                  />
                </div>

                {/* Footer */}
                <div className="flex items-center pt-2 border-t border-gray-200 dark:border-gray-600">
                  <button
                    type="submit"
                    disabled={isLoading || !due_date}
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Saving..." : "Save"}
                  </button>
                  <button
                    type="button"
                    onClick={closeDialog}
                    disabled={isLoading}
                    className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </TransitionChild>
    </Transition>
  );
}
