import { describe, expect, it } from "vitest"
import { calculateOrderTotal, validateOrder, type OrderProductInput } from "./validation"

const products: OrderProductInput[] = [
  { quantity: "2", price: 25.5 },
  { quantity: "1", price: 49.99 }
]

describe("calculateOrderTotal", () => {
  it("calculates product quantities with currency precision", () => {
    expect(calculateOrderTotal(products)).toBe(100.99)
  })
})

describe("validateOrder", () => {
  it("accepts an empty advance as zero", () => {
    expect(validateOrder({ alumnId: 1, products, advance: "" })).toEqual([])
  })

  it("accepts an advance equal to the order total", () => {
    expect(validateOrder({ alumnId: 1, products, advance: "100.99" })).toEqual([])
  })

  it("requires an alumn and at least one product", () => {
    expect(validateOrder({ alumnId: 0, products: [], advance: "" })).toEqual([
      "Select an alumn",
      "Add at least one product"
    ])
  })

  it.each(["", "0", "-1", "1.5"])("rejects invalid product quantity %j", quantity => {
    expect(validateOrder({ alumnId: 1, products: [{ quantity, price: 10 }], advance: "" }))
      .toContain("Every product quantity must be a positive integer")
  })

  it.each(["-1", "invalid"])("rejects invalid advance %j", advance => {
    expect(validateOrder({ alumnId: 1, products, advance }))
      .toContain("Advance must be a valid non-negative amount")
  })

  it("rejects an advance above the calculated total", () => {
    expect(validateOrder({ alumnId: 1, products, advance: "101" }))
      .toContain("Advance cannot exceed the order total")
  })
})