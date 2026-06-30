import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fmtDate } from "@/utils/dateUtils";
import { LuLayoutGrid, LuTable2 } from "react-icons/lu";
import { CusSegment } from "@/components/ui/segment/CusSegment";
import PageHeader from "@/widgets/shared-ui/PageHeader";
import { IncomingKassaCard } from "./components/IncomingKassaCard";
import { IncomingKassaTable, type TableRowState } from "./components/IncomingKassaTable";
import { IncomingSummaryBar } from "./components/IncomingSummaryBar";
import { UnsentDaysAlert } from "./components/UnsentDaysAlert";
import { getZReports, confirmZReports } from "./api/apiRoleKassaMainIncoming";
import { flattenZReports, type ConfirmZReportItem, type ZReportStatus } from "./types";

export default function FeaturesRoleKassaMainIncoming() {
  const date = fmtDate(new Date());
  const qc   = useQueryClient();

  const [view,           setView]           = useState<"card" | "table">("card");
  const [localSmena,     setLocalSmena]     = useState<Record<number, boolean>>({});
  const [localStatuses,  setLocalStatuses]  = useState<Record<number, ZReportStatus>>({});
  const [pendingReviews, setPendingReviews] = useState<ConfirmZReportItem[]>([]);

  const { data } = useQuery({
    queryKey: ["z-reports"],
    queryFn:  () => getZReports(),
  });

  const sendMut = useMutation({
    mutationFn: () => confirmZReports({ zreports: pendingReviews }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["z-reports"] });
      setPendingReviews([]);
      setLocalStatuses({});
    },
  });

  const groups = data?.data["cashbox-zreports"] ?? [];
  const stats  = data?.data.stats;

  const reports = flattenZReports(groups).map((r) => ({
    ...r,
    status: localStatuses[r.id] ?? r.status,
  }));

  function markReview(id: number, status: "confirmed" | "cancelled") {
    setLocalStatuses((p) => ({ ...p, [id]: status }));
    setPendingReviews((p) => [
      ...p.filter((item) => item.id !== id),
      { id, status },
    ]);
  }

  function handleSmenaToggle(id: number) {
    setLocalSmena((p) => ({ ...p, [id]: !p[id] }));
  }

  const tableRowState: Record<number, TableRowState> = Object.fromEntries(
    reports.map((r) => [r.id, { smenaYopildi: localSmena[r.id] ?? false }]),
  );

  return (
    <div className="px-4 tablet:px-6 py-5 flex flex-col gap-5">
      {/* Top bar */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <PageHeader
          title="Приём Z-отчётов"
          subtitle={`${date} · Ежедневные Z-отчёты всех касс`}
        />
        <CusSegment
          layout="inline"
          size="sm"
          value={view}
          onValueChange={(v) => setView(v as "card" | "table")}
          items={[
            { id: "card",  label: "Карточки", icon: <LuLayoutGrid size={13} /> },
            { id: "table", label: "Таблица",  icon: <LuTable2 size={13} /> },
          ]}
        />
      </div>

      {/* Summary + send button */}
      <IncomingSummaryBar
        total={stats?.total ?? 0}
        confirmed={stats?.confirmed ?? 0}
        cancelled={stats?.cancelled ?? 0}
        pending={stats?.waiting ?? 0}
        canSend={pendingReviews.length > 0}
        isSendPending={sendMut.isPending}
        onSend={() => sendMut.mutate()}
      />

      {/* Unsent days warning */}
      <UnsentDaysAlert days={[]} />

      {/* Card view */}
      {view === "card" && (
        <div className="flex flex-col gap-4">
          {reports.map((report) => (
            <IncomingKassaCard
              key={report.id}
              report={report}
              onConfirm={() => markReview(report.id, "confirmed")}
              onReject={() => markReview(report.id, "cancelled")}
            />
          ))}
        </div>
      )}

      {/* Table view */}
      {view === "table" && (
        <IncomingKassaTable
          reports={reports}
          rowState={tableRowState}
          onSmenaToggle={handleSmenaToggle}
          onConfirm={(id) => markReview(id, "confirmed")}
          onReject={(id) => markReview(id, "cancelled")}
        />
      )}
    </div>
  );
}
