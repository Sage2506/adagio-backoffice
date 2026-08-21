import type { IAlumnRecord } from "./alumns"
import type { ILinks } from "./common"
import type { IPlanRecord } from "./plans"

export type IPaymentMethod = 'cash' | 'card'

export interface IPaymentNew {
  payment: {
    alumn_id: string
    quantity: string
    created_at?: string
    paid_at?: string
    payment_method?: IPaymentMethod
  }
  paid_amount?: string
  payable_type: 'subscription' | 'order'
  payable_id: string
}

export interface IGetPaymentsResponse {
  success: true,
  data: IPaymentRecord[]
  links: ILinks
  pages: number[]
}

export interface IPaymentRecord {
  id: number
  alumn_id: number
  created_at: string
  paid_at: string
  quantity: number
  updated_at: string
  user_email: string
  payment_method: string
}

export interface IPostPaymentResponse {
  success: true
  data: IPaymentRecord
}

export interface IPaymentAlumnPlan {
  id: number
  plan_id: number
  alumn_id: number
  due_date: string
  status: number
  custom_price: number | null
  last_payment_date: string
  created_at: string
  updated_at: string
  alumn: IAlumnRecord
  plan: IPlanRecord
}