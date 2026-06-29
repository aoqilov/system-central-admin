import { RoleTypes } from "@/const/constData";

export type { RoleTypes };

export interface DecodedToken {
  employee_id?: string;
  role_id?: string;
  exp?: number;
  iat?: number;
}

const TOKEN_KEY = import.meta.env.VITE_TOKEN_KEY ?? "parkops_token";
const ROLE_KEY = "parkops_role";
const AUTH_TTL_HOURS = 20;

const ROLE_DEFAULT_PATH: Partial<Record<RoleTypes, string>> = {
  [RoleTypes.SUPERADMIN]:      "/",
  [RoleTypes.HEAD_CASHIER]:    "/",
  [RoleTypes.HEAD_OPERATOR]:   "/",
  [RoleTypes.HEAD_ACCOUNTANT]: "/",
  [RoleTypes.CASHIER]:         "/rolekassa/otchet",
  [RoleTypes.OPERATOR]:        "/operator",
};

function setCookie(name: string, value: string, hours: number): void {
  document.cookie = `${name}=${encodeURIComponent(value)}; max-age=${hours * 3600}; path=/; SameSite=Strict`;
}

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${encodeURIComponent(name)}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function removeCookie(name: string): void {
  document.cookie = `${name}=; max-age=0; path=/; SameSite=Strict`;
}

export function decodeToken(token: string): DecodedToken | null {
  try {
    return JSON.parse(atob(token.split(".")[1])) as DecodedToken;
  } catch {
    return null;
  }
}

export function getRoleDefaultPath(role: string): string {
  return ROLE_DEFAULT_PATH[role as RoleTypes] ?? "/";
}

export function getStoredToken(): string | null {
  return getCookie(TOKEN_KEY);
}

export function getStoredEmployeeId(): number | null {
  const token = getStoredToken();
  if (!token) return null;
  const decoded = decodeToken(token);
  return decoded?.employee_id ? Number(decoded.employee_id) : null;
}

export function getStoredRole(): RoleTypes | null {
  return getCookie(ROLE_KEY) as RoleTypes | null;
}

export function saveAuth(token: string, role: string): void {
  setCookie(TOKEN_KEY, token, AUTH_TTL_HOURS);
  setCookie(ROLE_KEY, role, AUTH_TTL_HOURS);
}

export function clearAuth(): void {
  removeCookie(TOKEN_KEY);
  removeCookie(ROLE_KEY);
}
