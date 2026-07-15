// ─── Cashbox Reports ──────────────────────────────────────────────────────────

export type CashboxReportStatus =
  | "open"
  | "stopped"
  | "closed"
  | "confirmed"
  | "cancelled";
export type ReportType = "zreport" | "xreport";

export type ZReportStatus = CashboxReportStatus;

export interface ZReportOperator {
  id: number;
  firstname: string;
  lastname: string;
  file: number | null;
}

export interface CashboxReport {
  id: number;
  operator: ZReportOperator | null;
  cashbox: number;
  checked_by: number | null;
  report_type: ReportType;
  zreport: number | null;
  report_date: string;
  status: CashboxReportStatus;
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
  xreports_count: number | null;
  created_at: string;
}

export interface ZReportItem extends CashboxReport {}

export interface CashboxZReportGroup {
  id: number;
  name: string;
  place: string;
  status: string;
  description: string | null;
  zreports: CashboxReport[];
}

export interface DailyZReport extends CashboxReport {
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

// ─── Attraction Reports ───────────────────────────────────────────────────────

export type AttractionReportStatus =
  | "open"
  | "stopped"
  | "closed"
  | "confirmed";

export interface AttractionReport {
  id: number;
  attraction: number;
  operator: ZReportOperator | number | null;
  report_type: ReportType;
  zreport: number | null;
  status: AttractionReportStatus;
  opened_at: string;
  stopped_at: string | null;
  closed_at: string | null;
  confirmed_at: string | null;
  confirmed_by: number | null;
  total_rounds: number;
  total_people: number;
  total_offline: number;
  total_online: number;
  total_vip: number;
  total_organization: number;
  paid_amount: number;
  total_amount: number;
  created_at: string;
}

export interface AttractionZReportStats {
  total: number;
  open: number;
  stopped: number;
  waiting: number;
  confirmed: number;
}

export interface AttractionZReportTotals {
  total_rounds: number;
  total_people: number;
  total_offline: number;
  total_online: number;
  total_vip: number;
  total_organization: number;
  paid_amount: number;
  total_amount: number;
}

export interface AttractionZReportGroup {
  id: number;
  name: string;
  manufacturer: string;
  category: number;
  status: string;
  dashboard_file: number | null;
  main_file: number | null;
  files: number[];
  price: number;
  duration: number;
  seats: number;
  age_limit: number;
  min_height: number;
  max_weight: number;
  description: string;
  zreports: AttractionReport[];
}

export interface GetAttractionZReportsData {
  stats: AttractionZReportStats;
  totals: AttractionZReportTotals;
  attractions: AttractionZReportGroup[];
}

// ─── Accounting ───────────────────────────────────────────────────────────────

export interface AccountingCashboxItem {
  cashbox: {
    id: number;
    name: string;
    place: string;
    status: string;
    description: string | null;
  };
  zreport: ZReportsTotals;
}

export interface AccountingCashboxReports {
  start_date: string;
  end_date: string;
  totals: ZReportsTotals;
  cashboxes: AccountingCashboxItem[];
}

export interface AccountingAttractionItem {
  attraction: {
    id: number;
    name: string;
    status: string;
    price: number;
  };
  zreport: AttractionZReportTotals;
}

export interface AccountingAttractionReports {
  start_date: string;
  end_date: string;
  totals: AttractionZReportTotals;
  attractions: AccountingAttractionItem[];
}

// ─── Query params ─────────────────────────────────────────────────────────────

export interface GetZReportsParams {
  date?: string;
}

export interface AccountingParams {
  date?: string;
  start_date?: string;
  end_date?: string;
}

// ─── Payloads ─────────────────────────────────────────────────────────────────

export interface ConfirmZReportItem {
  id: number;
  status: "confirmed" | "cancelled";
}

export interface ConfirmZReportsPayload {
  zreports: ConfirmZReportItem[];
}

export interface UpdateReportStatusPayload {
  status: CashboxReportStatus;
  report_type: ReportType;
  report: number;
}

export interface UpdateAttractionReportStatusPayload {
  status: AttractionReportStatus;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

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
