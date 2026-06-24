import { lazy } from "react";
import { Navigate } from "react-router-dom";
import type { RouteObject } from "react-router-dom";
import AppLayout from "../components/layout/admin/AppLayout";
import { AuthGuard } from "../middleware/AuthGuard";
import KassaProfile from "../pages/forKassa/KassaProfile";
const KassaLayout = lazy(
  () => import("../components/layout/kassa/KassaLayout"),
);
const KassaHome = lazy(() => import("../pages/forKassa/KassaHome"));
const KassaSmena = lazy(() => import("../pages/forKassa/KassaSmena"));
const KassaOtchet = lazy(() => import("../pages/forKassa/KassaOtchet"));
const OperatorLayout = lazy(
  () => import("../components/layout/operator/OperatorLayout"),
);

const Dashboard = lazy(() => import("../pages/admin/main/Dashboard"));
const LiveMonitorKassa = lazy(
  () => import("../pages/admin/main/LiveMonitorKassa"),
);
const LiveMonitorAttraction = lazy(
  () => import("../pages/admin/main/LiveMonitorAttraction"),
);
const LiveMonitorEmployes = lazy(
  () => import("../pages/admin/main/LiveMonitorEmployes"),
);
const Employees = lazy(() => import("../pages/admin/control/Employees"));
const EmployeeDetail = lazy(() => import("../pages/admin/control/EmployeeDetail"));
const Attractions = lazy(() => import("../pages/admin/control/Attractions"));
const AttractionDetail = lazy(
  () => import("../pages/admin/control/AttractionDetail"),
);
const Kassa = lazy(() => import("../pages/admin/control/Kassa"));
const KassaDetail = lazy(() => import("../pages/admin/control/KassaDetail"));
const ReportsKassa = lazy(() => import("../pages/admin/main/ReportsKassa"));
const ReportsAttraction = lazy(
  () => import("../pages/admin/main/ReportsAttraction"),
);
const ReportsEmployees = lazy(
  () => import("../pages/admin/main/ReportsEmployees"),
);
const Settings = lazy(() => import("../pages/admin/Settings"));
const Support = lazy(() => import("../pages/admin/Support"));
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
const DevUI = lazy(() => import("../pages/admin/DevUI"));
const QrCode = lazy(() => import("../pages/admin/control/QrCode"));
const LockScreen = lazy(() => import("../pages/admin/LockScreen"));

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
      { path: "/live-monitor/kassa", element: <LiveMonitorKassa /> },
      { path: "/live-monitor/attraction", element: <LiveMonitorAttraction /> },
      { path: "/live-monitor/employees", element: <LiveMonitorEmployes /> },
      { path: "/employees", element: <Employees /> },
      { path: "/employee/:id", element: <EmployeeDetail /> },
      { path: "/attractions", element: <Attractions /> },
      { path: "/attraction/:id", element: <AttractionDetail /> },
      { path: "/kassa", element: <Kassa /> },
      { path: "/kassa/:id", element: <KassaDetail /> },
      { path: "/reports", element: <Navigate to="/reports/kassa" replace /> },
      { path: "/reports/kassa", element: <ReportsKassa /> },
      { path: "/reports/attraction", element: <ReportsAttraction /> },
      { path: "/reports/employees", element: <ReportsEmployees /> },
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
  {
    // for kassa pages
    element: (
      <AuthGuard roles={["kassa"]}>
        <KassaLayout />
      </AuthGuard>
    ),
    children: [
      { path: "/rolekassa", element: <KassaHome /> },
      { path: "/rolekassa/smena", element: <KassaSmena /> },
      { path: "/rolekassa/otchet", element: <KassaOtchet /> },
      { path: "/rolekassa/profile", element: <KassaProfile /> },
    ],
  },
  { path: "/login", element: <Login /> },
  { path: "/lock", element: <LockScreen /> },
  { path: "/unauthorized", element: <Unauthorized /> },
  { path: "*", element: <NotFound /> },
];
