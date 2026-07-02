import api from "@/api-config/axiosInstance";
import type {
  ApiResponse,
  TodayReportsData,
  ReportStatusPayload,
  UpdateReportData,
} from "../types";

export const openReport = async (attractionID: number) => {
  const { data } = await api.post<ApiResponse<UpdateReportData>>(
    `/attractions/${attractionID}/reports/open`,
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
