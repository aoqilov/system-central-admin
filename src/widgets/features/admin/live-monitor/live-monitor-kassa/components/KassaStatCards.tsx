import React from "react";
import {
  LuBanknote,
  LuArrowUpDown,
  LuWallet,
  LuCreditCard,
  LuTrendingUp,
  LuLayoutGrid,
} from "react-icons/lu";
import { CusCard } from "../../../../../../components/shared/card/CusCard";

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
    <CusCard className="p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span
          className="text-xs font-medium"
          style={{ color: "var(--text-muted)" }}
        >
          {label}
        </span>
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: `${color}18` }}
        >
          <Icon size={15} style={{ color }} />
        </div>
      </div>
      <div>
        <p
          className="text-xl font-bold"
          style={{ color: "var(--text-default)" }}
        >
          {value}
        </p>
        {sub && (
          <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
            {sub}
          </p>
        )}
      </div>
    </CusCard>
  );
}

const fmt = (v: number) =>
  v >= 1_000_000 ? `${(v / 1_000_000).toFixed(2)} mln` : v.toLocaleString();

const TOTAL = 16_400_000;

export function KassaStatCards() {
  const activeCount = 5;
  const inactiveCount = 2;
  const maintenanceCount = 1;

  return (
    <div className="grid grid-cols-2 tablet:grid-cols-3 desktop:grid-cols-6 gap-4">
      <StatCard
        label="Bugungi daromad"
        value={fmt(TOTAL)}
        sub="so'm"
        color="var(--color-blue)"
        icon={LuBanknote}
      />
      <StatCard
        label="Tranzaksiyalar"
        value="411"
        sub="bugun"
        color="var(--color-cyan)"
        icon={LuArrowUpDown}
      />
      <StatCard
        label="Naqd pul"
        value={fmt(6_450_000)}
        sub={`${Math.round((6_450_000 / TOTAL) * 100)}%`}
        color="var(--color-green)"
        icon={LuWallet}
      />
      <StatCard
        label="UzCard"
        value={fmt(5_280_000)}
        sub={`${Math.round((5_280_000 / TOTAL) * 100)}%`}
        color="var(--color-purple)"
        icon={LuCreditCard}
      />
      <StatCard
        label="Karta to'ldirish"
        value={fmt(2_670_000)}
        sub={`${Math.round((2_670_000 / TOTAL) * 100)}%`}
        color="var(--color-yellow)"
        icon={LuTrendingUp}
      />

      <CusCard className="p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span
            className="text-xs font-medium"
            style={{ color: "var(--text-muted)" }}
          >
            Kassalar holati
          </span>
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "var(--bg-hover)" }}
          >
            <LuLayoutGrid size={15} style={{ color: "var(--text-muted)" }} />
          </div>
        </div>
        <div className="flex items-end gap-3">
          <div className="text-center">
            <p
              className="text-xl font-bold"
              style={{ color: "var(--color-green)" }}
            >
              {activeCount}
            </p>
            <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
              Faol
            </p>
          </div>
          <div className="text-center">
            <p
              className="text-xl font-bold"
              style={{ color: "var(--color-gray)" }}
            >
              {inactiveCount}
            </p>
            <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
              Nofaol
            </p>
          </div>
          <div className="text-center">
            <p
              className="text-xl font-bold"
              style={{ color: "var(--color-yellow)" }}
            >
              {maintenanceCount}
            </p>
            <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
              Ta'mirda
            </p>
          </div>
        </div>
      </CusCard>
    </div>
  );
}
