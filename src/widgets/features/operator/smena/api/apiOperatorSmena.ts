import api from "@/api-config/axiosInstance";
import type {
  ApiResponse,
  TodayReportsData,
  ReportStatusPayload,
  UpdateReportData,
} from "../types";

const getDeviceId = (): string => {
  const key = "dntdiOP";
  let id = localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }
  return id;
};

export const openReport = async (attractionID: number) => {
  const { data } = await api.post<ApiResponse<UpdateReportData>>(
    `/attractions/${attractionID}/reports/open`,
    undefined,
    { headers: { "device-id": getDeviceId() } },
  );
  return data;
};

export const getTodayReports = async (attractionID: number) => {
  const { data } = await api.get<ApiResponse<TodayReportsData>>(
    `/attractions/${attractionID}/reports`,
  );
  return data;
};

export const updateReportStatus = async (
  attractionID: number,
  reportID: number,
  payload: ReportStatusPayload,
) => {
  const { data } = await api.put<ApiResponse<UpdateReportData>>(
    `/attractions/${attractionID}/reports/${reportID}/status`,
    { data: payload },
  );
  return data;
};
