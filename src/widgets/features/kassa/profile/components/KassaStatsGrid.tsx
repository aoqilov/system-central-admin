import { LuBanknote, LuTicket, LuClock, LuActivity } from "react-icons/lu";
import type { EmployeeCoreStats, CashierStats } from "@/data/employees";

function fmt(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)} mln`;
  return n.toLocaleString();
}

function fmtMinutes(min: number) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${h}h ${m}m`;
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
  color: string;
}) {
  return (
    <div
      className="rounded-2xl border p-4 flex flex-col gap-2 flex-1"
      style={{ background: "var(--bg-second)", borderColor: "var(--border-default)" }}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>{label}</span>
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center"
          style={{ background: `${color}18` }}
        >
          <Icon size={15} style={{ color }} />
        </div>
      </div>
      <p className="font-bold leading-none" style={{ fontSize: 22, color: "var(--text-default)" }}>
        {value}
      </p>
      {sub && (
        <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>{sub}</p>
      )}
    </div>
  );
}

interface Props {
  core?: EmployeeCoreStats;
  roleStats?: CashierStats;
}

export function KassaStatsGrid({ core, roleStats }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <StatCard
        icon={LuBanknote}
        label="Bugungi tushum"
        value={fmt(roleStats?.revenueToday ?? 0)}
        sub="so'm"
        color="#3b82f6"
      />
      <StatCard
        icon={LuTicket}
        label="Sotilgan chiptalar"
        value={String(roleStats?.ticketsSoldToday ?? 0)}
        sub="bugun"
        color="#8b5cf6"
      />
      <StatCard
        icon={LuClock}
        label="Ishlagan vaqt"
        value={fmtMinutes(core?.workedTodayMinutes ?? 0)}
        sub={core?.checkIn ? `Kirish: ${core.checkIn}` : undefined}
        color="#22c55e"
      />
      <StatCard
        icon={LuActivity}
        label="Samaradorlik"
        value={`${core?.efficiency ?? 0}%`}
        sub={`Davomat: ${core?.attendanceRate ?? 0}%`}
        color="#f97316"
      />
    </div>
  );
}
