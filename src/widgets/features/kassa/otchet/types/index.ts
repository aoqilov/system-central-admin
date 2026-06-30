export interface ApiResponse<T> {
  statusCode: number;
  data: T;
}

// ─── Shared ───────────────────────────────────────────────────────────────────

export type ReportType   = "xreport" | "zreport";
export type ReportStatus = "open" | "closed";

export interface ReportOperator {
  id: number;
  firstname: string;
  lastname: string;
  file: number;
}

// ─── CashboxReport ────────────────────────────────────────────────────────────

export interface CashboxReport {
  id: number;
  operator: ReportOperator;
  cashbox: number;
  checked_by: number;
  report_type: ReportType;
  zreport: number;
  report_date: string;
  status: ReportStatus;
  opened_at: string;
  closed_at: string;
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

// ─── Responses ────────────────────────────────────────────────────────────────

export interface OpenReportData {
  "cashbox-report": CashboxReport;
}

export interface CloseReportPayload {
  report_type: ReportType;
}

export interface CloseReportData {
  success: true;
}

export type ZReportConfirmStatus = "confirmed" | "cancelled";

export interface ZReportConfirmItem {
  id: number;
  status: ZReportConfirmStatus;
}

export interface ConfirmZReportsPayload {
  zreports: ZReportConfirmItem[];
}

export interface ConfirmZReportsData {
  success: true;
}

export interface TodayReportsData {
  "cashbox-reports": {
    zreport: CashboxReport;
    xreports: CashboxReport[];
  };
}
