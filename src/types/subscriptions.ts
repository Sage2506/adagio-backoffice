import type { IAlumnRecord, ILinks } from "./alumns"
import type { IPlanRecord } from "./plans"

export interface ISubscriptionNew {
  plan_id: string
  alumn_id: string
}
export interface ISubscriptionRecord {
  plan_id: number
  alumn_id: number
  id: number
  due_date: string
  status: number
  last_payment_date: string
  created_at: string
  updated_at: string
}

export interface ISubscriptionAlumnPlanRecord {
  plan_id: number
  alumn_id: number
  id: number
  due_date: string
  status: number
  last_payment_date: string
  created_at: string
  updated_at: string
  alumn: IAlumnRecord
  plan: IPlanRecord
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