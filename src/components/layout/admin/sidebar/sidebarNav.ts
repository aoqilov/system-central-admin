import type { IconType } from "react-icons";
import {
  LuLayoutDashboard,
  LuActivity,
  LuUsers,
  LuFerrisWheel,
  LuChartBar,
  LuSettings,
  LuLifeBuoy,
  LuBanknote,
  LuFileCheck,
  LuFileOutput,
  LuFileInput,
  LuCreditCard,
} from "react-icons/lu";
import { SiTestcafe } from "react-icons/si";
import { RoleTypes } from "@/const/constData";
import { LiaIdCardSolid } from "react-icons/lia";

// в”Ђв”Ђв”Ђ Types в”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђ

export interface NavItemDef {
  labelKey: string;
  icon: IconType;
  to: string;
  roles?: RoleTypes[];
  subItems?: never;
}

export interface SubItemDef {
  labelKey: string;
  icon: IconType;
  to: string;
  roles?: RoleTypes[];
}

export interface NavSubMenuDef {
  labelKey: string;
  icon: IconType;
  to?: never;
  roles?: RoleTypes[];
  subItems: SubItemDef[];
}

export type NavEntry = NavItemDef | NavSubMenuDef;

export interface NavGroupDef {
  labelKey: string;
  items: NavEntry[];
}

// в”Ђв”Ђв”Ђ Nav groups в”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђ

export const navGroups: NavGroupDef[] = [
  {
    labelKey: "main",
    items: [
      {
        labelKey: "dashboard",
        icon: LuLayoutDashboard,
        to: "/",
        roles: [RoleTypes.SUPERADMIN],
      },
      {
        labelKey: "liveMonitor",
        icon: LuActivity,
        subItems: [
          {
            labelKey: "liveKassa",
            icon: LuBanknote,
            to: "/live-monitor/kassa",
            roles: [RoleTypes.SUPERADMIN, RoleTypes.HEAD_CASHIER],
          },
          {
            labelKey: "liveAttraction",
            icon: LuFerrisWheel,
            to: "/live-monitor/attraction",
            roles: [
              RoleTypes.SUPERADMIN,
              RoleTypes.HEAD_CASHIER,
              RoleTypes.HEAD_OPERATOR,
            ],
          },
          {
            labelKey: "liveEmployees",
            icon: LuUsers,
            to: "/live-monitor/employees",
            roles: [
              RoleTypes.SUPERADMIN,
              RoleTypes.HEAD_CASHIER,
              RoleTypes.HEAD_OPERATOR,
            ],
          },
        ],
      },
      {
        labelKey: "reports",
        icon: LuChartBar,
        subItems: [
          {
            labelKey: "reportsKassa",
            icon: LuBanknote,
            to: "/reports/kassa",
            roles: [RoleTypes.SUPERADMIN, RoleTypes.HEAD_ACCOUNTANT],
          },
          {
            labelKey: "reportsAttraction",
            icon: LuFerrisWheel,
            to: "/reports/attraction",
            roles: [RoleTypes.SUPERADMIN, RoleTypes.HEAD_ACCOUNTANT],
          },
          {
            labelKey: "reportsEmployees",
            icon: LuUsers,
            to: "/reports/employees",
            roles: [RoleTypes.SUPERADMIN, RoleTypes.HEAD_ACCOUNTANT],
          },
        ],
      },
    ],
  },
  {
    labelKey: "control",
    items: [
      {
        labelKey: "employees",
        icon: LuUsers,
        to: "/employees",
        roles: [RoleTypes.SUPERADMIN],
      },
      {
        labelKey: "attractions",
        icon: LuFerrisWheel,
        to: "/attractions",
        roles: [RoleTypes.SUPERADMIN, RoleTypes.HEAD_OPERATOR],
      },
      {
        labelKey: "kassa",
        icon: LuBanknote,
        to: "/kassa",
        roles: [RoleTypes.SUPERADMIN, RoleTypes.HEAD_CASHIER],
      },
      {
        labelKey: "kassaZReport",
        icon: LuFileCheck,
        subItems: [
          {
            labelKey: "kassaIncoming",
            icon: LuFileCheck,
            to: "/rolekassa-main/incoming",
            roles: [RoleTypes.SUPERADMIN, RoleTypes.HEAD_CASHIER],
          },
          {
            labelKey: "kassaExport",
            icon: LuFileOutput,
            to: "/rolekassa-main/export",
            roles: [RoleTypes.SUPERADMIN, RoleTypes.HEAD_CASHIER],
          },
        ],
      },
      {
        labelKey: "operatorZReport",
        icon: LuFileCheck,
        subItems: [
          {
            labelKey: "operatorIncoming",
            icon: LuFileCheck,
            to: "/roleoperator-main/incoming",
            roles: [RoleTypes.SUPERADMIN, RoleTypes.HEAD_OPERATOR],
          },
          {
            labelKey: "operatorExport",
            icon: LuFileOutput,
            to: "/roleoperator-main/export",
            roles: [RoleTypes.SUPERADMIN, RoleTypes.HEAD_OPERATOR],
          },
        ],
      },
      {
        labelKey: "buxZReport",
        icon: LuFileInput,
        subItems: [
          {
            labelKey: "buxIncomingKassa",
            icon: LuFileInput,
            to: "/rolebux-main/incoming-kassa",
            roles: [RoleTypes.SUPERADMIN, RoleTypes.HEAD_ACCOUNTANT],
          },
          {
            labelKey: "buxIncomingOperator",
            icon: LuFileInput,
            to: "/rolebux-main/incoming-operator",
            roles: [RoleTypes.SUPERADMIN, RoleTypes.HEAD_ACCOUNTANT],
          },
        ],
      },

      {
        labelKey: "nfcCards",
        icon: LuCreditCard,
        to: "/nfc-cards",
        roles: [RoleTypes.SUPERADMIN, RoleTypes.HEAD_CASHIER],
      },
    ],
  },
];

export const systemItems: NavItemDef[] = [
  {
    labelKey: "settings",
    icon: LuSettings,
    to: "/settings",
    roles: [],
  },
  {
    labelKey: "support",
    icon: LuLifeBuoy,
    to: "/support",
    roles: [],
  },
  ...(import.meta.env.DEV
    ? [
        {
          labelKey: "test-UI",
          icon: SiTestcafe,
          to: "/test-ui",
          roles: [RoleTypes.SUPERADMIN],
        },
      ]
    : []),
];
