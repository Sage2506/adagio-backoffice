export interface ILoginResponse {
  success: boolean, errors: { msj: string }[]
}

export interface IUserCredentials {
  email: string,
  password: string
}