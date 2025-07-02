import { Route, Routes } from "react-router";
import App from "./App";
import AppCopy from "./App copy";
import DashboardLayout from "./layouts/dashboard";
import Login from "./components/auth/login";
import LogOut from "./components/auth/logout";
import AlumnForm from "./components/dashboard/alumns/form";

export function Router() {
  return (
    <Routes>
      <Route index element={<App />} />
      <Route path="login" element={<Login />} />
      <Route path="logout" element={<LogOut />} />
      <Route path="alumn/form" element={<AlumnForm />} />
      <Route element={<DashboardLayout />}>
        <Route path="copy" element={<AppCopy />} />
      </Route>
    </Routes>
  )
}