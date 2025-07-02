import api, { OK, type IErrorResponse } from "./api";

const path = "/alumns"
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
}

export interface ILinks {
  first: string
  last: string
  prev?: string
  next?: string
}

interface IGetAlumnsResponse {
  success: true,
  data: IAlumnRecord[],
  links: ILinks,
  pages: number[]
}

export function getAlumns(params?: string): Promise<IGetAlumnsResponse | IErrorResponse> {
  return api.get<IGetAlumnsResponse>(`${path}?${params}`,).then(response => {
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