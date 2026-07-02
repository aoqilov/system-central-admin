import { useState } from "react";
import { LuPlay, LuFerrisWheel } from "react-icons/lu";
import { fmtDate } from "@/utils/dateUtils";
import PageHeader from "@/widgets/shared-ui/PageHeader";
import { CusButton } from "@/components/ui/buttons/CusButton";
import { useMe } from "@/widgets/api-global/files-route/auth";
import { useOperatorAttraction } from "../hooks/useOperatorAttraction";
import { useSmena } from "./hooks";
import { SmenaStatsBox } from "./components/SmenaStatsBox";
import { XReportList } from "./components/XReportList";
import { OpenXReportDialog } from "./modals/OpenXReportDialog";
import { CloseSmenaDialog } from "./modals/CloseSmenaDialog";

export default function FeatureOperatorSmena() {
  const [openXDialog, setOpenXDialog] = useState(false);
  const [closeSmenaDialog, setCloseSmenaDialog] = useState(false);

  const { data: me } = useMe();
  const { attraction } = useOperatorAttraction();
  const attractionID = attraction?.id;

  const {
    zreport,
    xreports,
    isLoading,
    canOpenX,
    canClose,
    openXMut,
    stopXMut,
    resumeXMut,
    closeXMut,
    closeZMut,
  } = useSmena(attractionID);

  const date = fmtDate(new Date());
  const operatorName = me?.fullname ?? "";

  if (isLoading) {
    return (
      <div className="p-4 tablet:p-6 flex flex-col gap-5 pb-6">
        <PageHeader title="Smena" subtitle={`${date} · Yuklanmoqda...`} />
        <div
          className="rounded-2xl border px-5 py-10 flex items-center justify-center gap-3"
          style={{ background: "var(--bg-second)", borderColor: "var(--border-default)" }}
        >
          <LuFerrisWheel size={20} className="animate-spin" style={{ color: "var(--text-muted)" }} />
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 tablet:p-6 flex flex-col gap-5 pb-6">
      <PageHeader
        title="Smena"
        subtitle={`${date} · Bugungi aylanishlar`}
      />

      {zreport && (
        <SmenaStatsBox
          zreport={zreport}
          smenaNumber={zreport.id}
          operatorName={operatorName}
          canClose={canClose}
          onClose={() => setCloseSmenaDialog(true)}
        />
      )}

      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold" style={{ color: "var(--text-default)" }}>
          X-otchetlar
        </p>
        {canOpenX && (
          <CusButton
            colorPalette="green"
            variant="solid"
            size="sm"
            onClick={() => setOpenXDialog(true)}
          >
            <LuPlay size={13} /> X-otchet ochish
          </CusButton>
        )}
      </div>

      <XReportList
        xreports={xreports}
        onStop={(id) => stopXMut.mutate(id)}
        onResume={(id) => resumeXMut.mutate(id)}
        onClose={(id) => closeXMut.mutate(id)}
      />

      <OpenXReportDialog
        open={openXDialog}
        isPending={openXMut.isPending}
        onClose={() => setOpenXDialog(false)}
        onConfirm={() => {
          openXMut.mutate(undefined, {
            onSuccess: () => setOpenXDialog(false),
          });
        }}
      />

      {zreport && (
        <CloseSmenaDialog
          open={closeSmenaDialog}
          zreport={zreport}
          onClose={() => setCloseSmenaDialog(false)}
          onConfirm={() => {
            closeZMut.mutate(undefined, {
              onSuccess: () => setCloseSmenaDialog(false),
            });
          }}
        />
      )}
    </div>
  );
}
