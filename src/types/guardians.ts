export interface IGuadianRecord {
  id: number
  name: string
  last_name: string
  address: string | null
  phone_number: string
  email: string
  is_active: boolean
  created_at: string
  updated_at: string
  primary?: boolean
}

export interface IGuardianNew {
  name: string
  last_name: string
  phone_number?: string
  email?: string
  alumn_id?: string
  primary?: boolean
}

export interface IGuardianRecord {
  id: number
  name: string
  last_name: string
  address: string | null
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

export interface IGetGuardiansResponse {
  success: true
  data: IGuardianRecord[]
}