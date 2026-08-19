import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router";
import { useAuth } from "../components/auth/useAuth";
import BirthdaysSection from "../components/dashboard/alumns/birthdaysSection";

export default function DashboardLayout() {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleUnauthorized = () => {
            logout();
            navigate("/login", { replace: true });
        };
        window.addEventListener("unauthorized", handleUnauthorized);
        return () => window.removeEventListener("unauthorized", handleUnauthorized);
    }, [navigate, logout]);

    const handleLogout = () => {
        setIsMobileMenuOpen(false);
        logout();
        navigate("/login", { replace: true });
    };


    return (
        <div className="min-h-screen bg-background font-body-md text-on-surface w-full">
            {/* SideNavBar */}
            <nav
                className="hidden lg:flex flex-col h-screen w-64 fixed left-0 top-0 bg-surface-bright dark:bg-surface-container-lowest border-r border-outline-variant dark:border-outline py-stack-md z-50">
                <div className="px-container-padding">
                    <img src="/Logotipo.png" alt="Adagio Logo" className="h-auto w-full object-contain dark:hidden" />
                    <img src="/logoBlanco.png" alt="Adagio Logo" className="hidden h-auto w-full object-contain dark:block" />
                </div>
                <div className="flex-1 flex flex-col gap-1 overflow-y-auto">
                    <NavLink to={'/dashboard'} end className={({ isActive }) => `rounded-lg mx-2 px-4 py-3 flex items-center gap-3 ${isActive ? "bg-primary-container text-on-primary-container font-bold scale-95 duration-200" : "text-on-surface-variant dark:text-outline hover:bg-surface-container-high dark:hover:bg-surface-variant transition-all"}`}
                    >
                        <span className="material-symbols-outlined" data-icon="dashboard">dashboard</span>
                        <span className="text-label-md font-label-md">Dashboard</span>
                    </NavLink>
                    <NavLink to={'/dashboard'} end className={({ isActive }) => `rounded-lg mx-2 px-4 py-3 flex items-center gap-3 ${isActive ? "bg-primary-container text-on-primary-container font-bold scale-95 duration-200" : "text-on-surface-variant dark:text-outline hover:bg-surface-container-high dark:hover:bg-surface-variant transition-all"}`}
                    >
                        <span className="material-symbols-outlined" data-icon="group">group</span>
                        <span className="text-label-md font-label-md">Alumns</span>
                    </NavLink>
                    <NavLink to={'/dashboard/subscriptions'} className={({ isActive }) => `rounded-lg mx-2 px-4 py-3 flex items-center gap-3 ${isActive ? "bg-primary-container text-on-primary-container font-bold scale-95 duration-200" : "text-on-surface-variant dark:text-outline hover:bg-surface-container-high dark:hover:bg-surface-variant transition-all"}`}
                    >
                        <span className="material-symbols-outlined" data-icon="event_repeat">event_repeat</span>
                        <span className="text-label-md font-label-md">Subscriptions</span>
                    </NavLink>
                    <NavLink to={'/dashboard/plans'} className={({ isActive }) => `rounded-lg mx-2 px-4 py-3 flex items-center gap-3 ${isActive ? "bg-primary-container text-on-primary-container font-bold scale-95 duration-200" : "text-on-surface-variant dark:text-outline hover:bg-surface-container-high dark:hover:bg-surface-variant transition-all"}`}
                    >
                        <span className="material-symbols-outlined" data-icon="layers">layers</span>
                        <span className="text-label-md font-label-md">Plans</span>
                    </NavLink>
                    <NavLink to={'/dashboard/products'} className={({ isActive }) => `rounded-lg mx-2 px-4 py-3 flex items-center gap-3 ${isActive ? "bg-primary-container text-on-primary-container font-bold scale-95 duration-200" : "text-on-surface-variant dark:text-outline hover:bg-surface-container-high dark:hover:bg-surface-variant transition-all"}`}
                    >
                        <span className="material-symbols-outlined" data-icon="shopping_bag">shopping_bag</span>
                        <span className="text-label-md font-label-md">Products</span>
                    </NavLink>
                    <NavLink to={'/dashboard/orders'} className={({ isActive }) => `rounded-lg mx-2 px-4 py-3 flex items-center gap-3 ${isActive ? "bg-primary-container text-on-primary-container font-bold scale-95 duration-200" : "text-on-surface-variant dark:text-outline hover:bg-surface-container-high dark:hover:bg-surface-variant transition-all"}`}
                    >
                        <span className="material-symbols-outlined" data-icon="receipt_long">receipt_long</span>
                        <span className="text-label-md font-label-md">Orders</span>
                    </NavLink>
                </div>
                <div className="px-4 mt-auto">
                    <a className="text-on-surface-variant dark:text-outline px-4 py-3 flex items-center gap-3 rounded-lg hover:bg-surface-container-high dark:hover:bg-surface-variant transition-all" onClick={handleLogout}>
                        <span className="material-symbols-outlined" data-icon="logout">logout</span>
                        <span className="text-label-md font-label-md">Logout</span>
                    </a>
                </div>
            </nav>
            {/* TopNavBar (Mobile) */}
            <nav
                className="lg:hidden fixed top-0 left-0 z-50 flex justify-between items-center w-full h-16 px-container-padding bg-surface dark:bg-surface-container-low border-b border-outline-variant dark:border-outline">
                <button type="button" onClick={() => setIsMobileMenuOpen(open => !open)} aria-expanded={isMobileMenuOpen} aria-controls="mobile-dashboard-menu" className="p-2 rounded-full text-on-surface-variant hover:bg-surface-container-low transition-colors"><span
                    className="material-symbols-outlined" data-icon="menu">menu</span></button>
                <h1 className="text-headline-md font-headline-md font-bold text-primary-container">Current page</h1>
                <button type="button" aria-label="Notifications" className="p-2 rounded-full text-on-surface-variant hover:bg-surface-container-low transition-colors"><span
                    className="material-symbols-outlined" data-icon="notifications">notifications</span></button>
            </nav>
            <button type="button" aria-label="Close menu" onClick={() => setIsMobileMenuOpen(false)} className={`lg:hidden fixed inset-0 z-[60] bg-black/50 transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`} />
            <aside id="mobile-dashboard-menu" aria-hidden={!isMobileMenuOpen} className={`lg:hidden fixed top-0 bottom-0 left-0 z-[70] flex w-[80%] max-w-[320px] flex-col bg-surface shadow-xl transition-transform duration-300 ease-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <header className="flex items-center gap-3 p-gutter border-b border-outline-variant">
                    <div className="w-10 h-10 rounded-lg bg-primary-container text-on-primary-container flex items-center justify-center"><span className="material-symbols-outlined">auto_awesome</span></div>
                    <div>
                        <h2 className="text-headline-sm text-on-surface">Adagio</h2>
                        <p className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wide">Studio Admin</p>
                    </div>
                    <button type="button" onClick={() => setIsMobileMenuOpen(false)} aria-label="Close menu" className="ml-auto p-1 text-on-surface-variant hover:text-primary transition-colors"><span className="material-symbols-outlined">close</span></button>
                </header>
                <nav className="flex-1 overflow-y-auto px-2 py-4">
                    <ul className="flex flex-col gap-1">
                        <li><NavLink to="/dashboard" end onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => `flex items-center gap-4 px-4 py-3 rounded-lg ${isActive ? "bg-primary-container text-on-primary-container shadow-sm" : "text-on-surface-variant hover:bg-surface-container transition-colors"}`}><span className="material-symbols-outlined">dashboard</span><span className="font-body-md">Dashboard</span></NavLink></li>
                        <li><NavLink to="/dashboard" end onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => `flex items-center gap-4 px-4 py-3 rounded-lg ${isActive ? "bg-primary-container text-on-primary-container shadow-sm" : "text-on-surface-variant hover:bg-surface-container transition-colors"}`}><span className="material-symbols-outlined">group</span><span className="font-body-md">Alumns</span></NavLink></li>
                        <li><NavLink to="/dashboard/subscriptions" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => `flex items-center gap-4 px-4 py-3 rounded-lg ${isActive ? "bg-primary-container text-on-primary-container shadow-sm font-semibold" : "text-on-surface-variant hover:bg-surface-container transition-colors"}`}><span className="material-symbols-outlined">event_repeat</span><span className="font-body-md">Subscriptions</span></NavLink></li>
                        <li><NavLink to="/dashboard/plans" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => `flex items-center gap-4 px-4 py-3 rounded-lg ${isActive ? "bg-primary-container text-on-primary-container shadow-sm font-semibold" : "text-on-surface-variant hover:bg-surface-container transition-colors"}`}><span className="material-symbols-outlined">layers</span><span className="font-body-md">Plans</span></NavLink></li>
                        <li><NavLink to="/dashboard/products" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => `flex items-center gap-4 px-4 py-3 rounded-lg ${isActive ? "bg-primary-container text-on-primary-container shadow-sm font-semibold" : "text-on-surface-variant hover:bg-surface-container transition-colors"}`}><span className="material-symbols-outlined">shopping_bag</span><span className="font-body-md">Products</span></NavLink></li>
                        <li><NavLink to="/dashboard/orders" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => `flex items-center gap-4 px-4 py-3 rounded-lg ${isActive ? "bg-primary-container text-on-primary-container shadow-sm font-semibold" : "text-on-surface-variant hover:bg-surface-container transition-colors"}`}><span className="material-symbols-outlined">receipt_long</span><span className="font-body-md">Orders</span></NavLink></li>
                    </ul>
                </nav>
                <div className="p-4 border-t border-outline-variant">
                    <button type="button" onClick={handleLogout} className="w-full flex items-center gap-3 p-2 rounded-lg text-left hover:bg-surface-container transition-colors">
                        <span className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold">SA</span>
                        <span className="flex-1"><span className="block text-label-md font-label-md font-bold text-on-surface">Admin User</span><span className="block text-[10px] text-on-surface-variant">admin@adagio.studio</span></span>
                        <span className="material-symbols-outlined text-on-surface-variant">logout</span>
                    </button>
                </div>
            </aside>
            <main className="w-full pt-20 pb-24 p-container-padding lg:ml-64 lg:w-[calc(100%-256px)] lg:pt-8 lg:pb-8 xl:w-[calc(100%-696px)]">
                <Outlet />
            </main>
            <nav aria-label="Mobile primary navigation" className="lg:hidden fixed bottom-0 left-0 z-50 flex h-20 w-full items-center justify-around border-t border-outline-variant bg-surface px-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
                <NavLink to="/dashboard" end className={({ isActive }) => `flex h-16 w-24 flex-col items-center justify-center gap-1 rounded-full transition-colors ${isActive ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:bg-surface-container-low'}`}>
                    <span className="material-symbols-outlined">group</span>
                    <span className="text-[10px] font-label-md">Alumns</span>
                </NavLink>
                <NavLink to="/dashboard/subscriptions" className={({ isActive }) => `flex h-16 w-28 flex-col items-center justify-center gap-1 rounded-full transition-colors ${isActive ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:bg-surface-container-low'}`}>
                    <span className="material-symbols-outlined">event_repeat</span>
                    <span className="text-[10px] font-label-md">Subscriptions</span>
                </NavLink>
                <NavLink to="/dashboard/orders" className={({ isActive }) => `flex h-16 w-24 flex-col items-center justify-center gap-1 rounded-full transition-colors ${isActive ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:bg-surface-container-low'}`}>
                    <span className="material-symbols-outlined">receipt_long</span>
                    <span className="text-[10px] font-label-md">Orders</span>
                </NavLink>
            </nav>
            <aside className="hidden xl:block fixed right-0 top-0 h-screen w-[440px] overflow-y-auto border-l border-outline-variant p-container-padding">
                <BirthdaysSection />
            </aside>
        </div>
    )
}