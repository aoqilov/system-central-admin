import type { AttrZReportStatus } from "./types";

export function fmt(n: number) {
  return n.toLocaleString("ru-RU");
}

export const STATUS_CFG: Record<
  AttrZReportStatus | "inactive",
  { label: string; color: string; bg: string }
> = {
  open:      { label: "Активен",    color: "#22c55e", bg: "#22c55e15" },
  stopped:   { label: "Остановлен", color: "#f97316", bg: "#f9731615" },
  waiting:   { label: "Ожидание",   color: "#eab308", bg: "#eab30815" },
  confirmed: { label: "Завершён",   color: "#6b7280", bg: "#6b728015" },
  inactive:  { label: "Неактивен",  color: "#6b7280", bg: "#6b728015" },
};

export type ZReportStatus = AttrZReportStatus | "inactive";
export type SortKey = "name" | "rounds" | "total" | "status";
