import AutocompleteCombobox from "../../utils/autocomplete";
import { getSubscriptions } from "../../../services/subscription";

export default function PaySubscriptionForm() {

  function onOptionSelected(option: { id: string | number, label: string } | null) {
    console.log("option object: ", option);
  }

  async function fetchUsers(query: string) {
    const response = await getSubscriptions({ params: `full_name=${query}` })
    if (response.success) {
      return response.data.map(subscription => ({ id: subscription.id, label: subscription.alumn.name, value: subscription }));
    }
    return []
  }
  return (
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
  );
};

