import { useEffect, useState } from "react";
import { NavLink, useNavigate, useSearchParams } from "react-router";
import type { IProductRecord } from "../../../types/products";
import type { ILinks } from "../../../types/common";
import { getProducts } from "../../../services/product";
import { formatPrice } from "../../../utils/numbers";

export default function ProductsTable() {
  const navigate = useNavigate()
  const [products, setProducts] = useState<IProductRecord[]>([]);
  const [pages, setPages] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [links, setLinks] = useState<ILinks>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ msj: string }[]>([]);
  const [searchValue, setSearchValue] = useState('');

  let [searchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.has('page[page]')) {
      setCurrentPage(parseInt(searchParams.get('page[page]')!))
    } else {
      setCurrentPage(1)
    }
    if (searchParams.has('q[name_cont]')) {
      setSearchValue(searchParams.get('q[name_cont]')!)
    }
    loadProducts();
  }, [searchParams.toString()])

  async function loadProducts() {
    setIsLoading(true)
    if (searchParams.has('page[page]')) {
      setCurrentPage(parseInt(searchParams.get('page[page]')!))
    }
    getProducts({ params: searchParams.toString() }).then(response => {
      if (response.success) {
        const { data, pages, links } = response
        setProducts(data);
        setPages(pages);
        setLinks(links);
      } else {
        setErrors(response.errors)
      }
    }).finally(() => {
      setIsLoading(false)
    })
  }

  // function setPage(page: number) {
  //   const newParams = new URLSearchParams(searchParams)
  //   newParams.set('page[page]', page.toString());
  //   navigate(`?${newParams.toString()}`, { replace: true });
  // }

  // function resetPager() {
  //   if (currentPage === 1) {
  //     loadProducts();
  //   } else {
  //     setPage(1)
  //   }
  // }

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
      <div>
        {errors.map(error => <p>{error.msj}</p>)}
      </div>
      <div className="flex flex-column sm:flex-row flex-wrap space-y-4 sm:space-y-0 items-center justify-between pb-4">
        <div>
          <label htmlFor="table-search" className="sr-only">Search</label>
          <div className="relative mt-1">
            <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
              </svg>
            </div>
            <input type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={handleKeyDown}
              id="table-search" className="w-full pl-10 pr-4 py-3 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary bg-surface-lowest text-body-md font-body-md outline-none transition-all shadow-sm" placeholder="Search for items" />
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
          </tr>
        </thead>
        <tbody className={isLoading ? "opacity-50 pointer-events-none" : "text-body-md font-body-md"}>
          {isLoading && products.length === 0 ? (
            <tr>
              <td colSpan={3} style={{ padding: 0, border: 'none' }}>
                <div className="flex items-center justify-center" style={{ minHeight: '60vh' }}>
                  <span className="text-lg text-gray-500">Loading...</span>
                </div>
              </td>
            </tr>
          ) : (
            products.map((product) =>
              <tr key={`product_${product.id}`} onClick={() => navigate(`/dashboard/products/form/${product.id}`)} className={"odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 even:dark:hover:bg-gray-700"}>
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {product.id}
                </th>
                <td className="px-6 py-4 capitalize">
                  {product.name}
                </td>
                <td className="px-6 py-4">
                  {formatPrice(product.price)}
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
                to={links.first.split('products')[1]}
                className="px-3 py-1 rounded border border-outline-variant text-on-surface-variant hover:bg-surface-container">
                First
              </NavLink>
            </li>
          }

          {links?.prev &&
            <li>
              <NavLink
                to={links.prev.split('products')[1]}
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
                to={links.next.split('products')[1]}
                className="px-3 py-1 rounded border border-outline-variant text-on-surface-variant hover:bg-surface-container">
                Next
              </NavLink>
            </li>
          }
          {links &&
            <li>
              <NavLink
                to={links.last.split('products')[1]}
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