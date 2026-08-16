import { useEffect, useState } from "react";
import { NavLink, useNavigate, useSearchParams } from "react-router";
import type { IOrderRecord } from "../../../types/orders";
import type { ILinks } from "../../../types/common";
import { getOrders } from "../../../services/order";
import { formatPrettyLongDateShort, formatPrice } from "../../../utils/numbers";
import { BanknotesIcon, CreditCardIcon, EyeIcon, PlusIcon } from "@heroicons/react/24/outline";

const statusStyles = {
  pending: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
  partial: "bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200",
  paid: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200"
};

export default function OrdersTable() {
  const navigate = useNavigate()
  const [orders, setOrders] = useState<IOrderRecord[]>([]);
  const [pages, setPages] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [links, setLinks] = useState<ILinks>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ msj: string }[]>([]);
  const [searchParams] = useSearchParams();
  const queryString = searchParams.toString();
  const requestedPage = searchParams.get('page[page]');

  useEffect(() => {
    let active = true;
    setIsLoading(true)
    if (requestedPage) {
      setCurrentPage(parseInt(requestedPage))
    }

    getOrders({ params: queryString }).then(response => {
      if (!active) return;
      if (response.success) {
        const { data, pages, links } = response
        setOrders(data);
        setPages(pages);
        setLinks(links);
      } else {
        setErrors(response.errors)
      }
    }).finally(() => {
      if (active) setIsLoading(false)
    })

    return () => { active = false; };
  }, [queryString, requestedPage])

  return (
    <div className="lg:ml-64 p-container-padding max-w-[1440px] mx-auto min-h-screen flex flex-col gap-stack-lg my-8">
      {errors.length > 0 && (
        <div role="alert" className="border-b border-red-200 bg-red-50 px-5 py-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
          {errors.map((error, index) => <p key={`${error.msj}_${index}`}>{error.msj}</p>)}
        </div>
      )}
      <div className="flex flex-column sm:flex-row flex-wrap space-y-4 sm:space-y-0 items-center justify-between pb-4">
        <div />
        <div className="relative">
          <button onClick={() => navigate('/dashboard/orders/form')} className="bg-primary text-on-primary font-bold py-2 px-6 rounded-lg flex items-center gap-2 hover:bg-surface-tint transition-colors shadow-sm whitespace-nowrap" type="button">
            <PlusIcon className="h-5 w-5" />
            Create
          </button>
        </div>
      </div>
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-soft overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-outline-variant bg-surface">
            <th scope="col" className="py-4 px-6 text-table-header font-table-header text-on-surface-variant uppercase tracking-wider">
              Alumno
            </th>
            <th scope="col" className="py-4 px-6 text-table-header font-table-header text-on-surface-variant uppercase tracking-wider">
              Total
            </th>
            <th scope="col" className="py-4 px-6 text-table-header font-table-header text-on-surface-variant uppercase tracking-wider">
              Pagado
            </th>
            <th scope="col" className="py-4 px-6 text-table-header font-table-header text-on-surface-variant uppercase tracking-wider">
              Saldo
            </th>
            <th scope="col" className="py-4 px-6 text-table-header font-table-header text-on-surface-variant uppercase tracking-wider">
              Estado
            </th>
            <th scope="col" className="py-4 px-6 text-table-header font-table-header text-on-surface-variant uppercase tracking-wider">
              Fecha
            </th>
            <th scope="col" className="py-4 px-6 text-table-header font-table-header text-on-surface-variant uppercase tracking-wider text-right">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className={isLoading ? "opacity-50 pointer-events-none" : "text-body-md font-body-md"}>
          {isLoading && orders.length === 0 ? (
            <tr>
              <td colSpan={7} style={{ padding: 0, border: 'none' }}>
                <div className="flex items-center justify-center" style={{ minHeight: '60vh' }}>
                  <span className="text-lg text-gray-500">Loading...</span>
                </div>
              </td>
            </tr>
          ) : (
            orders.map((order) =>
              <tr key={`order_${order.id}`} className={"odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 even:dark:hover:bg-gray-700"}>
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  <span className="block">{order.alumn.name} {order.alumn.last_name}</span>
                  <span className="block text-xs font-normal text-gray-500">#{order.id}</span>
                </th>
                <td className="px-6 py-4">
                  {formatPrice(order.total)}
                </td>
                <td className="px-6 py-4">{formatPrice(order.paid_amount)}</td>
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{formatPrice(order.remaining_balance)}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2.5 py-1 text-xs font-semibold capitalize ${statusStyles[order.status]}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{formatPrettyLongDateShort(order.created_at)}</td>
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-1">
                    <button type="button" onClick={() => navigate(`/dashboard/orders/${order.id}`)} className="p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white" title="View order detail" aria-label={`View order ${order.id} detail`}>
                      <EyeIcon className="h-5 w-5" />
                    </button>
                    <button type="button" onClick={() => navigate(`/dashboard/orders/${order.id}#payments`)} className="p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white" title="View payments" aria-label={`View order ${order.id} payments`}>
                      <BanknotesIcon className="h-5 w-5" />
                    </button>
                    <button type="button" disabled={order.status === "paid"} onClick={() => navigate(`/dashboard/orders/${order.id}#payment-form`)} className="p-2 text-blue-600 hover:bg-blue-50 hover:text-blue-800 disabled:cursor-not-allowed disabled:text-gray-300 dark:text-blue-400 dark:hover:bg-gray-700 dark:disabled:text-gray-600" title={order.status === "paid" ? "Order is paid" : "Register payment"} aria-label={`Register payment for order ${order.id}`}>
                      <CreditCardIcon className="h-5 w-5" />
                    </button>
                  </div>
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
                to={links.first.split('orders')[1]}
                className="px-3 py-1 rounded border border-outline-variant text-on-surface-variant hover:bg-surface-container">
                First
              </NavLink>
            </li>
          }

          {links?.prev &&
            <li>
              <NavLink
                to={links.prev.split('orders')[1]}
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
                to={links.next.split('orders')[1]}
                className="px-3 py-1 rounded border border-outline-variant text-on-surface-variant hover:bg-surface-container">
                Next
              </NavLink>
            </li>
          }
          {links &&
            <li>
              <NavLink
                to={links.last.split('orders')[1]}
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