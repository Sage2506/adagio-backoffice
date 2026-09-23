import { useCallback, useEffect, useState } from "react";
import { deleteAlumn, getAlumns, } from "../../../services/alumn";
import { useNavigate } from "react-router";
import type { IAlumnRecord } from "../../../types/alumns";
import ConfirmationModal from "../../utils/confirmationModal";
import AlumnsRow from "./row";
import { usePagination } from "../../../hooks/usePagination";
import PaginationComponent from "../../utils/paginationComponent";
import AgeRangeFilter from "../../utils/AgeRangeFilter";
import DisciplineFilter from "../../utils/DisciplineFilter";

export default function AlumnsTable() {
  const navigate = useNavigate()
  const [alumns, setAlumns] = useState<IAlumnRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ msj: string }[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [alumnToDelete, setAlumnToDelete] = useState<IAlumnRecord>();
  const {
    currentPage,
    pages,
    links,
    totalEntries,
    searchParams,
    searchString,
    setPagination,
    resetPagination,
    getPageTarget,
    getLinkTarget,
  } = usePagination({ resourcePath: "alumns" });

  useEffect(() => {
    if (searchParams.has('q[full_name_cont]')) {
      setSearchValue(searchParams.get('q[full_name_cont]')!)
    }
    loadAlumns();
  }, [searchString])

  async function loadAlumns() {
    setIsLoading(true)
    getAlumns({ params: searchParams.toString() }).then(response => {
      if (response.success) {
        const { data, pages, links, total } = response
        setAlumns(data);
        setPagination({ pages, links, total });
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

  const handleDelete = useCallback((event: React.MouseEvent, alumn: IAlumnRecord) => {
    event.stopPropagation()
    setAlumnToDelete(alumn)
    setIsModalOpen(true);
  }, [])

  function onConfirmResponse(accepted: boolean) {
    if (alumnToDelete) {
      if (accepted) {
        eraseAlum();
      }
    }
    setIsModalOpen(false)
  }

  async function eraseAlum() {
    if (alumnToDelete) {
      setIsLoading(true)
      const response = await deleteAlumn({ id: alumnToDelete.id })
      if (response.success) {
        resetPagination(loadAlumns)
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
        onConfirmResponse={onConfirmResponse}
      />
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-stack-sm w-full">
        <div className="flex w-full flex-col flex-wrap items-start gap-stack-sm lg:flex-row lg:items-end">
          <div className="w-full md:w-80">
            <label htmlFor="table-search" className="block text-label-md font-label-md text-on-surface-variant">Search</label>
            <div className="relative mt-1 flex items-center">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg className="w-4 h-4 text-on-surface-variant" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                </svg>
              </div>
              <input type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={handleKeyDown}
                id="table-search" className="w-full pl-10 pr-10 py-2 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary bg-surface-lowest text-on-surface text-body-md font-body-md outline-none transition-all" placeholder="Search for alumns" />
            </div>
          </div>
          <AgeRangeFilter idPrefix="alumns" />
          <DisciplineFilter idPrefix="alumns" />
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
              alumns.map((alumn) => <AlumnsRow key={'student' + alumn.id} alumn={alumn} handleDelete={handleDelete} />)
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
        currentItems={alumns.length}
        getPageTarget={getPageTarget}
        getLinkTarget={getLinkTarget}
      />
    </div >
  )
}