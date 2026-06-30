export type TxType            = "topup" | "payment" | "refund";
export type TxPaymentType     = "cash" | "card" | "online";
export type TxCardType        = "uzcard" | "humo";
export type TxPaymentService  = "uzum" | "click" | "payme";
export type TxStatus          = "success" | "pending" | "failed";
export type CardStatus        = "active" | "blocked" | "expired";

export interface TxCard {
  id: number;
  card: string;
  status: CardStatus;
}

export interface TxOperator {
  id: number;
  firstname: string;
  lastname: string;
  file: number;
}

export interface CashboxTransaction {
  id: number;
  card: TxCard;
  operator: TxOperator;
  type: TxType;
  payment_type: TxPaymentType;
  payment_card_type: TxCardType;
  payment_service_type: TxPaymentService;
  amount: number;
  balance_before: number;
  balance_after: number;
  status: TxStatus;
  cashbox: number;
  xreport: number;
  created_at: string;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CashboxTransactionsData {
  "cashbox-transactions": CashboxTransaction[];
  pagination: Pagination;
}

export interface GetTransactionsParams {
  page?: number;
  limit?: number;
}
