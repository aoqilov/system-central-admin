import api from "@/api-config/axiosInstance";
import type { CashboxTransactionsData, GetTransactionsParams } from "../types";

interface ApiResponse<T> { statusCode: number; data: T; }

export const getTransactions = async (cashboxID: number, params?: GetTransactionsParams) => {
  const { data } = await api.get<ApiResponse<CashboxTransactionsData>>(
    `/cards/cashboxes/${cashboxID}/transactions`,
    { params: { page: params?.page ?? 1, limit: params?.limit ?? 10 } },
  );
  return data;
};
