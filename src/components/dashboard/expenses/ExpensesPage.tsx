import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useLoadingLabel } from "../../../hooks/useLoadingLabel";
import api from "../../../services/api";
import { usePagination } from "../../../hooks/usePagination";
import PaginationComponent from "../../utils/paginationComponent"
import ExpenseRow from "./ExpenseRow";
import NewExpenseModal from "./NewExpenseModal";

interface ExpenseRecord {
  id: number;
  date: string;
  description: string | null;
  category: string;
  payment_method: string;
  amount: number;
}

interface ExpensesResponse {
  data: ExpenseRecord[];
  pages: number[];
  links: Parameters<ReturnType<typeof usePagination>["setPagination"]>[0]["links"];
}

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<ExpenseRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const {
    currentPage,
    pages,
    links,
    searchString,
    setPagination,
    resetPagination,
    getPageTarget,
    getLinkTarget,
  } = usePagination({ resourcePath: "expenses" });

  useEffect(() => {
    let isActive = true;

    async function fetchExpenses() {
      setIsLoading(true);
      try {
        const response = await api.get<ExpensesResponse>(`/expenses${searchString ? `?${searchString}` : ""}`);
        if (!isActive) return;
        setExpenses(response.data.data);
        setPagination({ pages: response.data.pages, links: response.data.links });
        setError("");
      } catch (requestError) {
        const message = axios.isAxiosError<{ error?: string }>(requestError)
          ? requestError.response?.data?.error
          : undefined;
        if (isActive) setError(message || "Unable to load expenses.");
      } finally {
        if (isActive) setIsLoading(false);
      }
    }

    fetchExpenses();
    return () => { isActive = false; };
  }, [searchString, refreshKey]);

  const handleExpenseCreated = useCallback(() => {
    setIsModalOpen(false);
    resetPagination();
    setRefreshKey(value => value + 1);
  }, [resetPagination]);
  const loadingLabel = useLoadingLabel("Loading", isLoading);

  const handleExpenseError = useCallback((message: string) => {
    setError(message);
  }, []);

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  return (
    <main className="w-full min-w-0 space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-headline-md text-on-surface">Expenses</h1>
          <p className="mt-1 text-body-md font-body-md text-on-surface-variant">Track business expenses and payment channels.</p>
        </div>
        <button type="button" onClick={() => setIsModalOpen(true)} className="rounded-lg bg-primary px-5 py-2.5 font-medium text-on-primary shadow-sm transition-colors hover:bg-surface-tint">New</button>
      </header>

      {error && <div role="alert" className="rounded-xl border border-error-container bg-error-container px-4 py-3 text-body-md text-on-error-container">{error}</div>}

      <section className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant bg-surface">
                <th scope="col" className="py-4 px-6 text-table-header font-table-header text-on-surface-variant uppercase tracking-wider">Date</th>
                <th scope="col" className="py-4 px-6 text-table-header font-table-header text-on-surface-variant uppercase tracking-wider">Description</th>
                <th scope="col" className="py-4 px-6 text-table-header font-table-header text-on-surface-variant uppercase tracking-wider">Category</th>
                <th scope="col" className="py-4 px-6 text-table-header font-table-header text-on-surface-variant uppercase tracking-wider">Payment Method</th>
                <th scope="col" className="py-4 px-6 text-table-header font-table-header text-on-surface-variant uppercase tracking-wider text-right">Amount</th>
              </tr>
            </thead>
            <tbody className={isLoading ? "opacity-50 pointer-events-none" : "text-body-md font-body-md"}>
              {isLoading && expenses.length === 0 ? (
                <tr><td colSpan={5} style={{ padding: 0, border: "none" }}><div className="flex items-center justify-center" style={{ minHeight: "60vh" }}><span className="text-lg text-gray-500">{loadingLabel}</span></div></td></tr>
              ) : expenses.length === 0 ? (
                <tr><td colSpan={5} className="py-10 px-6 text-center text-on-surface-variant">No expenses found.</td></tr>
              ) : (
                expenses.map(expense => <ExpenseRow key={`expense_${expense.id}`} expense={expense} />)
              )}
            </tbody>
          </table>
        </div>
        <PaginationComponent currentPage={currentPage} pages={pages} links={links} isLoading={isLoading} currentItems={expenses.length} getPageTarget={getPageTarget} getLinkTarget={getLinkTarget} />
      </section>

      <NewExpenseModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onCreated={handleExpenseCreated}
        onError={handleExpenseError}
      />
    </main>
  );
}
