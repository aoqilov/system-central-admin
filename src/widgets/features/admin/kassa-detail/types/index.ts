// ─── Common ───────────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  statusCode: number;
  data: T;
}

// ─── Operator ─────────────────────────────────────────────────────────────────

export interface Operator {
  id: number;
  firstname: string;
  lastname: string;
  file: number | null;
}

// ─── GET /cashbox/operators/me ────────────────────────────────────────────────

export interface GetMeResponse {
  operator: Operator | null;
}

// ─── POST /cashbox/{cashboxID}/operators ──────────────────────────────────────

export type OperatorType = "main" | "assistant";

export interface AssignOperatorPayload {
  operator: number;
  type?: OperatorType;
}

export interface CashboxOperatorItem {
  id: number;
  cashbox: number;
  type: OperatorType;
  status: "active" | "inactive";
  operator: Operator | null;
}

export interface AssignOperatorResponse {
  "cashbox-operator": CashboxOperatorItem;
}

// ─── DELETE /cashbox/{cashboxID}/operators/{operatorID} ───────────────────────

export interface DeleteOperatorResponse {
  success: true;
}
