import { useEffect, useState } from "react";
import { Transition, TransitionChild } from "@headlessui/react";
import { postSubscriptionAddCredit } from "../../../services/subscription";
import type { ISubscriptionAlumnPlanRecord } from "../../../types/subscriptions";

interface RegisterSubscriptionCreditModalProps {
    isOpen: boolean;
    subscription: ISubscriptionAlumnPlanRecord | null;
    onClose: (reloaded?: boolean) => void;
    onSuccess?: () => void;
}

export default function RegisterSubscriptionCreditModal({
    isOpen,
    subscription,
    onClose,
    onSuccess,
}: RegisterSubscriptionCreditModalProps) {
    const [creditAmount, setCreditAmount] = useState<string>("");
    const [isSubmittingCredit, setIsSubmittingCredit] = useState(false);
    const [creditError, setCreditError] = useState<string | null>(null);

    useEffect(() => {
        if (!isOpen) {
            setCreditAmount("");
            setCreditError(null);
            setIsSubmittingCredit(false);
        }
    }, [isOpen]);

    async function onSubmitAddCredit(e?: React.FormEvent<HTMLFormElement>) {
        e?.preventDefault();

        if (!subscription) return;

        const amount = Number(creditAmount);
        if (!creditAmount || Number.isNaN(amount) || amount <= 0) {
            setCreditError("The amount must be greater than 0");
            return;
        }

        setIsSubmittingCredit(true);
        setCreditError(null);

        const response = await postSubscriptionAddCredit({ id: subscription.id.toString(), amount });
        setIsSubmittingCredit(false);

        if (response.success) {
            setCreditAmount("");
            onSuccess?.();
            onClose(true);
            return;
        }

        setCreditError(response.errors[0]?.msj || "Unable to apply the credit");
    }

    if (!isOpen) return null;

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
                <div className="fixed inset-0 bg-on-secondary-fixed/50 z-10 backdrop-blur-[2px] transition-opacity duration-30" />
            </TransitionChild>

            <TransitionChild
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
            >
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => !isSubmittingCredit && onClose(false)}>
                    <div className="relative z-20 w-[92%] max-w-md bg-surface rounded-xl shadow-2xl flex flex-col overflow-hidden animate-[fadeIn_0.2s_ease-out]" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between px-gutter py-4 border-b border-outline-variant">
                            <div>
                                <h2 className="font-headline-sm text-headline-sm text-on-surface">Apply credit</h2>
                            </div>
                            <button
                                type="button"
                                onClick={() => !isSubmittingCredit && onClose(false)}
                                disabled={isSubmittingCredit}
                                className="text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high p-1.5 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 focus:ring-offset-surface disabled:opacity-50"
                            >
                                <span className="material-symbols-outlined text-[20px] leading-none block">close</span>
                            </button>
                        </div>

                        <form onSubmit={onSubmitAddCredit} className={`p-gutter flex flex-col gap-stack-md ${isSubmittingCredit ? "opacity-50 pointer-events-none" : ""}`}>
                            <div>
                                <p className="font-body-lg text-body-lg text-on-surface font-medium">Enter the credit amount to apply</p>
                            </div>
                            <div className="flex flex-col gap-base">
                                <label className="font-label-md text-label-md text-on-surface-variant">Amount</label>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={creditAmount}
                                    onChange={(e) => {
                                        setCreditAmount(e.target.value);
                                        if (creditError) setCreditError(null);
                                    }}
                                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2.5 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-shadow placeholder-outline"
                                    placeholder="0.00"
                                    autoFocus
                                />
                            </div>

                            {creditError && (
                                <p className="text-sm text-error">{creditError}</p>
                            )}

                            <div className="flex justify-end gap-stack-sm mt-2">
                                <button
                                    type="button"
                                    onClick={() => !isSubmittingCredit && onClose(false)}
                                    disabled={isSubmittingCredit}
                                    className="bg-transparent border border-outline text-on-surface font-label-md text-label-md px-6 py-2.5 rounded-lg hover:bg-surface-container-high active:bg-surface-variant transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmittingCredit}
                                    className="bg-primary text-on-primary font-label-md text-label-md px-6 py-2.5 rounded-lg hover:bg-surface-tint active:bg-on-primary-fixed-variant transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {isSubmittingCredit ? "Processing..." : "Accept"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </TransitionChild>
        </Transition>
    );
}
