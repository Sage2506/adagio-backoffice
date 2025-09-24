import { useEffect, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import type { IDueDate, ISubscriptionAlumnPlanRecord } from "../../../types/subscriptions";
import type { IPaymentNew } from "../../../types/payments";
import { postPayment } from "../../../services/payment";
import DatePicker from "../../utils/datePicker";
import { Transition, TransitionChild } from '@headlessui/react';
import { putSubscriptionDueDate } from "../../../services/subscription";
import { parseDateToYYYYMMDD } from "../../../utils/stringFormatters";

interface RegisterSubscriptionPaymentModalProps {
  isOpen: boolean;
  onSubscriptionPaid: (successful: boolean) => void;
  subscription: ISubscriptionAlumnPlanRecord | null;
}

export default function RegisterSubscriptionPaymentModal({
  isOpen,
  onSubscriptionPaid,
  subscription,
}: RegisterSubscriptionPaymentModalProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<string>('');
  const [due_date, setDueDate] = useState<Date | null>(null);
  const [paid_at, setPaidAt] = useState<Date | null>(null);

  useEffect(() => {
    if (subscription) {
      setQuantity((subscription.plan.price - subscription.paid_amount).toString())
      setDueDate(new Date(subscription.due_date))
    }
  }, [subscription])

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isLoading) {
        onSubscriptionPaid(false);
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
  }, [isOpen, isLoading, onSubscriptionPaid]);

  function formSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    submitData();
  }

  async function submitData() {
    if (subscription) {
      const data: IPaymentNew = {
        payment: {
          alumn_id: subscription.alumn.id.toString(),
          quantity,
        },
        payable_id: subscription.id.toString(),
        payable_type: "subscription",
      }
      if (!!paid_at) {
        data.payment['paid_at'] = parseDateToYYYYMMDD(paid_at)
      }
      setIsLoading(true);
      const response = await postPayment({ data });
      if (response.success) {
        if (parseDateToYYYYMMDD(due_date) !== '' && parseDateToYYYYMMDD(due_date) !== subscription.due_date) {
          changeDueDate()
        } else {
          setIsLoading(false);
          onSubscriptionPaid(true);
        }
      } else {
        setIsLoading(false)
      }
    }
  }

  async function changeDueDate() {
    if (subscription) {
      const data: IDueDate = {
        due_date: parseDateToYYYYMMDD(due_date)
      }
      const response = await putSubscriptionDueDate({ id: subscription.id.toString(), data })
      setIsLoading(false)
      onSubscriptionPaid(true);
      if (!response.success) {
        console.log("date not updated");
      }
    }
  }

  if (!isOpen) return null;

  return (
    <Transition show={isOpen}>
      {/* Backdrop with transition */}
      <TransitionChild
        enter="ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-50 dark:bg-opacity-80 z-40"

        />
      </TransitionChild>

      {/* Modal with transition */}
      <TransitionChild
        enter="ease-out duration-300"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => onSubscriptionPaid(false)}>
          <div
            className="relative bg-white rounded-lg shadow dark:bg-gray-800 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Pagar Subscripción
              </h3>
              <button
                type="button"
                onClick={() => !isLoading && onSubscriptionPaid(false)}
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
                onSubmit={(e) => formSubmit(e)}
                className={`space-y-6 ${isLoading ? "opacity-50 pointer-events-none" : ""}`}
              >
                <p className="capitalize text-gray-900 dark:text-white">
                  {subscription?.alumn.name} {subscription?.alumn.last_name}
                </p>

                <div>
                  <label
                    htmlFor="quantity"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Quantity
                  </label>
                  <input
                    onChange={(e) => {
                      setQuantity(e.target.value);
                    }}
                    value={quantity}
                    type="number"
                    id="quantity"
                    name="quantity"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="$0.00"
                    required
                    pattern="^\d+(\.\d{1,2})?$"
                    step="0.01"
                    min="0" />
                </div>

                <div>
                  <label
                    htmlFor="due_date"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Due Date
                  </label>
                  <DatePicker
                    value={due_date}
                    onChange={(date) => setDueDate(date)}
                    id="due_date"
                    name="due_date"
                  />
                </div>
                <div>
                  <label
                    htmlFor="paid_at"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Paid Date
                  </label>
                  <DatePicker
                    placeholder="Select a paid date"
                    value={paid_at}
                    onChange={(date) => setPaidAt(date)}
                    id="paid_at"
                    name="paid_at" />
                </div>
              </form>
            </div>

            {/* Footer */}
            <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
              <button
                type="button"
                onClick={submitData}
                disabled={isLoading}
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:opacity-50 disabled:cursor-not-allowed">
                {isLoading ? "Processing..." : "Pay"}
              </button>
              <button
                type="button"
                onClick={() => onSubscriptionPaid(false)}
                disabled={isLoading}
                className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </TransitionChild>
    </Transition>
  );
}