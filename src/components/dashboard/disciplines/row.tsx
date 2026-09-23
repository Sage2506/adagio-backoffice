import { memo } from "react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import type { IDisciplineRecord } from "../../../types/disciplines";
import { blockDemoReadOnlyAction, isDemoReadOnlySession } from "../../../utils/demoMode";

interface DisciplineRowProps {
  discipline: IDisciplineRecord;
  onEdit: (discipline: IDisciplineRecord) => void;
  onDelete: (event: React.MouseEvent, discipline: IDisciplineRecord) => void;
}

function DisciplineRow({ discipline, onEdit, onDelete }: DisciplineRowProps) {
  const isReadOnly = isDemoReadOnlySession();

  return (
    <tr className="border-b border-outline-variant hover:bg-surface-container-low transition-colors group">
      <th scope="row" className="py-4 px-6 font-bold text-on-surface">{discipline.id}</th>
      <td className="py-4 px-6 text-on-surface">{discipline.name}</td>
      <td className="py-4 px-6 text-on-surface-variant">{discipline.is_active ? "Active" : "Inactive"}</td>
      <td className="py-4 px-6 text-center">
        <div className="flex items-center justify-center gap-2">
          <button type="button" title="Edit discipline" disabled={isReadOnly} onClick={() => onEdit(discipline)} className="rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-primary disabled:cursor-not-allowed disabled:opacity-50">
            <PencilIcon className="size-5" />
            <span className="sr-only">Edit discipline</span>
          </button>
          <button type="button" title="Delete discipline" disabled={isReadOnly} onClick={event => { if (blockDemoReadOnlyAction(event)) return; onDelete(event, discipline); }} className="rounded-full p-2 text-error transition-colors hover:bg-error-container hover:text-on-error-container disabled:cursor-not-allowed disabled:opacity-50">
            <TrashIcon className="size-5" />
            <span className="sr-only">Delete discipline</span>
          </button>
        </div>
      </td>
    </tr>
  );
}

export default memo(DisciplineRow);
