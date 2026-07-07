import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getZReports, confirmZReports, updateReportStatus } from "../api/apiOpeMainIncoming";
import { type AttractionRow, type RowStatus, type CardCounts } from "../types";

export function useOpeMainIncoming() {
  const today = dayjs();
  const dateStr = today.format("YYYY-MM-DD");
  const qc = useQueryClient();
  const QUERY_KEY = ["ope-main-incoming", dateStr];

  const { data, isLoading, isError } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => getZReports(dateStr),
  });

  const [rows, setRows] = useState<AttractionRow[]>([]);
  const [sendDialog, setSendDialog] = useState(false);
  const [sentAt, setSentAt] = useState<string | null>(null);
  const [sendLoading, setSendLoading] = useState(false);

  useEffect(() => {
    if (!data) return;
    setRows(
      data.attractions.flatMap((a) =>
        a.zreports.map((z) => ({
          id:         a.id,
          reportId:   z.id,
          name:       a.name,
          price:      a.price,
          roundCount: z.total_rounds,
          cards: {
            jami:      z.total_people,
            asosiy:    z.total_offline,
            online:    z.total_online,
            vip:       z.total_vip,
            mehmon:    z.total_guest,
            parkXodim: z.total_park_staff,
          },
          paid:       z.paid_amount,
          total:      z.total_amount,
          status:
            z.status === "active" || z.status === "open" ? "active"
            : z.status === "stopped"                     ? "stopped"
            : z.status === "confirmed"                   ? "confirmed"
            : "closed",
        } satisfies AttractionRow)),
      ),
    );
  }, [data]);

  // ── Aggregates (API totals dan) ──
  const totalRounds  = data?.totals.total_rounds     ?? 0;
  const totalRevenue = data?.totals.total_amount     ?? 0;
  const totalCards: CardCounts = {
    jami:      data?.totals.total_people     ?? 0,
    asosiy:    data?.totals.total_offline    ?? 0,
    online:    data?.totals.total_online     ?? 0,
    vip:       data?.totals.total_vip        ?? 0,
    mehmon:    data?.totals.total_guest      ?? 0,
    parkXodim: data?.totals.total_park_staff ?? 0,
  };

  function handleConfirm(id: number) {
    setRows((prev) =>
      prev.map((r) => r.id === id ? { ...r, status: "confirmed" as RowStatus } : r),
    );
  }

  async function handleReopen(attractionId: number) {
    const row = rows.find((r) => r.id === attractionId);
    if (!row) return;
    await updateReportStatus(attractionId, row.reportId, "open");
    await qc.invalidateQueries({ queryKey: QUERY_KEY });
  }

  async function handleSend() {
    const confirmed = rows
      .filter((r) => r.status === "confirmed")
      .map((r) => ({ id: r.reportId, status: "confirmed" as const }));

    if (confirmed.length === 0) return;

    setSendLoading(true);
    try {
      await confirmZReports(confirmed);
      setSentAt(dayjs().format("HH:mm, DD.MM.YYYY"));
      setSendDialog(false);
    } finally {
      setSendLoading(false);
    }
  }

  return {
    today,
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
