import { useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router";

export default function DashboardLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleUnauthorized = () => navigate("/login", { replace: true });
    window.addEventListener("unauthorized", handleUnauthorized);
    return () => window.removeEventListener("unauthorized", handleUnauthorized);

  }, [navigate])

  return (
    <div className="relative flex w-full flex-col">
      <div className="top-0 z-10 h-16 pt-6">
        <div className="sm:px-8 top-(--header-top,--spacing(6)) w-full">
          <div className="mx-auto w-full max-w-7xl lg:px-8">
            <div className="relative px-4 sm:px-8 lg:px-12">
              <div className="mx-auto max-w-2xl lg:max-w-5xl">
                <div className="relative flex gap-4">
                  <div className="flex flex-1"></div>
                  <div className="flex flex-1 justify-end md:justify-center">
                    <nav className="pointer-events-auto hidden md:block">
                      <ul className="flex rounded-full bg-white/90 px-3 text-sm font-medium text-zinc-800 shadow-lg ring-1 shadow-zinc-800/5 ring-zinc-900/5 backdrop-blur-sm dark:bg-zinc-800/90 dark:text-zinc-200 dark:ring-white/10">
                        <li>
                          <NavLink to={'/'} className="relative block px-3 py-2 transition hover:text-teal-500 dark:hover:text-teal-400">Alumnas</NavLink>
                        </li>
                        <li>
                          <NavLink to={'/alumn/form'} className="relative block px-3 py-2 transition hover:text-teal-500 dark:hover:text-teal-400">Alumn Form</NavLink>
                        </li>
                        <li>
                          <NavLink to={'/subscriptions/pay'} className="relative block px-3 py-2 transition hover:text-teal-500 dark:hover:text-teal-400">Pay Subscription</NavLink>
                        </li>
                      </ul>
                    </nav>
                  </div>
                  <div className="flex justify-end md:flex-1"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Outlet />
    </div>
  )
}