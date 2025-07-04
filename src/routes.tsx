import { Route, Routes } from "react-router";
import App from "./App";
import AppCopy from "./App copy";
import DashboardLayout from "./layouts/dashboard";
import Login from "./components/auth/login";
import LogOut from "./components/auth/logout";
import AlumnForm from "./components/dashboard/alumns/form";
import PaySubscriptionForm from "./components/dashboard/subscriptions/paySubscription";

export function Router() {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="logout" element={<LogOut />} />
      <Route path="subscriptions/pay" element={<PaySubscriptionForm />}></Route>
      <Route element={<DashboardLayout />}>
        <Route index element={<App />} />
        <Route path="copy" element={<AppCopy />} />
        <Route path="alumn/form" element={<AlumnForm />} />
        <Route path="alumn/:id/edit" element={<AlumnForm />} />
      </Route>
    </Routes>
  )
}