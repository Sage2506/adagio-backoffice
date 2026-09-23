import { memo } from "react";
import { BanknotesIcon, CreditCardIcon, EyeIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router";
import type { IOrderRecord } from "../../../types/orders";
import { formatPrettyLongDateShort, formatPrice } from "../../../utils/numbers";

const statusStyles = {
  pending: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
  partial: "bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200",
  paid: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200"
};

interface OrdersRowProps {
  order: IOrderRecord;
}

function OrdersRow({ order }: OrdersRowProps) {
  const navigate = useNavigate();

  return (
    <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 even:dark:hover:bg-gray-700">
      <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
        <span className="block">{order.alumn.name} {order.alumn.last_name}</span>
        <span className="block text-xs font-normal text-gray-500">#{order.id}</span>
      </th>
      <td className="px-6 py-4">{formatPrice(order.total)}</td>
      <td className="px-6 py-4">{formatPrice(order.paid_amount)}</td>
      <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{formatPrice(order.remaining_balance)}</td>
      <td className="px-6 py-4">
        <span className={`inline-flex px-2.5 py-1 text-xs font-semibold capitalize ${statusStyles[order.status]}`}>
          {order.status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">{formatPrettyLongDateShort(order.created_at)}</td>
      <td className="px-6 py-4">
        <div className="flex justify-end gap-1">
          <button type="button" onClick={() => navigate(`/dashboard/orders/${order.id}`)} className="p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white" title="View order detail" aria-label={`View order ${order.id} detail`}>
            <EyeIcon className="h-5 w-5" />
          </button>
          <button type="button" onClick={() => navigate(`/dashboard/orders/${order.id}#payments`)} className="p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white" title="View payments" aria-label={`View order ${order.id} payments`}>
            <BanknotesIcon className="h-5 w-5" />
          </button>
          <button type="button" disabled={order.status === "paid"} onClick={() => navigate(`/dashboard/orders/${order.id}#payment-form`)} className="p-2 text-blue-600 hover:bg-blue-50 hover:text-blue-800 disabled:cursor-not-allowed disabled:text-gray-300 dark:text-blue-400 dark:hover:bg-gray-700 dark:disabled:text-gray-600" title={order.status === "paid" ? "Order is paid" : "Register payment"} aria-label={`Register payment for order ${order.id}`}>
            <CreditCardIcon className="h-5 w-5" />
          </button>
        </div>
      </td>
    </tr>
  );
}

export default memo(OrdersRow);
