import dayjs from "dayjs";
import api from "@/api-config/axiosInstance";
import type {
  ApiResponse,
  GetZReportsData,
  GetZReportsParams,
  ConfirmZReportsPayload,
  ReopenZReportPayload,
} from "../types";

export const getZReports = async (params?: GetZReportsParams) => {
  const { data } = await api.get<ApiResponse<GetZReportsData>>("/zreports", {
    params: {
      date: dayjs().format("YYYY-MM-DD"),
      ...params,
    },
  });
  return data;
};

export const confirmZReports = async (payload: ConfirmZReportsPayload) => {
  const { data } = await api.post<ApiResponse<{ success: true }>>(
    "/zreports/confirmation",
    { data: payload },
  );
  return data;
};

export const reopenZReport = async (payload: ReopenZReportPayload) => {
  const { data } = await api.put<ApiResponse<{ success: true }>>(
    `/cashboxes/${payload.cashboxId}/reports/status`,
    { data: { status: "open", report_type: "zreport", report: payload.reportId } },
  );
  return data;
};
