import { Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/16/solid";
import { useEffect, useState } from "react";

interface IPaymentsModal {
  isModalOpen: boolean;
  toggleModal: Function;
  payableId: number | null;
}

export default function PaymentsModal({ isModalOpen, toggleModal, payableId }: IPaymentsModal) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    console.log("payments modal loades");

  }, [payableId]);

  return (
    <Transition show={isModalOpen}>
      {/* Backdrop with transition */}
      <Transition.Child
        enter="ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-50 dark:bg-opacity-80 z-40"
          onClick={() => toggleModal()}
        />
      </Transition.Child>

      {/* Modal with transition */}
      <Transition.Child
        enter="ease-out duration-300"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="relative bg-white rounded-lg shadow dark:bg-gray-800 w-full max-w-md"
            onClick={() => toggleModal()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Pagos de Objeto
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
      </Transition.Child>
    </Transition>
  );
};