import { type ElementType } from "react";
import { useQuery } from "@tanstack/react-query";
import { LuCheck, LuWrench, LuBan, LuLayoutGrid } from "react-icons/lu";
import { fetchCashboxStats } from "../api/apiKassa";

function StatCard({
  icon: Icon,
  label,
  value,
  color,
  isLoading,
}: {
  icon: ElementType;
  label: string;
  value: number | undefined;
  color: string;
  isLoading: boolean;
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
        {isLoading ? (
          <div
            className="mt-1 h-7 w-10 rounded"
            style={{
              background: "var(--bg-hover)",
              animation: "pulse 1.5s infinite",
            }}
          />
        ) : (
          <p
            className="text-2xl font-semibold"
            style={{ color: "var(--text-default)" }}
          >
            {value ?? "—"}
          </p>
        )}
      </div>
    </div>
  );
}

export function KassaStatCards() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["cashbox-stats"],
    queryFn: fetchCashboxStats,
    staleTime: 1000 * 60 * 5,
  });

  return (
    <div className="grid grid-cols-2 desktop:grid-cols-4 gap-3">
      <StatCard
        icon={LuLayoutGrid}
        label="Всего касс"
        value={stats?.cashboxes}
        color="#3b82f6"
        isLoading={isLoading}
      />
      <StatCard
        icon={LuCheck}
        label="Активных"
        value={stats?.active}
        color="#22c55e"
        isLoading={isLoading}
      />
      <StatCard
        icon={LuWrench}
        label="На обслуживании"
        value={stats?.maintenance}
        color="#f59e0b"
        isLoading={isLoading}
      />
      <StatCard
        icon={LuBan}
        label="Закрытых"
        value={stats?.inactive}
        color="#ef4444"
        isLoading={isLoading}
      />
    </div>
  );
}
