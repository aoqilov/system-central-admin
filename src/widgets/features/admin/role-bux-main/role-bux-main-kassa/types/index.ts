import type { AccountingCashboxItem, ZReportsTotals } from "@/types/report.types";

// ─── UI Table Types ───────────────────────────────────────────────────────────

export interface PaymentKassaCell {
  noDiscount: number | null;
  withDiscount: number | null;
}

export interface PaymentRow {
  type: string;
  kassas: PaymentKassaCell[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function colTotal(
  rows: PaymentRow[],
  ki: number,
  field: "noDiscount" | "withDiscount",
): number {
  return rows.reduce((s, r) => s + (r.kassas[ki]?.[field] ?? 0), 0);
}

export function grandTotal(
  rows: PaymentRow[],
  field: "noDiscount" | "withDiscount",
): number {
  return rows.reduce(
    (s, r) => r.kassas.reduce((a, k) => a + (k[field] ?? 0), s),
    0,
  );
}

export function buildPaymentRows(cashboxes: AccountingCashboxItem[]): PaymentRow[] {
  const types: { label: string; key: keyof ZReportsTotals }[] = [
    { label: "Наличные", key: "cash_amount" },
    { label: "UzCard",   key: "uzcard_amount" },
    { label: "Humo",     key: "humo_amount" },
    { label: "Click",    key: "click_amount" },
    { label: "PayMe",    key: "payme_amount" },
    { label: "UZUM",     key: "uzum_amount" },
  ];
  return types.map(({ label, key }) => ({
    type: label,
    kassas: cashboxes.map((entry) => {
      const val = entry.zreport[key] as number;
      return { noDiscount: val, withDiscount: val };
    }),
  }));
}
