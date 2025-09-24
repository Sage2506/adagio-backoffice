import { useEffect, useState } from "react";
import type { ISubscriptionAlumnPlanRecord } from "../../../types/subscriptions";
import { formatPrettyDateShort } from "../../../utils/numbers";
import { PowerIcon } from "@heroicons/react/24/solid";

interface ISubscriptionRow {
  onClick: (e: React.MouseEvent<HTMLElement>) => void;
  showPaymentModal: Function;
  subscription: ISubscriptionAlumnPlanRecord;
  suspendSubscription: Function;
}

const paidStatusStyle = "odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 even:dark:hover:bg-gray-700";
const pendingStatusStyle = "odd:bg-yellow-50 even:bg-yellow-100 border-b border-yellow-200 hover:bg-yellow-200 odd:dark:bg-yellow-900 even:dark:bg-yellow-800 dark:border-yellow-700 dark:hover:bg-yellow-600 even:dark:hover:bg-yellow-700";
const lateStatusStyle = "odd:bg-red-100 even:bg-red-200 border-b border-red-300 hover:bg-red-200 odd:dark:bg-red-900 even:dark:bg-red-800 dark:border-red-700 dark:hover:bg-red-600 even:dark:hover:bg-red-700";
export default function SubscriptionsRow({ subscription, onClick, showPaymentModal, suspendSubscription }: ISubscriptionRow) {
  const [dateStatusStyle, setDateStatusStyle] = useState<string>(paidStatusStyle)
  useEffect(() => {
    calculatePaymentStatus()
  }, []);

  function calculatePaymentStatus() {
    const today = new Date();
    const dueDate = new Date(subscription.due_date)
    const dueDatePlusFive = new Date(dueDate)
    dueDate.setDate(dueDatePlusFive.getDate() + 5)
    if (today > dueDatePlusFive) { // hoy es despues del due date
      setDateStatusStyle(lateStatusStyle)
    } else if (today > dueDate) {
      setDateStatusStyle(pendingStatusStyle)
    } else {
      setDateStatusStyle(paidStatusStyle)
    }
  }

  function onShowPaymentsModal(e: React.MouseEvent<HTMLElement>) {
    e.stopPropagation();
    showPaymentModal(subscription)
  }

  function onSuspendSubsctiption(e: React.MouseEvent<HTMLElement>) {
    e.stopPropagation();
    suspendSubscription(subscription);
  }

  return (
    <tr key={`subscription_${subscription.id}`} onClick={(e) => onClick(e)} className={`${dateStatusStyle}`}>
      <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white capitalize">
        {subscription.id}
      </th>
      <td className="px-6 py-4 capitalize">
        {subscription.alumn.name + ' ' + subscription.alumn.last_name}
      </td>
      <td className="px-6 py-4 capitalize">
        {subscription.plan.name}
      </td>
      <td className="px-6 py-4">
        <button className="rounded-xs shadow-lg p-0.5" onClick={(e) => onShowPaymentsModal(e)}>
          <p className="cursor-pointer hover:font-bold">
            {subscription.last_payment_date ? formatPrettyDateShort(subscription.last_payment_date) : "No payments yet"}
          </p>
        </button>
      </td>
      <td className="px-6 py-4">
        {formatPrettyDateShort(subscription.due_date)}
      </td>
      <td className="px-6 py-4">
        <div>
          <button
            type="button"
            className={`
        p-2 rounded-md transition-all duration-150 ease-in-out
        ${subscription.status === "active"
                ? 'bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700'
                : 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600'
              }
        border border-transparent hover:border-opacity-30
        ${subscription.status === "active" ? 'hover:border-green-300' : 'hover:border-gray-300'}
        focus:outline-none focus:ring-1 focus:ring-opacity-50
        ${subscription.status === "active" ? 'focus:ring-green-400' : 'focus:ring-gray-400'}
      `}
            onClick={(e) => { onSuspendSubsctiption(e) }}
          >
            <PowerIcon className="w-5 h-5" />
          </button>
        </div>
      </td>
    </tr >
  );
};