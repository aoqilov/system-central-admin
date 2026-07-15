import { LuCreditCard, LuGlobe } from "react-icons/lu";

export type PaymentMethod = "karta" | "online";

export const PAYMENT_METHOD = {
  karta: {
    label: "Karta",
    Icon: LuCreditCard,
    color: "#3b82f6",
    bg: "#3b82f618",
  },
  online: {
    label: "Online",
    Icon: LuGlobe,
    color: "#8b5cf6",
    bg: "#8b5cf618",
  },
} as const;

export interface RoundOrder {
  id: string;
  nfcId: string;
  amount: number;
  paymentMethod: PaymentMethod;
}

export type DialogState = "loading" | "success" | "insufficient" | "error";

export function fmt(n: number) {
  return n.toLocaleString("uz-UZ");
}




export interface PaymentPayload {
  nfc: string;
  attractionID: number;
}

export interface PaymentTransaction {
  id: number;
  card: number;
  card_number: string;
  nfc: string;
  type: "topup" | "payment" | "refund";
  amount: number;
  balance_before: number;
  balance_after: number;
  payment_type: "cash" | "card" | "online";
  payment_card_type: "uzcard" | "humo" | "visa" | "mastercard";
  payment_service_type: "uzum" | "payme" | "click";
  status: "success" | "failed" | "pending";
  operator: number;
  cashbox: number;
  xreport: number;
  created_at: string;
}

export interface PaymentResult {
  paid: boolean;
  message: string;
  transaction: PaymentTransaction | null;
}

export interface PaymentResponse {
  statusCode: number;
  data: {
    payment: PaymentResult;
  };
}

// ─── Current Round ────────────────────────────────────────────────────────────

export interface RoundCard {
  id: number;
  card: string;
  nfc: string;
  type: import("@/types/card.types").CardType;
  status: "active" | "blocked";
  balance: number;
}

export interface RoundTransaction {
  id: number;
  transaction_type: "topup" | "payment" | "refund";
  amount: number;
  balance_before: number;
  balance_after: number;
  card: RoundCard;
  created_at: string;
}

export interface AttractionRound {
  id: number;
  report: number;
  attraction: number;
  operator: number;
  round_number: number;
  status: "open" | "closed";
  people_count: number;
  offline_count: number;
  online_count: number;
  vip_count: number;
  organization_count: number;
  paid_amount: number;
  total_amount: number;
  started_at: string;
  finished_at: string | null;
  created_at: string;
  transactions: RoundTransaction[];
}

export interface CurrentRoundResponse {
  statusCode: number;
  data: {
    "attraction-round": AttractionRound;
  };
}