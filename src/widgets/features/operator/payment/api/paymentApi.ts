import type { PaymentMethod } from "../types";

export const MOCK = {
  attractionName: "Karusel",
  price: 15_000,
  maxSlots: 8,
};

export interface PaymentApiResponse {
  success: boolean;
  message: string;
  amount?: number;
  cardBalance?: number;
  paymentMethod?: PaymentMethod;
}

export async function callPaymentApi(
  nfcId: string,
  amount: number,
  orderId: string,
): Promise<PaymentApiResponse> {
  // TODO: axiosInstance.post("/nfc/payment", { nfcId, amount, orderId })
  void nfcId;
  void orderId;
  await new Promise((r) => setTimeout(r, 1500));
  const method: PaymentMethod = Math.random() > 0.5 ? "karta" : "online";
  return Math.random() > 0.25
    ? { success: true, message: "Pul yechildi", amount, paymentMethod: method }
    : {
        success: false,
        message: "Pul yetarli emas",
        cardBalance: Math.floor(Math.random() * 50_000),
      };
}
