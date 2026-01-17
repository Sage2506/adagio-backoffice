import { Transition, TransitionChild } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/16/solid";
import { useEffect, useState } from "react";
import type { IPaymentRecord } from "../../../types/payments";
import { getPayments } from "../../../services/payment";
import { buildSnakeCaseParams } from "../../../utils/stringFormatters";
import PaymentsRow from "./row";

interface IPaymentsModal {
  isOpen: boolean;
  payableId: number | null;
  payableType: string;
  toggleModal: Function;
}

export default function PaymentsModal({ isOpen, toggleModal, payableId, payableType }: IPaymentsModal) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [payments, setPayments] = useState<IPaymentRecord[]>([])

  useEffect(() => {
    if (!isOpen || payableId === null) {
      setPayments([]);
      return;
    }
    fetchPayments();
  }, [isOpen, payableId]);

  async function fetchPayments() {
    if (!!payableId) {
      setIsLoading(true);
      getPayments({ params: buildSnakeCaseParams({ payableType, payableId }) }).then(response => {
        if (response.success) {
          setPayments(response.data);
        }
      }).finally(() => {
        setIsLoading(false);
      })
    }
  }

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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => toggleModal()}>
          <div
            className="relative bg-white rounded-lg shadow dark:bg-gray-800 w-full max-w-md"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Lista de pagos
              </h3>
              <button
                type="button"
                onClick={() => toggleModal()}
                disabled={isLoading}
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <XMarkIcon className="w-4 h-4" />
                <span className="sr-only">Close modal</span>
              </button>
            </div>

            {/* Body */}
            <div className="p-4 md:p-5">
              <table className="w-full">
                <thead>
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      ID
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className={isLoading ? "opacity-50 pointer-events-none" : ""}>
                  {isLoading && payments.length === 0 ? (
                    <tr>
                      <td colSpan={3} style={{ padding: 0, border: 'none' }}>
                        <div className="flex items-center justify-center" style={{ minHeight: '60vh' }}>
                          <span className="text-lg text-gray-500">Loading...</span>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    payments.map(payment =>
                      <PaymentsRow key={`payment_${payment.id}`} payment={payment} />
                    )
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
              <button
                type="button"
                onClick={() => toggleModal()}
                disabled={isLoading}
                className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </TransitionChild>
    </Transition>
  );
};