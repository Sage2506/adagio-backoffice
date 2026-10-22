import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import type { IOrderRecord } from "../../../types/orders";
import { deleteOrder, getOrders } from "../../../services/order";
import { PlusIcon } from "@heroicons/react/24/outline";
import { usePagination } from "../../../hooks/usePagination";
import PaginationComponent from "../../utils/paginationComponent";
import ConfirmationModal from "../../utils/confirmationModal";
import OrdersRow from "./row";

export default function OrdersTable() {
  const navigate = useNavigate()
  const [orders, setOrders] = useState<IOrderRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ msj: string }[]>([]);
  const [reloadKey, setReloadKey] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<IOrderRecord>();
  const {
    currentPage,
    pages,
    links,
    totalEntries,
    searchString,
    setPagination,
    getPageTarget,
    getLinkTarget,
  } = usePagination({ resourcePath: "orders" });

  useEffect(() => {
    let active = true;
    setIsLoading(true)

    getOrders({ params: searchString }).then(response => {
      if (!active) return;
      if (response.success) {
        const { data, pages, links, total } = response
        setOrders(data);
        setPagination({ pages, links, total });
        setErrors([]);
      } else {
        setErrors(response.errors)
      }
    }).finally(() => {
      if (active) setIsLoading(false)
    })

    return () => { active = false; };
  }, [searchString, reloadKey])

  function handleDelete(event: React.MouseEvent, order: IOrderRecord) {
    event.stopPropagation();
    setOrderToDelete(order);
    setIsModalOpen(true);
  }

  async function confirmDelete(accepted: boolean) {
    setIsModalOpen(false);
    if (!accepted || !orderToDelete) return;

    setIsLoading(true);
    const response = await deleteOrder({ id: orderToDelete.id });
    if (!response.success) {
      setErrors(response.errors);
      setIsLoading(false);
      return;
    }

    setErrors([]);
    setOrderToDelete(undefined);
    // Deleting the only row of a later page would reload an empty page.
    if (orders.length === 1 && currentPage > 1) {
      navigate(getPageTarget(currentPage - 1), { replace: true });
    } else {
      setReloadKey(current => current + 1);
    }
  }

  return (
    <div className="w-full min-w-0 flex flex-col gap-stack-md">
      {errors.length > 0 && (
        <div role="alert" className="border-b border-red-200 bg-red-50 px-5 py-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
          {errors.map((error, index) => <p key={`${error.msj}_${index}`}>{error.msj}</p>)}
        </div>
      )}
      <ConfirmationModal
        titleText="Delete Order"
        bodyText={`You're about to delete order #${orderToDelete?.id} of ${orderToDelete?.alumn.name} ${orderToDelete?.alumn.last_name}, are you sure?`}
        confirmText="Yes"
        rejectText="No"
        isModalOpen={isModalOpen}
        onConfirmResponse={confirmDelete}
      />
      <div className="flex flex-column sm:flex-row flex-wrap space-y-4 sm:space-y-0 items-center justify-between">
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
            orders.map(order => <OrdersRow key={`order_${order.id}`} order={order} onDelete={handleDelete} />)
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
        currentItems={orders.length}
        getPageTarget={getPageTarget}
        getLinkTarget={getLinkTarget}
      />
    </div>
  )
}