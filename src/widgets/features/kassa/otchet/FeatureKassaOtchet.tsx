import { useState } from "react";
import { fmtDate } from "@/utils/dateUtils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import PageHeader from "@/widgets/shared-ui/PageHeader";
import { ZOtchetStatsBox } from "./components/ZOtchetStatsBox";
import { XOtchetList } from "./components/XOtchetList";
import { OpenXOtchetDialog } from "./modals/OpenXOtchetDialog";
import { PauseXOtchetDialog } from "./modals/PauseXOtchetDialog";
import { ZOtchetCloseDrawer } from "./modals/ZOtchetCloseDrawer";
import { getTodayReports, openReport, closeReport } from "./api/apiKassaOtchet";
import { reportToPaySummary, buildZHtmlRussian, openPrint } from "./otchet.helpers";
import { CASHBOX_REPORTS_KEY } from "../kassa.constants";
import { useCashbox } from "../hooks/useCashbox";

export default function FeatureKassaOtchet() {
  const qc = useQueryClient();
  const { cashboxId } = useCashbox();

  const [openXDialog, setOpenXDialog] = useState(false);
  const [pauseTargetId, setPauseTargetId] = useState<number | null>(null);
  const [zDialog, setZDialog] = useState(false);

  const QUERY_KEY = CASHBOX_REPORTS_KEY(cashboxId ?? 0);

  const { data } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => getTodayReports(cashboxId!),
    enabled: !!cashboxId,
  });

  const reports = data?.data["cashbox-reports"];
  const zreport = reports?.zreport ?? null;
  const xreports = reports?.xreports ?? [];
  const activeX = xreports.find((x) => x.status === "open") ?? null;

  const isZOpen = zreport?.status === "open";
  const canCloseZ =
    xreports.length > 0 &&
    xreports.every((x) => x.status === "closed") &&
    isZOpen;
  const summary = reportToPaySummary(zreport);
  const date = fmtDate(new Date());

  function invalidate() {
    void qc.invalidateQueries({ queryKey: QUERY_KEY });
  }

  const openMut = useMutation({
    mutationFn: () => openReport(cashboxId!),
    onSuccess: () => {
      invalidate();
      setOpenXDialog(false);
    },
  });

  const closeMut = useMutation({
    mutationFn: ({ reportType, reportId }: { reportType: "xreport" | "zreport"; reportId: number }) =>
      closeReport(cashboxId!, { status: "closed", report_type: reportType, report: reportId }),
    onSuccess: () => {
      invalidate();
      setZDialog(false);
    },
  });

  const stopMut = useMutation({
    mutationFn: () =>
      closeReport(cashboxId!, { status: "stopped", report_type: "xreport", report: activeX?.id ?? 0 }),
    onSuccess: () => {
      invalidate();
      setPauseTargetId(null);
    },
  });

  const resumeMut = useMutation({
    mutationFn: () => {
      const stoppedX = xreports.find((x) => x.status === "stopped");
      return closeReport(cashboxId!, { status: "open", report_type: "xreport", report: stoppedX?.id ?? 0 });
    },
    onSuccess: () => invalidate(),
  });

  function handleZPrint() {
    if (zreport) openPrint(buildZHtmlRussian(zreport));
  }

  function handleZPrintCopy() {
    if (zreport) openPrint(buildZHtmlRussian(zreport, true));
  }

  return (
    <div className="p-4 tablet:p-6 flex flex-col gap-5 pb-6">
      <PageHeader
        title="Kunlik Otchet"
        subtitle="Kunlik otchet ma'lumotlari saqlanadi"
      />

      <ZOtchetStatsBox
        date={date}
        hasActive={isZOpen}
        hasItems={xreports.length > 0}
        canCloseZ={canCloseZ}
        summary={summary}
        onZClose={() => setZDialog(true)}
        onPrintCopy={handleZPrintCopy}
      />

      <XOtchetList
        xreports={xreports}
        activeX={activeX}
        canOpenNew={!activeX && !zreport?.closed_at && xreports.every((x) => x.status !== "stopped")}
        onOpenNew={() => setOpenXDialog(true)}
        onPause={setPauseTargetId}
        onClose={() => closeMut.mutate({ reportType: "xreport", reportId: activeX?.id ?? 0 })}
        onResume={() => resumeMut.mutate()}
      />

      <OpenXOtchetDialog
        open={openXDialog}
        isPending={openMut.isPending}
        onClose={() => setOpenXDialog(false)}
        onConfirm={() => openMut.mutate()}
      />

      <PauseXOtchetDialog
        open={!!pauseTargetId}
        isPending={stopMut.isPending}
        onClose={() => setPauseTargetId(null)}
        onConfirm={() => stopMut.mutate()}
      />

      <ZOtchetCloseDrawer
        open={zDialog}
        isPending={closeMut.isPending}
        onClose={() => setZDialog(false)}
        date={date}
        summary={summary}
        onPrint={handleZPrint}
        onConfirm={() => closeMut.mutate({ reportType: "zreport", reportId: zreport?.id ?? 0 })}
      />
    </div>
  );
}
