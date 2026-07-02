import { lazy } from "react";
import { Navigate } from "react-router-dom";
import type { RouteObject } from "react-router-dom";
import AppLayout from "../components/layout/admin/AppLayout";
import { AuthGuard } from "../middleware/AuthGuard";
import { RoleTypes } from "@/const/constData";
import KassaProfile from "../pages/forKassa/KassaProfile";
import OperatorSmena from "@/pages/forOperator/OperatorSmena";

const { SUPERADMIN, HEAD_CASHIER, HEAD_OPERATOR, HEAD_ACCOUNTANT } = RoleTypes;

function rg(element: JSX.Element, roles: RoleTypes[]) {
  return <AuthGuard roles={roles}>{element}</AuthGuard>;
}
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
const EmployeeDetail = lazy(
  () => import("../pages/admin/control/EmployeeDetail"),
);
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
const NfcCards = lazy(() => import("../pages/admin/control/NfcCards"));
const LockScreen = lazy(() => import("../pages/admin/LockScreen"));
const RoleKassaMainIncoming = lazy(
  () => import("../pages/admin/main/RoleKassaMainIncoming"),
);
const RoleKassaMainExport = lazy(
  () => import("../pages/admin/main/RoleKassaMainExport"),
);
const RoleOperatorMainIncoming = lazy(
  () => import("../pages/admin/main/RoleOperatorMainIncoming"),
);
const RoleOperatorMainExport = lazy(
  () => import("../pages/admin/main/RoleOperatorMainExport"),
);
const RoleBuxMainIncomingKassa = lazy(
  () => import("../pages/admin/main/RoleBuxMainIncomingKassa"),
);
const RoleBuxMainIncomingOperator = lazy(
  () => import("../pages/admin/main/RoleBuxMainIncomingOperator"),
);

export const routes: RouteObject[] = [
  {
    // for admin pages
    element: (
      <AuthGuard
        roles={[
          RoleTypes.SUPERADMIN,
          RoleTypes.HEAD_CASHIER,
          RoleTypes.HEAD_OPERATOR,
          RoleTypes.HEAD_ACCOUNTANT,
        ]}
      >
        <AppLayout />
      </AuthGuard>
    ),
    children: [
      { path: "/", element: <Dashboard /> },
      {
        path: "/live-monitor/kassa",
        element: rg(<LiveMonitorKassa />, [SUPERADMIN, HEAD_CASHIER]),
      },
      {
        path: "/live-monitor/attraction",
        element: rg(<LiveMonitorAttraction />, [
          SUPERADMIN,
          HEAD_CASHIER,
          HEAD_OPERATOR,
        ]),
      },
      {
        path: "/live-monitor/employees",
        element: rg(<LiveMonitorEmployes />, [
          SUPERADMIN,
          HEAD_CASHIER,
          HEAD_OPERATOR,
        ]),
      },
      { path: "/employees", element: rg(<Employees />, [SUPERADMIN]) },
      { path: "/employee/:id", element: rg(<EmployeeDetail />, [SUPERADMIN]) },
      {
        path: "/attractions",
        element: rg(<Attractions />, [SUPERADMIN, HEAD_OPERATOR]),
      },
      {
        path: "/attraction/:id",
        element: rg(<AttractionDetail />, [SUPERADMIN, HEAD_OPERATOR]),
      },
      { path: "/kassa", element: rg(<Kassa />, [SUPERADMIN, HEAD_CASHIER]) },
      {
        path: "/kassa/:id",
        element: rg(<KassaDetail />, [SUPERADMIN, HEAD_CASHIER]),
      },
      { path: "/reports", element: <Navigate to="/reports/kassa" replace /> },
      {
        path: "/reports/kassa",
        element: rg(<ReportsKassa />, [SUPERADMIN, HEAD_ACCOUNTANT]),
      },
      {
        path: "/reports/attraction",
        element: rg(<ReportsAttraction />, [SUPERADMIN, HEAD_ACCOUNTANT]),
      },
      {
        path: "/reports/employees",
        element: rg(<ReportsEmployees />, [SUPERADMIN, HEAD_ACCOUNTANT]),
      },
      { path: "/settings", element: <Settings /> },
      { path: "/support", element: <Support /> },

      {
        path: "/nfc-cards",
        element: rg(<NfcCards />, [SUPERADMIN, HEAD_CASHIER]),
      },
      {
        path: "/rolekassa-main/incoming",
        element: rg(<RoleKassaMainIncoming />, [SUPERADMIN, HEAD_CASHIER]),
      },
      {
        path: "/rolekassa-main/export",
        element: rg(<RoleKassaMainExport />, [SUPERADMIN, HEAD_CASHIER]),
      },
      {
        path: "/roleoperator-main/incoming",
        element: rg(<RoleOperatorMainIncoming />, [SUPERADMIN, HEAD_OPERATOR]),
      },
      {
        path: "/roleoperator-main/export",
        element: rg(<RoleOperatorMainExport />, [SUPERADMIN, HEAD_OPERATOR]),
      },
      {
        path: "/rolebux-main/incoming-kassa",
        element: rg(<RoleBuxMainIncomingKassa />, [
          SUPERADMIN,
          HEAD_ACCOUNTANT,
        ]),
      },
      {
        path: "/rolebux-main/incoming-operator",
        element: rg(<RoleBuxMainIncomingOperator />, [
          SUPERADMIN,
          HEAD_ACCOUNTANT,
        ]),
      },
      ...(import.meta.env.DEV
        ? [{ path: "/test-ui", element: rg(<DevUI />, [SUPERADMIN]) }]
        : []),
    ],
  },
  {
    // for operator pages
    element: (
      <AuthGuard roles={[RoleTypes.OPERATOR]}>
        <OperatorLayout />
      </AuthGuard>
    ),
    children: [
      { path: "/operator", element: <Navigate to="/operator/smena" replace /> },
      { path: "/operator/home", element: <OperatorHome /> },
      { path: "/operator/payment", element: <OperatorPayment /> },
      { path: "/operator/profile", element: <OperatorProfile /> },
      { path: "/operator/smena", element: <OperatorSmena /> },
    ],
  },
  {
    // for kassa pages
    element: (
      <AuthGuard roles={[RoleTypes.CASHIER]}>
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
