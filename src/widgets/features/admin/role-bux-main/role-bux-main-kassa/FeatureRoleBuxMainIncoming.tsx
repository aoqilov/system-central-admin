import { LuDownload } from "react-icons/lu";
import { CusButton } from "@/components/ui/buttons/CusButton";
import PageHeader from "@/widgets/shared-ui/PageHeader";
import { BuxDatePicker } from "./components/BuxDatePicker";
import { BuxSummaryCards } from "./components/BuxSummaryCards";
import { BuxReportTable } from "./components/BuxReportTable";
import { AcceptDialog } from "./modals/AcceptDialog";
import { useBuxMainKassa, PARK_NAME } from "./hooks/useBuxMainKassa";

export default function FeatureRoleBuxMainKassa() {
  const {
    dateMode, setDateMode,
    date, setDate,
    dateFrom, setDateFrom,
    dateTo, setDateTo,
    acceptOpen, setAcceptOpen,
    rows, kassas, kartaSold, dateLabel,
    totalNoDiscount, totalWithDiscount, kartaSum,
    handleExport,
  } = useBuxMainKassa();

  return (
    <div className="px-4 tablet:px-6 py-5 flex flex-col gap-5 pb-28">
      {/* Top bar */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <PageHeader
          title="Входящие отчёты:"
          highlight=" Касса"
          subtitle="Просмотр и принятие кассовых Z-отчётов"
        />
        <div className="flex items-center gap-2 flex-wrap">
          <BuxDatePicker
            mode={dateMode}
            date={date}
            dateFrom={dateFrom}
            dateTo={dateTo}
            onModeChange={setDateMode}
            onDateChange={setDate}
            onDateFromChange={setDateFrom}
            onDateToChange={setDateTo}
          />
          <CusButton
            variant="solid"
            colorPalette="green"
            size="sm"
            onClick={handleExport}
          >
            <LuDownload size={14} /> Скачать Excel
          </CusButton>
        </div>
      </div>

      {/* Summary cards */}
      <BuxSummaryCards
        rows={rows}
        totalNoDiscount={totalNoDiscount}
        kartaSum={kartaSum}
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
        onConfirm={() => setAcceptOpen(false)}
      />
    </div>
  );
}
