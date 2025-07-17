import { useEffect, useState } from "react";
import type { ISubscriptionAlumnPlanRecord } from "../../../types/subscriptions";
import { formatPrettyDateShort } from "../../../services/numbers";

interface ISubscriptionRow {
  subscription: ISubscriptionAlumnPlanRecord
  onClick: (e: React.MouseEvent<HTMLElement>) => void;
}

const paidStatusStyle = "odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 even:dark:hover:bg-gray-700";
const pendingStatusStyle = "odd:bg-yellow-50 even:bg-yellow-100 border-b border-yellow-200 hover:bg-yellow-200 odd:dark:bg-yellow-900 even:dark:bg-yellow-800 dark:border-yellow-700 dark:hover:bg-yellow-600 even:dark:hover:bg-yellow-700";
const lateStatusStyle = "odd:bg-red-100 even:bg-red-200 border-b border-red-300 hover:bg-red-200 odd:dark:bg-red-900 even:dark:bg-red-800 dark:border-red-700 dark:hover:bg-red-600 even:dark:hover:bg-red-700";
export default function SubscripcionsRow({ subscription, onClick }: ISubscriptionRow) {
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

  return (
    <tr key={`subscription_${subscription.id}`} onClick={(e) => onClick(e)} className={`${dateStatusStyle}`}>
      <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white capitalize">
        {subscription.id}
      </th>
      <td className="px-6 py-4 capitalize">
        {subscription.alumn.name}
      </td>
      <td className="px-6 py-4 capitalize">
        {subscription.alumn.last_name}
      </td>
      <td className="px-6 py-4 capitalize">
        {subscription.plan.name}
      </td>
      <td className="px-6 py-4">
        {formatPrettyDateShort(subscription.last_payment_date)}
      </td>
      <td className="px-6 py-4">
        {formatPrettyDateShort(subscription.due_date)}
      </td>
    </tr >
  );
};