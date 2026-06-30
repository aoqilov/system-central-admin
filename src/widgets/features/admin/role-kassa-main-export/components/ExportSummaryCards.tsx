import {
  LuBanknote,
  LuCreditCard,
  LuSmartphone,
  LuWallet,
} from "react-icons/lu";
import type { PaymentRow } from "../types";
import { ExportSummaryCard } from "./ExportSummaryCard";

const TYPE_CONFIG: Record<string, { icon: React.ElementType; color: string }> = {
  Наличные: { icon: LuBanknote,   color: "#22c55e" },
  UzCard:   { icon: LuCreditCard, color: "#3b82f6" },
  Humo:     { icon: LuCreditCard, color: "#8b5cf6" },
  Click:    { icon: LuSmartphone, color: "#f97316" },
  PayMe:    { icon: LuSmartphone, color: "#ef4444" },
  UZUM:     { icon: LuWallet,     color: "#06b6d4" },
};

interface Props {
  rows: PaymentRow[];
  totalNoDiscount: number;
}

export function ExportSummaryCards({ rows, totalNoDiscount }: Props) {
  return (
    <div className="grid grid-cols-4 tablet:grid-cols-7 gap-3">
      <ExportSummaryCard
        icon={LuBanknote}
        label="Общая выручка"
        value={`${(totalNoDiscount / 1_000_000).toFixed(2)} млн`}
        sub="сум"
        color="#3b82f6"
      />
      {rows.map((row) => {
        const total = row.kassas.reduce((s, k) => s + (k.noDiscount ?? 0), 0);
        const cfg = TYPE_CONFIG[row.type] ?? { icon: LuBanknote, color: "#6b7280" };
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
    </div>
  );
}
