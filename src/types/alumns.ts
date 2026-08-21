import type { ISuccessfulDelete } from "../services/api"
import type { ILinks } from "./common"
import type { IGuadianRecord } from "./guardians"

export interface IAlumnNew {
  name: string
  last_name: string
  address: string
  phone_number: string
  email: string
  birth_date: string,
  special_med_conditions: string
  is_guardian_required_for_leaving: boolean
  guardian_ids: number[]
  subscription_attributes?: {
    plan_id: string
    subscribed_at?: string
    custom_price?: number
  }
}

export interface IAlumnRecord {
  id: number
  name: string
  last_name: string
  address: string
  phone_number: string
  email: string
  is_active: boolean
  created_at: string
  updated_at: string
  birth_date: string
  special_med_conditions: string
  is_guardian_required_for_leaving: boolean
  plan_id?: number | null
  subscription_id?: number | null
}

export interface IAlumnWithPlanAndSubscriptionRecord extends IAlumnRecord {
  plan_id: number | null
  subscription_id: number | null
}

export interface IAlumnGuardiansRecord {
  guardians: IGuadianRecord[]
  alumn: IAlumnWithPlanAndSubscriptionRecord
}

export interface IGetAlumnResponse {
  success: true
  data: IAlumnRecord
}

export interface IGetAlumnGuardiansResponse {
  success: true
  data: IAlumnGuardiansRecord
}

export interface IGetAlumnsResponse {
  success: true,
  data: IAlumnRecord[],
  links: ILinks,
  pages: number[]
  total: number
}

export interface IPostAlumnResponse {
  success: true,
  data: IAlumnRecord
}

export interface IPostAlumnDelete {
  success: true,
  data: ISuccessfulDelete
}

export interface IBirthdayAlumn {
  id: number
  name: string
  last_name: string
  birth_date: string
}

export interface IGetBirthdaysResponse {
  success: true
  data: IBirthdayAlumn[]
}