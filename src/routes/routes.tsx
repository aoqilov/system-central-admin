import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import AppLayout from "../components/layout/admin/AppLayout";
import { AuthGuard } from "../middleware/AuthGuard";
const OperatorLayout = lazy(
  () => import("../components/layout/operator/OperatorLayout"),
);

const Dashboard = lazy(() => import("../pages/Dashboard"));
const LiveMonitor = lazy(() => import("../pages/LiveMonitor"));
const Employees = lazy(() => import("../pages/Employees"));
const EmployeeDetail = lazy(() => import("../pages/EmployeeDetail"));
const Attractions = lazy(() => import("../pages/Attractions"));
const AttractionDetail = lazy(() => import("../pages/AttractionDetail"));
const Kassa = lazy(() => import("../pages/Kassa"));
const KassaDetail = lazy(() => import("../pages/KassaDetail"));
const Reports = lazy(() => import("../pages/Reports"));
const Settings = lazy(() => import("../pages/Settings"));
const Support = lazy(() => import("../pages/Support"));
const OperatorHome = lazy(() => import("../pages/forOperator/OperatorHome"));
const OperatorPayment = lazy(
  () => import("../pages/forOperator/OperatorPayment"),
);
const OperatorProfile = lazy(
  () => import("../pages/forOperator/OperatorProfile"),
);
const Login = lazy(() => import("../pages/Login"));
const Unauthorized = lazy(() => import("../pages/Unauthorized"));
const NotFound = lazy(() => import("../pages/NotFound"));
const DevUI = lazy(() => import("../pages/DevUI"));
const QrCode = lazy(() => import("../pages/QrCode"));

export const routes: RouteObject[] = [
  {
    // for admin pages
    element: (
      <AuthGuard roles={["admin"]}>
        <AppLayout />
      </AuthGuard>
    ),
    children: [
      { path: "/", element: <Dashboard /> },
      { path: "/live-monitor", element: <LiveMonitor /> },
      { path: "/employees", element: <Employees /> },
      { path: "/employee/:id", element: <EmployeeDetail /> },
      { path: "/attractions", element: <Attractions /> },
      { path: "/attraction/:id", element: <AttractionDetail /> },
      { path: "/kassa", element: <Kassa /> },
      { path: "/kassa/:id", element: <KassaDetail /> },
      { path: "/reports", element: <Reports /> },
      { path: "/settings", element: <Settings /> },
      { path: "/support", element: <Support /> },
      { path: "/qrcode", element: <QrCode /> },
      ...(import.meta.env.DEV
        ? [{ path: "/test-ui", element: <DevUI /> }]
        : []),
    ],
  },
  {
    // for operator pages
    element: (
      <AuthGuard roles={["operator"]}>
        <OperatorLayout />
      </AuthGuard>
    ),
    children: [
      { path: "/operator", element: <OperatorHome /> },
      { path: "/operator/payment", element: <OperatorPayment /> },
      { path: "/operator/profile", element: <OperatorProfile /> },
    ],
  },
  { path: "/login", element: <Login /> },
  { path: "/unauthorized", element: <Unauthorized /> },
  { path: "*", element: <NotFound /> },
];
