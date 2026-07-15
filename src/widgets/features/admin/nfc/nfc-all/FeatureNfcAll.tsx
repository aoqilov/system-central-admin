import { useState } from "react";
import { LuList, LuChartColumn } from "react-icons/lu";
import { CusSegment } from "@/components/ui/segment/CusSegment";
import PageHeader from "@/widgets/shared-ui/PageHeader";
import { useApiNfcAll } from "./hooks/useApiNfcAll";
import { NfcAllStats } from "./components/NfcAllStats";
import { NfcAllFilters } from "./components/NfcAllFilters";
import { NfcAllTable } from "./components/NfcAllTable";
import { NfcAllCharts } from "./components/NfcAllCharts";
import { InfoNfcAllDialog } from "./modals/InfoNfcAllDialog";
import { NFC_TYPE_META } from "./nfc-all.types";

type View = "list" | "charts";

const VIEW_TABS = [
  { id: "list", label: "Список", icon: <LuList size={13} /> },
  { id: "charts", label: "Статистика", icon: <LuChartColumn size={13} /> },
];

export default function FeatureNfcAll() {
  const {
    filters,
    page,
    pageSize,
    setFilters,
    setPage,
    setPageSize,
    stats,
    statsLoading,
    cards,
    total,
    cardsLoading,
    infoCard,
    setInfoCard,
  } = useApiNfcAll();

  const [view, setView] = useState<View>("list");

  return (
    <div className="p-4 tablet:p-6 space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <PageHeader
          title="NFC карты:"
          highlight="Все"
          subtitle="Общий обзор всех типов карт"
        />
        <CusSegment
          layout="inline"
          value={view}
          onValueChange={(v) => setView(v as View)}
          items={VIEW_TABS}
        />
      </div>

      <NfcAllStats stats={stats!} isLoading={statsLoading} />

      {/* Batch toggle buttons */}
      {stats && stats.batches.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilters({ batch: null })}
            className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
            style={{
              background:
                filters.batch === null
                  ? "var(--text-default)"
                  : "var(--bg-second)",
              color:
                filters.batch === null ? "var(--bg-main)" : "var(--text-muted)",
              border: "1px solid var(--border-default)",
            }}
          >
            Все
            <span
              className="ml-1.5 px-1.5 py-0.5 rounded text-xs font-semibold"
              style={{
                background: filters.batch === null ? "#2563eb" : "#dbeafe",
                color: filters.batch === null ? "#fff" : "#1d4ed8",
              }}
            >
              {stats.total.total}
            </span>
          </button>

          {stats.batches.map((b) => {
            const meta = NFC_TYPE_META[b.type];
            const isActive = filters.batch === b.batchId;
            return (
              <button
                key={`${b.type}-${b.batchId}`}
                onClick={() => setFilters({ batch: b.batchId })}
                className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                style={{
                  background: isActive
                    ? "var(--text-default)"
                    : "var(--bg-second)",
                  color: isActive ? "var(--bg-main)" : "var(--text-muted)",
                  border: "1px solid var(--border-default)",
                }}
              >
                <span
                  className="inline-block w-2 h-2 rounded-full mr-1.5"
                  style={{ background: meta.color }}
                />
                {b.batchName}
                <span
                  className="ml-1.5 px-1.5 py-0.5 rounded text-xs font-semibold"
                  style={{
                    background: isActive ? "#2563eb" : "#dbeafe",
                    color: isActive ? "#fff" : "#1d4ed8",
                  }}
                >
                  {b.total}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {view === "list" && (
        <div
          className="rounded-xl"
          style={{
            background: "var(--bg-second)",
            border: "1px solid var(--border-default)",
          }}
        >
          <div
            className="p-4"
            style={{ borderBottom: "1px solid var(--border-default)" }}
          >
            <NfcAllFilters
              filters={filters}
              onChange={setFilters}
              pageSize={pageSize}
              onPageSizeChange={setPageSize}
            />
          </div>

          <div className="px-4 pt-3 pb-1">
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              {total} карт
              {filters.type !== "all" ||
              filters.status !== "all" ||
              filters.search
                ? " (отфильтровано)"
                : ""}
            </p>
          </div>

          <div className="px-4 pb-4">
            <NfcAllTable
              data={cards}
              total={total}
              page={page}
              pageSize={pageSize}
              onPageChange={setPage}
              onInfo={setInfoCard}
              isLoading={cardsLoading}
            />
          </div>
        </div>
      )}

      {/* {view === "charts" && stats && <NfcAllCharts stats={stats} />}
      {view === "charts" && !stats && statsLoading && (
        <div
          className="h-64 rounded-xl animate-pulse"
          style={{ background: "var(--bg-second)" }}
        />
      )} */}

      <InfoNfcAllDialog
        open={infoCard !== null}
        onClose={() => setInfoCard(null)}
        card={infoCard}
      />
    </div>
  );
}
