import type { Pagination } from "./common.types";

export type CashboxStatus = "active" | "inactive";

export interface CashboxOperator {
  id: number;
  firstname: string;
  lastname: string;
  file: number | null;
}

export interface Cashbox {
  id: number;
  name: string;
  place: string;
  status: CashboxStatus;
  description: string | null;
  device: string | number | null;
  operators: CashboxOperator[];
}

export type CashboxWriteResult = Omit<Cashbox, "operators">;

export interface CashboxStats {
  cashboxes: number;
  active: number;
  inactive: number;
  maintenance: number;
  closed: number;
}

// ─── Response wrappers ────────────────────────────────────────────────────────

export interface CashboxesResponse {
  statusCode: number;
  data: {
    cashboxes: Cashbox[];
    pagination: Pagination;
  };
}

export interface CashboxResponse {
  statusCode: number;
  data: { cashbox: Cashbox };
}

export interface CashboxStatsResponse {
  statusCode: number;
  data: { cashbox_stats: CashboxStats };
}

export interface CashboxWriteResponse {
  statusCode: number;
  data: { cashbox: CashboxWriteResult };
}

// ─── Assign operator ──────────────────────────────────────────────────────────

export interface CashboxOperatorMe {
  id: number;
  firstname: string;
  lastname: string;
  file: number | null;
}

export interface GetMeResponse {
  operator: CashboxOperatorMe;
}

export interface AssignOperatorPayload {
  operator: number;
}

export interface AssignOperatorResponse {
  cashbox: Cashbox;
}

export interface DeleteOperatorResponse {
  success: true;
}

// ─── Query params ─────────────────────────────────────────────────────────────

export interface CashboxesParams {
  search?: string;
  statuses?: CashboxStatus;
  page?: number;
  limit?: number;
}

// ─── Payloads ─────────────────────────────────────────────────────────────────

export interface CreateCashboxPayload {
  name: string;
  place: string;
  description?: string;
}

export interface UpdateCashboxPayload {
  name?: string;
  place?: string;
  status?: CashboxStatus;
  description?: string | null;
  device?: string | number;
}
