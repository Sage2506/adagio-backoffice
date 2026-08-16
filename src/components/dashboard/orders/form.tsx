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
import { ArrowPathIcon, BanknotesIcon, ShoppingCartIcon, UserIcon } from "@heroicons/react/24/outline";
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

  const fieldClass = "w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-lowest text-on-surface focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all text-body-md font-body-md";
  const labelClass = "block text-label-md font-label-md text-on-surface-variant mb-2";
  const sectionTitleClass = "text-headline-sm text-on-surface flex items-center gap-2";

  return (
    <form onSubmit={event => formSubmit(event)} className={`w-full min-w-0 flex flex-col gap-stack-md font-body-md ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}>
      <header className="mb-stack-md flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-headline-md text-on-surface">Create Order</h1>
          <p className="text-body-md text-on-surface-variant mt-1">Process a new transaction or product sale.</p>
        </div>
        <button type="submit" disabled={isLoading} className={`bg-primary text-on-primary font-bold px-6 py-3 rounded-lg hover:bg-surface-tint transition-colors shadow-sm whitespace-nowrap ${isLoading ? 'cursor-progress opacity-70' : ''}`}>Submit order</button>
      </header>

      {errors.length > 0 && (
        <div role="alert" className="mb-stack-md rounded-lg border border-error-container bg-error-container px-4 py-3 text-body-md text-on-error-container">
          {errors.map((error, index) => <p key={`${error.msj}_${index}`}>{error.msj}</p>)}
        </div>
      )}
      <main className="max-w-4xl space-y-stack-md">
        <section className="bg-surface-lowest rounded-xl shadow-soft border border-surface-container p-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
            <h2 className={sectionTitleClass}><UserIcon className="w-5 h-5 text-primary" />Select Alumn</h2>
            <button id="dropdownRadioButton" onClick={() => clearSelection()} className="text-label-md font-label-md text-primary hover:text-surface-tint flex items-center gap-1 transition-colors" type="button"><ArrowPathIcon className="w-4 h-4" />Clear selection</button>
          </div>
          <div className="relative [&_input]:pl-12 [&_input]:pr-4 [&_input]:py-3 [&_input]:rounded-lg [&_input]:border-outline-variant [&_input]:bg-surface-lowest [&_input]:text-on-surface [&_input]:focus:ring-1 [&_input]:focus:ring-primary [&_input]:focus:border-primary [&_input]:text-body-md [&_input]:font-body-md [&_ul]:rounded-lg [&_ul]:border-outline-variant [&_ul]:bg-surface-lowest [&_ul]:text-on-surface [&_ul]:shadow-soft">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-outline pointer-events-none z-10">&#128269;</span>
            <AutocompleteCombobox fetchOptions={fetchAlumns} onSelect={option => onOptionSelected(option)} onInputChange={() => setAlumnId(0)} placeholder="Search alumns by name or ID..." />
          </div>
        </section>

        <section className="bg-surface-lowest rounded-xl shadow-soft border border-surface-container p-6">
          <h2 className={`${sectionTitleClass} mb-6`}><ShoppingCartIcon className="w-5 h-5 text-primary" />Products &amp; Details</h2>
          <div className="space-y-4 mb-8">
            <div className="relative [&_input]:pl-12 [&_input]:pr-4 [&_input]:py-3 [&_input]:rounded-lg [&_input]:border-outline-variant [&_input]:bg-surface-lowest [&_input]:text-on-surface [&_input]:focus:ring-1 [&_input]:focus:ring-primary [&_input]:focus:border-primary [&_input]:text-body-md [&_input]:font-body-md [&_ul]:rounded-lg [&_ul]:border-outline-variant [&_ul]:bg-surface-lowest [&_ul]:text-on-surface [&_ul]:shadow-soft">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-outline pointer-events-none z-10">&#128269;</span>
              <SearchCombobox fetchOptions={fetchProducts} onSelect={option => onProductSelected(option)} placeholder="Search products..." />
            </div>
            <textarea id="description" name="description" value={description} onChange={e => setDescription(e.target.value)} className={`${fieldClass} resize-none`} placeholder="Order description or notes..." rows={2} />
          </div>
          {products.length === 0 ? (
            <div className="border border-dashed border-outline-variant rounded-lg p-8 text-center bg-surface-bright">
              <ShoppingCartIcon className="w-8 h-8 text-outline mx-auto mb-2" />
              <p className="text-body-md text-on-surface-variant">No products added yet.<br />Search and select products to add them to the order.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-outline-variant">
              <table className="w-full text-left border-collapse">
                <thead><tr className="border-b border-outline-variant bg-surface"><th className="py-4 px-6 text-table-header font-table-header text-on-surface-variant uppercase tracking-wider">ID</th><th className="py-4 px-6 text-table-header font-table-header text-on-surface-variant uppercase tracking-wider">Name</th><th className="py-4 px-6 text-table-header font-table-header text-on-surface-variant uppercase tracking-wider">Quantity</th><th className="py-4 px-6 text-table-header font-table-header text-on-surface-variant uppercase tracking-wider">Price</th><th className="w-12 px-3 py-4"><span className="sr-only">Remove</span></th></tr></thead>
                <tbody className="text-body-md font-body-md">{products.map(product => <tr key={`product_${product.id}`} className="border-b border-outline-variant last:border-b-0"><td className="px-6 py-3">{product.id}</td><td className="px-6 py-3 capitalize">{product.name}</td><td className="px-6 py-3"><input type="number" min="1" step="1" onChange={e => handleQuantityChange(e, product.id)} value={product.quantity} className="w-24 px-3 py-2 rounded-md border border-outline-variant bg-surface-lowest text-on-surface focus:ring-1 focus:ring-primary focus:border-primary outline-none" placeholder="0" /></td><td className="px-6 py-3">{formatPrice(product.price)}</td><td className="px-3 py-3"><button type="button" onClick={() => removeProduct(product.id)} className="p-2 rounded-md text-error hover:bg-error-container hover:text-on-error-container" title={`Remove ${product.name}`} aria-label={`Remove ${product.name}`}><TrashIcon className="h-5 w-5" /></button></td></tr>)}</tbody>
              </table>
            </div>
          )}
        </section>

        <section className="bg-surface-lowest rounded-xl shadow-soft border border-surface-container p-6">
          <h2 className={`${sectionTitleClass} mb-6`}><BanknotesIcon className="w-5 h-5 text-primary" />Payment Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div><label htmlFor="advance" className={labelClass}>Anticipo (Deposit)</label><div className="relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-bold">$</span><input type="number" min="0" max={orderTotal()} step="0.01" id="advance" name="advance" value={advance} onChange={e => { setAdvancePercent(undefined); handlePriceInputChange(e, setAdvance) }} className={`${fieldClass} pl-8`} placeholder="0.00" /></div></div>
            <div><p className={labelClass}>Quick Percentage</p><div className="flex rounded-lg border border-outline-variant overflow-hidden">{([20, 30, 50] as const).map(percent => <button key={percent} type="button" onClick={() => advanceSelected(percent)} className={`flex-1 py-3 text-body-md font-body-md border-r border-outline-variant last:border-r-0 transition-colors ${advancePercent === percent ? 'bg-primary-container text-on-primary-container font-semibold' : 'text-on-surface-variant hover:bg-surface-container'}`}>{percent}%</button>)}</div></div>
          </div>
        </section>

        <section className="rounded-xl border border-primary-container bg-surface-container-low p-6 flex flex-col sm:flex-row justify-between sm:items-end gap-3">
          <div><p className="text-label-md font-label-md text-on-surface-variant">Order Total</p><p className="text-headline-md font-bold text-primary">{formatPrice(orderTotal())}</p></div>
          <p className="text-body-md text-on-surface-variant">Advance: {formatPrice(Number(advance) || 0)}</p>
        </section>
      </main>
    </form>
  );
};