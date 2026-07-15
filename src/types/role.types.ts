export interface RoleItem {
  id: number;
  name: string;
}

export interface RolesResponse {
  statusCode: number;
  data: { roles: RoleItem[] };
}
