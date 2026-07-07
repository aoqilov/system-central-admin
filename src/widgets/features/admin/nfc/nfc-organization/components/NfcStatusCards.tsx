import type { ElementType } from "react";
import { LuCreditCard, LuWifi, LuShieldOff, LuBan } from "react-icons/lu";
import { useQuery } from "@tanstack/react-query";
import { getCardsStats } from "../api/nfcOrgApi";

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: ElementType;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div
      className="rounded-xl p-4 flex items-center gap-3"
      style={{
        background: "var(--bg-second)",
        border: "1px solid var(--border-default)",
      }}
    >
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: `${color}18` }}
      >
        <Icon size={16} style={{ color }} />
      </div>
      <div>
        <p
          className="text-xl font-bold leading-none"
          style={{ color: "var(--text-default)" }}
        >
          {value}
        </p>
        <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
          {label}
        </p>
      </div>
    </div>
  );
}

function StatSkeleton() {
  return (
    <div
      className="rounded-xl p-4 flex items-center gap-3 animate-pulse"
      style={{
        background: "var(--bg-second)",
        border: "1px solid var(--border-default)",
      }}
    >
      <div className="w-9 h-9 rounded-lg shrink-0" style={{ background: "var(--bg-hover)" }} />
      <div className="space-y-2 flex-1">
        <div className="h-5 w-10 rounded" style={{ background: "var(--bg-hover)" }} />
        <div className="h-3 w-16 rounded" style={{ background: "var(--bg-hover)" }} />
      </div>
    </div>
  );
}

export default function NfcStatusCards() {
  const { data, isLoading } = useQuery({
    queryKey: ["nfc-org-cards-stats"],
    queryFn: getCardsStats,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 desktop:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => <StatSkeleton key={i} />)}
      </div>
    );
  }

  const batches = data?.data.card_stats ?? [];
  if (!data) return null;

  const total    = batches.reduce((s, b) => s + b.total,    0);
  const active   = batches.reduce((s, b) => s + b.active,   0);
  const inactive = batches.reduce((s, b) => s + b.inactive, 0);
  const blocked  = batches.reduce((s, b) => s + b.blocked,  0);

  return (
    <div className="grid grid-cols-2 desktop:grid-cols-4 gap-3">
      <StatCard icon={LuCreditCard} label="Всего"          value={total}    color="#64748b" />
      <StatCard icon={LuWifi}       label="Активных"       value={active}   color="#22c55e" />
      <StatCard icon={LuShieldOff}  label="Неактивных"     value={inactive} color="#94a3b8" />
      <StatCard icon={LuBan}        label="Заблокировано"  value={blocked}  color="#ef4444" />
    </div>
  );
}
