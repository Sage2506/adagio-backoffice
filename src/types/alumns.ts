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
}

export interface IAlumnGuardiansRecord {
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
  guardians: IGuadianRecord[]
  plan_id: number
  subscription_id: number
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
}

export interface IPostAlumnResponse {
  success: true,
  data: IAlumnRecord
}