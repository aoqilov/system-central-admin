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
  status: string;
  file?: number | null;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface EmployeeStats {
  employees: number;
  active: number;
  inactive: number;
  vacation: number;
  fired: number;
}

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

export interface RoleItem {
  id: number;
  name: string;
}

export interface RolesResponse {
  statusCode: number;
  data: { roles: RoleItem[] };
}

export interface EmployeesParams {
  page?: number;
  limit?: number;
  search?: string;
  roles?: number;
  statuses?: "active" | "inactive" | "vacation" | "fired";
}

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
  status?: string;
}
