import { useEffect, useState } from "react";
import { NavLink, useNavigate, useSearchParams } from "react-router";
import type { IPlanRecord } from "../../../types/plans";
import type { ILinks } from "../../../types/common";
import { getPlans } from "../../../services/plan";
import { formatPrice } from "../../../services/numbers";

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
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg my-10 mx-6">
      <div className="flex flex-column sm:flex-row flex-wrap space-y-4 sm:space-y-0 items-center justify-between pb-4">
        <div>
        </div>
        <div className="relative">
          <button id="dropdownRadioButton" onClick={() => navigate('/plans/form')} className="inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700" type="button">
            Create
            <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14m-7 7V5" />
            </svg>
          </button>
        </div>
      </div>
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
              Price
            </th>
          </tr>
        </thead>

        <tbody className={isLoading ? "opacity-50 pointer-events-none" : ""}>
          {plans.map((plan) =>
            <tr key={`plan_${plan.id}`} onClick={() => navigate(`/plans/form/${plan.id}`)} className={"odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 even:dark:hover:bg-gray-700"}>
              <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                {plan.id}
              </th>
              <td className="px-6 py-4 capitalize">
                {plan.name}
              </td>
              <td className="px-6 py-4">
                {formatPrice(plan.price)}
              </td>
            </tr>)}
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
                to={links.first.split('plans')[1]}
                className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                First
              </NavLink>
            </li>
          }

          {links?.prev &&
            <li>
              <NavLink
                to={links.prev.split('plans')[1]}
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
                to={links.next.split('plans')[1]}
                className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                Next
              </NavLink>
            </li>
          }
          {links &&
            <li>
              <NavLink
                to={links.last.split('plans')[1]}
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