import type { IAlumnRecord } from "./alumns"
import type { IPlanRecord } from "./plans"

export interface IPaymentNew {
  payment: {
    alumn_id: string
    quantity: string
    created_at?: string
  }
  payable_type: 'subscription' | 'order'
  payable_id: string
}

export interface IPaymentRecord {
  id: number
  alumn_id: number
  quantity: number
  created_at: string
  updated_at: string
  user_email: string
}

export interface IPostPaymentResponse {
  success: true
  data: IPaymentRecord
}

export interface IPaymentAlumnPlan{
  id: number
  plan_id: number
  alumn_id: number
  due_date: string
  status: number
  last_payment_date: string
  created_at: string
  updated_at: string
  alumn: IAlumnRecord
  plan: IPlanRecord
}