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
