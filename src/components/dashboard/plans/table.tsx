import { useEffect, useState } from "react";
import { NavLink, useNavigate, useSearchParams } from "react-router";
import type { IPlanRecord } from "../../../types/plans";
import type { ILinks } from "../../../types/common";
import { getPlans } from "../../../services/plan";
import { formatPrice } from "../../../utils/numbers";

export default function PlansTable() {
  const navigate = useNavigate()
  const [plans, setPlans] = useState<IPlanRecord[]>([]);
  const [pages, setPages] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [links, setLinks] = useState<ILinks>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ msj: string }[]>([]);
  let [searchParams] = useSearchParams();

  useEffect(() => {
    loadPlans();
  }, [searchParams.toString()])

  async function loadPlans() {
    setIsLoading(true)
    if (searchParams.has('page[page]')) {
      setCurrentPage(parseInt(searchParams.get('page[page]')!))
    }
    getPlans({ params: searchParams.toString() }).then(response => {
      if (response.success) {
        const { data, pages, links } = response
        setPlans(data);
        setPages(pages);
        setLinks(links);
      } else {
        setErrors(response.errors)
      }
    }).finally(() => {
      setIsLoading(false)
    })
  }

  return (
    <div className="w-full min-w-0 flex flex-col gap-stack-md">
      <div>
        {errors.map(error => <p>{error.msj}</p>)}
      </div>
      <div className="flex flex-column sm:flex-row flex-wrap space-y-4 sm:space-y-0 items-center justify-between pb-4">
        <div>
        </div>
        <div className="relative">
          <button id="dropdownRadioButton" onClick={() => navigate('/dashboard/plans/form')} className="bg-primary text-on-primary font-bold py-2 px-6 rounded-lg flex items-center gap-2 hover:bg-surface-tint transition-colors shadow-sm whitespace-nowrap" type="button">
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
              Name
            </th>
            <th scope="col" className="py-4 px-6 text-table-header font-table-header text-on-surface-variant uppercase tracking-wider">
              Duration
            </th>
            <th scope="col" className="py-4 px-6 text-table-header font-table-header text-on-surface-variant uppercase tracking-wider">
              Price
            </th>
          </tr>
        </thead>
        <tbody className={isLoading ? "opacity-50 pointer-events-none" : "text-body-md font-body-md"}>
          {isLoading && plans.length === 0 ? (
            <tr>
              <td colSpan={4} style={{ padding: 0, border: 'none' }}>
                <div className="flex items-center justify-center" style={{ minHeight: '60vh' }}>
                  <span className="text-lg text-gray-500">Loading...</span>
                </div>
              </td>
            </tr>
          ) : (
            plans.map((plan) =>
              <tr key={`plan_${plan.id}`} onClick={() => navigate(`/plans/form/${plan.id}`)} className={"odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 even:dark:hover:bg-gray-700"}>
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {plan.id}
                </th>
                <td className="px-6 py-4 capitalize">
                  {plan.name}
                </td>
                <td className="px-6 py-4 capitalize">
                  {plan.subscription_duration}
                </td>
                <td className="px-6 py-4">
                  {formatPrice(plan.price)}
                </td>
              </tr>)
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
                to={links.first.split('plans')[1]}
                className="px-3 py-1 rounded border border-outline-variant text-on-surface-variant hover:bg-surface-container">
                First
              </NavLink>
            </li>
          }

          {links?.prev &&
            <li>
              <NavLink
                to={links.prev.split('plans')[1]}
                className="px-3 py-1 rounded border border-outline-variant text-on-surface-variant hover:bg-surface-container">
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
                  `px-3 py-1 rounded border ${currentPage === page
                    ? 'border-primary bg-primary-container text-on-primary-container font-bold'
                    : 'border-outline-variant text-on-surface-variant hover:bg-surface-container'
                  }`
                }>
                {page}
              </NavLink>
            </li>
          )}
          {links?.next &&
            <li>
              <NavLink
                to={links.next.split('plans')[1]}
                className="px-3 py-1 rounded border border-outline-variant text-on-surface-variant hover:bg-surface-container">
                Next
              </NavLink>
            </li>
          }
          {links &&
            <li>
              <NavLink
                to={links.last.split('plans')[1]}
                className="px-3 py-1 rounded border border-outline-variant text-on-surface-variant hover:bg-surface-container">
                Last
              </NavLink>
            </li>
          }
        </ul>
      </nav>
    </div>
  )
}