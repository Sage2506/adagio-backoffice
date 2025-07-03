import api, { CREATED, OK, type IErrorResponse } from "./api";

const path = "/alumns";

export interface IAlumnNew {
  name: string
  last_name: string
  address: string
  phone_number: string
  email: string
  birth_date: string,
  special_med_conditions: string
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
}

export interface ILinks {
  first: string
  last: string
  prev?: string
  next?: string
}

interface IGetAlumnResponse {
  success: true
  data: IAlumnRecord
}

interface IGetAlumnsResponse {
  success: true,
  data: IAlumnRecord[],
  links: ILinks,
  pages: number[]
}

interface IPostAlumnResponse {
  success: true,
  data: IAlumnRecord
}

export function getAlumns(params?: string): Promise<IGetAlumnsResponse | IErrorResponse> {
  return api.get<IGetAlumnsResponse>(`${path}?${params}`).then(response => {
    if (response.status === OK) {
      const { data, links, pages } = response.data
      return { success: true as const, data, links, pages };
    } else {
      return { success: false as const, errors: [{ msj: response.status.toString() }] };
    }
  }).catch(error => {
    return { success: false as const, errors: [{ msj: error.message }] }
  })
}

export function getAlumn(id: string): Promise<IGetAlumnResponse | IErrorResponse> {
  return api.get<IAlumnRecord>(`${path}/${id}`).then(response => {
    if (response.status === OK) {
      return { success: true as const, data: response.data };
    } else {
      return { success: false as const, errors: [{ msj: response.status.toString() }] };
    }
  }).catch(error => {
    return { success: false as const, errors: [{ msj: error.message }] }
  })
}

export function postAlumn(data: IAlumnNew): Promise<IPostAlumnResponse | IErrorResponse> {
  return api.post<IAlumnRecord>(path, data).then(response => {
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