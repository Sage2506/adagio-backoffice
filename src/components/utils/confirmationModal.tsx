import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "flowbite-react";

interface ConfirmationModalProps {
  titleText?: string,
  bodyText?: string,
  confirmText?: string
  rejectText?: string
  openModal: boolean;
  onConfirmResponse: (confirmed: boolean) => void;
}

export default function ConfirmationModal({ titleText, bodyText, confirmText, rejectText, openModal, onConfirmResponse }: ConfirmationModalProps) {
  return (
    <Modal show={openModal} size="md" onClose={() => onConfirmResponse(false)} dismissible>
      <ModalHeader>{titleText || "Confirm action"}</ModalHeader>
      <ModalBody>
        <div className="space-y-6">
          <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
            {bodyText || "You're about to perform an action, are you sure?"}
          </p>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button onClick={() => onConfirmResponse(true)}>{confirmText || "I accept"}</Button>
        <Button color="alternative" onClick={() => onConfirmResponse(false)}>
          {rejectText || "Cancel"}
        </Button>
      </ModalFooter>
    </Modal>
  );
};