import { useState } from "react";
import dayjs from "dayjs";
import { useQuery } from "@tanstack/react-query";
import { LuDownload } from "react-icons/lu";
import { fmtDate } from "@/utils/dateUtils";
import { CusButton } from "@/components/ui/buttons/CusButton";
import PageHeader from "@/widgets/shared-ui/PageHeader";
import { BuxDatePicker } from "./components/BuxDatePicker";
import { BuxSummaryCards } from "./components/BuxSummaryCards";
import { BuxReportTable } from "./components/BuxReportTable";
import { BuxAcceptBar } from "./components/BuxAcceptBar";
import { AcceptDialog } from "./modals/AcceptDialog";
import { exportToExcel } from "./utils/exportToExcel";
import { getAccountingReport } from "./api/apiBuxMainIncoming";
import { buildPaymentRows, grandTotal } from "./types";

const PARK_NAME = "Central Park";
const TODAY     = dayjs().format("YYYY-MM-DD");

function fmtRange(from: string, to: string): string {
  const f = fmtDate(from);
  const t = fmtDate(to);
  return f === t ? f : `${f} — ${t}`;
}

export default function FeatureRoleBuxMainIncoming() {
  const [dateMode,     setDateMode]     = useState<"kunlik" | "oraliq">("kunlik");
  const [date,         setDate]         = useState(TODAY);
  const [dateFrom,     setDateFrom]     = useState(TODAY);
  const [dateTo,       setDateTo]       = useState(TODAY);
  const [acceptOpen,   setAcceptOpen]   = useState(false);
  const [acceptedAt,   setAcceptedAt]   = useState<string | null>(null);

  const { data } = useQuery({
    queryKey: ["bux-incoming-report", dateMode, date, dateFrom, dateTo],
    queryFn: () =>
      getAccountingReport(
        dateMode === "kunlik"
          ? { date }
          : { start_date: dateFrom, end_date: dateTo },
      ),
  });

  const report    = data?.data["cashbox-reports"];
  const entries   = report?.cashboxes ?? [];
  const kassas    = entries.map((e) => e.cashbox.name);
  const kartaSold = entries.map((e) => e.zreport.activated_cards_count);
  const rows      = buildPaymentRows(entries);

  const dateLabel         = dateMode === "kunlik" ? fmtDate(date) : fmtRange(dateFrom, dateTo);
  const totalNoDiscount   = grandTotal(rows, "noDiscount");
  const totalWithDiscount = grandTotal(rows, "withDiscount");
  const kartaSum          = kartaSold.reduce((s, n) => s + n, 0);

  function handleAccept() {
    setAcceptedAt(dayjs().format("DD.MM.YYYY — HH:mm"));
    setAcceptOpen(false);
  }

  function handleDateChange(d: string) {
    setDate(d);
    setAcceptedAt(null);
  }

  function handleDateFromChange(d: string) {
    setDateFrom(d);
    setAcceptedAt(null);
  }

  function handleDateToChange(d: string) {
    setDateTo(d);
    setAcceptedAt(null);
  }

  return (
    <div className="px-4 tablet:px-6 py-5 flex flex-col gap-5 pb-28">
      {/* Top bar */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <PageHeader
          title="Входящие отчёты: Касса"
          subtitle="Просмотр и принятие кассовых Z-отчётов"
        />
        <div className="flex items-center gap-2 flex-wrap">
          <BuxDatePicker
            mode={dateMode}
            date={date}
            dateFrom={dateFrom}
            dateTo={dateTo}
            onModeChange={setDateMode}
            onDateChange={handleDateChange}
            onDateFromChange={handleDateFromChange}
            onDateToChange={handleDateToChange}
          />
          <CusButton
            variant="outline"
            size="sm"
            onClick={() =>
              exportToExcel({ rows, kassas, kartaSold, dateLabel, parkName: PARK_NAME, acceptedAt })
            }
          >
            <LuDownload size={14} /> Скачать Excel
          </CusButton>
        </div>
      </div>

      {/* Summary cards */}
      <BuxSummaryCards rows={rows} totalNoDiscount={totalNoDiscount} />

      {/* Accept bar */}
      <BuxAcceptBar
        kassaCount={kassas.length}
        kartaSum={kartaSum}
        totalWithDiscount={totalWithDiscount}
        sentAt={null}
        acceptedAt={acceptedAt}
        onAccept={() => setAcceptOpen(true)}
      />

      {/* Main table */}
      <BuxReportTable
        rows={rows}
        kassas={kassas}
        kartaSold={kartaSold}
        dateLabel={dateLabel}
        parkName={PARK_NAME}
      />

      {/* Accept dialog */}
      <AcceptDialog
        open={acceptOpen}
        parkName={PARK_NAME}
        dateLabel={dateLabel}
        kassaCount={kassas.length}
        kartaSum={kartaSum}
        totalWithDiscount={totalWithDiscount}
        sentAt={null}
        onClose={() => setAcceptOpen(false)}
        onConfirm={handleAccept}
      />
    </div>
  );
}
