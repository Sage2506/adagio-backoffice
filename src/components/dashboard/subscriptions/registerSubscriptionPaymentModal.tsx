import { useEffect, useState } from "react";
import type { ISubscriptionAlumnPlanRecord } from "../../../types/subscriptions";
import type { IPaymentNew } from "../../../types/payments";
import { postPayment } from "../../../services/payment";
import DatePicker from "../../utils/datePicker";
import { Transition, TransitionChild } from '@headlessui/react';
import { parseDateToYYYYMMDD } from "../../../utils/stringFormatters";
import { handlePriceInputChange } from "../../../utils/numbers";

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
  const [alumnFullName, setAlumnFullName] = useState<string>('');

  useEffect(() => {
    if (subscription) {
      const subscriptionPrice = subscription.custom_price ?? subscription.plan.price;
      setQuantity((subscriptionPrice - subscription.paid_amount).toString())
      setAlumnFullName(subscription.alumn.name + ' ' + subscription.alumn.last_name);
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
      setIsLoading(false);
      if (response.success) {
        resetState();
        onSubscriptionPaid(true);
      }
    }
  }

  function closeDialog() {
    onSubscriptionPaid(false);
    resetState();
  }

  function resetState() {
    setDueDate(null)
    setPaidAt(null)
    setIsLoading(false)
    setQuantity('')
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
          className="fixed inset-0 bg-on-secondary-fixed/50 z-10 backdrop-blur-[2px] transition-opacity duration-30"

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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={closeDialog}>
          <div
            className="relative z-20 w-[92%] max-w-md bg-surface rounded-xl shadow-2xl flex flex-col overflow-hidden animate-[fadeIn_0.2s_ease-out]" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between px-gutter py-4 border-b border-outline-variant">
              <h2 className="font-headline-sm text-headline-sm text-on-surface">Pagar Subscripción</h2>
              <button
                type="button"
                onClick={() => !isLoading && closeDialog()}
                disabled={isLoading}
                className="text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high p-1.5 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 focus:ring-offset-surface">
                <span className="material-symbols-outlined text-[20px] leading-none block">close</span>
              </button>
            </div>
            {/* Body */}
            <form onSubmit={(e) => formSubmit(e)} className={`p-gutter flex flex-col gap-stack-md overflow-y-auto max-h-[70vh] ${isLoading ? "opacity-50 pointer-events-none" : ""}`}>
              <div>
                <p className="font-body-lg text-body-lg text-on-surface font-medium capitalize">{alumnFullName}</p>
                {subscription?.custom_price != null && <p className="text-sm text-on-surface-variant">Precio personalizado: S/. {subscription.custom_price.toFixed(2)}</p>}
              </div>
              <div className="flex flex-col gap-base">
                <label className="font-label-md text-label-md text-on-surface-variant">Quantity</label>
                <div className="relative">
                  <input
                    onChange={(e) => {
                      handlePriceInputChange(e, setQuantity)
                    }}
                    value={quantity}
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2.5 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-shadow placeholder-outline"
                    id="quantity" placeholder="0" type="number" />
                </div>
              </div>
              <div className="flex flex-col gap-base">
                <label className="font-label-md text-label-md text-on-surface-variant">Paid Date</label>
                <DatePicker
                  placeholder="Select a paid date"
                  value={paid_at}
                  onChange={(date) => setPaidAt(date)}
                  id="paid_at"
                  name="paid_at" />
              </div>
              <div className="flex flex-col gap-base">
                <label className="font-label-md text-label-md text-on-surface-variant">Due Date</label>
                <DatePicker
                  value={due_date}
                  onChange={(date) => setDueDate(date)}
                  id="due_date"
                  name="due_date"
                />
              </div>
            </form>
            <div
              className="px-gutter py-4 bg-surface-container-lowest border-t border-outline-variant flex flex-row-reverse justify-start gap-stack-sm mt-auto">
              <button
                onClick={submitData}
                disabled={isLoading}

                className={`bg-primary text-on-primary font-label-md text-label-md px-6 py-2.5 rounded-lg hover:bg-surface-tint active:bg-on-primary-fixed-variant transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface`}>
                {isLoading ? "Processing..." : "Pay"}
              </button>
              <button
                onClick={closeDialog}
                disabled={isLoading}
                className="bg-transparent border border-outline text-on-surface font-label-md text-label-md px-6 py-2.5 rounded-lg hover:bg-surface-container-high active:bg-surface-variant transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </TransitionChild>
    </Transition>
  );
}