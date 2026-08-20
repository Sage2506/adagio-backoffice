import type { IAlumnRecord } from "./alumns"
import type { ILinks } from "./common"
import type { IPlanRecord } from "./plans"

export interface ISubscriptionNew {
  plan_id: string
  alumn_id: string
  status?: number
  subscribed_at?: string
  custom_price?: number
}
export interface ISubscriptionRecord {
  plan_id: number
  alumn_id: number
  id: number
  due_date: string
  status: number
  paid_amount: number
  custom_price: number | null
  last_payment_date: string
  created_at: string
  updated_at: string
}

export interface ISubscriptionAlumnPlanRecord {
  plan_id: number
  alumn_id: number
  id: number
  due_date: string
  status: string
  last_payment_date: string
  created_at: string
  updated_at: string
  alumn: IAlumnRecord
  plan: IPlanRecord,
  paid_amount: number
  custom_price: number | null
}

export interface IPostSubscriptionResponse {
  success: true
  data: ISubscriptionRecord
}

export interface IGetSubscriptionsResponse {
  success: true,
  data: ISubscriptionAlumnPlanRecord[]
  links: ILinks
  pages: number[]
}

export interface IDueDate {
  due_date: string
}