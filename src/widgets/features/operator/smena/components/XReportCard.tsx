import { useState } from "react";
import {
  LuPlay,
  LuUsers,
  LuWifiOff,
  LuWifi,
  LuStar,
  LuUserPlus,
  LuShield,
  LuBanknote,
  LuPause,
  LuPower,

} from "react-icons/lu";
import { StatCard } from "@/widgets/features/kassa/otchet/components/StatCard";
import { CusButton } from "@/components/ui/buttons/CusButton";
import { StopXReportDialog } from "../modals/StopXReportDialog";
import { CloseXReportDialog } from "../modals/CloseXReportDialog";
import type { AttractionReport } from "../types";
import { fmt } from "../types";

interface Props {
  xreport: AttractionReport;
  index: number;
  onStop: (id: number) => void;
  onResume: (id: number) => void;
  onClose: (id: number) => void;
}

const STATUS_MAP: Record<AttractionReport["status"], { label: string; color: string }> = {
  open:    { label: "Aktiv",         color: "#22c55e" },
  stopped: { label: "To'xtatilgan", color: "#f59e0b" },
  closed:  { label: "Yopildi",      color: "#64748b" },
};

function timeRange(opened: string, closed: string, status: AttractionReport["status"]) {
  if (!opened) return "—";
  const from = opened.slice(11, 16);
  if (status === "open" || status === "stopped") return `${from} →`;
  const to = closed?.slice(11, 16) ?? "—";
  return `${from} – ${to}`;
}

export function XReportCard({ xreport, index, onStop, onResume, onClose }: Props) {
  const [stopDialog, setStopDialog] = useState(false);
  const [closeDialog, setCloseDialog] = useState(false);

  const status = STATUS_MAP[xreport.status];
  const dim = xreport.status === "stopped";

  return (
    <>
      <div
        className="rounded-2xl border overflow-hidden"
        style={{ background: "var(--bg-second)", borderColor: "var(--border-default)" }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-3 border-b"
          style={{ borderColor: "var(--border-default)" }}
        >
          <p className="font-semibold text-sm" style={{ color: "var(--text-default)" }}>
            X-otchet #{xreport.id}
            <span className="ml-2 font-normal text-xs" style={{ color: "var(--text-muted)" }}>
              {timeRange(xreport.opened_at, xreport.closed_at, xreport.status)}
            </span>
          </p>
          <span
            className="text-xs font-medium px-2.5 py-1 rounded-full"
            style={{ background: `${status.color}18`, color: status.color }}
          >
            {status.label}
          </span>
        </div>

        {/* Stats */}
        <div className="overflow-x-auto px-4 py-4">
          <div className="flex gap-3">
            <StatCard icon={LuPlay}     label="Round"      value={String(xreport.total_rounds)}     color="#3b82f6" dim={dim} />
            <StatCard icon={LuUsers}    label="Jami"       value={String(xreport.total_people)}     color="#22c55e" dim={dim} />
            <StatCard icon={LuWifiOff}  label="Offline"    value={String(xreport.total_offline)}    color="#64748b" dim={dim} />
            <StatCard icon={LuWifi}     label="Online"     value={String(xreport.total_online)}     color="#06b6d4" dim={dim} />
            <StatCard icon={LuStar}     label="VIP"        value={String(xreport.total_vip)}        color="#eab308" dim={dim} />
            <StatCard icon={LuUserPlus} label="Mehmon"     value={String(xreport.total_guest)}      color="#8b5cf6" dim={dim} />
            <StatCard icon={LuShield}   label="Park xodim" value={String(xreport.total_park_staff)} color="#22c55e" dim={dim} />
            <StatCard icon={LuBanknote} label="Summa"      value={fmt(xreport.total_amount)} sub="сум" color="#3b82f6" dim={dim} />
          </div>
        </div>

        {/* Action buttons */}
        {xreport.status === "open" && (
          <div
            className="flex gap-3 px-4 pb-4"
          >
            <CusButton
              colorPalette="orange"
              variant="solid"
              size="sm"
              onClick={() => setStopDialog(true)}
            >
              <LuPause size={14} /> To'xtatish
            </CusButton>
            <CusButton
              colorPalette="red"
              variant="solid"
              size="sm"
              onClick={() => setCloseDialog(true)}
            >
              <LuPower size={14} /> Yopish
            </CusButton>
          </div>
        )}

        {xreport.status === "stopped" && (
          <div className="px-4 pb-4">
            <CusButton
              colorPalette="green"
              variant="solid"
              size="sm"
              onClick={() => onResume(xreport.id)}
            >
              <LuPlay size={14} /> Davom ettirish
            </CusButton>
          </div>
        )}
      </div>

      <StopXReportDialog
        open={stopDialog}
        xreport={xreport}
        index={index}
        onClose={() => setStopDialog(false)}
        onConfirm={() => {
          onStop(xreport.id);
          setStopDialog(false);
        }}
      />

      <CloseXReportDialog
        open={closeDialog}
        xreport={xreport}
        index={index}
        onClose={() => setCloseDialog(false)}
        onConfirm={() => {
          onClose(xreport.id);
          setCloseDialog(false);
        }}
      />
    </>
  );
}
