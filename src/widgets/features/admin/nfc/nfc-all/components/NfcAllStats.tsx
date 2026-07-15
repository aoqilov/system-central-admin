import type { ElementType } from "react";
import { LuCreditCard, LuWifi, LuShieldOff, LuBan } from "react-icons/lu";
import { MdMoney } from "react-icons/md";
import type { NfcAllStats } from "../nfc-all.types";
import { NFC_TYPE_META } from "../nfc-all.types";

function StatCard({
  icon: Icon,
  label,
  value,
  displayValue,
  color,
  className = "",
  sub,
}: {
  icon: ElementType;
  label: string;
  value: number;
  displayValue?: string;
  color: string;
  className?: string;
  sub?: React.ReactNode;
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
        className="font-bold tabular-nums leading-none text-center break-all"
        style={{
          color: "var(--text-default)",
          fontSize:
            displayValue && displayValue.length > 10 ? "0.85rem" : "1.25rem",
        }}
      >
        {displayValue ?? value.toLocaleString()}
      </p>
      {sub && <div className="w-full">{sub}</div>}
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
      <div
        className="w-9 h-9 rounded-lg"
        style={{ background: "var(--bg-hover)" }}
      />
      <div
        className="h-3 w-14 rounded"
        style={{ background: "var(--bg-hover)" }}
      />
      <div
        className="h-5 w-10 rounded"
        style={{ background: "var(--bg-hover)" }}
      />
    </div>
  );
}

interface Props {
  stats: NfcAllStats;
  isLoading?: boolean;
}

export function NfcAllStats({ stats, isLoading }: Props) {
  if (isLoading || !stats) {
    return (
      <div className="grid grid-cols-2 tablet:grid-cols-4 desktop:grid-cols-7 gap-3">
        {Array.from({ length: 7 }).map((_, i) => (
          <StatSkeleton
            key={i}
            className={
              i === 6 ? "col-span-2 tablet:col-span-4 desktop:col-span-1" : ""
            }
          />
        ))}
      </div>
    );
  }

  const { total, byType, totalBalance } = stats;

  return (
    <>
      <div className="grid grid-cols-3 gap-3">
        {(["classic", "vip", "organization"] as const).map((t) => {
          const meta = NFC_TYPE_META[t];
          return (
            <div
              key={t}
              className="rounded-xl p-4 flex flex-col gap-3"
              style={{
                background: "var(--bg-second)",
                border: "1px solid var(--border-default)",
                borderLeft: `3px solid ${meta.color}`,
              }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="inline-block w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ background: meta.color }}
                />
                <span className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>
                  {meta.label}
                </span>
              </div>
              <p className="text-2xl font-bold tabular-nums" style={{ color: "var(--text-default)" }}>
                {byType[t].total.toLocaleString()}
              </p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-2 tablet:grid-cols-4 desktop:grid-cols-7 gap-3">
        <StatCard
          icon={LuCreditCard}
          label="Всего карт"
          value={total.total}
          color="#64748b"
        />
        <StatCard
          icon={LuWifi}
          label="Активных"
          value={total.active}
          color="#22c55e"
        />
        <StatCard
          icon={LuShieldOff}
          label="Неактивных"
          value={total.inactive}
          color="#ef4444"
        />
        <StatCard
          icon={LuBan}
          label="Заблокировано"
          value={total.blocked}
          color="#94a3b8"
        />
        <StatCard
          icon={LuBan}
          label="Утеряно"
          value={total.lost}
          color="#facc15"
        />
        <StatCard
          icon={LuBan}
          label="Заморожено"
          value={total.frozen}
          color="#3b82f6"
        />
        <StatCard
          icon={MdMoney}
          label="Общий баланс"
          value={totalBalance}
          displayValue={totalBalance.toLocaleString("ru-RU")}
          color="#22c55e"
          className="col-span-2 tablet:col-span-4 desktop:col-span-1"
        />
      </div>
    </>
  );
}
