import api from "./api";

const path = "/alumns"
export type AlumnRecord = {
  id: number,
  name: string
  last_name: string
}

export type IGetAlumnsResponse = {
  data: AlumnRecord[],
  links: {
    first: string,
    last: string,
    prev: string,
    next: string
  }
}
export async function getAlumns(params?: string[][]): Promise<IGetAlumnsResponse> {
  try {
    const response = await api.get<IGetAlumnsResponse>(`${path}`)
    return response.data
  } catch (error : any) {

    return {
      data: [],
      links: {
        first: "",
        last: "",
        prev: "",
        next: ""
      }
    }
  }
}