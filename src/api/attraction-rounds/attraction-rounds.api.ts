import api from "@/api-config/axiosInstance";
import type { Round } from "@/types/round.types";
import type { ApiResponse } from "@/types/common.types";

export async function getCurrentRound(attractionID: number): Promise<Round | null> {
  const { data } = await api.get<ApiResponse<{ "attraction-round": Round | null }>>(
    `/attractions/${attractionID}/rounds/current`,
  );
  return data.data["attraction-round"];
}

export async function getTodayRounds(attractionID: number): Promise<Round[]> {
  const { data } = await api.get<ApiResponse<{ "attraction-rounds": Round[] }>>(
    `/attractions/${attractionID}/rounds/today`,
  );
  return data.data["attraction-rounds"];
}

export async function getAllTodayRounds(): Promise<Round[]> {
  const { data } = await api.get<ApiResponse<{ "attraction-rounds": Round[] }>>(
    "/attractions/rounds/today",
  );
  return data.data["attraction-rounds"];
}

export async function closeRound(attractionID: number, roundID: number): Promise<Round> {
  const { data } = await api.post<ApiResponse<{ "attraction-round": Round }>>(
    `/attractions/${attractionID}/rounds/${roundID}/close`,
  );
  return data.data["attraction-round"];
}
