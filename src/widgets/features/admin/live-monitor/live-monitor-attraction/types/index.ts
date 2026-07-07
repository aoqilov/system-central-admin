// ─── Attraction Z-report ──────────────────────────────────────────────────────

export type AttrZReportStatus = "open" | "stopped" | "waiting" | "confirmed";

export interface AttrZReport {
  id: number;
  attraction: number;
  operator: number;
  report_type: "zreport";
  zreport: number;
  status: AttrZReportStatus;
  opened_at: string;
  stopped_at: string | null;
  closed_at: string | null;
  confirmed_at: string | null;
  confirmed_by: number | null;
  total_rounds: number;
  total_people: number;
  total_offline: number;
  total_online: number;
  total_vip: number;
  total_guest: number;
  total_park_staff: number;
  paid_amount: number;
  total_amount: number;
  created_at: string;
}

export interface AttractionZReport {
  id: number;
  name: string;
  manufacturer: string;
  category: number;
  status: string;
  dashboard_file: number;
  main_file: number;
  files: number[];
  price: number;
  duration: number;
  seats: number;
  age_limit: number;
  min_height: number;
  max_weight: number;
  description: string;
  zreports: AttrZReport[];
}

export interface AttrZReportStats {
  total: number;
  open: number;
  stopped: number;
  waiting: number;
  confirmed: number;
}

export interface AttrZReportTotals {
  total_rounds: number;
  total_people: number;
  total_offline: number;
  total_online: number;
  total_vip: number;
  total_guest: number;
  total_park_staff: number;
  paid_amount: number;
  total_amount: number;
}

export interface AttrZReportsData {
  stats: AttrZReportStats;
  totals: AttrZReportTotals;
  attractions: AttractionZReport[];
}

export interface AttrZReportsResponse {
  statusCode: number;
  data: AttrZReportsData;
}
