import { LuActivity } from "react-icons/lu";
import {
  CusCard,
  CusCardHeader,
} from "../../../../../../components/shared/card/CusCard";
import {
  CusTable,
  type ColumnDef,
} from "../../../../../../components/ui/table/CusTable";
import {
  employees,
  EmployeeRole,
  EmployeeStatus,
} from "../../../../../../data/employees";

const fmtMin = (m = 0) => {
  if (!m) return "—";
  const h = Math.floor(m / 60);
  const min = m % 60;
  return h > 0 ? `${h}h ${min}m` : `${min}m`;
};

const ROLE_CFG: Record<EmployeeRole, { label: string; color: string }> = {
  [EmployeeRole.ADMIN]: { label: "Admin", color: "var(--color-purple)" },
  [EmployeeRole.CASHIER]: { label: "Kassir", color: "var(--color-blue)" },
  [EmployeeRole.OPERATOR]: { label: "Operator", color: "var(--color-cyan)" },
  [EmployeeRole.SECURITY]: { label: "Security", color: "var(--color-yellow)" },
  [EmployeeRole.CLEANER]: { label: "Cleaner", color: "var(--color-gray)" },
};

const STATUS_CFG: Record<EmployeeStatus, { label: string; color: string }> = {
  [EmployeeStatus.ACTIVE]: { label: "Faol", color: "var(--color-green)" },
  [EmployeeStatus.INACTIVE]: { label: "Nofaol", color: "var(--color-gray)" },
  [EmployeeStatus.VACATION]: {
    label: "Ta'tilda",
    color: "var(--color-yellow)",
  },
  [EmployeeStatus.FIRED]: { label: "Ketgan", color: "var(--color-red)" },
};

type Emp = (typeof employees)[number];

const columns: ColumnDef<Emp>[] = [
  {
    key: "fullName",
    header: "Xodim",
    render: (e) => (
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <img
          src={e.avatarUrl ?? `https://i.pravatar.cc/150?u=${e.id}`}
          alt={e.fullName}
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            objectFit: "cover",
            flexShrink: 0,
          }}
        />
        <div>
          <p
            style={{
              fontSize: 13,
              fontWeight: 500,
              color: "var(--text-2)",
              lineHeight: 1.2,
            }}
          >
            {e.fullName ?? `${e.firstName} ${e.lastName}`}
          </p>
          <p style={{ fontSize: 11, color: "var(--text-muted)" }}>#{e.id}</p>
        </div>
      </div>
    ),
  },
  {
    key: "role",
    header: "Lavozim",
    render: (e) => {
      const cfg = ROLE_CFG[e.role];
      return (
        <span
          style={{
            display: "inline-block",
            padding: "2px 8px",
            borderRadius: 4,
            fontSize: 11,
            fontWeight: 600,
            background: `${cfg.color}18`,
            color: cfg.color,
          }}
        >
          {cfg.label}
        </span>
      );
    },
  },
  {
    key: "status",
    header: "Holat",
    render: (e) => {
      const cfg = STATUS_CFG[e.status];
      return (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            fontSize: 12,
          }}
        >
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: cfg.color,
              display: "inline-block",
              boxShadow:
                e.status === EmployeeStatus.ACTIVE
                  ? `0 0 5px ${cfg.color}`
                  : "none",
            }}
          />
          <span style={{ color: cfg.color }}>{cfg.label}</span>
        </span>
      );
    },
  },
  {
    key: "statsUser",
    header: "Keldi",
    render: (e) => (
      <span
        className="font-mono text-xs"
        style={{ color: "var(--text-muted)" }}
      >
        {e.statsUser?.core.checkIn ?? "—"}
      </span>
    ),
  },
  {
    key: "statsUser",
    header: "Ish vaqti",
    render: (e) => (
      <span style={{ fontSize: 12, color: "var(--text-3)" }}>
        {fmtMin(e.statsUser?.core.workedTodayMinutes)}
      </span>
    ),
  },
  {
    key: "statsUser",
    header: "KPI",
    align: "right",
    render: (e) => {
      const eff = e.statsUser?.core.efficiency;
      if (!eff) return <span style={{ color: "var(--text-dim)" }}>—</span>;
      const color =
        eff >= 90
          ? "var(--color-green)"
          : eff >= 75
            ? "var(--color-yellow)"
            : "var(--color-red)";
      return (
        <span style={{ fontSize: 13, fontWeight: 600, color }}>{eff}%</span>
      );
    },
  },
];

export function EmployeeStatusTable() {
  return (
    <CusCard>
      <CusCardHeader
        icon={LuActivity}
        title="Xodimlar holati"
        iconColor="var(--color-green)"
        action={
          <div className="flex items-center gap-1.5">
            <span
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ background: "var(--color-green)" }}
            />
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
              Live
            </span>
          </div>
        }
      />
      <CusTable<Emp>
        data={employees}
        maxH="400px"
        stickyHeader
        variant="outline"
        colorHeader="var(--bg-hover)"
        size="sm"
        columns={columns}
      />
    </CusCard>
  );
}
