export interface LoginPayload {
  phone_number: string;
  password: string;
}

export interface LoginResponse {
  statusCode: number;
  data: {
    auth: {
      accessToken: string;
    };
  };
}

export interface AuthEmployee {
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
  file: number | null;
}

export interface GetMeEmployeeResponse {
  statusCode: number;
  data: {
    employee: AuthEmployee;
  };
}
