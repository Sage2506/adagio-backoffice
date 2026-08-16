export interface OrderProductInput {
  quantity: string
  price: number
}

interface OrderValidationInput {
  alumnId: number
  products: OrderProductInput[]
  advance: string
}

export function calculateOrderTotal(products: OrderProductInput[]): number {
  const totalInCents = products.reduce((total, product) => {
    const quantity = Number(product.quantity)
    if (!Number.isInteger(quantity) || quantity <= 0) return total

    return total + Math.round(product.price * 100) * quantity
  }, 0)

  return totalInCents / 100
}

export function validateOrder({ alumnId, products, advance }: OrderValidationInput): string[] {
  const errors: string[] = []
  const total = calculateOrderTotal(products)
  const advanceAmount = advance.trim() === '' ? 0 : Number(advance)

  if (alumnId <= 0) errors.push("Select an alumn")
  if (products.length === 0) errors.push("Add at least one product")
  if (products.some(product => !/^[1-9]\d*$/.test(product.quantity))) {
    errors.push("Every product quantity must be a positive integer")
  }
  if (!Number.isFinite(advanceAmount) || advanceAmount < 0) {
    errors.push("Advance must be a valid non-negative amount")
  } else if (advanceAmount > total) {
    errors.push("Advance cannot exceed the order total")
  }

  return errors
}