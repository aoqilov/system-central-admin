import api from "@/api-config/axiosInstance";
import type {
  ApiResponse,
  OpenReportData,
  CloseReportPayload,
  CloseReportData,
  ConfirmZReportsPayload,
  ConfirmZReportsData,
  TodayReportsData,
} from "../types";

// ─────────────────────────────────────────────────────────────────────────────── POST ───────────────────────────────────────────────────────────────────────────────
export const openReport = async (cashboxID: number) => {
  const { data } = await api.post<ApiResponse<OpenReportData>>(
    `/cashboxes/${cashboxID}/reports/open`,
  );
  return data;
};

export const closeReport = async (
  cashboxID: number,
  payload: CloseReportPayload,
) => {
  const { data } = await api.post<ApiResponse<CloseReportData>>(
    `/cashboxes/${cashboxID}/reports/close`,
    { data: payload },
  );
  return data;
};

export const confirmZReports = async (payload: ConfirmZReportsPayload) => {
  const { data } = await api.post<ApiResponse<ConfirmZReportsData>>(
    "/zreports/confirmation",
    { data: payload },
  );
  return data;
};

export const getTodayReports = async (cashboxID: number) => {
  const { data } = await api.get<ApiResponse<TodayReportsData>>(
    `/cashboxes/${cashboxID}/reports`,
  );
  return data;
};