
import type { ILoginResponse, IUserCredentials } from "../types/auth";
import type { IErrorResponse } from "../types/errors";
import { api, OK } from "./api";



export function logIn(args: { user: IUserCredentials }): Promise<ILoginResponse | IErrorResponse> {
  const { user } = args;
  return api.post<ILoginResponse>(`auth/login`, user).then(response => {
    if (response.status === OK) {

      api.defaults.headers.common['Authorization'] = response.data.id_token;
      localStorage.setItem("id_token", response.data.id_token)
      return { success: true, id_token: response.data.id_token, errors: [] }
    } else {
      return { success: false, errors: [{ msj: response.status.toString() }], id_token: "" }
    }
  }).catch(error => {
    return { success: false, errors: [{ msj: error.message }], id_token: "" }
  })
}