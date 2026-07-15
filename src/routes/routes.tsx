import { lazy } from "react";
import { Navigate } from "react-router-dom";
import type { RouteObject } from "react-router-dom";
import AppLayout from "../components/layout/admin/AppLayout";
import { AuthGuard } from "../middleware/AuthGuard";
import { RoleTypes } from "@/const/constData";
import KassaProfile from "../pages/forKassa/KassaProfile";
import OperatorSmena from "@/pages/forOperator/OperatorSmena";

const {
  SUPERADMIN,
  HEAD_CASHIER,
  HEAD_OPERATOR,
  HEAD_ACCOUNTANT,
  HEAD_MARKETING,
  OWNER,
  DIRECTOR,
  ADMIN,
} = RoleTypes;

// Roles with full admin access
const FA = [OWNER, DIRECTOR, ADMIN, HEAD_MARKETING] as const;

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
const NfcCards = lazy(
  () => import("../pages/admin/control/nfc-cards/NfcCards"),
);
const NfcClassic = lazy(
  () => import("../pages/admin/control/nfc-cards/NfcClassic"),
);
const NfcVIP = lazy(() => import("../pages/admin/control/nfc-cards/NfcVIP"));
const NfcOrganization = lazy(
  () => import("../pages/admin/control/nfc-cards/NfcOrganization"),
);
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
const MarketingNews = lazy(
  () => import("../pages/admin/marketing/MarketingNews"),
);
const MarketingMemory = lazy(
  () => import("../pages/admin/marketing/MarketingMemory"),
);
const MarketingAksiya = lazy(
  () => import("../pages/admin/marketing/MarketingAksiya"),
);

export const routes: RouteObject[] = [
  {
    // for admin pages
    element: (
      <AuthGuard
        roles={[
          SUPERADMIN,
          HEAD_CASHIER,
          HEAD_OPERATOR,
          HEAD_ACCOUNTANT,
          HEAD_MARKETING,
          OWNER,
          DIRECTOR,
          ADMIN,
        ]}
      >
        <AppLayout />
      </AuthGuard>
    ),
    children: [
      { path: "/", element: <Dashboard /> },
      //
      // live monitor pages
      {
        path: "/live-monitor/kassa",
        element: rg(<LiveMonitorKassa />, [
          SUPERADMIN,
          HEAD_CASHIER,
          HEAD_ACCOUNTANT,
          ...FA,
        ]),
      },
      {
        path: "/live-monitor/attraction",
        element: rg(<LiveMonitorAttraction />, [
          SUPERADMIN,
          HEAD_CASHIER,
          HEAD_OPERATOR,
          HEAD_ACCOUNTANT,
          ...FA,
        ]),
      },
      {
        path: "/live-monitor/employees",
        element: rg(<LiveMonitorEmployes />, [
          SUPERADMIN,
          HEAD_CASHIER,
          HEAD_OPERATOR,
          HEAD_ACCOUNTANT,
          ...FA,
        ]),
      },
      //
      // employes pages
      {
        path: "/employees",
        element: rg(<Employees />, [SUPERADMIN, HEAD_ACCOUNTANT, ...FA]),
      },
      {
        path: "/employee/:id",
        element: rg(<EmployeeDetail />, [SUPERADMIN, ...FA]),
      },
      //
      // attractions pages
      {
        path: "/attractions",
        element: rg(<Attractions />, [SUPERADMIN, HEAD_OPERATOR, ...FA]),
      },
      {
        path: "/attraction/:id",
        element: rg(<AttractionDetail />, [SUPERADMIN, HEAD_OPERATOR, ...FA]),
      },
      //
      // kassa pages
      {
        path: "/kassa",
        element: rg(<Kassa />, [SUPERADMIN, HEAD_CASHIER, ...FA]),
      },
      {
        path: "/kassa/:id",
        element: rg(<KassaDetail />, [SUPERADMIN, HEAD_CASHIER, ...FA]),
      },
      // reports pages
      { path: "/reports", element: <Navigate to="/reports/kassa" replace /> },
      {
        path: "/reports/kassa",
        element: rg(<ReportsKassa />, [SUPERADMIN, HEAD_ACCOUNTANT, ...FA]),
      },
      {
        path: "/reports/attraction",
        element: rg(<ReportsAttraction />, [
          SUPERADMIN,
          HEAD_ACCOUNTANT,
          ...FA,
        ]),
      },
      {
        path: "/reports/employees",
        element: rg(<ReportsEmployees />, [SUPERADMIN, HEAD_ACCOUNTANT, ...FA]),
      },
      //
      // other pages
      { path: "/settings", element: <Settings /> },
      { path: "/support", element: <Support /> },
      //
      // nfc-cards pages
      {
        path: "/nfc-cards",
        element: <Navigate to="/nfc-cards/all" replace />,
      },
      {
        path: "/nfc-cards/all",
        element: rg(<NfcCards />, [SUPERADMIN, HEAD_CASHIER, ...FA]),
      },
      {
        path: "/nfc-cards/classic",
        element: rg(<NfcClassic />, [SUPERADMIN, HEAD_CASHIER, ...FA]),
      },
      {
        path: "/nfc-cards/vip",
        element: rg(<NfcVIP />, [SUPERADMIN, HEAD_CASHIER, ...FA]),
      },
      {
        path: "/nfc-cards/organization",
        element: rg(<NfcOrganization />, [SUPERADMIN, HEAD_CASHIER, ...FA]),
      },
      //
      // role-kassa head
      {
        path: "/rolekassa-main/incoming",
        element: rg(<RoleKassaMainIncoming />, [
          SUPERADMIN,
          HEAD_CASHIER,
          ...FA,
        ]),
      },
      {
        path: "/rolekassa-main/export",
        element: rg(<RoleKassaMainExport />, [SUPERADMIN, HEAD_CASHIER, ...FA]),
      },
      //
      // role-operator head
      {
        path: "/roleoperator-main/incoming",
        element: rg(<RoleOperatorMainIncoming />, [
          SUPERADMIN,
          HEAD_OPERATOR,
          ...FA,
        ]),
      },
      {
        path: "/roleoperator-main/export",
        element: rg(<RoleOperatorMainExport />, [
          SUPERADMIN,
          HEAD_OPERATOR,
          ...FA,
        ]),
      },
      //
      // role-bux head
      {
        path: "/rolebux-main/incoming-kassa",
        element: rg(<RoleBuxMainIncomingKassa />, [
          SUPERADMIN,
          HEAD_ACCOUNTANT,
          ...FA,
        ]),
      },
      {
        path: "/rolebux-main/incoming-operator",
        element: rg(<RoleBuxMainIncomingOperator />, [
          SUPERADMIN,
          HEAD_ACCOUNTANT,
          ...FA,
        ]),
      },
      //
      // marketing pages
      {
        path: "/marketing",
        element: <Navigate to="/marketing/news" replace />,
      },
      {
        path: "/marketing/news",
        element: rg(<MarketingNews />, [SUPERADMIN, HEAD_MARKETING, ...FA]),
      },
      {
        path: "/marketing/memory",
        element: rg(<MarketingMemory />, [SUPERADMIN, HEAD_MARKETING, ...FA]),
      },
      {
        path: "/marketing/aksiya",
        element: rg(<MarketingAksiya />, [SUPERADMIN, HEAD_MARKETING, ...FA]),
      },
      ...(import.meta.env.DEV
        ? [{ path: "/test-ui", element: rg(<DevUI />, [SUPERADMIN, ...FA]) }]
        : []),
    ],
  },
  {
    // for operator pages
    element: (
      <AuthGuard roles={[RoleTypes.OPERATOR, RoleTypes.SUPERADMIN, ...FA]}>
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
      <AuthGuard
        roles={[
          RoleTypes.CASHIER,
          RoleTypes.SUPERADMIN,
          RoleTypes.HEAD_CASHIER,
          ...FA,
        ]}
      >
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
