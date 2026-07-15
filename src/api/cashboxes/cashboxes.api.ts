import api from "@/api-config/axiosInstance";
import type {
  Cashbox,
  CashboxStats,
  CashboxWriteResult,
  CashboxesResponse,
  CashboxResponse,
  CashboxStatsResponse,
  CashboxWriteResponse,
  CashboxesParams,
  CreateCashboxPayload,
  UpdateCashboxPayload,
} from "@/types/cashbox.types";
import type { Pagination } from "@/types/common.types";

export async function fetchCashboxes(
  params: CashboxesParams = {},
): Promise<{ cashboxes: Cashbox[]; pagination: Pagination }> {
  const { data } = await api.get<CashboxesResponse>("/cashboxes", { params });
  return data.data;
}

export async function fetchCashbox(
  cashboxID: number,
  deviceID?: number,
): Promise<Cashbox> {
  const { data } = await api.get<CashboxResponse>("/cashbox", {
    params: { cashboxID, ...(deviceID != null && { deviceID }) },
  });
  return data.data.cashbox;
}

export async function fetchCashboxStats(): Promise<CashboxStats> {
  const { data } = await api.get<CashboxStatsResponse>("/cashbox/stats");
  return data.data.cashbox_stats;
}

export async function createCashbox(
  payload: CreateCashboxPayload,
): Promise<CashboxWriteResult> {
  const { data } = await api.post<CashboxWriteResponse>("/cashbox", {
    data: payload,
  });
  return data.data.cashbox;
}

export async function updateCashbox(
  id: number,
  payload: UpdateCashboxPayload,
): Promise<CashboxWriteResult> {
  const { data } = await api.put<CashboxWriteResponse>(`/cashbox/${id}`, {
    data: payload,
  });
  return data.data.cashbox;
}

export async function deleteCashboxes(ids: number[]): Promise<void> {
  await api.delete("/cashbox", { data: { data: { cashboxIDs: ids } } });
}
