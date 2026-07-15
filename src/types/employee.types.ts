import type { Pagination } from "./common.types";

export type EmployeeStatus =
  | "active"
  | "inactive"
  | "vacation"
  | "fired"
  | "active,inactive";

export interface ApiEmployee {
  id: number;
  firstname: string;
  lastname: string;
  fullname: string;
  date_of_birth: string;
  phone_number: string;
  telegram_username: string | null;
  role: number;
  salary: number;
  status: EmployeeStatus;
  file?: number | null;
}

export interface EmployeeStats {
  employees: number;
  active: number;
  inactive: number;
  vacation: number;
  fired: number;
}

// ─── Response wrappers ────────────────────────────────────────────────────────

export interface EmployeesResponse {
  statusCode: number;
  data: {
    employees: ApiEmployee[];
    pagination: Pagination;
  };
}

export interface EmployeeResponse {
  statusCode: number;
  data: { employee: ApiEmployee };
}

export interface EmployeeStatsResponse {
  statusCode: number;
  data: { employee_stats: EmployeeStats };
}

// ─── Query params ─────────────────────────────────────────────────────────────

export interface EmployeesParams {
  page?: number;
  limit?: number;
  search?: string;
  roles?: number;
  statuses?: EmployeeStatus;
}

// ─── Payloads ─────────────────────────────────────────────────────────────────

export interface CreateEmployeePayload {
  firstname: string;
  lastname: string;
  date_of_birth: string;
  phone_number: string;
  telegram_username: string;
  password: string;
  role: number;
  salary?: number | null;
  file?: number | null;
}

export interface UpdateEmployeePayload {
  firstname?: string;
  lastname?: string;
  date_of_birth?: string;
  phone_number?: string;
  telegram_username?: string;
  password?: string;
  role?: number;
  salary?: number | null;
  file?: number | null;
  status?: EmployeeStatus;
}
