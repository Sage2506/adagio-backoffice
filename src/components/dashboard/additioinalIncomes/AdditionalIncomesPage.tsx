import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useLoadingLabel } from "../../../hooks/useLoadingLabel";
import PaginationComponent from "../../utils/paginationComponent";
import api from "../../../services/api";
import { usePagination } from "../../../hooks/usePagination";
import type { ILinks } from "../../../types/common";
import AdditionalIncomeRow from "./AdditionalIncomeRow";
import NewAdditionalIncomeModal from "./NewAdditionalIncomeModal";

interface AdditionalIncomeRecord {
  id: number;
  amount: number;
  date: string;
  description: string | null;
  category: string;
  payment_method: string;
}

interface AdditionalIncomesResponse {
  data: AdditionalIncomeRecord[];
  pages: number[];
  links: ILinks;
}

export default function AdditionalIncomesPage() {
  const [incomes, setIncomes] = useState<AdditionalIncomeRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const loadingLabel = useLoadingLabel("Loading", isLoading);
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
  } = usePagination({ resourcePath: "additional_incomes" });

  useEffect(() => {
    let isActive = true;

    async function fetchIncomes() {
      setIsLoading(true);
      try {
        const response = await api.get<AdditionalIncomesResponse>(`/additional_incomes${searchString ? `?${searchString}` : ""}`);
        if (!isActive) return;
        setIncomes(response.data.data);
        setPagination({ pages: response.data.pages, links: response.data.links });
        setError("");
      } catch (requestError: unknown) {
        const message = axios.isAxiosError<{ error?: string }>(requestError)
          ? requestError.response?.data?.error
          : undefined;
        if (isActive) setError(message || "Unable to load additional incomes.");
      } finally {
        if (isActive) setIsLoading(false);
      }
    }

    fetchIncomes();
    return () => { isActive = false; };
  }, [searchString, refreshKey]);

  const handleIncomeCreated = useCallback(() => {
    resetPagination();
    setRefreshKey(value => value + 1);
  }, [resetPagination]);

  const handleIncomeError = useCallback((message: string) => {
    setError(message);
  }, []);

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  return (
    <main className="w-full min-w-0 space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-headline-md text-on-surface">Additional Incomes</h1>
          <p className="mt-1 text-body-md font-body-md text-on-surface-variant">Track income outside regular student payments.</p>
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
              {isLoading && incomes.length === 0 ? (
                <tr><td colSpan={5} style={{ padding: 0, border: "none" }}><div className="flex items-center justify-center" style={{ minHeight: "60vh" }}><span className="text-lg text-gray-500">{loadingLabel}</span></div></td></tr>
              ) : incomes.length === 0 ? (
                <tr><td colSpan={5} className="py-10 px-6 text-center text-on-surface-variant">No additional incomes found.</td></tr>
              ) : (
                incomes.map(income => <AdditionalIncomeRow key={`additional_income_${income.id}`} income={income} />)
              )}
            </tbody>
          </table>
        </div>
        <PaginationComponent currentPage={currentPage} pages={pages} links={links} isLoading={isLoading} currentItems={incomes.length} getPageTarget={getPageTarget} getLinkTarget={getLinkTarget} />
      </section>

      <NewAdditionalIncomeModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onCreated={handleIncomeCreated}
        onError={handleIncomeError}
      />
    </main>
  );
}
