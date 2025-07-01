
import { api } from "./api";

interface loginResponse {
  id_token: string;
  status: number,
}

export function logIn(args: { user: { email?: string, password?: string }, rememberMe: boolean }): Promise<{ success: boolean, idToken: string, errors: { msj: string }[] }> {
  const { user } = args;
  return api.post<loginResponse>(`auth/login`, user).then(response => {
    if (response.status === 200) {

      api.defaults.headers.common['Authorization'] = response.data.id_token;
      localStorage.setItem("id_token", response.data.id_token)
      return { success: true, idToken: response.data.id_token, errors: [] }
      /*if (rememberMe) {
        const cookies = new Cookies();
        cookies.set('authToken', response.data.auth_token, { path: '/', maxAge: 31536000 });
      }

      response = await api.get(`${path}/current_user_data`);
      const { status, data } = response
      if (status === 200) {
        //dispatch(setCurrentUser(data))
      } else {
        //dispatch(showError("Error de correo o contraseña"))
      }
      //dispatch(login())*/
    } else {
      //dispatch(showError("Error de correo o contraseña"))
      return { success: false, errors: [{ msj: response.status.toString() }], idToken: "" }
    }
  }).catch(success => {
    console.log("success: ", success)
    return { success: false, errors: [{ msj: success.message }], idToken: "" }
  })
}