export interface ILoginResponse {
  success: boolean, id_token: string, errors: { msj: string }[]
}

export interface IUserCredentials {
  email: string,
  password: string
}