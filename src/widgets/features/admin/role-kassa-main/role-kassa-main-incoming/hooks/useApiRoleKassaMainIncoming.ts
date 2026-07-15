import { useState } from "react";
import dayjs from "dayjs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCashboxZReports,
  confirmCashboxZReports,
  updateCashboxReportStatus,
} from "@/api/cashbox-reports/cashbox-reports.api";
import { flattenZReports } from "@/types/report.types";
import type { ZReportStatus, ConfirmZReportItem, DailyZReport } from "@/types/report.types";
import type { TableRowState } from "../components/IncomingKassaTable";

const QUERY_KEY = ["kassa-main-z-reports"];

export function useApiRoleKassaMainIncoming() {
  const date = dayjs().format("YYYY-MM-DD");
  const qc = useQueryClient();

  const [localSmena, setLocalSmena] = useState<Record<number, boolean>>({});
  const [reopeningId, setReopeningId] = useState<number | null>(null);
  const [localStatuses, setLocalStatuses] = useState<Record<number, ZReportStatus>>({});
  const [pendingReviews, setPendingReviews] = useState<ConfirmZReportItem[]>([]);

  const { data, isLoading, isError } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => getCashboxZReports({ date }),
  });

  const sendMut = useMutation({
    mutationFn: () => confirmCashboxZReports({ zreports: pendingReviews }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY });
      setPendingReviews([]);
      setLocalStatuses({});
    },
  });

  const reopenMut = useMutation({
    mutationFn: ({ cashboxId, reportId }: { cashboxId: number; reportId: number }) =>
      updateCashboxReportStatus(cashboxId, {
        status: "open",
        report_type: "zreport",
        report: reportId,
      }),
    onSuccess: (_, { reportId }) => {
      qc.invalidateQueries({ queryKey: QUERY_KEY });
      clearLocalStatus(reportId);
      setReopeningId(null);
    },
    onError: () => setReopeningId(null),
  });

  const groups = data?.cashboxes ?? [];
  const stats = data?.stats;

  const reports: DailyZReport[] = flattenZReports(groups).map((r) => ({
    ...r,
    status: (localStatuses[r.id] ?? r.status) as ZReportStatus,
  }));

  function markReview(id: number, status: "confirmed" | "cancelled") {
    setLocalStatuses((p) => ({ ...p, [id]: status }));
    setPendingReviews((p) => [
      ...p.filter((item) => item.id !== id),
      { id, status },
    ]);
  }

  function clearLocalStatus(id: number) {
    setLocalStatuses((p) => {
      const next = { ...p };
      delete next[id];
      return next;
    });
    setPendingReviews((p) => p.filter((item) => item.id !== id));
  }

  function handleSmenaToggle(id: number) {
    setLocalSmena((p) => ({ ...p, [id]: !p[id] }));
  }

  function handleReopen(cashboxId: number, reportId: number) {
    setReopeningId(reportId);
    reopenMut.mutate({ cashboxId, reportId });
  }

  const tableRowState: Record<number, TableRowState> = Object.fromEntries(
    reports.map((r) => [
      r.id,
      {
        smenaYopildi: localSmena[r.id] ?? false,
        isReopenPending: reopeningId === r.id && reopenMut.isPending,
      },
    ]),
  );

  return {
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
    clearLocalStatus,
    handleSmenaToggle,
    handleReopen,
  };
}
