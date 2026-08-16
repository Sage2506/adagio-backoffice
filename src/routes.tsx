import { Route, Routes } from "react-router";
import LandingPage from "./pages/landing/LandingPage";
import DashboardLayout from "./layouts/dashboard";
import Login from "./components/auth/login";
import LogOut from "./components/auth/logout";
import AlumnForm from "./components/dashboard/alumns/form";
import SubscriptionsTable from "./components/dashboard/subscriptions/table";
import PlansTable from "./components/dashboard/plans/table";
import PlanForm from "./components/dashboard/plans/form";
import PaySubscriptionForm from "./components/dashboard/subscriptions/paySubscription";
import ProductsTable from "./components/dashboard/products/table";
import ProductForm from "./components/dashboard/products/form";
import OrdersTable from "./components/dashboard/orders/table";
import OrdersForm from "./components/dashboard/orders/form";
import OrderDetail from "./components/dashboard/orders/detail";
import AlumnsTable from "./components/dashboard/alumns/table";
import ProtectedRoute from "./components/auth/protectedRoute";

export function Router() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="login" element={<Login />} />
      <Route path="logout" element={<LogOut />} />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      }>
        <Route index element={<AlumnsTable />} />
        <Route path="alumns/form" element={<AlumnForm />} />
        <Route path="alumns/form/:id" element={<AlumnForm />} />
        <Route path="orders" element={<OrdersTable />}></Route>
        <Route path="orders/form" element={<OrdersForm />}></Route>
        <Route path="orders/:id" element={<OrderDetail />}></Route>
        <Route path="plans" element={<PlansTable />}></Route>
        <Route path="plans/form" element={<PlanForm />}></Route>
        <Route path="plans/form/:id" element={<PlanForm />}></Route>
        <Route path="products" element={<ProductsTable />}></Route>
        <Route path="products/form" element={<ProductForm />}></Route>
        <Route path="products/form/:id" element={<ProductForm />}></Route>
        <Route path="subscriptions" element={<SubscriptionsTable />}></Route>
        <Route path="subscriptions/pay" element={<PaySubscriptionForm />}></Route>
      </Route>
    </Routes>
  )
}