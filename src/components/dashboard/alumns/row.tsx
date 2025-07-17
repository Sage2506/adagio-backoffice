import { useEffect } from "react";
import type { IAlumnRecord } from "../../../types/alumns";
import { useNavigate } from "react-router";

interface IAlumnsRow {
  alumn: IAlumnRecord
}

export default function AlumnsRow({ alumn }: IAlumnsRow) {
  const navigate = useNavigate()
  useEffect(() => {

  }, []);
  return (
    <tr key={`alumn_${alumn.id}`} onClick={() => navigate(`/alumns/form/${alumn.id}`)} className={"odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 even:dark:hover:bg-gray-700 capitalize"}>
      <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white capitalize">
        {alumn.id}
      </th>
      <td className="px-6 py-4 capitalize">
        {alumn.name}
      </td>
      <td className="px-6 py-4 capitalize">
        {alumn.last_name}
      </td>
      <td className="px-6 py-4">

      </td>
    </tr>
  );
};