import type { ElementType } from "react";
import {
  LuBanknote,
  LuCreditCard,
  LuSmartphone,
  LuWallet,
  LuTrendingUp,
  LuTrendingDown,
} from "react-icons/lu";
import type { PaymentRow } from "../types";
import { ExportSummaryCard } from "./ExportSummaryCard";

const TYPE_CONFIG: Record<string, { icon: ElementType; color: string }> =
  {
    Наличные: { icon: LuBanknote, color: "#22c55e" },
    UzCard: { icon: LuCreditCard, color: "#3b82f6" },
    Humo: { icon: LuCreditCard, color: "#8b5cf6" },
    Click: { icon: LuSmartphone, color: "#f97316" },
    PayMe: { icon: LuSmartphone, color: "#ef4444" },
    UZUM: { icon: LuWallet, color: "#06b6d4" },
  };

interface Props {
  rows: PaymentRow[];
  totalNoDiscount: number;
  kartaSum: number;
}

export function ExportSummaryCards({ rows, totalNoDiscount, kartaSum }: Props) {
  return (
    <div className="overflow-x-auto">
      <div className="flex gap-3" style={{ minWidth: "max-content" }}>
        <ExportSummaryCard
          icon={LuBanknote}
          label="Общая выручка"
          value={`${(totalNoDiscount / 1_000_000).toFixed(2)} млн`}
          sub="сум"
          color="#3b82f6"
        />

        {rows.map((row) => {
          const total = row.kassas.reduce((s, k) => s + (k.noDiscount ?? 0), 0);
          const cfg = TYPE_CONFIG[row.type] ?? {
            icon: LuBanknote,
            color: "#6b7280",
          };
          return (
            <ExportSummaryCard
              key={row.type}
              icon={cfg.icon}
              label={row.type}
              value={
                total >= 1_000_000
                  ? `${(total / 1_000_000).toFixed(2)} млн`
                  : total.toLocaleString("ru-RU")
              }
              sub="сум"
              color={cfg.color}
            />
          );
        })}
        <ExportSummaryCard
          icon={LuTrendingUp}
          label="Активированные карты"
          value={String(kartaSum)}
          sub="шт"
          color="#eab308"
        />
        <ExportSummaryCard
          icon={LuTrendingDown}
          label="Возвраты карт"
          value="0"
          sub="шт"
          color="#ef4444"
        />
      </div>
    </div>
  );
}
