import { useState, useEffect } from "react";
import { getAlumns, } from "../../../services/alumn";
import { NavLink, useNavigate, useSearchParams } from "react-router";
import type { IAlumnRecord } from "../../../types/alumns";
import type { ILinks } from "../../../types/common";


export default function AlumnsTable() {
  const navigate = useNavigate()
  const [alumns, setAlumns] = useState<IAlumnRecord[]>([]);
  const [pages, setPages] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [links, setLinks] = useState<ILinks>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ msj: string }[]>([]);
  const [searchParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState('');



  useEffect(() => {
    if (searchParams.has('page[page]')) {
      setCurrentPage(parseInt(searchParams.get('page[page]')!))
    } else {
      setCurrentPage(1)
    }
    if (searchParams.has('q[full_name_cont]')) {
      setSearchValue(searchParams.get('q[full_name_cont]')!)
    }
    loadAlumns();
  }, [searchParams.toString()])

  async function loadAlumns() {
    setIsLoading(true)
    getAlumns({ params: searchParams.toString() }).then(response => {
      if (response.success) {
        const { data, pages, links } = response
        setAlumns(data);
        setPages(pages);
        setLinks(links);
      } else {
        setErrors(response.errors)
      }
    }).finally(() => {
      setIsLoading(false)
    })
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('page[page]')
      if (searchValue.trim()) {
        newParams.set('q[full_name_cont]', searchValue.trim());
      } else {
        newParams.delete('q[full_name_cont]');
      }
      // Replace the current route
      navigate(`?${newParams.toString()}`, { replace: true });
    }
  };

  function setPage(page: number) {
    const newParams = new URLSearchParams(searchParams)
    newParams.set('page[page]', page.toString());
    navigate(`?${newParams.toString()}`, { replace: true });
  }

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg my-10 mx-6">
      <div className="pb-4 ">
        <label htmlFor="table-search" className="sr-only">Search</label>
        <div className="relative mt-1">
          <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
            </svg>
          </div>
          <input type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={handleKeyDown}
            id="table-search" className="block pt-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search for items" />
        </div>
      </div>
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Name
            </th>
            <th scope="col" className="px-6 py-3">
              Last name
            </th>
          </tr>
        </thead>

        <tbody className={isLoading ? "opacity-50 pointer-events-none" : ""}>
          {alumns.map((alumn) =>
            <tr key={`alumn_${alumn.id}`} onClick={() => navigate(`/alumns/form/${alumn.id}`)} className={"odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 even:dark:hover:bg-gray-700"}>
              <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                {alumn.name}
              </th>
              <td className="px-6 py-4">
                {alumn.last_name}
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
                to={links.first.split('alumns')[1]}
                className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                First
              </NavLink>
            </li>
          }

          {links?.prev &&
            <li>
              <NavLink
                to={links.prev.split('alumns')[1]}
                className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                Previous
              </NavLink>
            </li>
          }

          {pages.map(page =>
            <li key={`page_${page}`}>
              <a
                aria-current={currentPage === page ? 'page' : 'false'}

                onClick={() => setPage(page)}
                className={
                  `flex items-center justify-center px-3 h-8 border ${currentPage === page
                    ? 'text-blue-600 bg-blue-50 border-blue-300 dark:text-white dark:bg-blue-600 dark:border-blue-700'
                    : 'text-gray-500 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700'
                  }`
                }>
                {page}
              </a>
            </li>
          )}

          {links?.next &&
            <li>
              <NavLink
                to={links.next.split('alumns')[1]}
                className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                Next
              </NavLink>
            </li>
          }
          {links &&
            <li>
              <NavLink
                to={links.last.split('alumns')[1]}
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