import { memo } from "react";
import { useNavigate } from "react-router";
import type { IPlanRecord } from "../../../types/plans";
import { formatPrice } from "../../../utils/numbers";

interface PlansRowProps {
  plan: IPlanRecord;
}

function PlansRow({ plan }: PlansRowProps) {
  const navigate = useNavigate();

  return (
    <tr
      onClick={() => navigate(`/dashboard/plans/form/${plan.id}`)}
      className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 even:dark:hover:bg-gray-700"
    >
      <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
        {plan.id}
      </th>
      <td className="px-6 py-4 capitalize">{plan.name}</td>
      <td className="px-6 py-4 capitalize">{plan.subscription_duration}</td>
      <td className="px-6 py-4">{formatPrice(plan.price)}</td>
    </tr>
  );
}

export default memo(PlansRow);
