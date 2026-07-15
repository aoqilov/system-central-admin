import type { Pagination } from "./common.types";

export type CardStatus = "active" | "inactive" | "blocked" | "lost" | "frozen";
export type CardType = "classic" | "vip" | "organization";
export type PaymentType = "cash" | "card" | "online";
export type PaymentCardType = "uzcard" | "humo" | "nfc";
export type PaymentServiceType = "uzum" | "payme" | "click";
export type TransactionType = "topup" | "payment" | "refund";
export type TransactionStatus = "success" | "cancelled" | "failed";

export interface Card {
  id: number;
  type?: CardType;
  batch: string;
  card: string;
  nfc: string;
  status: CardStatus;
  balance: number;
  owner?: string;
  imported_at: string;
  activated_at: string | null;
}

export interface Transaction {
  id: number;
  type: TransactionType;
  amount: number;
  balance_before: number;
  balance_after: number;
  payment_type: PaymentType | null;
  payment_card_type: PaymentCardType | null;
  payment_service_type: PaymentServiceType | null;
  status: TransactionStatus;
  operator: number | null;
  cashbox: number | null;
  xreport: number | null;
  created_at: string;
}

export interface CardStatsBatch {
  id: number;
  name: string;
  type: CardType;
  total: number;
}

export interface CardStats {
  totalBalance: number;
  total: number;
  active: number;
  inactive: number;
  blocked: number;
  lost: number;
  frozen: number;
  tethered: number;
  types: Record<CardType, number>;
  batches: CardStatsBatch[];
}

// ─── Response wrappers ────────────────────────────────────────────────────────

export interface GetCardsStatsResponse {
  card_stats: CardStats;
}

export interface GetCardsResponse {
  cards: Card[];
  pagination: Pagination;
}

export interface UploadCardsResponse {
  inserted: number;
}

export interface UpdateCardResponse {
  card: Pick<Card, "id" | "status">;
}

export interface NfcCheckCard extends Card {
  balance: number;
  last_transaction: Transaction | null;
}

export interface NfcCheckResponse {
  card: NfcCheckCard;
}

export interface TopUpResponse {
  transaction: Transaction;
}

export interface PaymentResponse {
  paid: boolean;
  message: string;
  transaction: Transaction | null;
}

export interface GetTransactionsResponse {
  "cashbox-transactions": Transaction[];
  pagination: Pagination;
}

// ─── Query params ─────────────────────────────────────────────────────────────

export interface GetCardsQuery {
  batch?: number;
  type?: CardType;
  search?: string;
  statuses?: string;
  page?: number;
  limit?: number;
}

export interface GetTransactionsQuery {
  page?: number;
  limit?: number;
}

// ─── Payloads ─────────────────────────────────────────────────────────────────

export interface DeleteCardsPayload {
  cardIDs: number[];
}

export interface UpdateCardPayload {
  status: CardStatus;
}

export interface NfcCheckPayload {
  nfc: string;
}

export interface TopUpPayload {
  nfc: string;
  amount: number;
  payment_type: PaymentType;
  payment_card_type?: PaymentCardType;
  payment_service_type?: PaymentServiceType;
}

export interface CardPaymentPayload {
  nfc: string;
  attractionID: number;
}
