import { memo } from "react";
import { TrashIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router";
import type { IProductRecord } from "../../../types/products";
import { formatPrice } from "../../../utils/numbers";
import { blockDemoReadOnlyAction, isDemoReadOnlySession } from "../../../utils/demoMode";

interface ProductsRowProps {
  product: IProductRecord;
  onDelete: (event: React.MouseEvent, product: IProductRecord) => void;
}

function ProductsRow({ product, onDelete }: ProductsRowProps) {
  const navigate = useNavigate();
  const isReadOnly = isDemoReadOnlySession();

  return (
    <tr
      onClick={() => navigate(`/dashboard/products/form/${product.id}`)}
      className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 even:dark:hover:bg-gray-700"
    >
      <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
        {product.id}
      </th>
      <td className="px-6 py-4 capitalize">{product.name}</td>
      <td className="px-6 py-4">{formatPrice(product.price)}</td>
      <td className="px-6 py-4 text-center">
        <button
          type="button"
          title="Delete product"
          aria-label={`Delete ${product.name}`}
          disabled={isReadOnly}
          onClick={event => {
            if (blockDemoReadOnlyAction(event)) return;
            onDelete(event, product);
          }}
          className="rounded-full p-2 text-red-600 transition-colors hover:bg-red-100 hover:text-red-800 dark:hover:bg-red-900 dark:hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent"
        >
          <TrashIcon className="h-5 w-5" />
        </button>
      </td>
    </tr>
  );
}

export default memo(ProductsRow);
