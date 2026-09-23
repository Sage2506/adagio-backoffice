import { memo, useEffect, useMemo, useState } from "react";
import { useLoadingLabel } from "../../../hooks/useLoadingLabel";
import api from "../../../services/api";
import { formatCurrencyValue } from "../../../utils/numbers";

const initialBalance = {
  summary: {
    total_available: 0,
    cash_on_hand: 0,
    in_bank_account: 0,
  },
  breakdown: {
    student_income: { cash: 0, digital: 0 },
    additional_income: { cash: 0, digital: 0 },
    expenses: { cash: 0, digital: 0 },
  },
};

const breakdownSections = [
  { key: "student_income", label: "Student Income" },
  { key: "additional_income", label: "Additional Income" },
  { key: "expenses", label: "Expenses" },
];

function FinancialBalance() {
  const [balance, setBalance] = useState(initialBalance);
  const [isLoading, setIsLoading] = useState(true);
  const loadingLabel = useLoadingLabel("Loading balance", isLoading);
  const [error, setError] = useState("");

  useEffect(() => {
    let isActive = true;

    async function fetchBalance() {
      try {
        setIsLoading(true);
        setError("");
        const response = await api.get("/balance");
        if (isActive) setBalance(response.data.data);
      } catch (requestError) {
        if (!isActive) return;
        setError(requestError.response?.data?.error || "Unable to load financial balance.");
      } finally {
        if (isActive) setIsLoading(false);
      }
    }

    fetchBalance();

    return () => {
      isActive = false;
    };
  }, []);

  const summaryCards = useMemo(() => [
    { label: "Total Available", value: balance.summary.total_available, accent: "text-primary" },
    { label: "Cash on Hand", value: balance.summary.cash_on_hand, accent: "text-on-surface" },
    { label: "In Bank", value: balance.summary.in_bank_account, accent: "text-tertiary" },
  ], [balance.summary]);

  if (isLoading) {
    return (
      <div className="flex min-h-64 items-center justify-center rounded-xl border border-outline-variant bg-surface-container-lowest p-8 text-body-md text-on-surface-variant shadow-soft">
        {loadingLabel}
      </div>
    );
  }

  if (error) {
    return (
      <div role="alert" className="rounded-xl border border-error-container bg-error-container p-6 text-body-md text-on-error-container shadow-soft">
        {error}
      </div>
    );
  }

  return (
    <main className="w-full min-w-0 flex flex-col gap-stack-lg">
      <section aria-labelledby="balance-summary-heading">
        <div className="mb-4">
          <h1 id="balance-summary-heading" className="text-headline-md text-on-surface">Financial Balance</h1>
          <p className="mt-1 text-body-md font-body-md text-on-surface-variant">A current view of available funds and payment channels.</p>
        </div>
        <div className="grid gap-stack-md md:grid-cols-3">
          {summaryCards.map(card => (
            <article key={card.label} className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-soft transition-colors hover:bg-surface-container-low">
              <p className="text-table-header font-table-header uppercase tracking-wider text-on-surface-variant">{card.label}</p>
              <p className={`mt-3 text-headline-md ${card.accent}`}>{formatCurrencyValue(card.value)}</p>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="balance-breakdown-heading">
        <div className="mb-4">
          <h2 id="balance-breakdown-heading" className="text-headline-sm text-on-surface">Breakdown</h2>
        </div>
        <div className="grid gap-stack-md md:grid-cols-3">
          {breakdownSections.map(section => {
            const values = balance.breakdown[section.key];
            return (
              <article key={section.key} className="overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest shadow-soft">
                <h3 className="border-b border-outline-variant bg-surface px-6 py-4 text-body-lg font-body-lg text-on-surface">{section.label}</h3>
                <dl className="text-body-md font-body-md">
                  <div className="flex items-center justify-between border-b border-outline-variant px-6 py-4 transition-colors hover:bg-surface-container-low">
                    <dt className="text-on-surface-variant">Cash</dt>
                    <dd className="font-semibold text-on-surface">{formatCurrencyValue(values.cash)}</dd>
                  </div>
                  <div className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-surface-container-low">
                    <dt className="text-on-surface-variant">Digital</dt>
                    <dd className="font-semibold text-on-surface">{formatCurrencyValue(values.digital)}</dd>
                  </div>
                </dl>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}

export default memo(FinancialBalance);
