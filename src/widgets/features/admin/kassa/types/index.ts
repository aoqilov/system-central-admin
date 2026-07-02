// ─── Status ───────────────────────────────────────────────────────────────────

export type CashboxStatus = "active" | "inactive";

// ─── Operator ─────────────────────────────────────────────────────────────────

export interface CashboxOperator {
  id: number;
  firstname: string;
  lastname: string;
  file: number | null;
}

// ─── Cashbox ──────────────────────────────────────────────────────────────────

export interface Cashbox {
  id: number;
  name: string;
  place: string;
  status: CashboxStatus;
  description: string | null;
  device: string | number;
  operators: CashboxOperator[];
}

// POST/PUT response'da operators qaytmaydi — alohida tip
export type CashboxWriteResult = Omit<Cashbox, "operators">;

// ─── Stats ────────────────────────────────────────────────────────────────────

export interface CashboxStats {
  cashboxes: number;
  active: number;
  inactive: number;
  maintenance: number;
  closed: number;
}

// ─── Pagination ───────────────────────────────────────────────────────────────

// ─── Response wrappers ────────────────────────────────────────────────────────

export interface CashboxesResponse {
  statusCode: number;
  data: {
    cashboxes: Cashbox[];
    pagination: PaginationSchema;
  };
}

// DIQQAT (#4): Swagger'da GET /cashbox/{id} response kaliti "attraction" deb
// yozilgan — copy-paste xato ko'rinadi. Hozircha "cashbox" deb yozdik.
// Agar real backend "attraction" qaytarsa, bu typeni moslab o'zgartir.
export interface CashboxResponse {
  statusCode: number;
  data: {
    cashbox: Cashbox;
  };
}

export interface CashboxStatsResponse {
  statusCode: number;
  data: {
    cashbox_stats: CashboxStats;
  };
}

export interface CashboxWriteResponse {
  statusCode: number;
  data: {
    cashbox: CashboxWriteResult;
  };
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
