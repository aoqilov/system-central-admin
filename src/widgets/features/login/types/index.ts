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

export interface DecodedToken {
  employee_id?: string;
  role_id?: string;
  exp?: number;
  iat?: number;
}

export interface RoleItem {
  id: number;
  name: string;
}
