import { useEffect, useState } from "react";
import { ArrowLeftIcon, BanknotesIcon, CheckCircleIcon, CreditCardIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { useNavigate, useParams } from "react-router";
import { getOrder } from "../../../services/order";
import { postPayment } from "../../../services/payment";
import type { IOrderRecord } from "../../../types/orders";
import type { IPaymentNew } from "../../../types/payments";
import { formatPrettyLongDateShort, formatPrice, handlePriceInputChange } from "../../../utils/numbers";

const statusStyles = {
  pending: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
  partial: "bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200",
  paid: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200"
};

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<IOrderRecord>();
  const [amount, setAmount] = useState("");
  const [errors, setErrors] = useState<{ msj: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaying, setIsPaying] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (!id) return;

    let active = true;
    setIsLoading(true);
    getOrder({ id }).then(response => {
      if (!active) return;
      if (response.success) {
        setOrder(response.data);
        setErrors([]);
      } else {
        setErrors(response.errors);
      }
    }).finally(() => {
      if (active) setIsLoading(false);
    });

    return () => { active = false; };
  }, [id, refreshKey]);

  useEffect(() => {
    if (!isLoading && window.location.hash) {
      document.querySelector(window.location.hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [isLoading]);

  async function submitPayment(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!order || isPaying || order.status === "paid") return;

    const paymentAmount = Number(amount);
    if (!Number.isFinite(paymentAmount) || paymentAmount <= 0) {
      setErrors([{ msj: "Payment must be greater than zero" }]);
      return;
    }
    if (paymentAmount > order.remaining_balance) {
      setErrors([{ msj: "Payment cannot exceed the remaining balance" }]);
      return;
    }

    const data: IPaymentNew = {
      payment: {
        alumn_id: order.alumn_id.toString(),
        quantity: amount
      },
      payable_type: "order",
      payable_id: order.id.toString()
    };

    setIsPaying(true);
    const response = await postPayment({ data });
    if (response.success) {
      setAmount("");
      setErrors([]);
      setRefreshKey(value => value + 1);
    } else {
      setErrors(response.errors);
    }
    setIsPaying(false);
  }

  if (isLoading && !order) {
    return <div className="flex min-h-[60vh] items-center justify-center text-gray-500">Loading order...</div>;
  }

  if (!order) {
    return (
      <div className="mx-6 my-10 border border-red-200 bg-red-50 p-6 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
        <ExclamationCircleIcon className="mb-3 h-8 w-8" />
        <p>{errors[0]?.msj || "Order not found"}</p>
      </div>
    );
  }

  const isPaid = order.status === "paid";

  return (
    <main className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6">
      <button type="button" onClick={() => navigate("/dashboard/orders")} className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
        <ArrowLeftIcon className="h-4 w-4" />
        Back to orders
      </button>

      <header className="flex flex-wrap items-start justify-between gap-4 border-b border-gray-200 pb-5 dark:border-gray-700">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Order #{order.id}</p>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">{order.alumn.name} {order.alumn.last_name}</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Created {formatPrettyLongDateShort(order.created_at)} by {order.user_email}</p>
        </div>
        <span className={`inline-flex px-3 py-1.5 text-sm font-semibold capitalize ${statusStyles[order.status]}`}>{order.status}</span>
      </header>

      {errors.length > 0 && (
        <div role="alert" className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
          {errors.map((error, index) => <p key={`${error.msj}_${index}`}>{error.msj}</p>)}
        </div>
      )}

      <section aria-label="Order financial summary" className="grid gap-px overflow-hidden border border-gray-200 bg-gray-200 sm:grid-cols-3 dark:border-gray-700 dark:bg-gray-700">
        <FinancialMetric label="Total" value={order.total} />
        <FinancialMetric label="Paid" value={order.paid_amount} />
        <FinancialMetric label="Balance" value={order.remaining_balance} emphasized />
      </section>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0 space-y-6">
          <section className="border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
            <div className="border-b border-gray-200 px-5 py-4 dark:border-gray-700">
              <h2 className="font-semibold text-gray-900 dark:text-white">Products</h2>
              {order.description && <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{order.description}</p>}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
                <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                  <tr><th className="px-5 py-3">Product</th><th className="px-5 py-3">Quantity</th><th className="px-5 py-3 text-right">Unit price</th><th className="px-5 py-3 text-right">Subtotal</th></tr>
                </thead>
                <tbody>
                  {order.order_products?.map(line => (
                    <tr key={line.id} className="border-t border-gray-200 dark:border-gray-700">
                      <th className="px-5 py-4 font-medium text-gray-900 dark:text-white">{line.product.name}</th>
                      <td className="px-5 py-4">{line.quantity}</td>
                      <td className="px-5 py-4 text-right">{formatPrice(line.price)}</td>
                      <td className="px-5 py-4 text-right font-medium text-gray-900 dark:text-white">{formatPrice(line.price * line.quantity)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section id="payments" className="scroll-mt-6 border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
            <div className="flex items-center gap-2 border-b border-gray-200 px-5 py-4 dark:border-gray-700">
              <BanknotesIcon className="h-5 w-5 text-gray-500" />
              <h2 className="font-semibold text-gray-900 dark:text-white">Payment history</h2>
            </div>
            {order.payments && order.payments.length > 0 ? (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {order.payments.map(payment => (
                  <div key={payment.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                    <div><p className="font-medium text-gray-900 dark:text-white">{formatPrice(payment.quantity)}</p><p className="text-xs text-gray-500">{payment.user_email}</p></div>
                    <time className="text-sm text-gray-500">{formatPrettyLongDateShort(payment.paid_at || payment.created_at)}</time>
                  </div>
                ))}
              </div>
            ) : <p className="px-5 py-8 text-center text-sm text-gray-500">No payments registered</p>}
          </section>
        </div>

        <section id="payment-form" className="min-w-0 scroll-mt-6 border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900 lg:sticky lg:top-6">
          <div className="mb-5 flex items-center gap-2">
            {isPaid ? <CheckCircleIcon className="h-6 w-6 text-emerald-600" /> : <CreditCardIcon className="h-6 w-6 text-blue-600" />}
            <h2 className="font-semibold text-gray-900 dark:text-white">{isPaid ? "Order paid" : "Register payment"}</h2>
          </div>
          <dl className="mb-5 space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-gray-500">Total</dt><dd className="text-gray-900 dark:text-white">{formatPrice(order.total)}</dd></div>
            <div className="flex justify-between"><dt className="text-gray-500">Paid</dt><dd className="text-gray-900 dark:text-white">{formatPrice(order.paid_amount)}</dd></div>
            <div className="flex justify-between border-t border-gray-200 pt-2 font-semibold dark:border-gray-700"><dt className="text-gray-700 dark:text-gray-300">Balance</dt><dd className="text-gray-900 dark:text-white">{formatPrice(order.remaining_balance)}</dd></div>
          </dl>
          <form onSubmit={submitPayment} className="space-y-4">
            <div>
              <label htmlFor="payment-amount" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">Amount</label>
              <input id="payment-amount" type="number" min="0.01" max={order.remaining_balance} step="0.01" disabled={isPaid || isPaying} value={amount} onChange={event => handlePriceInputChange(event, setAmount)} placeholder="0.00" className="block w-full border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-600 dark:bg-gray-800 dark:text-white" />
            </div>
            <button type="submit" disabled={isPaid || isPaying} className="inline-flex w-full items-center justify-center gap-2 bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:cursor-not-allowed disabled:bg-gray-400 dark:bg-blue-600 dark:hover:bg-blue-700">
              <CreditCardIcon className="h-5 w-5" />
              {isPaying ? "Registering..." : isPaid ? "No balance due" : "Register payment"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}

function FinancialMetric({ label, value, emphasized = false }: { label: string, value: number, emphasized?: boolean }) {
  return (
    <div className="bg-white px-5 py-4 dark:bg-gray-900">
      <p className="text-xs font-medium uppercase text-gray-500">{label}</p>
      <p className={`mt-1 text-xl font-semibold ${emphasized ? "text-blue-700 dark:text-blue-400" : "text-gray-900 dark:text-white"}`}>{formatPrice(value)}</p>
    </div>
  );
}