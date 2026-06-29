import api from "@/api-config/axiosInstance";
import type {
  Cashbox,
  CashboxStats,
  CashboxWriteResult,
  CashboxResponse,
  CashboxesResponse,
  CashboxStatsResponse,
  CashboxWriteResponse,
  CashboxesParams,
  CreateCashboxPayload,
  UpdateCashboxPayload,
} from "../types";

// ---================================================================================= GET

export async function fetchCashboxes(
  params: CashboxesParams = {},
): Promise<{ cashboxes: Cashbox[]; pagination: CashboxesResponse["data"]["pagination"] }> {
  const { data } = await api.get<CashboxesResponse>("/cashboxes", { params });
  return data.data;
}


export async function fetchCashboxStats(): Promise<CashboxStats> {
  const { data } = await api.get<CashboxStatsResponse>("/cashbox/stats");
  return data.data.cashbox_stats;
}

// ---================================================================================= POST

export async function createCashbox(
  payload: CreateCashboxPayload,
): Promise<CashboxWriteResult> {
  const { data } = await api.post<CashboxWriteResponse>("/cashbox", {
    data: payload,
  });
  return data.data.cashbox;
}

// ---================================================================================= PUT

export async function updateCashbox(
  id: number,
  payload: UpdateCashboxPayload,
): Promise<CashboxWriteResult> {
  const { data } = await api.put<CashboxWriteResponse>(`/cashbox/${id}`, {
    data: payload,
  });
  return data.data.cashbox;
}

// ---================================================================================= DELETE

export async function deleteCashboxes(ids: number[]): Promise<void> {
  await api.delete("/cashbox", {
    data: { data: { cashboxIDs: ids } },
  });
}
