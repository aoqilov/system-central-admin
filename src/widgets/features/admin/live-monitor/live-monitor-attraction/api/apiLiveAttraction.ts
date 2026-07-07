import axiosInstance from "@/api-config/axiosInstance";
import type { AttrZReportsResponse } from "../types";

export function getAttractionZReports(date: string) {
  return axiosInstance.get<AttrZReportsResponse>("/reports/zreports", {
    params: { date },
  });
}
