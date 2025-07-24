import type { ILinks } from "./common"

export interface IOrderRecord {
  id: number
  user_id: number
  alumn_id: number
  status: number
  total: number
  description: string
  created_at: string
  updated_at: string
  paid_amount: number
}

export interface IOrderNew {
  order: {
    alumn_id: number,
    total: number,
    description: string,
    paid_amount: number
  },
  products: { id: number, quantity: number, price: number }[]
}
export interface IGetOrdersResponse {
  data: IOrderRecord[]
  success: true
  links: ILinks
  pages: number[]
}

export interface IGetOrderResponse {
  data: IOrderRecord
  success: true
}