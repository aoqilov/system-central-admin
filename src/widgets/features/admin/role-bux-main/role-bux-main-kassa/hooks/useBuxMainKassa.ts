import { useState } from "react";
import dayjs from "dayjs";
import { useQuery } from "@tanstack/react-query";
import { getAccountingCashboxReports } from "@/api/cashbox-reports/cashbox-reports.api";
import { fmtDate } from "@/utils/dateUtils";
import { buildPaymentRows, grandTotal } from "../types";
import { exportToExcel } from "../utils/exportToExcel";

export const PARK_NAME = "Central Park";

const TODAY = dayjs().format("YYYY-MM-DD");

function fmtRange(from: string, to: string): string {
  const f = fmtDate(from);
  const t = fmtDate(to);
  return f === t ? f : `${f} — ${t}`;
}

export function useBuxMainKassa() {
  const [dateMode, setDateMode] = useState<"kunlik" | "oraliq">("kunlik");
  const [date, setDate] = useState(TODAY);
  const [dateFrom, setDateFrom] = useState(TODAY);
  const [dateTo, setDateTo] = useState(TODAY);
  const [acceptOpen, setAcceptOpen] = useState(false);

  const params =
    dateMode === "kunlik"
      ? { date }
      : { start_date: dateFrom, end_date: dateTo };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["bux-incoming-report", params],
    queryFn: () => getAccountingCashboxReports(params),
  });

  const entries = data?.cashboxes ?? [];
  const kassas = entries.map((e) => e.cashbox.name);
  const kartaSold = entries.map((e) => e.zreport.activated_cards_count);
  const rows = buildPaymentRows(entries);

  const dateLabel =
    dateMode === "kunlik" ? fmtDate(date) : fmtRange(dateFrom, dateTo);
  const totalNoDiscount = grandTotal(rows, "noDiscount");
  const totalWithDiscount = grandTotal(rows, "withDiscount");
  const kartaSum = kartaSold.reduce((s, n) => s + n, 0);

  function handleExport() {
    exportToExcel({ rows, kassas, kartaSold, dateLabel, parkName: PARK_NAME });
  }

  return {
    dateMode,
    setDateMode,
    date,
    setDate,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    acceptOpen,
    setAcceptOpen,
    rows,
    kassas,
    kartaSold,
    dateLabel,
    isLoading,
    isError,
    totalNoDiscount,
    totalWithDiscount,
    kartaSum,
    handleExport,
  };
}
