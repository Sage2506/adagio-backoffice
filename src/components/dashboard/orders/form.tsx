import { useState } from "react";
import AutocompleteCombobox from "../../utils/autocomplete";
import { getAlumns } from "../../../services/alumn";
import type { IAlumnRecord } from "../../../types/alumns";
import type { IProductRecord } from "../../../types/products";
import SearchCombobox from "../../utils/searchCombobox";
import { getProducts } from "../../../services/product";
import { formatPrice, handlePriceInputChange } from "../../../utils/numbers";
import type { IOrderNew } from "../../../types/orders";
import { postOrder } from "../../../services/order";
import { useNavigate } from "react-router";
import { TrashIcon } from "@heroicons/react/16/solid";
import { calculateOrderTotal, validateOrder, type OrderProductInput } from "./validation";

interface Product extends OrderProductInput {
  id: number
  name: string
}

export default function OrdersForm() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [alumnId, setAlumnId] = useState<number>(0);
  const [products, setProducts] = useState<Product[]>([])
  const [advancePercent, setAdvancePercent] = useState<20 | 30 | 50>()
  const [advance, setAdvance] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [errors, setErrors] = useState<{ msj: string }[]>([])

  function onOptionSelected(option: { id: string | number, label: string, value: IAlumnRecord } | null) {
    if (option && typeof option.id === "number") {
      setAlumnId(option.id)
      setErrors([])
    } else {
      setAlumnId(0)
    }
  }

  function onProductSelected(option: { id: string | number, label: string, value: IProductRecord } | null) {
    if (option) {
      let productRepeated: boolean = false
      let idx: number = 0
      while (!productRepeated && idx < products.length) {
        if (products[idx].id === option.id) { productRepeated = true }
        idx++
      }
      if (!productRepeated) {
        setProducts([...products, { id: option.value.id, name: option.value.name, quantity: "1", price: option.value.price }])
        setErrors([])
      }
    }
  }

  function clearSelection() {
    setProducts([])
    setAdvance('')
    setAdvancePercent(undefined)
  }

  function removeProduct(productId: number) {
    setProducts(products => products.filter(product => product.id !== productId))
    setAdvance('')
    setAdvancePercent(undefined)
  }

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>, productId: number) => {
    const inputValue = e.target.value;
    if (inputValue === '' || /^[1-9]\d*$/.test(inputValue)) {
      setAdvancePercent(undefined)
      setProducts(products =>
        products.map(product =>
          product.id === productId
            ? { ...product, quantity: e.target.value }
            : product
        )
      );
    }
  };

  function advanceSelected(percent: 20 | 30 | 50) {
    setAdvancePercent(percent);
    const newAdvance = Math.round(orderTotal() * percent) / 100
    setAdvance(newAdvance.toString())
  }

  async function fetchAlumns(query: string) {
    const response = await getAlumns({ params: `q[full_name_cont]=${query}` })
    if (response.success) {
      return response.data.map(alumn => ({ id: alumn.id, label: alumn.name + ' ' + alumn.last_name, value: alumn }))
    }
    return []
  }

  async function fetchProducts(query: string) {
    const response = await getProducts({ params: `q[name_cont]=${query}` })
    if (response.success) {
      return response.data.map(product => ({ id: product.id, label: product.name, value: product }))
    }
    return []
  }

  function formSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isLoading) return;

    const validationErrors = validateOrder({ alumnId, products, advance })
    if (validationErrors.length > 0) {
      setErrors(validationErrors.map(msj => ({ msj })))
      return
    }

    const advanceAmount = advance.trim() === '' ? 0 : Number(advance)
    const data: IOrderNew = {
      order: {
        alumn_id: alumnId,
        description: description.trim(),
        paid_amount: advanceAmount
      },
      products: products.map(product => ({ id: product.id, quantity: Number(product.quantity) }))
    }
    createOrder({ data })
  }

  async function createOrder(args: { data: IOrderNew }) {
    setIsLoading(true)
    const response = await (postOrder(args))
    if (response.success) {
      navigate("/dashboard/orders")
    } else {
      setErrors(response.errors)
    }
    setIsLoading(false)
  }

  function orderTotal(): number {
    return calculateOrderTotal(products)
  }

  return (
    <form onSubmit={event => formSubmit(event)} className={`py-6 px-6 space-y-6 ${isLoading ? 'opacity-50 pointer-events-none' : ''}`} >
      {errors.length > 0 && (
        <div role="alert" className="border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-700 dark:bg-red-950 dark:text-red-200">
          {errors.map((error, index) => <p key={`${error.msj}_${index}`}>{error.msj}</p>)}
        </div>
      )}
      <AutocompleteCombobox
        fetchOptions={fetchAlumns}
        onSelect={(option) => onOptionSelected(option)}
        onInputChange={() => setAlumnId(0)}
        placeholder="Search alumns..."
      />
      <div className="flex flex-column sm:flex-row flex-wrap space-y-4 sm:space-y-0 items-center justify-between">
        <div>
        </div>
        <div className="relative">
          <button typeof="button" id="dropdownRadioButton" onClick={() => clearSelection()} className="inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700" type="button">
            Clear selection
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
          </button>
        </div>
      </div>
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3 capitalize">
              id
            </th>
            <th scope="col" className="px-6 py-3 capitalize">
              name
            </th>
            <th scope="col" className="px-6 py-3 capitalize">
              quantity
            </th>
            <th scope="col" className="px-6 py-3 capitalize">
              price
            </th>
            <th scope="col" className="w-12 px-3 py-3">
              <span className="sr-only">Remove</span>
            </th>
          </tr>
        </thead>
        <tbody className={isLoading ? "opacity-50 pointer-events-none" : ""}>
          {products.map((product) => <tr key={`product_${product.id}`} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 even:dark:hover:bg-gray-700 capitalize">
            <th scope="col" className="px-6 py-3">{product.id}</th>
            <td scope="col" className="px-6 py-3">{product.name}</td>
            <td scope="col" className="px-6 py-3">
              <input type="number" min="1" step="1" onChange={(e) => handleQuantityChange(e, product.id)} value={product.quantity} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="0" />
            </td>
            <td scope="col" className="px-6 py-3">{formatPrice(product.price)}</td>
            <td className="px-3 py-3">
              <button type="button" onClick={() => removeProduct(product.id)} className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300" title={`Remove ${product.name}`} aria-label={`Remove ${product.name}`}>
                <TrashIcon className="h-5 w-5" />
              </button>
            </td>
          </tr>)}
        </tbody>
      </table>
      <div className="flex flex-column sm:flex-row flex-wrap space-y-4 sm:space-y-0 items-center justify-between">
        <div>
          <label htmlFor="advance" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Anticipo</label>
          <div className="flex gap-4">
            <input type="number" min="0" max={orderTotal()} step="0.01" id="advance" name="advance" value={advance} onChange={(e) => { setAdvancePercent(undefined); handlePriceInputChange(e, setAdvance) }} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="0.00" />
            <div className={`flex items-center flex-column flex-wrap md:flex-row justify-between ${isLoading ? 'opacity-50 pointer-events-none' : ''
              }`}>
              <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-12">
                <li>
                  <button type="button" onClick={() => advanceSelected(20)} className={`flex items-center justify-center px-3 h-12 ms-0 leading-tight border rounded-s-lg dark:hover:text-white ${advancePercent === 20
                    ? 'text-blue-600 bg-blue-50 border-blue-300 dark:text-white dark:bg-blue-600 dark:border-blue-700'
                    : 'text-gray-500 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700'
                    }`}>20%</button>
                </li>
                <li>
                  <button type="button" onClick={() => advanceSelected(30)} className={`flex items-center justify-center px-3 h-12 border ${advancePercent === 30
                    ? 'text-blue-600 bg-blue-50 border-blue-300 dark:text-white dark:bg-blue-600 dark:border-blue-700'
                    : 'text-gray-500 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700'
                    }`}>30%</button>
                </li>
                <li>
                  <button type="button" onClick={() => advanceSelected(50)} className={`flex items-center justify-center px-3 h-12 leading-tight border rounded-e-lg dark:hover:text-white ${advancePercent === 50
                    ? 'text-blue-600 bg-blue-50 border-blue-300 dark:text-white dark:bg-blue-600 dark:border-blue-700'
                    : 'text-gray-500 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700'
                    }`}>50%</button>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="relative">
          <p>Total: {formatPrice(orderTotal())}</p>
        </div>
      </div>
      <SearchCombobox
        fetchOptions={fetchProducts}
        onSelect={(option) => onProductSelected(option)}
        placeholder="Search products..."
      />
      <div className="flex flex-column sm:flex-row flex-wrap space-y-4 sm:space-y-0 items-center justify-between">
        <input type="text" id="description" name="description" value={description} onChange={(e) => setDescription(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="description" />
      </div>
      <button type="submit" disabled={isLoading} className={`text-white ${isLoading ? "bg-gray-400 cursor-progress" : "bg-blue-700 hover:bg-blue-800 cursor-pointer dark:bg-blue-600 dark:hover:bg-blue-700"} focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center  dark:focus:ring-blue-800`}>Submit</button>
    </form>
  );
};