export interface AttractionRound {
  id: number;
  report: number;
  attraction: number;
  operator: number;
  round_number: number;
  status: "open" | "closed";
  people_count: number;
  offline_count: number;
  online_count: number;
  vip_count: number;
  organization_count: number;
  park_staff_count: number;
  paid_amount: number;
  total_amount: number;
  started_at: string;
  finished_at: string;
  created_at: string;
}

export interface TodayRoundsData {
  "attraction-rounds": AttractionRound[];
}

export interface ApiResponse<T> {
  statusCode: number;
  data: T;
}
