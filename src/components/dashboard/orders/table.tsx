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
    <div className="relative overflow-x-auto border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900 my-10 mx-6">
      {errors.length > 0 && (
        <div role="alert" className="border-b border-red-200 bg-red-50 px-5 py-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
          {errors.map((error, index) => <p key={`${error.msj}_${index}`}>{error.msj}</p>)}
        </div>
      )}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 px-5 py-4 dark:border-gray-700">
        <div>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Orders</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Financial status and payment activity</p>
        </div>
        <div className="relative">
          <button onClick={() => navigate('/dashboard/orders/form')} className="inline-flex items-center gap-2 bg-blue-700 px-3 py-2 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700" type="button">
            <PlusIcon className="h-5 w-5" />
            Create
          </button>
        </div>
      </div>
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3 capitalize">
              Alumno
            </th>
            <th scope="col" className="px-6 py-3 capitalize">
              Total
            </th>
            <th scope="col" className="px-6 py-3 capitalize">
              Pagado
            </th>
            <th scope="col" className="px-6 py-3 capitalize">
              Saldo
            </th>
            <th scope="col" className="px-6 py-3 capitalize">
              Estado
            </th>
            <th scope="col" className="px-6 py-3 capitalize">
              Fecha
            </th>
            <th scope="col" className="px-6 py-3 text-right capitalize">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className={isLoading ? "opacity-50 pointer-events-none" : ""}>
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
      <nav
        className={`flex items-center flex-column flex-wrap md:flex-row justify-between p-4 ${isLoading ? 'opacity-50 pointer-events-none' : ''
          }`}
        aria-busy={isLoading}
        aria-live="polite"
        aria-label="Table navigation">
        <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
          {links &&
            <li>
              <NavLink
                to={links.first.split('orders')[1]}
                className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                First
              </NavLink>
            </li>
          }

          {links?.prev &&
            <li>
              <NavLink
                to={links.prev.split('orders')[1]}
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
                to={links.next.split('orders')[1]}
                className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                Next
              </NavLink>
            </li>
          }
          {links &&
            <li>
              <NavLink
                to={links.last.split('orders')[1]}
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