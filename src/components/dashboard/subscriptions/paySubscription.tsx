import AutocompleteCombobox from "../../utils/autocomplete";
import { getSubscriptions } from "../../../services/subscription";
import { useState } from "react";

export default function PaySubscriptionForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<string>()

  function onOptionSelected(option: { id: string | number, label: string, value: any } | null) {
    if (option) {
      console.log("type of selected price: ", typeof option.value.plan.price);
      console.log("value of selected price: ", option.value.plan.price)
      setQuantity(option.value.plan.price)
    }
  }

  async function fetchUsers(query: string) {
    const response = await getSubscriptions({ params: `full_name=${query}` })
    if (response.success) {
      return response.data.map(subscription => ({ id: subscription.id, label: subscription.alumn.name, value: subscription }));
    }
    return []
  }

  function formSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
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
          placeholder="John" required pattern="^\d+(\.\d{1,2})?$" />
      </div>
      <button type="submit" disabled={isLoading} className={`text-white ${isLoading ? "bg-gray-400 cursor-progress" : "bg-blue-700 hover:bg-blue-800 cursor-pointer dark:bg-blue-600 dark:hover:bg-blue-700"} focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center  dark:focus:ring-blue-800`}>Submit</button>
    </form>
  );
};

