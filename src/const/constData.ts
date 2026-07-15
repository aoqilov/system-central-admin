export enum CashboxStatusTypes {
  ACTIVE = "active",
  INACTIVE = "inactive",
  MAINTENANCE = "maintenance",
  CLOSED = "closed",
}

export const CashboxStatusLabel: Record<CashboxStatusTypes, string> = {
  [CashboxStatusTypes.ACTIVE]: "Активна",
  [CashboxStatusTypes.INACTIVE]: "Неактивна",
  [CashboxStatusTypes.MAINTENANCE]: "Обслуживание",
  [CashboxStatusTypes.CLOSED]: "Закрыта",
};

export const CashboxStatusBadge: Record<
  CashboxStatusTypes,
  "active" | "pending" | "fired" | "inactive"
> = {
  [CashboxStatusTypes.ACTIVE]: "active",
  [CashboxStatusTypes.INACTIVE]: "inactive",
  [CashboxStatusTypes.MAINTENANCE]: "pending",
  [CashboxStatusTypes.CLOSED]: "fired",
};
export enum AttractionStatusTypes {
  ACTIVE = "active",
  INACTIVE = "inactive",
  MAINTENANCE = "maintenance",
  CLOSED = "closed",
}
export enum EmployeeStatusTypes {
  ACTIVE = "active",
  INACTIVE = "inactive",
  VACATAION = "vacation",
  FIRED = "fired",
}

export enum RoleTypes {
  SUPERADMIN = "superadmin", // id: 1
  CASHIER = "cashier", // id: 2
  HEAD_CASHIER = "head_cashier", // id: 3
  OPERATOR = "operator", // id: 4
  HEAD_OPERATOR = "head_operator", // id: 5
  HEAD_ACCOUNTANT = "head_accountant", // id: 6
  HEAD_MARKETING = "head_marketing", // id: 7
  OWNER = "owner", // id: 8
  DIRECTOR = "director", // id: 9
  ADMIN = "admin", // id: 10
}

export const RoleLabel: Record<RoleTypes, string> = {
  [RoleTypes.SUPERADMIN]: "Суперадмин",
  [RoleTypes.CASHIER]: "Кассир",
  [RoleTypes.OPERATOR]: "Оператор",
  [RoleTypes.HEAD_CASHIER]: "Старший кассир",
  [RoleTypes.HEAD_OPERATOR]: "Старший оператор",
  [RoleTypes.HEAD_ACCOUNTANT]: "Главный бухгалтер",
  [RoleTypes.HEAD_MARKETING]: "Старший Маркетолог",
  [RoleTypes.OWNER]: "Владелец",
  [RoleTypes.DIRECTOR]: "Директор",
  [RoleTypes.ADMIN]: "Администратор",
};
