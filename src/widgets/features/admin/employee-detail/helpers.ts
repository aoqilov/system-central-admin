import {
  EmployeeRole,
  EmployeeStatus,
  type Employee,
  type OperatorStats,
  type CashierStats,
  type SecurityStats,
  type CleanerStats,
} from "@/data/employees";
import type { BadgeStatus } from "@/components/ui/badge/CusBadge";

export function fmtMin(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export const STATUS_TO_BADGE: Record<EmployeeStatus, BadgeStatus> = {
  [EmployeeStatus.ACTIVE]: "active",
  [EmployeeStatus.INACTIVE]: "inactive",
  [EmployeeStatus.FIRED]: "fired",
  [EmployeeStatus.VACATION]: "vacation",
};

export type ChartCfg = {
  dataKey: string;
  labelKey: "rides" | "tickets" | "incidents" | "tasks" | "minutes";
  color: string;
  yFmt?: (v: number) => string;
};

export const ROLE_CHART: Record<EmployeeRole, ChartCfg> = {
  [EmployeeRole.OPERATOR]: {
    dataKey: "ridesOperated",
    labelKey: "rides",
    color: "#3b82f6",
  },
  [EmployeeRole.CASHIER]: {
    dataKey: "ticketsSold",
    labelKey: "tickets",
    color: "#22c55e",
  },
  [EmployeeRole.SECURITY]: {
    dataKey: "incidents",
    labelKey: "incidents",
    color: "#ef4444",
  },
  [EmployeeRole.CLEANER]: {
    dataKey: "tasksDone",
    labelKey: "tasks",
    color: "#f59e0b",
  },
  [EmployeeRole.ADMIN]: {
    dataKey: "workedMinutes",
    labelKey: "minutes",
    color: "#8b5cf6",
    yFmt: (v) => `${Math.floor(v / 60)}h`,
  },
};

export function getRoleMainStat(
  employee: Employee,
  t: (key: string) => string,
): { value: string; label: string } {
  const rs = employee.statsUser?.roleStats;
  if (!rs) {
    const min = employee.statsUser?.core.workedTodayMinutes;
    return { value: min ? fmtMin(min) : "—", label: t("workedToday") };
  }
  switch (employee.role) {
    case EmployeeRole.OPERATOR:
      return {
        value: String((rs as OperatorStats).ridesOperatedToday ?? 0),
        label: t("chart.rides"),
      };
    case EmployeeRole.CASHIER:
      return {
        value: String((rs as CashierStats).ticketsSoldToday ?? 0),
        label: t("chart.tickets"),
      };
    case EmployeeRole.SECURITY:
      return {
        value: String((rs as SecurityStats).incidentsToday ?? 0),
        label: t("chart.incidents"),
      };
    case EmployeeRole.CLEANER:
      return {
        value: String((rs as CleanerStats).tasksDoneToday ?? 0),
        label: t("chart.tasks"),
      };
    default:
      return { value: "—", label: t("workedToday") };
  }
}
