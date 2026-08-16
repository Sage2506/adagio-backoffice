import { useEffect } from "react";
import type { IAlumnRecord } from "../../../types/alumns";
import { useNavigate } from "react-router";
import { TrashIcon } from "@heroicons/react/24/solid";

interface IAlumnsRow {
  alumn: IAlumnRecord
  handleDelete: Function
}

export default function AlumnsRow({ alumn, handleDelete }: IAlumnsRow) {
  const navigate = useNavigate()
  useEffect(() => {

  }, []);
  return (
    <tr key={`alumn_${alumn.id}`} onClick={() => navigate(`/alumns/form/${alumn.id}`)} className={"border-b border-outline-variant hover:bg-surface-container-low transition-colors group"}>
      <th scope="row" className="py-4 px-6 font-bold text-on-surface">
        {alumn.id}
      </th>
      <td className="py-4 px-6">
        {alumn.name}
      </td>
      <td className="py-4 px-6 text-on-surface-variant">
        {alumn.last_name}
      </td>
      <td className="py-4 px-6 text-on-surface-variant">
        {alumn.birth_date}
      </td>
      <td className="py-4 px-6 text-center">
        <button
          onClick={e => handleDelete(e, alumn)}
          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 dark:hover:text-red-400 dark:hover:bg-red-900 rounded-full transition-colors duration-200"
        >
          <TrashIcon className="w-5 h-5" />
        </button>
      </td>
    </tr>
  );
};