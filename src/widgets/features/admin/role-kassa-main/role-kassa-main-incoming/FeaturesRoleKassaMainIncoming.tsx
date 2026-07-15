import { useState } from "react";
import { LuLayoutGrid, LuTable2 } from "react-icons/lu";
import { CusSegment } from "@/components/ui/segment/CusSegment";
import PageHeader from "@/widgets/shared-ui/PageHeader";
import { IncomingKassaCard } from "./components/IncomingKassaCard";
import { IncomingKassaTable } from "./components/IncomingKassaTable";
import { IncomingSummaryBar } from "./components/IncomingSummaryBar";
import { UnsentDaysAlert } from "./components/UnsentDaysAlert";
import { useApiRoleKassaMainIncoming } from "./hooks/useApiRoleKassaMainIncoming";

export default function FeaturesRoleKassaMainIncoming() {
  const [view, setView] = useState<"card" | "table">("card");

  const {
    date,
    reports,
    stats,
    isLoading,
    isError,
    pendingReviews,
    sendMut,
    tableRowState,
    reopeningId,
    reopenMut,
    markReview,
    handleSmenaToggle,
    handleReopen,
  } = useApiRoleKassaMainIncoming();

  return (
    <div className="px-4 tablet:px-6 py-5 flex flex-col gap-5">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <PageHeader
          title="Приём Z-отчётов"
          subtitle={`${date} · Ежедневные Z-отчёты всех касс`}
        />
        <div className="flex items-center gap-2">
          <CusSegment
            layout="inline"
            size="sm"
            value={view}
            onValueChange={(v) => setView(v as "card" | "table")}
            items={[
              { id: "card", label: "Карточки", icon: <LuLayoutGrid size={13} /> },
              { id: "table", label: "Таблица", icon: <LuTable2 size={13} /> },
            ]}
          />
        </div>
      </div>

      <IncomingSummaryBar
        total={stats?.total ?? 0}
        confirmed={stats?.confirmed ?? 0}
        cancelled={stats?.cancelled ?? 0}
        pending={stats?.stopped ?? 0}
        canSend={pendingReviews.length > 0}
        isSendPending={sendMut.isPending}
        onSend={() => sendMut.mutate()}
      />

      <UnsentDaysAlert days={[]} />

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

      {view === "card" && !isLoading && !isError && (
        <div className="flex flex-col gap-4">
          {reports.map((report) => (
            <IncomingKassaCard
              key={report.id}
              report={report}
              isReopenPending={reopeningId === report.id && reopenMut.isPending}
              onConfirm={() => markReview(report.id, "confirmed")}
              onReopen={() => handleReopen(report.cashbox_id, report.id)}
            />
          ))}
        </div>
      )}

      {view === "table" && !isLoading && !isError && (
        <IncomingKassaTable
          reports={reports}
          rowState={tableRowState}
          onSmenaToggle={handleSmenaToggle}
          onConfirm={(id) => markReview(id, "confirmed")}
          onReject={(id) => markReview(id, "cancelled")}
          onReopen={handleReopen}
        />
      )}
    </div>
  );
}
