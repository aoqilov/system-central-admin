import api from "@/api-config/axiosInstance";
import type {
  GetZReportsData,
  ConfirmZReportItem,
  ZReport,
  UpdateStatusValue,
} from "../types";

export const getZReports = async (date: string): Promise<GetZReportsData> => {
  const { data } = await api.get<{ statusCode: number; data: GetZReportsData }>(
    "/reports/zreports",
    { params: { date } },
  );
  return data.data;
};

export const confirmZReports = async (
  zreports: ConfirmZReportItem[],
): Promise<boolean> => {
  const { data } = await api.post<{ statusCode: number; data: { success: boolean } }>(
    "/attractions/zreports/confirmation",
    { data: { zreports } },
  );
  return data.data.success;
};

export const updateReportStatus = async (
  attractionID: number,
  reportID: number,
  status: UpdateStatusValue,
): Promise<ZReport> => {
  const { data } = await api.put<{
    statusCode: number;
    data: { "attraction-report": ZReport };
  }>(
    `/attractions/${attractionID}/reports/${reportID}/status`,
    { data: { status } },
  );
  return data.data["attraction-report"];
};
