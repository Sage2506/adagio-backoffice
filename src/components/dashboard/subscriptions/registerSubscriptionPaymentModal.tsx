import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "flowbite-react";
import { useEffect, useState } from "react";
import type { ISubscriptionAlumnPlanRecord } from "../../../types/subscriptions";
import type { IPaymentNew } from "../../../types/payments";
import { postPayment } from "../../../services/payment";

interface RegisterSubscriptionPaymentModalProps {
  isModalOpen: boolean
  onSubscriptionPaid: (successful: boolean) => void;
  subscription: ISubscriptionAlumnPlanRecord
}

export default function RegisterSubscriptionPaymentModal({ isModalOpen, onSubscriptionPaid, subscription }: RegisterSubscriptionPaymentModalProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<string>('')

  useEffect(() => {
    setQuantity((subscription.plan.price - subscription.paid_amount).toString())
  }, [])
  function formSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    submitData();
  }

  function submitData() {
    const data: IPaymentNew = {
      payment: {
        alumn_id: subscription.alumn.id.toString(),
        quantity
      },
      payable_type: "subscription",
      payable_id: subscription.id.toString()
    }
    registerPayment(data);
  }

  async function registerPayment(data: IPaymentNew) {
    setIsLoading(true)
    const response = await postPayment({ data })
    if (response.success) {
      setIsLoading(false);
      onSubscriptionPaid(true);
    }
  }

  return (
    <Modal show={isModalOpen} onClose={() => onSubscriptionPaid(false)} dismissible>
      <ModalHeader>Pagar Subscripcion</ModalHeader>
      <ModalBody>
        <form onSubmit={e => formSubmit(e)} className={`py-6 px-6 space-y-6 ${isLoading ? 'opacity-50 pointer-events-none' : ''}`} >
          <p className="capitalize">{subscription.alumn.name} {subscription.alumn.last_name}</p>
          <div>
            <label htmlFor="quantity" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Quantity</label>
            <input onChange={(e) => { setQuantity(e.target.value) }} value={quantity} type="number" id="quantity" name="quantity"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="$ 0.00" required pattern="^\d+(\.\d{1,2})?$" />
          </div>
        </form>
      </ModalBody>
      <ModalFooter>
        <Button type="button" disabled={isLoading} onClick={() => submitData()}>Pay</Button>
        <Button type="button" color="alternative" disabled={isLoading} onClick={() => onSubscriptionPaid(false)}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};