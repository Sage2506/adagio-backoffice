import { formatCurrencyValue } from "../../../utils/numbers";

function labelFor(value : string) {
  return value.replaceAll("_", " ").replace(/\b\w/g, character => character.toUpperCase());
}

export default function ExpenseRow({ expense }: { expense: { date: string; description: string | null; category: string; payment_method: string; amount: number } }) {
  return (
    <tr className="border-b border-outline-variant hover:bg-surface-container-low transition-colors group">
      <td className="py-4 px-6 text-on-surface-variant">
        {expense.date}
      </td>
      <td className="py-4 px-6 text-on-surface">
        {expense.description || "-"}
      </td>
      <td className="py-4 px-6 text-on-surface-variant capitalize">
        {labelFor(expense.category)}
      </td>
      <td className="py-4 px-6 text-on-surface-variant capitalize">
        {labelFor(expense.payment_method)}
      </td>
      <td className="py-4 px-6 text-right font-bold text-on-surface">
        {formatCurrencyValue(expense.amount)}
      </td>
    </tr>
  );
}
