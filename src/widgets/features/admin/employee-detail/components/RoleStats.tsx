import { LuActivity } from "react-icons/lu";
import {
  EmployeeRole,
  type Employee,
  type OperatorStats,
  type CashierStats,
  type SecurityStats,
  type CleanerStats,
} from "@/data/employees";
import { useTranslation } from "@/i18n/languageConfig";

export default function RoleStats({ employee }: { employee: Employee }) {
  const { t } = useTranslation("employeeDetail.");
  const { role, statsUser } = employee;
  const rs = statsUser?.roleStats;
  if (!rs) return null;

  const cu = t("countUnit");
  const fmtCount = (n: number) => (cu ? `${n}${cu}` : String(n));

  type Item = { label: string; value: string; color: string };
  const items: Item[] = [];

  if (role === EmployeeRole.OPERATOR) {
    const s = rs as OperatorStats;
    items.push(
      { label: t("role.ridesOperatedToday"), value: fmtCount(s.ridesOperatedToday ?? 0), color: "#3b82f6" },
      { label: t("role.ridesOperatedTotal"), value: fmtCount(s.ridesOperatedTotal ?? 0), color: "#3b82f6" },
    );
  } else if (role === EmployeeRole.CASHIER) {
    const s = rs as CashierStats;
    items.push(
      { label: t("role.ticketsSoldToday"), value: fmtCount(s.ticketsSoldToday ?? 0), color: "#22c55e" },
      { label: t("role.revenueToday"), value: `${(s.revenueToday ?? 0).toLocaleString()} UZS`, color: "#22c55e" },
    );
  } else if (role === EmployeeRole.SECURITY) {
    const s = rs as SecurityStats;
    items.push({ label: t("role.incidentsToday"), value: fmtCount(s.incidentsToday ?? 0), color: "#ef4444" });
  } else if (role === EmployeeRole.CLEANER) {
    const s = rs as CleanerStats;
    items.push({ label: t("role.tasksDoneToday"), value: fmtCount(s.tasksDoneToday ?? 0), color: "#f59e0b" });
  }

  if (items.length === 0) return null;

  return (
    <div
      className="rounded-xl border p-5"
      style={{ background: "var(--bg-second)", borderColor: "var(--border-default)" }}
    >
      <div className="flex items-center gap-2 mb-4">
        <LuActivity size={14} style={{ color: "var(--text-muted)" }} />
        <p className="text-sm font-semibold" style={{ color: "var(--text-default)" }}>
          {t("roleStats")}
        </p>
      </div>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.label} className="flex items-center justify-between">
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>{item.label}</p>
            <p className="text-sm font-semibold" style={{ color: item.color }}>{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
