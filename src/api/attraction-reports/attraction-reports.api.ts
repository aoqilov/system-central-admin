import api from "@/api-config/axiosInstance";
import type {
  AttractionReport,
  GetAttractionZReportsData,
  AccountingAttractionReports,
  GetZReportsParams,
  AccountingParams,
  ConfirmZReportsPayload,
  UpdateAttractionReportStatusPayload,
} from "@/types/report.types";
import type { ApiResponse } from "@/types/common.types";

export async function openAttractionReport(attractionID: number): Promise<AttractionReport> {
  
  const { data } = await api.post<ApiResponse<{ "attraction-report": AttractionReport }>>(
    `/attractions/${attractionID}/reports/open`,
  );
  return data.data["attraction-report"];
}

export async function getAttractionReports(
  attractionID: number,
): Promise<{ zreport: AttractionReport | null; xreports: AttractionReport[] }> {
  const { data } = await api.get<
    ApiResponse<{ "attraction-reports": { zreport: AttractionReport | null; xreports: AttractionReport[] } }>
  >(`/attractions/${attractionID}/reports`);
  return data.data["attraction-reports"];
}

export async function updateAttractionReportStatus(
  attractionID: number,
  reportID: number,
  payload: UpdateAttractionReportStatusPayload,
): Promise<AttractionReport> {
  const { data } = await api.put<ApiResponse<{ "attraction-report": AttractionReport }>>(
    `/attractions/${attractionID}/reports/${reportID}/status`,
    { data: payload },
  );
  return data.data["attraction-report"];
}

export async function getAttractionZReports(
  params: GetZReportsParams = {},
): Promise<GetAttractionZReportsData> {
  const { data } = await api.get<ApiResponse<GetAttractionZReportsData>>(
    "/attraction/zreports",
    { params },
  );
  return data.data;
}

export async function confirmAttractionZReports(payload: ConfirmZReportsPayload): Promise<void> {
  await api.post("/attractions/zreports/confirmation", { data: payload });
}

export async function getAccountingAttractionReports(
  params: AccountingParams = {},
): Promise<AccountingAttractionReports> {
  const { data } = await api.get<ApiResponse<{ "attraction-reports": AccountingAttractionReports }>>(
    "/attractions/reports/accounting",
    { params },
  );
  return data.data["attraction-reports"];
}

export async function getUnconfirmedAttractionDates(): Promise<string[]> {
  const { data } = await api.get<{ dates: string[] }>(
    "/attraction/notconfirmed/zreports/dates",
  );
  return data.dates;
}
