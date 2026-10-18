import type { IAlumnRecord } from "./alumns"
import type { ILinks } from "./common"
import type { IPlanRecord } from "./plans"

export interface ISubscriptionNew {
  plan_id: string
  alumn_id: string
  status?: number
  subscribed_at?: string
  custom_price?: number | null
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
  alumn_id: number
  alumn: IAlumnRecord
  created_at: string
  custom_price: number | null
  due_date: string
  guardian_phone_number: string,
  id: number
  is_past_due?: boolean
  last_payment_date: string
  paid_amount: number
  plan_id: number
  plan: IPlanRecord,
  status: string
  updated_at: string
  whatsapp_reminder_message: string
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
  total: number
}

export interface IDueDate {
  due_date: string
}