import { useState, useEffect } from "react";
import { EyeSlashIcon, EyeIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router";
import { getMonthlyIncome, getSubscriptions, putSubscription } from "../../../services/subscription";
import type { ISubscriptionAlumnPlanRecord, ISubscriptionNew } from "../../../types/subscriptions";
import RegisterSubscriptionPaymentModal from "./registerSubscriptionPaymentModal";
import RegisterSubscriptionCreditModal from "./registerSubscriptionCreditModal";
import EditDueDateModal from "./editDueDateModal";
import SubscriptionsRow from "./row";
import PaymentsModal from "../payments/paymentsModal";
import { usePagination } from "../../../hooks/usePagination";
import PaginationComponent from "../../utils/paginationComponent";
import { formatCurrencyValue } from "../../../utils/numbers";
import AgeRangeFilter from "../../utils/AgeRangeFilter";
import DisciplineFilter from "../../utils/DisciplineFilter";


export default function SubscriptionsTable() {
  const navigate = useNavigate()
  const [subscriptions, setSubscriptions] = useState<ISubscriptionAlumnPlanRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [monthlyIncome, setMonthlyIncome] = useState<number>(0);
  const [isSubscriptionPaymentModalOpen, setIsSubscriptionPaymentModalOpen] = useState<boolean>(false);
  const [isSubscriptionCreditModalOpen, setIsSubscriptionCreditModalOpen] = useState<boolean>(false);
  const [isEditDueDateModalOpen, setIsEditDueDateModalOpen] = useState<boolean>(false);
  const [isPaymentsModalOpen, setIsPaymentsModalOpen] = useState<boolean>(false);
  const [selectedSubscription, setSelectedSubscription] = useState<ISubscriptionAlumnPlanRecord | null>(null);
  const [searchValue, setSearchValue] = useState('');
  const {
    currentPage,
    pages,
    links,
    totalEntries,
    searchParams,
    searchString,
    setPagination,
    resetPagination,
    getPageTarget,
    getLinkTarget,
  } = usePagination({ resourcePath: "subscriptions" });

  useEffect(() => {
    if (searchParams.has('q[full_name_cont]')) {
      setSearchValue(searchParams.get('q[full_name_cont]')!)
    }
    loadSubscriptions();
    loadMonthlyIncome();
  }, [searchString.toString()])

  // Solo actualiza el filtro al presionar Enter
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      const value = searchValue.trim();
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('page[page]')
      if (value.trim()) {
        newParams.set('q[alumn_full_name_cont]', value);
      } else {
        newParams.delete('q[alumn_full_name_cont]');
      }
      navigate(`?${newParams.toString()}`, { replace: true });
    }
  }

  async function loadSubscriptions() {
    setIsLoading(true)
    getSubscriptions({ params: searchParams.toString() }).then(response => {
      if (response.success) {
        const { data, pages, links, total } = response
        setSubscriptions(data);
        setPagination({ pages, links, total });
      }
    }).finally(() => {
      setIsLoading(false)
    })
  }

  async function loadMonthlyIncome() {
    const response = await getMonthlyIncome();
    if (response.success) {
      setMonthlyIncome(response.total);
    }
  }

  function openPaySubscriptionModal(subscription: ISubscriptionAlumnPlanRecord) {
    setSelectedSubscription(subscription);
    setIsSubscriptionPaymentModalOpen(true);
  }

  function showPaymentModal(subscription: ISubscriptionAlumnPlanRecord) {
    setSelectedSubscription(subscription);
    setIsPaymentsModalOpen(true);
  }

  function openCreditModal(subscription: ISubscriptionAlumnPlanRecord) {
    setSelectedSubscription(subscription);
    setIsSubscriptionCreditModalOpen(true);
  }

  function openDueDateModal(subscription: ISubscriptionAlumnPlanRecord) {
    setSelectedSubscription(subscription);
    setIsEditDueDateModalOpen(true);
  }

  function navigateToAlumnForm(alumnId: number) {
    navigate(`/dashboard/alumns/form/${alumnId}`);
  }

  function subscriptionPaid(successful: boolean) {
    setIsSubscriptionPaymentModalOpen(false)
    setSelectedSubscription(null);
    if (successful) {
      resetPagination(loadSubscriptions)
    }
  }

  function onCreditModalClose(reloaded?: boolean) {
    setIsSubscriptionCreditModalOpen(false);
    setSelectedSubscription(null);
    if (reloaded) {
      resetPagination(loadSubscriptions);
    }
  }

  function onDueDateModalClose(reloaded?: boolean) {
    setIsEditDueDateModalOpen(false);
    setSelectedSubscription(null);
    if (reloaded) {
      resetPagination(loadSubscriptions);
    }
  }

  async function toggleSubscriptionStatus(subscription: ISubscriptionAlumnPlanRecord) {
    const { plan_id, alumn_id } = subscription
    const newSubscription: ISubscriptionNew = {
      plan_id: plan_id.toString(),
      alumn_id: alumn_id.toString(),
      status: subscription.status === "active" ? 1 : 0
    }
    subscription.status = subscription.status === "active" ? "cancelled" : "active"
    setIsLoading(true)
    const res = await putSubscription({ id: subscription.id.toString(), data: newSubscription })
    if (res.success) {
      resetPagination(loadSubscriptions);
    } else {
      subscription.status = subscription.status === "active" ? "cancelled" : "active"
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full min-w-0 flex flex-col gap-stack-md">
      <div>
        <h1 className="text-headline-md text-on-surface">Subscriptions</h1>

      </div>
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-stack-sm w-full">
        <div className="flex w-full flex-col flex-wrap items-start gap-stack-sm lg:flex-row lg:items-end">
          <div className="w-full md:w-80">
            <label htmlFor="table-search" className="block text-label-md font-label-md text-on-surface-variant">Search</label>
            <div className="relative mt-1 flex items-center">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg className="w-4 h-4 text-on-surface-variant" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                </svg>
              </div>
              <input type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={handleKeyDown}
                id="table-search" className="w-full pl-10 pr-10 py-2 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary bg-surface-lowest text-on-surface text-body-md font-body-md outline-none transition-all" placeholder="Search for subscriptions" />
              <button
                type="button"
                className="absolute right-1 p-2 rounded-md text-on-surface-variant hover:bg-surface-container focus:outline-none focus:ring-1 focus:ring-primary"
                title="Clear search"
                onClick={() => {
                  setSearchValue('');
                  const cleanParams = new URLSearchParams(searchParams);
                  cleanParams.delete('q[full_name_cont]');
                  cleanParams.delete('q[alumn_full_name_cont]');
                  cleanParams.delete('page[page]');
                  navigate(`?${cleanParams.toString()}`, { replace: true });
                }}
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
          <AgeRangeFilter idPrefix="subscriptions" />
          <DisciplineFilter idPrefix="subscriptions" />
          <div
            className={`px-3 py-2 rounded-lg border text-label-md font-label-md focus:outline-none transition-colors flex items-center gap-2 bg-surface-lowest text-on-surface-variant border-outline-variant hover:bg-surface-container'}`}
          >
            <p>Monthly Income: {formatCurrencyValue(monthlyIncome)}</p>
          </div>
          <button
            type="button"
            className={`px-3 py-2 rounded-lg border text-label-md font-label-md focus:outline-none transition-colors flex items-center gap-2 ${searchParams.get('include_inactive') === 'true' ? 'bg-primary-container text-on-primary-container border-primary-container' : 'bg-surface-lowest text-on-surface-variant border-outline-variant hover:bg-surface-container'}`}
            onClick={() => {
              const newParams = new URLSearchParams(searchParams);
              if (newParams.get('include_inactive') === 'true') {
                newParams.delete('include_inactive');
              } else {
                newParams.set('include_inactive', 'true');
              }
              newParams.delete('page[page]'); // reset page
              navigate(`?${newParams.toString()}`, { replace: true });
            }}
            title="Show/hide inactive subscriptions"
          >
            {searchParams.get('include_inactive') === 'true' ? (
              <>
                <EyeSlashIcon className="w-5 h-5" /> Disabled
              </>
            ) : (
              <>
                <EyeIcon className="w-5 h-5" /> Disabled
              </>
            )}

          </button>
        </div>
      </div>
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant bg-surface">
                <th scope="col" className="py-4 px-6 text-table-header font-table-header text-on-surface-variant uppercase tracking-wider">
                  ID
                </th>
                <th scope="col" className="py-4 px-6 text-table-header font-table-header text-on-surface-variant uppercase tracking-wider">
                  Full Name
                </th>
                <th scope="col" className="py-4 px-6 text-table-header font-table-header text-on-surface-variant uppercase tracking-wider">
                  Plan
                </th>
                <th scope="col" className="py-4 px-6 text-table-header font-table-header text-on-surface-variant uppercase tracking-wider">
                  Last payment
                </th>
                <th scope="col" className="py-4 px-6 text-table-header font-table-header text-on-surface-variant uppercase tracking-wider">
                  Due Date
                </th>
                <th scope="col" className="py-4 px-6 text-table-header font-table-header text-on-surface-variant uppercase tracking-wider">
                  Due Date
                </th>
              </tr>
            </thead>
            <tbody className={isLoading ? "opacity-50 pointer-events-none" : "text-body-md font-body-md"}>
              {isLoading && subscriptions.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: 0, border: 'none' }}>
                    <div className="flex items-center justify-center" style={{ minHeight: '60vh' }}>
                      <span className="text-lg text-gray-500">Loading...</span>
                    </div>
                  </td>
                </tr>
              ) : (
                subscriptions.map((subscription) =>
                  <SubscriptionsRow
                    toggleSubscriptionStatus={toggleSubscriptionStatus}
                    key={`subscription_${subscription.id}`}
                    subscription={subscription}
                    onClick={() => openPaySubscriptionModal(subscription)}
                    showPaymentModal={showPaymentModal}
                    onOpenCreditModal={openCreditModal}
                    onOpenDueDateModal={openDueDateModal}
                    onNavigateToAlumnForm={navigateToAlumnForm} />
                )
              )}
            </tbody>
          </table>
        </div>
        <PaginationComponent
          currentPage={currentPage}
          pages={pages}
          links={links}
          isLoading={isLoading}
          totalEntries={totalEntries}
          currentItems={subscriptions.length}
          getPageTarget={getPageTarget}
          getLinkTarget={getLinkTarget}
        />
      </div>
      <RegisterSubscriptionPaymentModal isOpen={isSubscriptionPaymentModalOpen} subscription={selectedSubscription ?? null} onSubscriptionPaid={((successful) => subscriptionPaid(successful))} />
      <EditDueDateModal
        isOpen={isEditDueDateModalOpen}
        subscription={selectedSubscription ?? null}
        onClose={onDueDateModalClose}
      />
      <RegisterSubscriptionCreditModal
        isOpen={isSubscriptionCreditModalOpen}
        subscription={selectedSubscription ?? null}
        onClose={onCreditModalClose}
        onSuccess={() => resetPagination(loadSubscriptions)}
      />
      <PaymentsModal
        isOpen={isPaymentsModalOpen}
        payableId={selectedSubscription?.id ?? null}
        payableType={"subscription"}
        toggleModal={() => { setIsPaymentsModalOpen(false); setSelectedSubscription(null) }}
      />
    </div>
  )
}