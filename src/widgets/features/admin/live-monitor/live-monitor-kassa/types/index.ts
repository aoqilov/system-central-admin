export type ZReportStatus = "open" | "stopped" | "confirmed" | "cancelled";

export interface ZReportOperator {
  id: number;
  firstname: string;
  lastname: string;
  file: number;
}

export interface ZReport {
  id: number;
  operator: ZReportOperator;
  checked_by: number | null;
  report_type: "zreport";
  zreport: number;
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

export interface ZReportCashbox {
  id: number;
  name: string;
  place: string;
  status: string;
  description: string;
  zreports: ZReport[];
}

export interface ZReportStats {
  total: number;
  open: number;
  stopped: number;
  confirmed: number;
  cancelled: number;
}

export interface ZReportTotals {
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

export interface ZReportsData {
  stats: ZReportStats;
  totals: ZReportTotals;
  cashboxes: ZReportCashbox[];
}

export interface ZReportsResponse {
  statusCode: number;
  data: ZReportsData;
}

// ─── Cashbox transactions ─────────────────────────────────────────────────────

export type TxType           = "topup" | "payment" | "refund";
export type TxPaymentType    = "cash" | "card" | "online";
export type TxCardType       = "uzcard" | "humo";
export type TxServiceType    = "uzum" | "click" | "payme";
export type TxStatus         = "success" | "pending" | "failed";

export interface CashboxTxCard {
  id: number;
  card: string;
  status: "active" | "blocked" | "expired";
}

export interface CashboxTxOperator {
  id: number;
  firstname: string;
  lastname: string;
  file: number;
}

export interface CashboxTransaction {
  id: number;
  card: CashboxTxCard;
  operator: CashboxTxOperator;
  type: TxType;
  payment_type: TxPaymentType;
  payment_card_type: TxCardType | null;
  payment_service_type: TxServiceType | null;
  amount: number;
  balance_before: number;
  balance_after: number;
  status: TxStatus;
  cashbox: number;
  xreport: number;
  created_at: string;
}

export interface CashboxTxPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CashboxTxData {
  "cashbox-transactions": CashboxTransaction[];
  pagination: CashboxTxPagination;
}

export interface CashboxTxResponse {
  statusCode: number;
  data: CashboxTxData;
}
