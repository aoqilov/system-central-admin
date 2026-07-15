export interface ApiResponse<T> {
  statusCode: number;
  data: T;
}

export interface ZReportOperator {
  id: number;
  firstname: string;
  lastname: string;
  file: number | null;
}

// "open" → smena ochiq
// "closed" → smena yopilgan, tasdiqlash kutilmoqda (waiting)
// "confirmed" → tasdiqlangan
// "cancelled" → bekor qilingan
export type ZReportStatus = "open" | "closed" | "confirmed" | "cancelled";

export interface ZReportItem {
  id: number;
  operator: ZReportOperator | null;
  checked_by: number | null;
  report_type: "zreport";
  zreport: number | null;
  report_date: string;
  status: ZReportStatus;
  opened_at: string;
  closed_at: string | null;
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
  created_at: string;
}

// API dan keluvchi cashbox + uning zreportlari
export interface CashboxZReportGroup {
  id: number;
  name: string;
  place: string;
  status: string;
  description: string | null;
  zreports: ZReportItem[];
}

// UI uchun flatten qilingan — cashbox ma'lumotlari zreportga qo'shilgan
export interface DailyZReport extends ZReportItem {
  cashbox_id: number;
  cashbox_name: string;
  cashbox_place: string;
}

export interface ZReportsStats {
  total: number;
  open: number;
  stopped: number;
  confirmed: number;
  cancelled: number;
}


export interface ZReportsTotals {
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

export interface GetZReportsData {
  stats: ZReportsStats;
  totals: ZReportsTotals;
  cashboxes: CashboxZReportGroup[];
}

export interface UnsentDay {
  date: string;
  cashbox_count: number;
}

export interface GetZReportsParams {
  date?: string;
  status?: string;
}

export interface ConfirmZReportItem {
  id: number;
  status: "confirmed" | "cancelled";
}

export interface ConfirmZReportsPayload {
  zreports: ConfirmZReportItem[];
}

export interface ReopenZReportPayload {
  cashboxId: number;
  reportId: number;
}

// ─── Helper ───────────────────────────────────────────────────────────────────

export function flattenZReports(groups: CashboxZReportGroup[]): DailyZReport[] {
  return groups.flatMap((cashbox) =>
    cashbox.zreports.map((z) => ({
      ...z,
      cashbox_id: cashbox.id,
      cashbox_name: cashbox.name,
      cashbox_place: cashbox.place,
    })),
  );
}
