import { useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router";
import { useAuth } from "../components/auth/useAuth";
import { AcademicCapIcon } from "@heroicons/react/16/solid";
import { IdentificationIcon } from "@heroicons/react/16/solid";
import { PresentationChartBarIcon } from "@heroicons/react/16/solid";
import { BuildingStorefrontIcon } from "@heroicons/react/16/solid";
import { ArrowRightStartOnRectangleIcon } from "@heroicons/react/16/solid";
import BirthdaysSection from "../components/dashboard/alumns/birthdaysSection";

export default function DashboardLayout() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const handleUnauthorized = () => {
      logout();
      navigate("/login", { replace: true });
    };
    window.addEventListener("unauthorized", handleUnauthorized);
    return () => window.removeEventListener("unauthorized", handleUnauthorized);
  }, [navigate, logout]);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };


  return (
    <div className="relative w-full flex flex-col">
      <div className="flex w-full">
        {/* Contenedor principal: barra de navegación y contenido */}
        <div className="min-w-0 flex-1 flex flex-col">
          <div className="top-0 z-10 md:h-16 md:pt-6">
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
                              <NavLink to={'/dashboard'} end className={({ isActive }) => `relative block px-3 py-2 transition hover:text-teal-500 dark:hover:text-teal-400 capitalize ${isActive ? "rounded-full bg-gray-600" : ""}`}>alumns</NavLink>
                            </li>
                            <li>
                              <NavLink to={'/dashboard/subscriptions'} className={({ isActive }) => `relative block px-3 py-2 transition hover:text-teal-500 dark:hover:text-teal-400 capitalize ${isActive ? "rounded-full bg-gray-600" : ""}`}>subscriptions</NavLink>
                            </li>
                            <li>
                              <NavLink to={'/dashboard/plans'} className={({ isActive }) => `relative block px-3 py-2 transition hover:text-teal-500 dark:hover:text-teal-400 capitalize ${isActive ? "rounded-full bg-gray-600" : ""}`}>plan</NavLink>
                            </li>
                            <li>
                              <NavLink to={'/dashboard/products'} className={({ isActive }) => `relative block px-3 py-2 transition hover:text-teal-500 dark:hover:text-teal-400 capitalize ${isActive ? "rounded-full bg-gray-600" : ""}`}>products</NavLink>
                            </li>
                            <li>
                              <NavLink to={'/dashboard/orders'} className={({ isActive }) => `relative block px-3 py-2 transition hover:text-teal-500 dark:hover:text-teal-400 capitalize ${isActive ? "rounded-full bg-gray-600" : ""}`}>orders</NavLink>
                            </li>
                            <li>
                              <a className="relative block px-3 py-2 transition hover:text-teal-500 dark:hover:text-teal-400 capitalize " onClick={handleLogout}>logout</a>
                            </li>
                          </ul>
                        </nav>
                        <div className="fixed bottom-0 left-0 right-0 flex md:hidden justify-around bg-white shadow-lg">
                          <NavLink to="/dashboard" end className={({ isActive }) => `p-3 text-gray-400 hover:text-blue-500 ${isActive ? "bg-gray-700 text-white" : ""}`}>
                            <AcademicCapIcon className="w-5 h-5" />
                          </NavLink>
                          <NavLink to="/dashboard/subscriptions" className={({ isActive }) => `p-3 text-gray-400 hover:text-blue-500 ${isActive ? "bg-gray-700 text-white" : ""}`}>
                            <IdentificationIcon className="w-5 h-5" />
                          </NavLink>
                          <NavLink to="/dashboard/plans" className={({ isActive }) => `p-3 text-gray-400 hover:text-blue-500 ${isActive ? "bg-gray-700 text-white" : ""}`}>
                            <PresentationChartBarIcon className="w-5 h-5" />
                          </NavLink>
                          <NavLink to="/dashboard/products" className={({ isActive }) => `p-3 text-gray-400 hover:text-blue-500 ${isActive ? "bg-gray-700 text-white" : ""}`}>
                            <BuildingStorefrontIcon className="w-5 h-5" />
                          </NavLink>
                          <a onClick={handleLogout} className="p-3 text-gray-400 hover:text-blue-500">
                            <ArrowRightStartOnRectangleIcon className="w-5 h-5" />
                          </a>
                        </div>
                      </div>
                      <div className="flex justify-end md:flex-1"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1 flex flex-row">
            <div className="min-w-0 flex-1">
              <Outlet />
            </div>
            <div className="hidden p-4 md:block md:w-1/4">
              <BirthdaysSection />
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}