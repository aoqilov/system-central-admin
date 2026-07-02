import api from "@/api-config/axiosInstance";
import type { Cashbox, CashboxResponse } from "@/widgets/features/admin/kassa/types";

export async function fetchCashboxByDevice(deviceID: string): Promise<Cashbox> {
  const { data } = await api.get<CashboxResponse>(`/cashbox`, {
    params: { deviceID },
  });
  return data.data.cashbox;
}
