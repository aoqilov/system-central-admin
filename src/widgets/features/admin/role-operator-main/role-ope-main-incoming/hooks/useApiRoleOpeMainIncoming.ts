import { useState, useMemo } from "react";
import dayjs from "dayjs";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAttractionZReports,
  confirmAttractionZReports,
  updateAttractionReportStatus,
  getUnconfirmedAttractionDates,
} from "@/api/attraction-reports/attraction-reports.api";
import type { AttractionRow, CardCounts } from "../types";

const TODAY = dayjs().format("YYYY-MM-DD");

export function useApiRoleOpeMainIncoming() {
  const qc = useQueryClient();

  const [selectedDate, setSelectedDate] = useState(TODAY);
  const [sendDialog, setSendDialog] = useState(false);
  const [sentAt, setSentAt] = useState<string | null>(null);
  const [sendLoading, setSendLoading] = useState(false);
  const [confirmedIds, setConfirmedIds] = useState<Set<number>>(new Set());

  const QUERY_KEY = ["ope-main-incoming", selectedDate];

  // ── Unconfirmed dates ──────────────────────────────────────────────────────
  const { data: unconfirmedData } = useQuery({
    queryKey: ["unconfirmed-attraction-dates"],
    queryFn: getUnconfirmedAttractionDates,
    staleTime: 30_000,
  });
  const unconfirmedDates = unconfirmedData ?? [];

  // ── Main zreports query ────────────────────────────────────────────────────
  const { data, isLoading, isError } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => getAttractionZReports({ date: selectedDate }),
  });

  const rows = useMemo<AttractionRow[]>(() => {
    if (!data) return [];
    return data.attractions.flatMap((a) =>
      a.zreports.map(
        (z) =>
          ({
            id: a.id,
            reportId: z.id,
            name: a.name,
            price: a.price,
            roundCount: z.total_rounds,
            cards: {
              jami: z.total_people,
              asosiy: z.total_offline,
              online: z.total_online,
              vip: z.total_vip,
              organization: z.total_organization,
            },
            paid: z.paid_amount,
            total: z.total_amount,
            status: confirmedIds.has(z.id)
              ? "confirmed"
              : z.status === "open"
                ? "active"
                : z.status === "stopped"
                  ? "stopped"
                  : z.status === "confirmed"
                    ? "confirmed"
                    : "closed",
          }) satisfies AttractionRow,
      ),
    );
  }, [data, confirmedIds]);

  const totalRounds = data?.totals.total_rounds ?? 0;
  const totalRevenue = data?.totals.total_amount ?? 0;
  const totalCards: CardCounts = {
    jami: data?.totals.total_people ?? 0,
    asosiy: data?.totals.total_offline ?? 0,
    online: data?.totals.total_online ?? 0,
    vip: data?.totals.total_vip ?? 0,
    organization: data?.totals.total_organization ?? 0,
  };

  function handleConfirm(reportId: number) {
    setConfirmedIds((prev) => new Set(prev).add(reportId));
  }

  async function handleReopen(attractionId: number) {
    const row = rows.find((r) => r.id === attractionId);
    if (!row) return;
    await updateAttractionReportStatus(attractionId, row.reportId, { status: "open" });
    setConfirmedIds((prev) => {
      const next = new Set(prev);
      next.delete(row.reportId);
      return next;
    });
    await qc.invalidateQueries({ queryKey: QUERY_KEY });
  }

  async function handleSend() {
    const confirmed = rows
      .filter((r) => r.status === "confirmed")
      .map((r) => ({ id: r.reportId, status: "confirmed" as const }));

    if (confirmed.length === 0) return;

    setSendLoading(true);
    try {
      await confirmAttractionZReports({ zreports: confirmed });
      setSentAt(dayjs().format("HH:mm, DD.MM.YYYY"));
      setSendDialog(false);
      setConfirmedIds(new Set());
      // invalidate both queries, then go back to today
      await qc.invalidateQueries({ queryKey: QUERY_KEY });
      await qc.invalidateQueries({ queryKey: ["unconfirmed-attraction-dates"] });
      setSelectedDate(TODAY);
    } finally {
      setSendLoading(false);
    }
  }

  return {
    selectedDate,
    setSelectedDate,
    isViewingToday: selectedDate === TODAY,
    unconfirmedDates,
    rows,
    isLoading,
    isError,
    sendDialog,
    setSendDialog,
    sentAt,
    sendLoading,
    totalRounds,
    totalRevenue,
    totalCards,
    handleConfirm,
    handleReopen,
    handleSend,
  };
}
