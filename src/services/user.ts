
import type { ILoginResponse, IUserCredentials } from "../types/auth";
import type { IErrorResponse } from "../types/errors";
import { api, OK } from "./api";



export function logIn(args: { user: IUserCredentials }): Promise<ILoginResponse | IErrorResponse> {
  const { user } = args;
  return api.post<ILoginResponse>(`auth/login`, user).then(response => {
    if (response.status === OK) {
      return { success: true, errors: [] }
    } else {
      return { success: false, errors: [{ msj: response.status.toString() }] }
    }
  }).catch(error => {
    return { success: false, errors: [{ msj: error.message }] }
  })
}

export function logOut(): Promise<void> {
  return api.post("auth/logout").then(() => undefined);
}

export function getCurrentUser(): Promise<{ email: string } | null> {
  return api.get<{ email: string }>("auth/me")
    .then(response => response.data)
    .catch(() => null);
}