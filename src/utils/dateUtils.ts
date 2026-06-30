import dayjs from "dayjs";

export function fmtDate(value: string | Date | null | undefined): string {
  if (!value) return "—";
  return dayjs(value).format("DD.MM.YYYY");
}

export function fmtDateTime(value: string | Date | null | undefined): string {
  if (!value) return "—";
  return dayjs(value).format("DD.MM.YYYY HH:mm");
}
