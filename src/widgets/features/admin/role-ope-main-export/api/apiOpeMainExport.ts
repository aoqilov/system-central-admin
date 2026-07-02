import api from "@/api-config/axiosInstance";
import type { AccountingReportData, GetAccountingParams } from "../types";

export const getAccountingReports = async (
  params: GetAccountingParams,
): Promise<AccountingReportData> => {
  const { data } = await api.get<{
    statusCode: number;
    data: { "attraction-reports": AccountingReportData };
  }>("/attractions/reports/accounting", { params });
  return data.data["attraction-reports"];
};
