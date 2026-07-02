import api from "@/api-config/axiosInstance";
import type {
  ApiResponse,
  GetAccountingReportData,
  GetAccountingParams,
} from "../types";

export const getAccountingReport = async (params: GetAccountingParams) => {
  const { data } = await api.get<ApiResponse<GetAccountingReportData>>(
    "/accounting/cashbox-reports",
    { params },
  );
  return data;
};
