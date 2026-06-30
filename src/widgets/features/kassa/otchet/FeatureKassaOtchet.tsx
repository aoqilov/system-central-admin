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
import { reportToPaySummary, buildZHtml, openPrint } from "./otchet.helpers";
import { CASHBOX_ID, CASHBOX_REPORTS_KEY } from "../kassa.constants";

const QUERY_KEY = CASHBOX_REPORTS_KEY(CASHBOX_ID);

export default function FeatureKassaOtchet() {
  const qc = useQueryClient();

  const [openXDialog, setOpenXDialog]   = useState(false);
  const [pauseTargetId, setPauseTargetId] = useState<number | null>(null);
  const [zDialog, setZDialog]           = useState(false);

  const { data } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => getTodayReports(CASHBOX_ID),
  });

  const reports  = data?.data["cashbox-reports"];
  const zreport  = reports?.zreport ?? null;
  const xreports = reports?.xreports ?? [];
  const activeX  = xreports.find((x) => x.status === "open") ?? null;

  const isZOpen   = zreport?.status === "open";
  const canCloseZ = xreports.length > 0 && xreports.every((x) => x.status === "closed") && isZOpen;
  const summary  = reportToPaySummary(zreport);
  const date     = fmtDate(new Date());

  function invalidate() {
    void qc.invalidateQueries({ queryKey: QUERY_KEY });
  }

  const openMut = useMutation({
    mutationFn: () => openReport(CASHBOX_ID),
    onSuccess: () => { invalidate(); setOpenXDialog(false); },
  });

  const closeMut = useMutation({
    mutationFn: (reportType: "xreport" | "zreport") =>
      closeReport(CASHBOX_ID, { report_type: reportType }),
    onSuccess: () => { invalidate(); setZDialog(false); },
  });

  function handleZPrint() {
    if (zreport) openPrint(buildZHtml(zreport));
  }

  function handleZPrintCopy() {
    if (zreport) openPrint(buildZHtml(zreport, true));
  }

  return (
    <div className="p-4 tablet:p-6 flex flex-col gap-5 pb-6">
      <PageHeader title="Kunlik Otchet" subtitle="Kunlik otchet ma'lumotlari saqlanadi" />

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
        canOpenNew={!activeX && !zreport?.closed_at}
        onOpenNew={() => setOpenXDialog(true)}
        onPause={setPauseTargetId}
        onClose={() => closeMut.mutate("xreport")}
      />

      <OpenXOtchetDialog
        open={openXDialog}
        isPending={openMut.isPending}
        onClose={() => setOpenXDialog(false)}
        onConfirm={() => openMut.mutate()}
      />

      <PauseXOtchetDialog
        open={!!pauseTargetId}
        onClose={() => setPauseTargetId(null)}
        onConfirm={() => setPauseTargetId(null)}
      />

      <ZOtchetCloseDrawer
        open={zDialog}
        isPending={closeMut.isPending}
        onClose={() => setZDialog(false)}
        date={date}
        summary={summary}
        onPrint={handleZPrint}
        onConfirm={() => closeMut.mutate("zreport")}
      />
    </div>
  );
}
