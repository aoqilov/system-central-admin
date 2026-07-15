export interface ApiEmployee {
  id: number;
  firstname: string;
  lastname: string;
  fullname: string;
  date_of_birth: string;
  phone_number: string;
  telegram_username: string | null;
  file?: string | null;
  role: number;
  salary: number;
  status: string;
}

export interface EmployeeDetailResponse {
  statusCode: number;
  data: { employee: ApiEmployee };
}

export interface RoleItem {
  id: number;
  name: string;
}

export interface RolesResponse {
  statusCode: number;
  data: { roles: RoleItem[] };
}
