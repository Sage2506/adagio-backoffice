import { useState } from "react";
import { logIn } from "../../services/user";
import { Navigate } from "react-router";
import { useAuth } from "./useAuth";
import { LoadingSpinner } from "../utils/loadingSpiner";

function Login() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ msj: string }[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { isAuthenticated, isLoading: authLoading, login } = useAuth();

  function formSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrors([])
    let isValid: boolean = true;
    if (email.trim().length === 0) {
      setErrors([...errors, { msj: 'Missing email' }])
      isValid = false
    } else {
      const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g
      if (!emailRegex.test(email)) {
        setErrors([...errors, { msj: 'Invalid email' }])
        isValid = false;
      }
    }

    if (password.trim().length === 0) {
      setErrors([...errors, { msj: 'Missing password' }])
      isValid = false
    }
    if (isValid) {
      postLogIn({ email, password })
    }

  }

  async function postLogIn(data: { email: string, password: string }) {
    try {
      setIsLoading(true);
      const response = await logIn({ user: data })
      if (response.success) {
        login()
      } else {
        setErrors(response.errors)
      }
    } catch (err: any) {
      setErrors([{ msj: (err.response?.data?.message || 'Login failed') }]);
    } finally {
      setIsLoading(false)
    }

  }

  if (authLoading) {
    return <LoadingSpinner />;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex w-full min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={event => formSubmit(event)}>
          <div>
            <p className="text-on-background">Please sign in</p>
          </div>
          <div>{errors.map((error, idx) => <p key={idx}>{error.msj}</p>)}</div>
          <div>
            <label htmlFor="email" className="text-sm/6 font-medium text-on-background dark:block">Email address</label>
            <div className="mt-2">
              <input
                type="text"
                name="email"
                id="email"
                autoComplete="email"
                required
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                value={email}
                onChange={(e) => { setEmail(e.target.value) }} />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-sm/6 font-medium text-on-background">Password</label>
            </div>
            <div className="mt-2">
              <input
                type="password"
                name="password"
                id="password"
                autoComplete="current-password"
                required
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                value={password}
                onChange={(e) => { setPassword(e.target.value) }} />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input id="rememberMe" aria-describedby="rememberMe" type="checkbox" checked={rememberMe} onChange={() => { setRememberMe(!rememberMe) }} className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="rememberMe" className="text-sm/6 font-medium text-on-background">Remember me</label>
              </div>
            </div>

          </div>
          <button type="submit" disabled={isLoading || authLoading} className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">{isLoading ? 'Logging in...' : 'Login'}</button>
        </form>
      </div>
    </div>
  );
}
export default Login;