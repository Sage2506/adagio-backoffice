import api, { CREATED, type IErrorResponse } from "./api"

const path = "/guardians";

export interface IGuardianNew {
  name: string
  last_name: string
  phone_number?: string
  email?: string
  alumn_id?: number
}

interface IGuardianRecord {
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

interface IPostGuardianResponse {
  success: true,
  data: IGuardianRecord
}

export function postGuardian(data: IGuardianNew): Promise<IPostGuardianResponse | IErrorResponse> {
  return api.post<IGuardianRecord>(path, data).then(response => {
    if (response.status === CREATED) {
      return {
        success: true as const,
        data: response.data
      };
    } else {
      return {
        success: false as const,
        errors: [{ msj: response.status.toString() }]
      };
    }
  }).catch((error: { message: string }) => {
    return {
      success: false as const,
      errors: [{ msj: error.message }]
    };
  });
}