export type RoundStatus = "open" | "finished" | "cancelled";

export interface Round {
  id: number;
  report: number;
  attraction: number;
  operator: number | null;
  round_number: number;
  status: RoundStatus;
  people_count: number;
  offline_count: number;
  online_count: number;
  vip_count: number;
  guest_count: number;
  park_staff_count: number;
  paid_amount: number;
  total_amount: number;
  started_at: string;
  finished_at: string | null;
  created_at: string;
}
