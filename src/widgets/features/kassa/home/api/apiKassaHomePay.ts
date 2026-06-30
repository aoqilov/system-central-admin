import api from "@/api-config/axiosInstance";
import type { NfcCheckData, TopupPayload, TopupData } from "../types";

interface ApiResponse<T> { statusCode: number; data: T; }

export const checkNfc = async (nfc: string) => {
  const { data } = await api.post<ApiResponse<NfcCheckData>>("/cards/nfc/check", {
    data: { nfc },
  });
  return data;
};

export const topupCard = async (payload: TopupPayload) => {
  const { data } = await api.post<ApiResponse<TopupData>>("/cards/topup", {
    data: payload,
  });
  return data;
};
