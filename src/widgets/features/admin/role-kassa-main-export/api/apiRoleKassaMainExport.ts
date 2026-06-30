import api from "@/api-config/axiosInstance";
import type {
  ApiResponse,
  GetAccountingReportData,
  GetAccountingParams,
} from "../types";

// API date format: YYYY.MM.DD (nuqtali) — YYYY-MM-DD dan convert
function toApiDate(iso: string): string {
  return iso.replace(/-/g, ".");
}

export const getAccountingReport = async (params: GetAccountingParams) => {
  const converted: GetAccountingParams = {
    ...(params.date       && { date:       toApiDate(params.date) }),
    ...(params.start_date && { start_date: toApiDate(params.start_date) }),
    ...(params.end_date   && { end_date:   toApiDate(params.end_date) }),
  };

  const { data } = await api.get<ApiResponse<GetAccountingReportData>>(
    "/accounting/cashbox-reports",
    { params: converted },
  );
  return data;
};
