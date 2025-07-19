import { useState, useEffect, useMemo } from "react";
import { NavLink, useSearchParams } from "react-router";
import { getSubscriptions } from "../../../services/subscription";
import type { ISubscriptionAlumnPlanRecord } from "../../../types/subscriptions";
import type { ILinks } from "../../../types/common";
import RegisterSubscriptionPaymentModal from "./registerSubscriptionPaymentModal";
import SubscripcionsRow from "./row";


export default function SubscriptionsTable() {
  const [subscriptions, setSubscriptions] = useState<ISubscriptionAlumnPlanRecord[]>([]);
  const [pages, setPages] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [links, setLinks] = useState<ILinks>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubscriptionPaymentModalOpen, setIsSubscriptionPaymentModalOpen] = useState<boolean>(false);
  const [selectedSubscription, setSelectedSubscriptionId] = useState<ISubscriptionAlumnPlanRecord>();
  let [searchParams] = useSearchParams();
  const searchString = useMemo(() => searchParams.toString(), [searchParams]);

  useEffect(() => {
    loadSubscriptions();
  }, [searchString])

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
    setSelectedSubscriptionId(subscription);
    setIsSubscriptionPaymentModalOpen(true);
  }

  function subscriptionPaid(successful: boolean) {
    setIsSubscriptionPaymentModalOpen(false)
    setSelectedSubscriptionId(undefined);
  }

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg my-10 mx-6">
      {selectedSubscription && <RegisterSubscriptionPaymentModal isModalOpen={isSubscriptionPaymentModalOpen} subscription={selectedSubscription} onSubscriptionPaid={((successful) => subscriptionPaid(successful))} />}
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              ID
            </th>
            <th scope="col" className="px-6 py-3">
              Name
            </th>
            <th scope="col" className="px-6 py-3">
              Last name
            </th>
            <th scope="col" className="px-6 py-3">
              Plan
            </th>
            <th scope="col" className="px-6 py-3">
              Last payment
            </th>
            <th scope="col" className="px-6 py-3">
              Due Date
            </th>
          </tr>
        </thead>

        <tbody className={isLoading ? "opacity-50 pointer-events-none" : ""}>
          {subscriptions.map((subscription) => <SubscripcionsRow key={`subscription_${subscription.id}`} subscription={subscription} onClick={() => openPaySubscriptionModal(subscription)} />
          )}
        </tbody>
      </table>
      <nav
        className={`flex items-center flex-column flex-wrap md:flex-row justify-between pt-4 ${isLoading ? 'opacity-50 pointer-events-none' : ''
          }`}
        aria-busy={isLoading}
        aria-live="polite"
        aria-label="Table navigation">
        <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
          {links &&
            <li>
              <NavLink
                to={links.first.split('subscriptions')[1]}
                className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                First
              </NavLink>
            </li>
          }

          {links?.prev &&
            <li>
              <NavLink
                to={links.prev.split('subscriptions')[1]}
                className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                Previous
              </NavLink>
            </li>
          }

          {pages.map(page =>
            <li key={`page_${page}`}>
              <NavLink
                aria-current={currentPage === page ? 'page' : 'false'}

                to={`?page%5Bpage%5D=${page}`}
                className={
                  `flex items-center justify-center px-3 h-8 border ${currentPage === page
                    ? 'text-blue-600 bg-blue-50 border-blue-300 dark:text-white dark:bg-blue-600 dark:border-blue-700'
                    : 'text-gray-500 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700'
                  }`
                }>
                {page}
              </NavLink>
            </li>
          )}
          {links?.next &&
            <li>
              <NavLink
                to={links.next.split('subscriptions')[1]}
                className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                Next
              </NavLink>
            </li>
          }
          {links &&
            <li>
              <NavLink
                to={links.last.split('subscriptions')[1]}
                className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                Last
              </NavLink>
            </li>
          }
        </ul>
      </nav>
    </div>
  )
}