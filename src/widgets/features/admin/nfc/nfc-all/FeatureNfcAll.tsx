import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { LuList, LuChartColumn } from "react-icons/lu";
import { CusSegment } from "@/components/ui/segment/CusSegment";
import PageHeader from "@/widgets/shared-ui/PageHeader";
import { getAllCards, getAllStats } from "./api/nfcAllApi";
import { useNfcAll } from "./hooks/useNfcAll";
import { NfcAllStats } from "./components/NfcAllStats";
import { NfcAllFilters } from "./components/NfcAllFilters";
import { NfcAllTable } from "./components/NfcAllTable";
import { NfcAllCharts } from "./components/NfcAllCharts";
import { InfoNfcAllDialog } from "./modals/InfoNfcAllDialog";
import type { UnifiedCard } from "./nfc-all.types";

type View = "list" | "charts";

export default function FeatureNfcAll() {
  const { filters, page, pageSize, setFilters, setPage, setPageSize } = useNfcAll();
  const [view, setView]           = useState<View>("list");
  const [infoCard, setInfoCard]   = useState<UnifiedCard | null>(null);

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["nfc-all-stats"],
    queryFn:  getAllStats,
  });

  const { data: cardsData, isLoading: cardsLoading } = useQuery({
    queryKey: ["nfc-all-cards", filters, page, pageSize],
    queryFn:  () =>
      getAllCards({
        page,
        limit:  pageSize,
        search: filters.search || undefined,
        type:   filters.type   !== "all" ? filters.type   : undefined,
        status: filters.status !== "all" ? filters.status : undefined,
      }),
    enabled: view === "list",
  });

  const cards = cardsData?.cards ?? [];
  const total = cardsData?.pagination.total ?? 0;

  const VIEW_TABS = [
    { id: "list",   label: "Список",     icon: <LuList size={13} /> },
    { id: "charts", label: "Статистика", icon: <LuChartColumn size={13} /> },
  ];

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

      {/* Aggregate stats — always visible */}
      {stats && !statsLoading && <NfcAllStats stats={stats} />}
      {statsLoading && (
        <div className="grid grid-cols-2 desktop:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-24 rounded-xl animate-pulse"
              style={{ background: "var(--bg-second)" }}
            />
          ))}
        </div>
      )}

      {/* List view */}
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
              {filters.type !== "all" || filters.status !== "all" || filters.search
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

      {/* Charts view */}
      {view === "charts" && stats && <NfcAllCharts stats={stats} />}
      {view === "charts" && !stats && statsLoading && (
        <div
          className="h-64 rounded-xl animate-pulse"
          style={{ background: "var(--bg-second)" }}
        />
      )}

      <InfoNfcAllDialog
        open={infoCard !== null}
        onClose={() => setInfoCard(null)}
        card={infoCard}
      />
    </div>
  );
}
