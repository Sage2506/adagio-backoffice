import AutocompleteCombobox from "../../utils/autocomplete";
import { getSubscriptions } from "../../../services/subscription";
import { useState } from "react";
import type { IPaymentAlumnPlan, IPaymentNew } from "../../../types/payments";
import { Datepicker } from "flowbite-react";
import { postPayment } from "../../../services/payment";

export default function PaySubscriptionForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [subscriptionId, setSubscriptionId] = useState<number>(0)
  const [alumn_id, setAlumnId] = useState<string>('')
  const [quantity, setQuantity] = useState<string>('')
  const [created_at, setCreatedAt] = useState<string>((new Date()).toString())

  function onOptionSelected(option: { id: string | number, label: string, value: IPaymentAlumnPlan } | null) {
    if (option) {
      setQuantity(option.value.plan.price.toString())
      setSubscriptionId(option.value.id)
      setAlumnId(option.value.alumn_id.toString())
    }
  }

  async function fetchUsers(query: string) {
    const response = await getSubscriptions({ params: `full_name=${query}` })
    if (response.success) {
      return response.data.map(subscription => ({ id: subscription.id, label: subscription.alumn.name + ' ' + subscription.alumn.last_name, value: subscription }));
    }
    return []
  }

  function formSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data: IPaymentNew = {
      payment: {
        alumn_id,
        quantity,
        created_at
      },
      payable_type: "subscription",
      payable_id: subscriptionId.toString()
    }
    createPayment(data)
  }

  async function createPayment(data: IPaymentNew) {
    const response = await postPayment({ data })
    if (response.success) {
      console.log("Success: ", response);
      setAlumnId('')
      setQuantity('')
      setSubscriptionId(0)
    }
  }

  return (
    <form onSubmit={e => formSubmit(e)} className={`py-6 px-6 space-y-6 ${isLoading ? 'opacity-50 pointer-events-none' : ''}`} >
      <div>
        <p>
          Subscription
        </p>
        <AutocompleteCombobox
          fetchOptions={fetchUsers}
          onSelect={(option) => onOptionSelected(option)}
          placeholder="Search users..."
        />
      </div>
      <div>
        <label htmlFor="quantity" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Quantity</label>
        <input onChange={(e) => { setQuantity(e.target.value) }} value={quantity} type="number" id="quantity" name="quantity"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="0.00" required pattern="^\d+(\.\d{1,2})?$" />
      </div>
      <div>
        <label htmlFor="created_at" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Created At</label>
        <Datepicker onChange={(value) => { setCreatedAt(value?.toString() || "") }} value={new Date(created_at)} id="created_at" name="created_at" />
      </div>
      <button type="submit" disabled={isLoading} className={`text-white ${isLoading ? "bg-gray-400 cursor-progress" : "bg-blue-700 hover:bg-blue-800 cursor-pointer dark:bg-blue-600 dark:hover:bg-blue-700"} focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center  dark:focus:ring-blue-800`}>Submit</button>
    </form>
  );
};