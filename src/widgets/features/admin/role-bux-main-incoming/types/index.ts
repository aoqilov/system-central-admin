// ─── API Types ────────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  statusCode: number;
  data: T;
}

export interface AccountingCashbox {
  id: number;
  name: string;
  place: string;
  status: string;
  description: string | null;
}

export interface AccountingZReport {
  total_amount: number;
  cash_amount: number;
  card_amount: number;
  online_amount: number;
  uzcard_amount: number;
  humo_amount: number;
  uzum_amount: number;
  payme_amount: number;
  click_amount: number;
  activated_cards_count: number;
  relationed_cards_count: number;
  transactions_count: number;
  xreports_count: number;
}

export interface AccountingCashboxEntry {
  cashbox: AccountingCashbox;
  zreport: AccountingZReport;
}

export interface AccountingReport {
  start_date: string;
  end_date: string;
  totals: AccountingZReport;
  cashboxes: AccountingCashboxEntry[];
}

export interface GetAccountingReportData {
  "cashbox-reports": AccountingReport;
}

export interface GetAccountingParams {
  date?: string;
  start_date?: string;
  end_date?: string;
}

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

export function buildPaymentRows(cashboxes: AccountingCashboxEntry[]): PaymentRow[] {
  const types = [
    { label: "Наличные", key: "cash_amount"   as keyof AccountingZReport },
    { label: "UzCard",   key: "uzcard_amount" as keyof AccountingZReport },
    { label: "Humo",     key: "humo_amount"   as keyof AccountingZReport },
    { label: "Click",    key: "click_amount"  as keyof AccountingZReport },
    { label: "PayMe",    key: "payme_amount"  as keyof AccountingZReport },
    { label: "UZUM",     key: "uzum_amount"   as keyof AccountingZReport },
  ];
  return types.map(({ label, key }) => ({
    type: label,
    kassas: cashboxes.map((entry) => {
      const val = entry.zreport[key] as number;
      return { noDiscount: val, withDiscount: val };
    }),
  }));
}
