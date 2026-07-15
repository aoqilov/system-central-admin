import { LuUsers, LuUserCheck, LuUserX, LuSunMedium } from "react-icons/lu";
import { useEmployeeStats } from "../hooks/useApiEmployees";

function StatCard({
  label,
  value,
  icon: Icon,
  color,
  loading,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  color: string;
  loading?: boolean;
}) {
  return (
    <div
      className="rounded-xl p-4 border flex items-center gap-4"
      style={{
        background: "var(--bg-second)",
        borderColor: "var(--border-default)",
      }}
    >
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: `${color}18` }}
      >
        <Icon size={18} style={{ color }} />
      </div>
      <div>
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          {label}
        </p>
        {loading ? (
          <div
            className="rounded"
            style={{
              width: 40,
              height: 28,
              background: "var(--bg-hover)",
              marginTop: 2,
            }}
          />
        ) : (
          <p
            className="text-2xl font-semibold"
            style={{ color: "var(--text-default)" }}
          >
            {value}
          </p>
        )}
      </div>
    </div>
  );
}

export default function EmployeeStatCards() {
  const { data: stats, isPending } = useEmployeeStats();

  return (
    <div className="grid grid-cols-2 desktop:grid-cols-4 gap-3">
      <StatCard
        label="Всего"
        value={stats?.employees ?? 0}
        icon={LuUsers}
        color="#3b82f6"
        loading={isPending}
      />
      <StatCard
        label="Активные"
        value={stats?.active ?? 0}
        icon={LuUserCheck}
        color="#22c55e"
        loading={isPending}
      />
      <StatCard
        label="В отпуске"
        value={stats?.vacation ?? 0}
        icon={LuSunMedium}
        color="#f59e0b"
        loading={isPending}
      />
      <StatCard
        label="Неактивные"
        value={(stats?.inactive ?? 0) + (stats?.fired ?? 0)}
        icon={LuUserX}
        color="#ef4444"
        loading={isPending}
      />
    </div>
  );
}
