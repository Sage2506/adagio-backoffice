import type { IAlumnRecord } from "./alumns"
import type { ILinks } from "./common"
import type { IPaymentRecord } from "./payments"
import type { IProductRecord } from "./products"

export type OrderStatus = "pending" | "partial" | "paid"

export interface IOrderProductRecord {
  id: number
  product_id: number
  quantity: number
  price: number
  product: Pick<IProductRecord, "id" | "name" | "description" | "is_active">
}

export interface IOrderRecord {
  id: number
  user_email: string
  alumn_id: number
  status: OrderStatus
  total: number
  description: string
  created_at: string
  updated_at: string
  paid_amount: number
  remaining_balance: number
  alumn: Pick<IAlumnRecord, "id" | "name" | "last_name" | "email">
  order_products?: IOrderProductRecord[]
  payments?: Pick<IPaymentRecord, "id" | "quantity" | "paid_at" | "created_at" | "user_email">[]
}

export interface IOrderNew {
  order: {
    alumn_id: number
    description: string
    paid_amount?: number
  }
  products: { id: number, quantity: number }[]
}
export interface IGetOrdersResponse {
  data: IOrderRecord[]
  success: true
  count: number
  links: ILinks
  pages: number[]
}

export interface IGetOrderResponse {
  data: IOrderRecord
  success: true
}