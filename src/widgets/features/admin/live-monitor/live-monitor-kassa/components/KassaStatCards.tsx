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
function StatCard({
  label,
  value,
  sub,
  color,
  icon: Icon,
}: {
  label: string;
  value: string;
  sub?: string;
  color: string;
  icon: React.ElementType;
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
        <p className="text-base font-bold leading-none" style={{ color: "var(--text-default)" }}>
          {value}
        </p>
        {sub && (
          <p className="text-[11px] mt-0.5" style={{ color: "var(--text-muted)" }}>{sub}</p>
        )}
      </div>
    </CusCard>
  );
}

const fmt = (v: number) =>
  v >= 1_000_000 ? `${(v / 1_000_000).toFixed(2)} mln` : v.toLocaleString();

const NAQD      = 4_200_000;
const UZCARD    = 3_150_000;
const HUMO      = 2_800_000;
const UZUMBANK  = 1_950_000;
const CLICK     = 2_300_000;
const PAYME     = 1_750_000;
const TOTAL     = NAQD + UZCARD + HUMO + UZUMBANK + CLICK + PAYME;

export function KassaStatCards() {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-semibold" style={{ color: "var(--text-default)" }}>
        Bugungi statistika
      </p>
      <div className="overflow-x-auto -mx-4 tablet:-mx-6 px-4 tablet:px-6 pb-1">
        <div className="flex gap-3">
          <StatCard label="Bugungi daromad"       value={fmt(TOTAL)}    sub="so'm"                                        color="var(--color-blue)"   icon={LuBanknote}   />
          <StatCard label="Naqd"                  value={fmt(NAQD)}     sub={`${Math.round((NAQD     / TOTAL) * 100)}%`}  color="var(--color-green)"  icon={LuWallet}     />
          <StatCard label="UzCard"                value={fmt(UZCARD)}   sub={`${Math.round((UZCARD   / TOTAL) * 100)}%`}  color="var(--color-blue)"   icon={LuCreditCard} />
          <StatCard label="Humo"                  value={fmt(HUMO)}     sub={`${Math.round((HUMO     / TOTAL) * 100)}%`}  color="var(--color-purple)" icon={LuCreditCard} />
          <StatCard label="UzumBank"              value={fmt(UZUMBANK)} sub={`${Math.round((UZUMBANK / TOTAL) * 100)}%`}  color="var(--color-cyan)"   icon={LuSmartphone} />
          <StatCard label="Click"                 value={fmt(CLICK)}    sub={`${Math.round((CLICK    / TOTAL) * 100)}%`}  color="#f97316"             icon={LuSmartphone} />
          <StatCard label="Payme"                 value={fmt(PAYME)}    sub={`${Math.round((PAYME    / TOTAL) * 100)}%`}  color="#ef4444"             icon={LuSmartphone} />
          <StatCard label="Karta sotildi"         value="54"            sub="bugun"                                       color="var(--color-yellow)" icon={LuTrendingUp} />
          <StatCard label="Karta registratsiya"   value="31"            sub="bugun"                                       color="var(--color-cyan)"   icon={LuUserCheck}  />
        </div>
      </div>
    </div>
  );
}
