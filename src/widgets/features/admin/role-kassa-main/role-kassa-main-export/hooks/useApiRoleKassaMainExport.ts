import { useState } from "react";
import dayjs from "dayjs";
import { useQuery } from "@tanstack/react-query";
import { fmtDate } from "@/utils/dateUtils";
import { getAccountingCashboxReports } from "@/api/cashbox-reports/cashbox-reports.api";
import { buildPaymentRows, grandTotal } from "../types";
import type { PaymentRow } from "../types";

const TODAY = dayjs().format("YYYY-MM-DD");

function fmtRange(from: string, to: string): string {
  const f = fmtDate(from);
  const t = fmtDate(to);
  return f === t ? f : `${f} — ${t}`;
}

export function useApiRoleKassaMainExport() {
  const [dateMode, setDateMode] = useState<"kunlik" | "oraliq">("kunlik");
  const [date, setDate] = useState(TODAY);
  const [dateFrom, setDateFrom] = useState(TODAY);
  const [dateTo, setDateTo] = useState(TODAY);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["accounting-cashbox-report", dateMode, date, dateFrom, dateTo],
    queryFn: () =>
      getAccountingCashboxReports(
        dateMode === "kunlik"
          ? { date }
          : { start_date: dateFrom, end_date: dateTo },
      ),
  });

  const entries = data?.cashboxes ?? [];
  const kassas = entries.map((e) => e.cashbox.name);
  const kartaSold = entries.map((e) => e.zreport.activated_cards_count);
  const rows: PaymentRow[] = buildPaymentRows(entries);

  const dateLabel = dateMode === "kunlik" ? fmtDate(date) : fmtRange(dateFrom, dateTo);
  const totalNoDiscount = grandTotal(rows, "noDiscount");
  const totalWithDiscount = grandTotal(rows, "withDiscount");
  const kartaSum = kartaSold.reduce((s, n) => s + n, 0);

  return {
    dateMode,
    setDateMode,
    date,
    setDate,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    isLoading,
    isError,
    kassas,
    kartaSold,
    rows,
    dateLabel,
    totalNoDiscount,
    totalWithDiscount,
    kartaSum,
  };
}
