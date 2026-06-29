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
  "active" | "pending" | "fired"
> = {
  [CashboxStatusTypes.ACTIVE]: "active",
  [CashboxStatusTypes.INACTIVE]: "fired",
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
  SUPERADMIN      = "superadmin",      // id: 1
  CASHIER         = "cashier",         // id: 2
  HEAD_CASHIER    = "head_cashier",    // id: 3
  OPERATOR        = "operator",        // id: 4
  HEAD_OPERATOR   = "head_operator",   // id: 5
  HEAD_ACCOUNTANT = "head_accountant", // id: 6
}

export const RoleLabel: Record<RoleTypes, string> = {
  [RoleTypes.SUPERADMIN]:      "Суперадмин",
  [RoleTypes.CASHIER]:         "Кассир",
  [RoleTypes.HEAD_CASHIER]:    "Старший кассир",
  [RoleTypes.OPERATOR]:        "Оператор",
  [RoleTypes.HEAD_OPERATOR]:   "Старший оператор",
  [RoleTypes.HEAD_ACCOUNTANT]: "Главный бухгалтер",
};
