import { useState } from "react";
import { LuDownload } from "react-icons/lu";
import { CusButton } from "@/components/ui/buttons/CusButton";
import PageHeader from "@/widgets/shared-ui/PageHeader";
import { ExportDatePicker } from "./components/ExportDatePicker";
import { ExportSummaryCards } from "./components/ExportSummaryCards";
import { ExportReportTable } from "./components/ExportReportTable";
import { ConfirmSendDialog } from "./modals/ConfirmSendDialog";
import { exportToExcel } from "./utils/exportToExcel";
import { useApiRoleKassaMainExport } from "./hooks/useApiRoleKassaMainExport";

const PARK_NAME = "Central Park";

export default function FeatureRoleKassaMainExport() {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const {
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
  } = useApiRoleKassaMainExport();

  return (
    <div className="px-4 tablet:px-6 py-5 flex flex-col gap-5 pb-28">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <PageHeader
          title="Отправка в бухгалтерию"
          subtitle="Экспорт ежедневных Z-отчётов в бухгалтерию"
        />
        <div className="flex items-center gap-2 flex-wrap">
          <ExportDatePicker
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
            onClick={() =>
              exportToExcel({ rows, kassas, kartaSold, dateLabel, parkName: PARK_NAME })
            }
          >
            <LuDownload size={14} /> Скачать Excel
          </CusButton>
        </div>
      </div>

      {isLoading && (
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Загрузка...
        </p>
      )}

      {isError && (
        <p className="text-sm" style={{ color: "#ef4444" }}>
          Ошибка загрузки данных
        </p>
      )}

      {!isLoading && !isError && (
        <>
          <ExportSummaryCards rows={rows} totalNoDiscount={totalNoDiscount} kartaSum={kartaSum} />
          <ExportReportTable
            rows={rows}
            kassas={kassas}
            kartaSold={kartaSold}
            dateLabel={dateLabel}
            parkName={PARK_NAME}
          />
        </>
      )}

      <ConfirmSendDialog
        open={confirmOpen}
        dateLabel={dateLabel}
        parkName={PARK_NAME}
        kassaCount={kassas.length}
        kartaSold={kartaSum}
        totalAmount={totalWithDiscount}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => setConfirmOpen(false)}
      />
    </div>
  );
}
