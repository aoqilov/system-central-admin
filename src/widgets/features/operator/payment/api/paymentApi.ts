import api from "@/api-config/axiosInstance";
import type { PaymentPayload, PaymentResponse, CurrentRoundResponse, AttractionRound } from "../types";


export const payWithNFC = async (
  payload: PaymentPayload,
): Promise<PaymentResponse> => {
  const { data } = await api.post<PaymentResponse>("/cards/payment", {
    data: payload,
  });
  return data;
};

export const getCurrentRound = async (
  attractionID: number,
): Promise<AttractionRound | null> => {
  const { data } = await api.get<CurrentRoundResponse>(
    `/attractions/${attractionID}/rounds/current`,
  );
  return data.data["attraction-round"] ?? null;
};

export const closeRound = async (
  attractionID: number,
  roundID: number,
): Promise<AttractionRound> => {
  const { data } = await api.post<{ statusCode: number; data: { "attraction-round": AttractionRound } }>(
    `/attractions/${attractionID}/rounds/${roundID}/close`,
  );
  return data.data["attraction-round"];
};

