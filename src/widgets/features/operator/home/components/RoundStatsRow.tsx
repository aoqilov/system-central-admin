import {
  LuPlay,
  LuUsers,
  LuWifiOff,
  LuWifi,
  LuStar,
  LuUserPlus,
  LuShield,
  LuBanknote,
  LuIdCard,
} from "react-icons/lu";
import { StatCard } from "@/widgets/features/kassa/otchet/components/StatCard";
import type { AttractionReport } from "../../smena/types";

interface Props {
  activeXreport: AttractionReport | null;
}

function fmt(n: number) {
  return n.toLocaleString("uz-UZ");
}

function toTime(iso: string) {
  return iso?.slice(11, 16) || "—";
}

const STATUS_MAP: Record<
  AttractionReport["status"],
  { label: string; color: string }
> = {
  open: { label: "Активна", color: "#22c55e" },
  stopped: { label: "Остановлена", color: "#f59e0b" },
  closed: { label: "Закрыта", color: "#64748b" },
};

export function RoundStatsRow({ activeXreport }: Props) {
  const status = activeXreport ? STATUS_MAP[activeXreport.status] : null;
  const op = activeXreport?.operator;
  const operatorName = op ? `${op.firstname} ${op.lastname}` : "—";

  const r = activeXreport;
  const roundCount = r?.total_rounds ?? 0;
  const people = r?.total_people ?? 0;
  const offline = r?.total_offline ?? 0;
  const online = r?.total_online ?? 0;
  const vip = r?.total_vip ?? 0;
  const guest = r?.total_organization ?? 0;
  const parkStaff = r?.total_park_staff ?? 0;
  const total = r?.total_amount ?? 0;

  return (
    <div
      className="rounded-2xl border overflow-hidden"
      style={{
        background: "var(--bg-second)",
        borderColor: "var(--border-default)",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-3 border-b"
        style={{ borderColor: "var(--border-default)" }}
      >
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <p
              className="text-sm font-semibold"
              style={{ color: "var(--text-default)" }}
            >
              {operatorName || "—"}
            </p>
            {activeXreport && (
              <span
                className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded"
                style={{
                  background: "var(--bg-hover)",
                  color: "var(--text-muted)",
                }}
              >
                x-otchet: #{activeXreport.id}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 mt-0.5">
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
              Открыта:{" "}
              <span style={{ color: "var(--text-default)" }}>
                {activeXreport ? toTime(activeXreport.opened_at) : "—"}
              </span>
            </span>
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
              Закрыта:{" "}
              <span style={{ color: "var(--text-default)" }}>
                {activeXreport?.closed_at
                  ? toTime(activeXreport.closed_at)
                  : "—"}
              </span>
            </span>
          </div>
        </div>

        {status && (
          <span
            className="text-xs font-medium px-2.5 py-1 rounded-full"
            style={{ background: `${status.color}18`, color: status.color }}
          >
            {status.label}
          </span>
        )}
      </div>

      {/* StatCards */}
      <div className="overflow-x-auto px-4 py-4">
        <div className="flex gap-3">
          <StatCard
            icon={LuPlay}
            label="Раунд"
            value={String(roundCount)}
            color="#3b82f6"
          />
          <StatCard
            icon={LuUsers}
            label="Всего"
            value={String(people)}
            color="#22c55e"
          />

          <StatCard
            icon={LuWifi}
            label="Online"
            value={String(online)}
            color="#06b6d4"
          />
          <StatCard
            icon={LuIdCard}
            label="Classic"
            value={String(offline)}
            color="#64748b"
          />
          <StatCard
            icon={LuStar}
            label="VIP"
            value={String(vip)}
            color="#8b5cf6"
          />
          <StatCard
            icon={LuUserPlus}
            label="Organization"
            value={String(guest)}
            color="#eab308"
          />

          <StatCard
            icon={LuBanknote}
            label="Итого"
            value={fmt(total)}
            sub="сум"
            color="#3b82f6"
          />
        </div>
      </div>
    </div>
  );
}
