import { useState, useEffect, useMemo } from "react";
import { EyeSlashIcon, EyeIcon, TrashIcon } from "@heroicons/react/24/outline";
import { NavLink, useNavigate, useSearchParams } from "react-router";
import { getSubscriptions, putSubscription } from "../../../services/subscription";
import type { ISubscriptionAlumnPlanRecord, ISubscriptionNew } from "../../../types/subscriptions";
import type { ILinks } from "../../../types/common";
import RegisterSubscriptionPaymentModal from "./registerSubscriptionPaymentModal";
import SubscriptionsRow from "./row";
import PaymentsModal from "../payments/paymentsModal";


export default function SubscriptionsTable() {
  const navigate = useNavigate()
  const [subscriptions, setSubscriptions] = useState<ISubscriptionAlumnPlanRecord[]>([]);
  const [pages, setPages] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [links, setLinks] = useState<ILinks>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubscriptionPaymentModalOpen, setIsSubscriptionPaymentModalOpen] = useState<boolean>(false);
  const [isPaymentsModalOpen, setIsPaymentsModalOpen] = useState<boolean>(false);
  const [selectedSubscription, setSelectedSubscription] = useState<ISubscriptionAlumnPlanRecord | null>(null);
  let [searchParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState('');
  const searchString = useMemo(() => searchParams.toString(), [searchParams]);

  useEffect(() => {
    if (searchParams.has('page[page]')) {
      setCurrentPage(parseInt(searchParams.get('page[page]')!))
    } else {
      setCurrentPage(1)
    }
    if (searchParams.has('q[full_name_cont]')) {
      setSearchValue(searchParams.get('q[full_name_cont]')!)
    }
    loadSubscriptions();
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
    if (searchParams.has('page[page]')) {
      setCurrentPage(parseInt(searchParams.get('page[page]')!))
    }
    getSubscriptions({ params: searchParams.toString() }).then(response => {
      if (response.success) {
        const { data, pages, links } = response
        setSubscriptions(data);
        setPages(pages);
        setLinks(links);
      }
    }).finally(() => {
      setIsLoading(false)
    })
  }

  function openPaySubscriptionModal(subscription: ISubscriptionAlumnPlanRecord) {
    setSelectedSubscription(subscription);
    setIsSubscriptionPaymentModalOpen(true);
  }

  function showPaymentModal(subscription: ISubscriptionAlumnPlanRecord) {
    setSelectedSubscription(subscription);
    setIsPaymentsModalOpen(true);
  }

  function subscriptionPaid(successful: boolean) {
    setIsSubscriptionPaymentModalOpen(false)
    setSelectedSubscription(null);
    if (successful) {
      loadSubscriptions();
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
      loadSubscriptions();
    } else {
      subscription.status = subscription.status === "active" ? "cancelled" : "active"
      setIsLoading(false);
    }
  }

  return (
    <div className="lg:ml-64 p-container-padding max-w-[1440px] mx-auto min-h-screen flex flex-col gap-stack-lg my-8">
      <div className="flex flex-column sm:flex-row flex-wrap space-y-4 sm:space-y-0 items-center justify-between pb-4">
        <div>
          <label htmlFor="table-search" className="sr-only">Search</label>
          <div className="relative mt-1 flex gap-2 items-center">
            <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
              </svg>
            </div>
            <input type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={handleKeyDown}
              id="table-search" className="w-full pl-10 pr-4 py-3 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary bg-surface-lowest text-body-md font-body-md outline-none transition-all shadow-sm" placeholder="Search for alumns" />
            <button
              type="button"
              className="ml-2 px-2 py-1 rounded-lg border text-sm font-medium bg-white text-gray-500 border-gray-300 dark:bg-gray-800 dark:text-white dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              title="Limpiar búsqueda"
              onClick={() => {
                setSearchValue('');
                const cleanParams = new URLSearchParams(searchParams);
                cleanParams.delete('q[full_name_cont]');
                cleanParams.delete('q[alumn_full_name_cont]');
                cleanParams.delete('page[page]');
                // Elimina otros parámetros de búsqueda si existen
                navigate(`?${cleanParams.toString()}`, { replace: true });
              }}
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="relative flex flex-row gap-2 items-center">
          <button
            type="button"
            className={`px-3 py-1.5 rounded-lg border text-sm font-medium focus:outline-none transition-colors duration-150 flex items-center gap-1 ${searchParams.get('include_inactive') === 'true' ? 'bg-blue-100 text-blue-700 border-blue-400' : 'bg-white text-gray-500 border-gray-300 dark:bg-gray-800 dark:text-white dark:border-gray-600'}`}
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
            title="Mostrar/ocultar suscripciones inactivas"
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
          <button onClick={() => navigate('/alumns/form')} className="bg-primary text-on-primary font-bold py-2 px-6 rounded-lg flex items-center gap-2 hover:bg-surface-tint transition-colors shadow-sm whitespace-nowrap" type="button">
            Create
            <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14m-7 7V5" />
            </svg>
          </button>
        </div>
      </div>
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-soft overflow-x-auto">
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
                reloadSubscriptions={loadSubscriptions}
                toggleSubscriptionStatus={toggleSubscriptionStatus}
                key={`subscription_${subscription.id}`}
                subscription={subscription}
                onClick={() => openPaySubscriptionModal(subscription)}
                showPaymentModal={showPaymentModal} />
            )
          )}
        </tbody>
      </table>
      </div>
      <nav
        className={`flex gap-1 justify-end px-6 py-4 border-t border-outline-variant bg-surface ${isLoading ? 'opacity-50 pointer-events-none' : ''
          }`}
        aria-busy={isLoading}
        aria-live="polite"
        aria-label="Table navigation">
        <ul className="flex gap-1">
          {links &&
            <li>
              <NavLink
                to={links.first.split('subscriptions')[1]}
                className="px-3 py-1 rounded border border-outline-variant text-on-surface-variant hover:bg-surface-container">
                First
              </NavLink>
            </li>
          }

          {links?.prev &&
            <li>
              <NavLink
                to={links.prev.split('subscriptions')[1]}
                className="px-3 py-1 rounded border border-outline-variant text-on-surface-variant hover:bg-surface-container">
                Previous
              </NavLink>
            </li>
          }

          {pages.map(page => {
            const params = new URLSearchParams(searchParams);
            params.set('page[page]', page.toString());
            if (searchValue.trim()) {
              params.set('q[full_name_cont]', searchValue.trim());
            }
            return (
              <li key={`page_${page}`}>
                <NavLink
                  aria-current={currentPage === page ? 'page' : 'false'}
                  to={`?${params.toString()}`}
                  className={
                    `px-3 py-1 rounded border ${currentPage === page
                      ? 'border-primary bg-primary-container text-on-primary-container font-bold'
                      : 'border-outline-variant text-on-surface-variant hover:bg-surface-container'
                    }`
                  }>
                  {page}
                </NavLink>
              </li>
            );
          })}
          {links?.next &&
            <li>
              <NavLink
                to={links.next.split('subscriptions')[1]}
                className="px-3 py-1 rounded border border-outline-variant text-on-surface-variant hover:bg-surface-container">
                Next
              </NavLink>
            </li>
          }
          {links &&
            <li>
              <NavLink
                to={links.last.split('subscriptions')[1]}
                className="px-3 py-1 rounded border border-outline-variant text-on-surface-variant hover:bg-surface-container">
                Last
              </NavLink>
            </li>
          }
        </ul>
      </nav>
      <RegisterSubscriptionPaymentModal isOpen={isSubscriptionPaymentModalOpen} subscription={selectedSubscription ?? null} onSubscriptionPaid={((successful) => subscriptionPaid(successful))} />
      <PaymentsModal
        isOpen={isPaymentsModalOpen}
        payableId={selectedSubscription?.id ?? null}
        payableType={"subscription"}
        toggleModal={() => { setIsPaymentsModalOpen(false); setSelectedSubscription(null) }}
      />
    </div>
  )
}