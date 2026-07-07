import axiosInstance from "@/api-config/axiosInstance";
import type { ZReportsResponse, CashboxTxResponse } from "../types";

export function getZReports(date: string) {
  return axiosInstance.get<ZReportsResponse>("/zreports", {
    params: { date },
  });
}

export function getCashboxTransactions(
  cashboxID: number,
  params?: { page?: number; limit?: number },
) {
  return axiosInstance.get<CashboxTxResponse>(
    `/cards/cashboxes/${cashboxID}/transactions`,
    { params: { page: 1, limit: 10, ...params } },
  );
}
