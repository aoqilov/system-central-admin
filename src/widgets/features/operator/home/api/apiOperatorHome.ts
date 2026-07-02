import api from "@/api-config/axiosInstance";
import type { ApiResponse, TodayRoundsData } from "../types";
import { TodayReportsData } from "../../smena/types";

export const getTodayRounds = async (attractionID: number) => {
  const { data } = await api.get<ApiResponse<TodayRoundsData>>(
    `/attractions/${attractionID}/rounds/today`,
  );
  return data;
};

export const getTodayReports = async (attractionID: number) => {
  const { data } = await api.get<ApiResponse<TodayReportsData>>(
    `/attractions/${attractionID}/reports`,
  );
  return data;
};
