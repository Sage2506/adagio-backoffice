import { useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Transition, TransitionChild } from '@headlessui/react';

interface ConfirmationModalProps {
  titleText?: string;
  bodyText?: string;
  confirmText?: string;
  rejectText?: string;
  isModalOpen: boolean;
  onConfirmResponse: (confirmed: boolean) => void;
}

export default function ConfirmationModal({
  titleText,
  bodyText,
  confirmText,
  rejectText,
  isModalOpen,
  onConfirmResponse
}: ConfirmationModalProps) {
  // Close modal on Escape key press
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onConfirmResponse(false);
      }
    };

    if (isModalOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen, onConfirmResponse]);

  return (
    <Transition show={isModalOpen}>
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
          onClick={() => onConfirmResponse(false)}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="relative bg-white rounded-lg shadow dark:bg-gray-800 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {titleText || "Confirm action"}
              </h3>
              <button
                type="button"
                onClick={() => onConfirmResponse(false)}
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              >
                <XMarkIcon className="w-4 h-4" />
                <span className="sr-only">Close modal</span>
              </button>
            </div>

            {/* Body */}
            <div className="p-4 md:p-5 space-y-4">
              <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                {bodyText || "You're about to perform an action, are you sure?"}
              </p>
            </div>

            {/* Footer */}
            <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
              <button
                onClick={() => onConfirmResponse(true)}
                type="button"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                {confirmText || "I accept"}
              </button>
              <button
                onClick={() => onConfirmResponse(false)}
                type="button"
                className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
              >
                {rejectText || "Cancel"}
              </button>
            </div>
          </div>
        </div>
      </TransitionChild>
    </Transition>
  );
}