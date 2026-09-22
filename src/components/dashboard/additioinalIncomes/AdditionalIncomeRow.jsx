import { formatCurrencyValue } from "../../../utils/numbers";

function labelFor(value) {
  return value.replaceAll("_", " ").replace(/\b\w/g, character => character.toUpperCase());
}

export default function AdditionalIncomeRow({ income }) {
  return (
    <tr className="border-b border-outline-variant hover:bg-surface-container-low transition-colors group">
      <td className="py-4 px-6 text-on-surface-variant">
        {income.date}
      </td>
      <td className="py-4 px-6 text-on-surface">
        {income.description || "-"}
      </td>
      <td className="py-4 px-6 text-on-surface-variant capitalize">
        {labelFor(income.category)}
      </td>
      <td className="py-4 px-6 text-on-surface-variant capitalize">
        {labelFor(income.payment_method)}
      </td>
      <td className="py-4 px-6 text-right font-bold text-on-surface">
        {formatCurrencyValue(income.amount)}
      </td>
    </tr>
  );
}
