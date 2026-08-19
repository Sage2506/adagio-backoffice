import { useState, useEffect } from "react";
import { deleteAlumn, getAlumns, } from "../../../services/alumn";
import { NavLink, useNavigate, useSearchParams } from "react-router";
import type { IAlumnRecord } from "../../../types/alumns";
import type { ILinks } from "../../../types/common";
import ConfirmationModal from "../../utils/confirmationModal";
import AlumnsRow from "./row";

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
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [alumnToDelete, setAlumnToDelete] = useState<IAlumnRecord>();
  const [totalEntries, setTotalEntries] = useState<number>(0);
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
        const { data, pages, links, total } = response
        setAlumns(data);
        setPages(pages);
        setLinks(links);
        setTotalEntries(total)
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
      navigate(`?${newParams.toString()}`, { replace: true });
    }
  };

  function setPage(page: number) {
    const newParams = new URLSearchParams(searchParams)
    newParams.set('page[page]', page.toString());
    navigate(`?${newParams.toString()}`, { replace: true });
  }

  function resetPager() {
    if (currentPage === 1) {
      loadAlumns();
    } else {
      setPage(1)
    }
  }

  function handleDelete(e: React.FormEvent, alumn: IAlumnRecord) {
    e.stopPropagation()
    setAlumnToDelete(alumn)
    setIsModalOpen(true);
  }

  function onConfirmResponse(accepted: boolean) {
    if (alumnToDelete) {
      if (accepted) {
        eraseAlun();
      }
    }
    setIsModalOpen(false)
  }

  async function eraseAlun() {
    if (alumnToDelete) {
      setIsLoading(true)
      const response = await deleteAlumn({ id: alumnToDelete.id })
      if (response.success) {
        resetPager()
      } else {
        setIsLoading(false)
      }
    }
  }

  return (
    <div className="w-full min-w-0 flex flex-col gap-stack-md">
      <div className={`${errors.length > 0 ? 'block' : 'hidden'}`}>
        {errors.map((error, idx) => <p key={error + '_' + idx}>{error.msj}</p>)}
      </div>
      <ConfirmationModal
        titleText="Delete Alumn"
        bodyText={`You're about to erase alumn ${alumnToDelete?.name + " " + alumnToDelete?.last_name}, are you sure?`}
        confirmText="Yes"
        rejectText="No"
        isModalOpen={isModalOpen}
        onConfirmResponse={((accepted: boolean) => onConfirmResponse(accepted))}
      />
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-stack-sm w-full">
        <div className="w-full md:w-80">
          <div className="relative flex items-center">
            <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
              </svg>
            </div>
            <input type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={handleKeyDown}
              id="table-search" className="w-full pl-10 pr-10 py-2 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary bg-surface-lowest text-body-md font-body-md outline-none transition-all" placeholder="Search for alumns" />
          </div>
        </div>
        <div className="relative">
          <button onClick={() => navigate('/dashboard/alumns/form')} className="bg-primary text-on-primary font-bold py-2 px-6 rounded-lg flex items-center gap-2 hover:bg-surface-tint transition-colors shadow-sm whitespace-nowrap" type="button">
            Create
            <svg className="w-6 h-6 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14m-7 7V5" />
            </svg>
          </button>
        </div>
      </div>
      <div
        className="xl:col-span-8 2xl:col-span-9 bg-surface-container-lowest rounded-xl border border-outline-variant shadow-soft overflow-hidden">
        <div className="overflow-x-auto"></div>
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
                Last name
              </th>
              <th scope="col" className="py-4 px-6 text-table-header font-table-header text-on-surface-variant uppercase tracking-wider">
                Birthday
              </th>
              <th scope="col" className="py-4 px-6 text-table-header font-table-header text-on-surface-variant uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className={isLoading ? "opacity-50 pointer-events-none" : "text-body-md font-body-md"}>
            {isLoading && alumns.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: 0, border: 'none' }}>
                  <div className="flex items-center justify-center" style={{ minHeight: '60vh' }}>
                    <span className="text-lg text-gray-500">Loading...</span>
                  </div>
                </td>
              </tr>
            ) : (
              alumns.map((alumn) => <AlumnsRow key={'alumno' + alumn.id} alumn={alumn} handleDelete={handleDelete} />)
            )}
          </tbody>
        </table>
      </div>
      <div className="px-6 py-4 flex items-center justify-between border-t border-outline-variant bg-surface">
        <div className="text-label-md font-label-md text-on-surface-variant">Showing {(currentPage - 1) * 10 + 1} to {(currentPage -1 ) * 10 + alumns.length } of {totalEntries} entries</div>
        <nav
          className={`flex gap-1 ${isLoading ? 'opacity-50 pointer-events-none' : ''
            }`}
          aria-busy={isLoading}
          aria-live="polite"
          aria-label="Table navigation">
          {links &&
            <NavLink
              to={links.first.split('alumns')[1]}
              className={
                `px-3 py-1 rounded border ${currentPage === 1
                  ? 'border-primary bg-primary-container text-on-primary-container font-bold'
                  : 'border-outline-variant text-on-surface-variant hover:bg-surface-container'
                }`}>
              First
            </NavLink>
          }
          {links?.prev &&
            <NavLink
              to={links.prev.split('alumns')[1]}
              className="px-3 py-1 rounded border">
              Previous
            </NavLink>
          }
          {pages.map(page =>
            <a key={`page_${page}`}
              aria-current={currentPage === page ? 'page' : 'false'}
              onClick={() => setPage(page)}
              className={
                `px-3 py-1 rounded border ${currentPage === page
                  ? 'border-primary bg-primary-container text-on-primary-container font-bold'
                  : 'border-outline-variant text-on-surface-variant hover:bg-surface-container'
                }`
              }>
              {page}
            </a>
          )}
          {links?.next &&
            <NavLink
              to={links.next.split('alumns')[1]}
              className="px-3 py-1 rounded border border-outline-variant text-on-surface-variant hover:bg-surface-container">
              Next
            </NavLink>
          }
          {links &&
            <NavLink
              to={links.last.split('alumns')[1]}
              className="px-3 py-1 rounded border border-outline-variant text-on-surface-variant hover:bg-surface-container">
              Last
            </NavLink>
          }
        </nav>
      </div>
    </div >
  )
}