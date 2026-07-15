import React from "react";
import {
  LuPlay,
  LuUsers,
  LuWifiOff,
  LuWifi,
  LuStar,
  LuUserCheck,
  LuShield,
  LuBanknote,
} from "react-icons/lu";
import { fmt } from "../helpers";
import type { AttractionZReportTotals } from "@/types/report.types";

function StatCard({
  label,
  value,
  sub,
  color,
  icon: Icon,
  loading,
}: {
  label: string;
  value: string;
  sub?: string;
  color: string;
  icon: React.ElementType;
  loading?: boolean;
}) {
  const isDefault = color === "var(--text-default)";
  const col = isDefault ? "#6b7280" : color;
  return (
    <div
      className="flex flex-col gap-1.5 rounded-xl border p-3"
      style={{
        background: "var(--bg-second)",
        borderColor: "var(--border-default)",
      }}
    >
      <div className="flex items-center justify-between gap-1">
        <span
          className="text-[10px] font-semibold truncate"
          style={{ color: "var(--text-muted)" }}
        >
          {label}
        </span>
        <div
          className="w-5 h-5 rounded-md flex items-center justify-center shrink-0"
          style={{ background: `${col}18` }}
        >
          <Icon size={11} style={{ color: col }} />
        </div>
      </div>
      {loading ? (
        <div
          className="h-5 w-16 rounded animate-pulse"
          style={{ background: "var(--bg-hover)" }}
        />
      ) : (
        <p
          className="font-bold leading-none"
          style={{
            fontSize: 20,
            color: isDefault ? "var(--text-default)" : color,
          }}
        >
          {value}
        </p>
      )}
      {sub && !loading && (
        <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>
          {sub}
        </p>
      )}
    </div>
  );
}

interface Props {
  totals: AttractionZReportTotals | undefined;
  isLoading: boolean;
}

export function AttractionTabStatCards({ totals, isLoading }: Props) {
  const t = totals;

  const CARDS: {
    label: string;
    value: string;
    sub?: string;
    color: string;
    icon: React.ElementType;
  }[] = [
    {
      label: "Раунды",
      value: String(t?.total_rounds ?? 0),
      color: "#60a5fa",
      icon: LuPlay,
    },
    {
      label: "Всего",
      value: String(t?.total_people ?? 0),
      color: "var(--text-default)",
      icon: LuUsers,
    },

    {
      label: "Онлайн",
      value: String(t?.total_online ?? 0),
      color: "#3b82f6",
      icon: LuWifi,
    },
    {
      label: "CLASSIC",
      value: String(t?.total_offline ?? 0),
      color: "#3b82f6",
      icon: LuWifiOff,
    },
    {
      label: "VIP",
      value: String(t?.total_vip ?? 0),
      color: "#8b5cf6",
      icon: LuStar,
    },
    {
      label: "ORGANIZATION",
      value: String(t?.total_organization ?? 0),
      color: "#eab308",
      icon: LuUserCheck,
    },
    {
      label: "Итого",
      value: fmt(t?.total_amount ?? 0),
      sub: "сум",
      color: "#22c55e",
      icon: LuBanknote,
    },
  ];

  return (
    <div className="grid grid-cols-4 tablet:grid-cols-8 gap-2">
      {CARDS.map((card) => (
        <StatCard key={card.label} loading={isLoading} {...card} />
      ))}
    </div>
  );
}
