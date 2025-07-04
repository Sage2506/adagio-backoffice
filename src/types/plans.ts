import type { ILinks } from "./alumns"

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
  success: boolean
  data: IPlanRecord[]
  links: ILinks
  pages: number[]
}
