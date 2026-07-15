// ─── API types ────────────────────────────────────────────────────────────────

export type NfcCardStatus = "active" | "blocked" | "expired";
export type NfcCardType = "classic" | "vip" | "organization";
export type TxType = "topup" | "payment" | "refund";
export type TxPaymentType = "cash" | "card" | "online";
export type TxCardType = "uzcard" | "humo";
export type TxPaymentService = "uzum" | "click" | "payme";
export type TxStatus = "success" | "pending" | "failed";

export interface LastTransaction {
  id: number;
  type: TxType;
  amount: number;
  balance_before: number;
  balance_after: number;
  payment_type: TxPaymentType;
  payment_card_type: TxCardType;
  payment_service_type: TxPaymentService;
  status: TxStatus;
  created_at: string;
}

export interface NfcCard {
  id: number;
  batch: string;
  type: NfcCardType;
  card: string;
  nfc: string;
  status: NfcCardStatus;
  imported_at: string;
  activated_at: string;
  balance: number;
  last_transaction: LastTransaction | null;
}

export interface NfcCheckData {
  card: NfcCard;
}

export interface TopupPayload {
  nfc: string;
  amount: number;
  payment_type: TxPaymentType;
  payment_card_type?: TxCardType;
  payment_service_type?: TxPaymentService;
}

export interface TopupTransaction {
  id: number;
  card: string;
  nfc: string;
  type: TxType;
  amount: number;
  balance_before: number;
  balance_after: number;
  payment_type: TxPaymentType;
  payment_card_type: TxCardType;
  payment_service_type: TxPaymentService;
  status: TxStatus;
  operator: number;
  cashbox: number;
  xreport: number;
  created_at: string;
}

export interface TopupData {
  transaction: TopupTransaction;
}

// ─── UI state types ───────────────────────────────────────────────────────────

export type RightMode = "aktivatsa" | "karta" | "relation";
export type CardScanStatus =
  | "empty"
  | "scanning"
  | "active"
  | "blocked"
  | "expired"
  | "error";
export type PayType = "naqd" | "karta" | "online";
export type KartaType = "uzcard" | "humo";

export interface QrInfo {
  status: "active" | "no-active" | null;
  raqam: string;
  token: string;
  partiya: string;
  amount: string;
  importedAt: string;
}

export const QR_STATUS_META: Record<
  NonNullable<QrInfo["status"]>,
  { label: string; scheme: "green" | "gray" }
> = {
  active: { label: "Активна", scheme: "green" },
  "no-active": { label: "Не активна", scheme: "gray" },
};

export const EMPTY_QR: QrInfo = {
  status: null,
  raqam: "",
  token: "",
  partiya: "",
  amount: "",
  importedAt: "",
};

export interface PendingItem {
  id: string;
  qrInfo: QrInfo;
  savedAt: Date;
}
