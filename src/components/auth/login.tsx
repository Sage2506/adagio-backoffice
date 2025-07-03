import { useEffect, useState } from "react";
import { logIn } from "../../services/user";
import { useNavigate } from "react-router";

function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ msj: string }[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("id_token");
    if (token) { navigate("/", { replace: true }) }
  }, [navigate]);

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
    const response = await logIn({ user: data})
    if (response.success) {
      navigate("/");
    } else {
      setErrors(response.errors)
    }

  }

  return (
    <div className="flex w-full min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={event => formSubmit(event)}>
          <div>
            <p>Please sign in</p>
          </div>
          <div>{errors.map((error, idx) => <p key={idx}>{error.msj}</p>)}</div>
          <div>
            <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900 dark:hidden">Email address</label>
            <label htmlFor="email" className="hidden text-sm/6 font-medium text-white-900 dark:block">Email address</label>
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
              <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900 dark:hidden">Password</label>
              <label htmlFor="password" className="hidden text-sm/6 font-medium text-white-900 dark:block">Password</label>
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
          <button type="submit" className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Sign in</button>
        </form>
      </div>
    </div>
  );
}
export default Login;