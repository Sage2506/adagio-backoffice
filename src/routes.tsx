import { Route, Routes } from "react-router";
import App from "./App";
import AppCopy from "./App copy";
import DashboardLayout from "./layouts/dashboard";
import Login from "./components/auth/login";
import LogOut from "./components/auth/logout";
import AlumnForm from "./components/dashboard/alumns/form";
import PaySubscriptionForm from "./components/dashboard/subscriptions/paySubscription";
import SubscriptionsTable from "./components/dashboard/subscriptions/table";
import PlansTable from "./components/dashboard/plans/table";
import PlanForm from "./components/dashboard/plans/form";

export function Router() {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="logout" element={<LogOut />} />
      <Route element={<DashboardLayout />}>
        <Route index element={<App />} />
        <Route path="copy" element={<AppCopy />} />
        <Route path="alumns/form" element={<AlumnForm />} />
        <Route path="alumns/form/:id" element={<AlumnForm />} />
        <Route path="subscriptions/pay" element={<PaySubscriptionForm />}></Route>
        <Route path="subscriptions" element={<SubscriptionsTable />}></Route>
        <Route path="plans" element={<PlansTable />}></Route>
        <Route path="plans/form" element={<PlanForm />}></Route>
        <Route path="plans/form/:id" element={<PlanForm />}></Route>
      </Route>
    </Routes>
  )
}