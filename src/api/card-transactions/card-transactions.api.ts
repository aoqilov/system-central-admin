import api from "@/api-config/axiosInstance";
import type {
  Transaction,
  NfcCheckResponse,
  TopUpResponse,
  PaymentResponse,
  GetTransactionsResponse,
  NfcCheckPayload,
  TopUpPayload,
  CardPaymentPayload,
  GetTransactionsQuery,
} from "@/types/card.types";
import type { ApiResponse } from "@/types/common.types";

export async function checkNfc(payload: NfcCheckPayload): Promise<NfcCheckResponse> {
  const { data } = await api.post<ApiResponse<NfcCheckResponse>>(
    "/cards/nfc/check",
    { data: payload },
  );
  return data.data;
}

export async function topupCard(payload: TopUpPayload): Promise<Transaction> {
  const { data } = await api.post<ApiResponse<TopUpResponse>>(
    "/cards/topup",
    { data: payload },
  );
  return data.data.transaction;
}

export async function payWithCard(payload: CardPaymentPayload): Promise<PaymentResponse> {
  const { data } = await api.post<ApiResponse<{ payment: PaymentResponse }>>(
    "/cards/payment",
    { data: payload },
  );
  return data.data.payment;
}

export async function getTransactions(
  cashboxID: number,
  params: GetTransactionsQuery = {},
): Promise<GetTransactionsResponse> {
  const { data } = await api.get<ApiResponse<GetTransactionsResponse>>(
    `/cards/cashboxes/${cashboxID}/transactions`,
    { params },
  );
  return data.data;
}
