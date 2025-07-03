export interface IGuadianRecord {
  id: number
  name: string
  last_name: string
  address: any
  phone_number: string
  email: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface IGuardianNew {
  name: string
  last_name: string
  phone_number?: string
  email?: string
  alumn_id?: number
}

export interface IGuardianRecord {
  id: number
  name: string
  last_name: string
  address: any
  phone_number: string
  email: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface IPostGuardianResponse {
  success: true,
  data: IGuardianRecord
}