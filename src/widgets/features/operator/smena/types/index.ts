export interface ReportOperator {
  id: number;
  firstname: string;
  lastname: string;
  file: number | null;
}

export interface AttractionReport {
  id: number;
  attraction: number;
  operator: ReportOperator;
  report_type: "zreport" | "xreport";
  zreport: number;
  status: "open" | "stopped" | "closed";
  opened_at: string;
  stopped_at: string;
  closed_at: string;
  confirmed_at: string;
  confirmed_by: number;
  total_rounds: number;
  total_people: number;
  total_offline: number;
  total_online: number;
  total_vip: number;
  total_guest: number;
  total_organization: number;
  total_park_staff: number;
  paid_amount: number;
  total_amount: number;
  created_at: string;
}

export interface AttractionReports {
  zreport: AttractionReport | null;
  xreports: AttractionReport[];
}

export interface ApiResponse<T> {
  statusCode: number;
  data: T;
}

export interface TodayReportsData {
  "attraction-reports": AttractionReports;
}

export interface ReportStatusPayload {
  status: AttractionReport["status"];
}

export interface UpdateReportData {
  "attraction-report": AttractionReport;
}

export function fmt(n: number) {
  return n.toLocaleString("uz-UZ");
}
