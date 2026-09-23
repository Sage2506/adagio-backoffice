import { useCallback, useEffect, useState } from "react";
import { useLoadingLabel } from "../../../hooks/useLoadingLabel";
import { useNavigate } from "react-router";
import type { IProductRecord } from "../../../types/products";
import { deleteProduct, getProducts } from "../../../services/product";
import { usePagination } from "../../../hooks/usePagination";
import PaginationComponent from "../../utils/paginationComponent";
import ProductsRow from "./row";

export default function ProductsTable() {
  const navigate = useNavigate()
  const [products, setProducts] = useState<IProductRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ msj: string }[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const loadingLabel = useLoadingLabel("Loading", isLoading);
  
  const {
    currentPage,
    pages,
    links,
    totalEntries,
    searchParams,
    searchString,
    setPagination,
    getPageTarget,
    getLinkTarget,
  } = usePagination({ resourcePath: "products" });

  useEffect(() => {
    if (searchParams.has('q[name_cont]')) {
      setSearchValue(searchParams.get('q[name_cont]')!)
    }
    loadProducts();
  }, [searchString])

  async function loadProducts() {
    setIsLoading(true)
    getProducts({ params: searchParams.toString() }).then(response => {
      if (response.success) {
        const { data, pages, links, total } = response
        setProducts(data);
        setPagination({ pages, links, total });
      } else {
        setErrors(response.errors)
      }
    }).finally(() => {
      setIsLoading(false)
    })
  }

  const handleDelete = useCallback(async (event: React.MouseEvent, product: IProductRecord) => {
    event.stopPropagation();
    setIsLoading(true);

    const response = await deleteProduct({ id: product.id });
    if (response.success) {
      setProducts(current => current.filter(currentProduct => currentProduct.id !== product.id));
    } else {
      setErrors(response.errors);
    }

    setIsLoading(false);
  }, []);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('page[page]')
      if (searchValue.trim()) {
        newParams.set('q[name_cont]', searchValue.trim());
      } else {
        newParams.delete('q[name_cont]');
      }
      navigate(`?${newParams.toString()}`, { replace: true });
    }
  };

  return (
    <div className="w-full min-w-0 flex flex-col gap-stack-md">
      <div className={`${errors.length > 0 ? 'block' : 'hidden'}`}>
        {errors.map(error => <p>{error.msj}</p>)}
      </div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-stack-sm w-full">
        <div>
          <div className="relative">
            <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
              </svg>
            </div>
            <input type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={handleKeyDown}
              id="table-search" className="w-full pl-10 pr-10 py-2 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary bg-surface-lowest text-body-md font-body-md outline-none transition-all" placeholder="Search for products" />
          </div>
        </div>
        <div className="relative">
          <button id="dropdownRadioButton" onClick={() => navigate('/dashboard/products/form')} className="bg-primary text-on-primary font-bold py-2 px-6 rounded-lg flex items-center gap-2 hover:bg-surface-tint transition-colors shadow-sm whitespace-nowrap" type="button">
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
              Price
            </th>
            <th scope="col" className="py-4 px-6 text-table-header font-table-header text-on-surface-variant uppercase tracking-wider text-center">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className={isLoading ? "opacity-50 pointer-events-none" : "text-body-md font-body-md"}>
          {isLoading && products.length === 0 ? (
            <tr>
              <td colSpan={4} style={{ padding: 0, border: 'none' }}>
                <div className="flex items-center justify-center" style={{ minHeight: '60vh' }}>
                  <span className="text-lg text-gray-500">{loadingLabel}</span>
                </div>
              </td>
            </tr>
          ) : (
            products.map(product => (
              <ProductsRow key={`product_${product.id}`} product={product} onDelete={handleDelete} />
            ))
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
        currentItems={products.length}
        getPageTarget={getPageTarget}
        getLinkTarget={getLinkTarget}
      />
    </div>
  )
}