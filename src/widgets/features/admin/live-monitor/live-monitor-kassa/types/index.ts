export type {
  ZReportStatus,
  ZReportOperator,
} from "@/types/report.types";

export type { CashboxReport as ZReport } from "@/types/report.types";
export type { CashboxZReportGroup as ZReportCashbox } from "@/types/report.types";
export type { ZReportsStats as ZReportStats } from "@/types/report.types";
export type { ZReportsTotals as ZReportTotals } from "@/types/report.types";
export type { GetZReportsData as ZReportsData } from "@/types/report.types";

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
