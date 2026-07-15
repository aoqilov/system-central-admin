import api from "@/api-config/axiosInstance";
import type {
  CashboxReport,
  GetZReportsData,
  AccountingCashboxReports,
  GetZReportsParams,
  AccountingParams,
  ConfirmZReportsPayload,
  UpdateReportStatusPayload,
} from "@/types/report.types";
import type { ApiResponse } from "@/types/common.types";

export async function openCashboxReport(cashboxID: number): Promise<CashboxReport> {
  const { data } = await api.post<ApiResponse<{ "cashbox-report": CashboxReport }>>(
    `/cashboxes/${cashboxID}/reports/open`,
  );
  return data.data["cashbox-report"];
}

export async function getCashboxReports(
  cashboxID: number,
): Promise<{ zreport: CashboxReport | null; xreports: CashboxReport[] }> {
  const { data } = await api.get<
    ApiResponse<{ "cashbox-reports": { zreport: CashboxReport | null; xreports: CashboxReport[] } }>
  >(`/cashboxes/${cashboxID}/reports`);
  return data.data["cashbox-reports"];
}

export async function updateCashboxReportStatus(
  cashboxID: number,
  payload: UpdateReportStatusPayload,
): Promise<void> {
  await api.put(`/cashboxes/${cashboxID}/reports/status`, { data: payload });
}

export async function getCashboxZReports(
  params: GetZReportsParams = {},
): Promise<GetZReportsData> {
  const { data } = await api.get<ApiResponse<GetZReportsData>>("/cashbox/zreports", { params });
  return data.data;
}

export async function confirmCashboxZReports(payload: ConfirmZReportsPayload): Promise<void> {
  await api.post("/zreports/confirmation", { data: payload });
}

export async function getAccountingCashboxReports(
  params: AccountingParams = {},
): Promise<AccountingCashboxReports> {
  const { data } = await api.get<ApiResponse<{ "cashbox-reports": AccountingCashboxReports }>>(
    "/accounting/cashbox-reports",
    { params },
  );
  return data.data["cashbox-reports"];
}

export async function getUnconfirmedCashboxDates(): Promise<string[]> {
  const { data } = await api.get<{ dates: string[] }>("/cashbox/notconfirmed/zreports/dates");
  return data.dates;
}
