import React from "react";
import { CusCard } from "../../../../../../components/shared/card/CusCard";
import {
  LuBanknote,
  LuWallet,
  LuCreditCard,
  LuSmartphone,
  LuTrendingUp,
  LuUserCheck,
} from "react-icons/lu";
import type { ZReportTotals } from "../types";

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
  return (
    <CusCard className="p-3 flex flex-col gap-2 flex-shrink-0" style={{ minWidth: 188 }}>
      <div className="flex items-start justify-between gap-1">
        <span className="text-[11px] font-medium leading-tight min-w-0" style={{ color: "var(--text-muted)" }}>
          {label}
        </span>
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: `${color}18` }}
        >
          <Icon size={13} style={{ color }} />
        </div>
      </div>
      <div>
        {loading ? (
          <div className="h-5 w-24 rounded animate-pulse" style={{ background: "var(--bg-hover)" }} />
        ) : (
          <p className="text-base font-bold leading-none" style={{ color: "var(--text-default)" }}>
            {value} <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>сум</span>
          </p>
        )}
        {sub && !loading && (
          <p className="text-[11px] mt-0.5" style={{ color: "var(--text-muted)" }}>{sub}</p>
        )}
      </div>
    </CusCard>
  );
}

const fmt = (v: number) => v.toLocaleString("ru-RU");

const pct = (part: number, total: number) =>
  total > 0 ? `${Math.round((part / total) * 100)}%` : "0%";

interface Props {
  totals: ZReportTotals | undefined;
  isLoading: boolean;
}

export function KassaStatCards({ totals, isLoading }: Props) {
  const t = totals;

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-semibold" style={{ color: "var(--text-default)" }}>
        Статистика за сегодня
      </p>
      <div className="overflow-x-auto -mx-4 tablet:-mx-6 px-4 tablet:px-6 pb-1">
        <div className="flex gap-3">
          <StatCard loading={isLoading} label="Выручка за сегодня" value={fmt(t?.total_amount ?? 0)}    sub="сум"                                                               color="var(--color-blue)"   icon={LuBanknote}   />
          <StatCard loading={isLoading} label="Наличные"           value={fmt(t?.cash_amount ?? 0)}     sub={pct(t?.cash_amount ?? 0, t?.total_amount ?? 0)}                    color="var(--color-green)"  icon={LuWallet}     />
          <StatCard loading={isLoading} label="UzCard"             value={fmt(t?.uzcard_amount ?? 0)}   sub={pct(t?.uzcard_amount ?? 0, t?.total_amount ?? 0)}                  color="var(--color-blue)"   icon={LuCreditCard} />
          <StatCard loading={isLoading} label="Humo"               value={fmt(t?.humo_amount ?? 0)}     sub={pct(t?.humo_amount ?? 0, t?.total_amount ?? 0)}                    color="#38bdf8"             icon={LuCreditCard} />
          <StatCard loading={isLoading} label="UzumBank"           value={fmt(t?.uzum_amount ?? 0)}     sub={pct(t?.uzum_amount ?? 0, t?.total_amount ?? 0)}                    color="#ec4899"             icon={LuSmartphone} />
          <StatCard loading={isLoading} label="Click"              value={fmt(t?.click_amount ?? 0)}    sub={pct(t?.click_amount ?? 0, t?.total_amount ?? 0)}                   color="#1e40af"             icon={LuSmartphone} />
          <StatCard loading={isLoading} label="Payme"              value={fmt(t?.payme_amount ?? 0)}    sub={pct(t?.payme_amount ?? 0, t?.total_amount ?? 0)}                   color="#f97316"             icon={LuSmartphone} />
          <StatCard loading={isLoading} label="Карт продано"       value={String(t?.activated_cards_count ?? 0)}  sub="сегодня"                                                color="var(--color-yellow)" icon={LuTrendingUp} />
          <StatCard loading={isLoading} label="Регистрация карт"   value={String(t?.relationed_cards_count ?? 0)} sub="сегодня"                                                color="var(--color-cyan)"   icon={LuUserCheck}  />
        </div>
      </div>
    </div>
  );
}
