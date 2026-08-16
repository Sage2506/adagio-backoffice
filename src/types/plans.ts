import type { ILinks } from "./common"

export interface IPlanNew {
  name: string
  price: string
  subscription_duration: string
  tolerance_days: string
}
export interface IPlanRecord {
  id: number
  name: string
  price: number
  subscription_duration: number
  tolerance_days: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface IGetPlansResponse {
  success: true
  data: IPlanRecord[]
  links: ILinks
  pages: number[]
}

export interface IGetPlanResponse {
  success: true
  data: IPlanRecord
}
