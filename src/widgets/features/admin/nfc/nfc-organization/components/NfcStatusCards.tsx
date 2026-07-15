import type { ElementType } from "react";
import { LuCreditCard, LuWifi, LuShieldOff, LuBan } from "react-icons/lu";
import { MdMoney } from "react-icons/md";
import type { CardStats } from "@/types/card.types";

function StatCard({
  icon: Icon,
  label,
  value,
  displayValue,
  color,
  className = "",
}: {
  icon: ElementType;
  label: string;
  value: number;
  displayValue?: string;
  color: string;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl p-4 flex flex-col items-center gap-2 ${className}`}
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
      <p className="text-xs text-center" style={{ color: "var(--text-muted)" }}>
        {label}
      </p>
      <p
        className="font-bold leading-none text-center break-all"
        style={{
          color: "var(--text-default)",
          fontSize: displayValue && displayValue.length > 10 ? "0.85rem" : "1.25rem",
        }}
      >
        {displayValue ?? value}
      </p>
    </div>
  );
}

function StatSkeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`rounded-xl p-4 flex flex-col items-center gap-2 animate-pulse ${className}`}
      style={{
        background: "var(--bg-second)",
        border: "1px solid var(--border-default)",
      }}
    >
      <div className="w-9 h-9 rounded-lg" style={{ background: "var(--bg-hover)" }} />
      <div className="h-3 w-14 rounded" style={{ background: "var(--bg-hover)" }} />
      <div className="h-5 w-10 rounded" style={{ background: "var(--bg-hover)" }} />
    </div>
  );
}

interface Props {
  stats?: CardStats;
  isLoading?: boolean;
}

export default function NfcStatusCards({ stats, isLoading }: Props) {
  if (isLoading || !stats) {
    return (
      <div className="grid grid-cols-2 tablet:grid-cols-4 desktop:grid-cols-7 gap-3">
        {Array.from({ length: 7 }).map((_, i) => (
          <StatSkeleton
            key={i}
            className={i === 6 ? "col-span-2 tablet:col-span-4 desktop:col-span-1" : ""}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 tablet:grid-cols-4 desktop:grid-cols-7 gap-3">
      <StatCard icon={LuCreditCard} label="Всего"         value={stats.total}        color="#64748b" />
      <StatCard icon={LuWifi}       label="Активных"      value={stats.active}       color="#22c55e" />
      <StatCard icon={LuShieldOff}  label="Неактивных"    value={stats.inactive}     color="#ef4444" />
      <StatCard icon={LuBan}        label="Заблокировано" value={stats.blocked}      color="#94a3b8" />
      <StatCard icon={LuBan}        label="Утеряно"       value={stats.lost}         color="#facc15" />
      <StatCard icon={LuBan}        label="Заморожено"    value={stats.frozen}       color="#3b82f6" />
      <StatCard
        icon={MdMoney}
        label="Общий баланс"
        value={stats.totalBalance}
        displayValue={stats.totalBalance.toLocaleString("ru-RU")}
        color="#22c55e"
        className="col-span-2 tablet:col-span-4 desktop:col-span-1"
      />
    </div>
  );
}
