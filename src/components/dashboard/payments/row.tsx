import type { IPaymentRecord } from "../../../types/payments";
import {formatPrettyLongDateShort } from "../../../utils/numbers";

interface IPaymentsRow {
  payment: IPaymentRecord
}

export default function PaymentsRow({payment}: IPaymentsRow) {

  return (
    <tr className={"odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 even:dark:hover:bg-gray-700 capitalize"}>
      <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white capitalize">
        {payment.id}
      </th>
      <td className="px-6 py-4 capitalize">
        {formatPrettyLongDateShort(payment.created_at)}
      </td>
      <td className="px-6 py-4 capitalize">
        {payment.quantity}
      </td>
    </tr>
  );
};