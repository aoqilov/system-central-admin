export const CASHBOX_ID = 3;
export const CASHBOX_REPORTS_KEY = (id: number) =>
  ["cashbox-today-reports", id] as const;
