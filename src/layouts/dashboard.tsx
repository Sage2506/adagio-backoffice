import { useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router";
import { useAuth } from "../components/auth/useAuth";
import { AcademicCapIcon, HomeIcon, UserGroupIcon } from "@heroicons/react/16/solid";
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
        // <div className="relative w-full flex flex-col">
        //   <div className="flex w-full">
        //     {/* Contenedor principal: barra de navegación y contenido */}
        //     <div className="min-w-0 flex-1 flex flex-col">
        //       <div className="top-0 z-10 md:h-16 md:pt-6">
        //         <div className="sm:px-8 top-(--header-top,--spacing(6)) w-full">
        //           <div className="mx-auto w-full max-w-7xl lg:px-8">
        //             <div className="relative px-4 sm:px-8 lg:px-12">
        //               <div className="mx-auto max-w-2xl lg:max-w-5xl">
        //                 <div className="relative flex gap-4">
        //                   <div className="flex flex-1"></div>
        //                   <div className="flex flex-1 justify-end md:justify-center">
        //                     <nav className="pointer-events-auto hidden md:block">
        //                       <ul className="flex rounded-full bg-white/90 px-3 text-sm font-medium text-zinc-800 shadow-lg ring-1 shadow-zinc-800/5 ring-zinc-900/5 backdrop-blur-sm dark:bg-zinc-800/90 dark:text-zinc-200 dark:ring-white/10">
        //                         <li>
        //                           <NavLink to={'/dashboard'} end className={({ isActive }) => `relative block px-3 py-2 transition hover:text-teal-500 dark:hover:text-teal-400 capitalize ${isActive ? "rounded-full bg-gray-600" : ""}`}>alumns</NavLink>
        //                         </li>
        //                         <li>
        //                           <NavLink to={'/dashboard/subscriptions'} className={({ isActive }) => `relative block px-3 py-2 transition hover:text-teal-500 dark:hover:text-teal-400 capitalize ${isActive ? "rounded-full bg-gray-600" : ""}`}>subscriptions</NavLink>
        //                         </li>
        //                         <li>
        //                           <NavLink to={'/dashboard/plans'} className={({ isActive }) => `relative block px-3 py-2 transition hover:text-teal-500 dark:hover:text-teal-400 capitalize ${isActive ? "rounded-full bg-gray-600" : ""}`}>plan</NavLink>
        //                         </li>
        //                         <li>
        //                           <NavLink to={'/dashboard/products'} className={({ isActive }) => `relative block px-3 py-2 transition hover:text-teal-500 dark:hover:text-teal-400 capitalize ${isActive ? "rounded-full bg-gray-600" : ""}`}>products</NavLink>
        //                         </li>
        //                         <li>
        //                           <NavLink to={'/dashboard/orders'} className={({ isActive }) => `relative block px-3 py-2 transition hover:text-teal-500 dark:hover:text-teal-400 capitalize ${isActive ? "rounded-full bg-gray-600" : ""}`}>orders</NavLink>
        //                         </li>
        //                         <li>
        //                           <a className="relative block px-3 py-2 transition hover:text-teal-500 dark:hover:text-teal-400 capitalize " onClick={handleLogout}>logout</a>
        //                         </li>
        //                       </ul>
        //                     </nav>
        //                     <div className="fixed bottom-0 left-0 right-0 flex md:hidden justify-around bg-white shadow-lg">
        //                       <NavLink to="/dashboard" end className={({ isActive }) => `p-3 text-gray-400 hover:text-blue-500 ${isActive ? "bg-gray-700 text-white" : ""}`}>
        //                         <AcademicCapIcon className="w-5 h-5" />
        //                       </NavLink>
        //                       <NavLink to="/dashboard/subscriptions" className={({ isActive }) => `p-3 text-gray-400 hover:text-blue-500 ${isActive ? "bg-gray-700 text-white" : ""}`}>
        //                         <IdentificationIcon className="w-5 h-5" />
        //                       </NavLink>
        //                       <NavLink to="/dashboard/plans" className={({ isActive }) => `p-3 text-gray-400 hover:text-blue-500 ${isActive ? "bg-gray-700 text-white" : ""}`}>
        //                         <PresentationChartBarIcon className="w-5 h-5" />
        //                       </NavLink>
        //                       <NavLink to="/dashboard/products" className={({ isActive }) => `p-3 text-gray-400 hover:text-blue-500 ${isActive ? "bg-gray-700 text-white" : ""}`}>
        //                         <BuildingStorefrontIcon className="w-5 h-5" />
        //                       </NavLink>
        //                       <a onClick={handleLogout} className="p-3 text-gray-400 hover:text-blue-500">
        //                         <ArrowRightStartOnRectangleIcon className="w-5 h-5" />
        //                       </a>
        //                     </div>
        //                   </div>
        //                   <div className="flex justify-end md:flex-1"></div>
        //                 </div>
        //               </div>
        //             </div>
        //           </div>
        //         </div>
        //       </div>
        //       <div className="flex-1 flex flex-row">
        //         <div className="min-w-0 flex-1">
        //           <Outlet />
        //         </div>
        //         <div className="hidden p-4 md:block md:w-1/4">
        //           <BirthdaysSection />
        //         </div>
        //       </div>
        //     </div>

        //   </div>
        // </div>
        <div className="flex bg-background min-h-screen font-body-md text-on-surface w-full">
            {/* SideNavBar */}
            <nav
                className="hidden lg:flex flex-col h-screen w-64 fixed left-0 top-0 bg-surface-bright dark:bg-surface-container-lowest border-r border-outline-variant dark:border-outline py-stack-md z-50">
                <div className="px-container-padding">
                    <img src="./Logotipo.png" alt="Adagio Logo" className="h-auto w-full object-contain" />
                </div>
                <div className="flex-1 flex flex-col gap-1 overflow-y-auto">
                    <NavLink to={'/dashboard'} end className={({ isActive }) => `rounded-lg mx-2 px-4 py-3 flex items-center gap-3 ${isActive ? "bg-primary-container text-on-primary-container font-bold scale-95 duration-200" : "text-on-surface-variant dark:text-outline hover:bg-surface-container hover:bg-surface-container-high dark:hover:bg-surface-variant transition-all"}`}
                    >
                        <span className="material-symbols-outlined" data-icon="dashboard">dashboard</span>
                        <span className="text-label-md font-label-md">Dashboard</span>
                    </NavLink>
                    <NavLink to={'/dashboard'} end className={({ isActive }) => `rounded-lg mx-2 px-4 py-3 flex items-center gap-3 ${isActive ? "bg-primary-container text-on-primary-container font-bold scale-95 duration-200" : "text-on-surface-variant dark:text-outline hover:bg-surface-container hover:bg-surface-container-high dark:hover:bg-surface-variant transition-all"}`}
                    >
                        <span className="material-symbols-outlined" data-icon="group">group</span>
                        <span className="text-label-md font-label-md">Alumns</span>
                    </NavLink>
                    <NavLink to={'/dashboard/subscriptions'} className={({ isActive }) => `rounded-lg mx-2 px-4 py-3 flex items-center gap-3 ${isActive ? "bg-primary-container text-on-primary-container font-bold scale-95 duration-200" : "text-on-surface-variant dark:text-outline hover:bg-surface-container hover:bg-surface-container-high dark:hover:bg-surface-variant transition-all"}`}
                    >
                        <span className="material-symbols-outlined" data-icon="event_repeat">event_repeat</span>
                        <span className="text-label-md font-label-md">Subscriptions</span>
                    </NavLink>
                    <NavLink to={'/dashboard/plans'} className={({ isActive }) => `rounded-lg mx-2 px-4 py-3 flex items-center gap-3 ${isActive ? "bg-primary-container text-on-primary-container font-bold scale-95 duration-200" : "text-on-surface-variant dark:text-outline hover:bg-surface-container hover:bg-surface-container-high dark:hover:bg-surface-variant transition-all"}`}
                    >
                        <span className="material-symbols-outlined" data-icon="layers">layers</span>
                        <span className="text-label-md font-label-md">Plans</span>
                    </NavLink>
                    <NavLink to={'/dashboard/products'} className={({ isActive }) => `rounded-lg mx-2 px-4 py-3 flex items-center gap-3 ${isActive ? "bg-primary-container text-on-primary-container font-bold scale-95 duration-200" : "text-on-surface-variant dark:text-outline hover:bg-surface-container hover:bg-surface-container-high dark:hover:bg-surface-variant transition-all"}`}
                    >
                        <span className="material-symbols-outlined" data-icon="shopping_bag">shopping_bag</span>
                        <span className="text-label-md font-label-md">Products</span>
                    </NavLink>
                    <NavLink to={'/dashboard/orders'} className={({ isActive }) => `rounded-lg mx-2 px-4 py-3 flex items-center gap-3 ${isActive ? "bg-primary-container text-on-primary-container font-bold scale-95 duration-200" : "text-on-surface-variant dark:text-outline hover:bg-surface-container hover:bg-surface-container-high dark:hover:bg-surface-variant transition-all"}`}
                    >
                        <span className="material-symbols-outlined" data-icon="receipt_long">receipt_long</span>
                        <span className="text-label-md font-label-md">Orders</span>
                    </NavLink>
                </div>
                <div className="px-4 mt-auto">
                    <a className="text-on-surface-variant dark:text-outline hover:bg-surface-container px-4 py-3 flex items-center gap-3 rounded-lg hover:bg-surface-container-high dark:hover:bg-surface-variant transition-all" onClick={handleLogout}>
                        <span className="material-symbols-outlined" data-icon="logout">logout</span>
                        <span className="text-label-md font-label-md">Logout</span>
                    </a>
                </div>
            </nav>
            {/* TopNavBar (Mobile) */}
            <nav
                className="lg:hidden bg-surface dark:bg-surface-container-low border-b border-outline-variant dark:border-outline sticky top-0 z-40 flex justify-between items-center w-full px-container-padding h-16">
                <h1 className="text-headline-md font-headline-md font-bold text-primary dark:text-primary-fixed">DanceStudio Pro
                </h1>
                <div className="flex gap-4">
                    <button className="text-on-surface-variant hover:text-primary transition-colors"><span
                        className="material-symbols-outlined" data-icon="menu">menu</span></button>
                </div>
            </nav>
            <main className="flex-1 pt-16 md:pt-0 p-container-padding max-w-[1440px] mx-auto w-full">
                <Outlet />
            </main>
            <div className="hidden md:block md:w-1/4 my-8">
                <BirthdaysSection />
            </div>
        </div>
    )
}