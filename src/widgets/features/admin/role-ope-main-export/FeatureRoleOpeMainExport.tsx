import PageHeader from "@/widgets/shared-ui/PageHeader";
import { ExportStatCards } from "./components/ExportStatCards";
import { ExportTable } from "./components/ExportTable";
import { ExportDateControls } from "./components/ExportDateControls";
import { useRoleOpeMainExport } from "./hooks/useRoleOpeMainExport";

export default function FeatureRoleOpeMainExport() {
  const {
    tab,
    setTab,
    selectedDay,
    setSelectedDay,
    dateFrom,
    dateTo,
    subtitle,
    rows,
    isLoading,
    isError,
    totalRounds,
    totalRevenue,
    totalCards,
    handleFromChange,
    handleToChange,
    handleExport,
  } = useRoleOpeMainExport();

  return (
    <div className="p-4 desktop:p-6 space-y-4 pb-8">
      <div className="flex flex-col gap-3 tablet:flex-row tablet:items-start tablet:justify-between">
        <PageHeader
          title="Экспорт отчёта"
          highlight="операторов"
          subtitle={subtitle}
        />
        <ExportDateControls
          tab={tab}
          onTabChange={setTab}
          selectedDay={selectedDay}
          onDayChange={setSelectedDay}
          dateFrom={dateFrom}
          dateTo={dateTo}
          onFromChange={handleFromChange}
          onToChange={handleToChange}
          onExport={handleExport}
        />
      </div>

      {isLoading && (
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>Загрузка...</p>
      )}

      {isError && (
        <p className="text-sm" style={{ color: "#ef4444" }}>Ошибка загрузки данных</p>
      )}

      {!isLoading && !isError && (
        <>
          <ExportStatCards
            totalRounds={totalRounds}
            totalCards={totalCards}
            totalRevenue={totalRevenue}
          />
          <ExportTable rows={rows} />
        </>
      )}
    </div>
  );
}
