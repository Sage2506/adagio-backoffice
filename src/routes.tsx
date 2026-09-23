import { lazy } from "react";
import { Route, Routes } from "react-router";
import LandingPage from "./pages/landing/LandingPage";
import DashboardLayout from "./layouts/dashboard";
import Login from "./components/auth/login";
import LogOut from "./components/auth/logout";
import ProtectedRoute from "./components/auth/protectedRoute";
import NotFound from "./pages/NotFound";

const AlumnForm = lazy(() => import("./components/dashboard/alumns/form"));
const SubscriptionsTable = lazy(() => import("./components/dashboard/subscriptions/table"));
const PlansTable = lazy(() => import("./components/dashboard/plans/table"));
const PlanForm = lazy(() => import("./components/dashboard/plans/form"));
const ProductsTable = lazy(() => import("./components/dashboard/products/table"));
const ProductForm = lazy(() => import("./components/dashboard/products/form"));
const OrdersTable = lazy(() => import("./components/dashboard/orders/table"));
const OrdersForm = lazy(() => import("./components/dashboard/orders/form"));
const OrderDetail = lazy(() => import("./components/dashboard/orders/detail"));
const AlumnsTable = lazy(() => import("./components/dashboard/alumns/table"));
const ExpensesPage = lazy(() => import("./components/dashboard/expenses/ExpensesPage"));
const AdditionalIncomesPage = lazy(() => import("./components/dashboard/additioinalIncomes/AdditionalIncomesPage"));
const DisciplinesTable = lazy(() => import("./components/dashboard/disciplines/table"));
const DisciplineForm = lazy(() => import("./components/dashboard/disciplines/form"));
const FinancialBalance = lazy(() => import("./components/dashboard/balances/FinancialBalance"));

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
        <Route index element={<SubscriptionsTable/>} />
        <Route path="alumns/form" element={<AlumnForm />} />
        <Route path="alumns/form/:id" element={<AlumnForm />} />
        <Route path="orders" element={<OrdersTable />}></Route>
        <Route path="orders/form" element={<OrdersForm />}></Route>
        <Route path="orders/:id" element={<OrderDetail />}></Route>
        <Route path="expenses" element={<ExpensesPage />}></Route>
        <Route path="additional-incomes" element={<AdditionalIncomesPage />}></Route>
        <Route path="plans" element={<PlansTable />}></Route>
        <Route path="plans/form" element={<PlanForm />}></Route>
        <Route path="plans/form/:id" element={<PlanForm />}></Route>
        <Route path="products" element={<ProductsTable />}></Route>
        <Route path="products/form" element={<ProductForm />}></Route>
        <Route path="products/form/:id" element={<ProductForm />}></Route>
        <Route path="alumns" element={<AlumnsTable/>}></Route>
        <Route path="disciplines" element={<DisciplinesTable />}></Route>
        <Route path="disciplines/form" element={<DisciplineForm />}></Route>
        <Route path="disciplines/form/:id" element={<DisciplineForm />}></Route>
        <Route path="balances" element={<FinancialBalance />}></Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}