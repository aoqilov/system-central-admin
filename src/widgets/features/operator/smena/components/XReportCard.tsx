import { useState } from "react";
import {
  LuActivity,
  LuCircleCheck,
  LuClock,
  LuX,
  LuPlay,
  LuUsers,
  LuWifiOff,
  LuWifi,
  LuStar,
  LuUserPlus,
  LuShield,
  LuBanknote,
} from "react-icons/lu";
import { CusBadge } from "@/components/ui/badge/CusBadge";
import { CusButton } from "@/components/ui/buttons/CusButton";
import { StatCard } from "@/widgets/features/kassa/otchet/components/StatCard";
import { StopXReportDialog } from "../modals/StopXReportDialog";
import { CloseXReportDialog } from "../modals/CloseXReportDialog";
import type { AttractionReport } from "../types";
import { fmt } from "../types";
import { fmtDateTime } from "@/utils/dateUtils";
import { RiOrganizationChart } from "react-icons/ri";

interface Props {
  xreport: AttractionReport;
  index: number;
  onStop: (id: number) => void;
  onResume: (id: number) => void;
  onClose: (id: number) => void;
}

export function XReportCard({
  xreport,
  index,
  onStop,
  onResume,
  onClose,
}: Props) {
  const [stopDialog, setStopDialog] = useState(false);
  const [closeDialog, setCloseDialog] = useState(false);

  const isActive = xreport.status === "open";
  const isClosed = xreport.status === "closed";
  const isStopped = xreport.status === "stopped";
  const dim = isClosed;

  const op = xreport.operator
    ? `${xreport.operator.firstname} ${xreport.operator.lastname}`
    : "—";

  return (
    <>
      <div
        className="rounded-xl border overflow-hidden"
        style={{ borderColor: isActive ? "#22c55e" : "var(--border-default)" }}
      >
        {/* Header */}
        <div
          className="px-4 py-3 flex items-center gap-3 border-b"
          style={{
            borderColor: isActive ? "#22c55e" : "var(--border-default)",
            background: isActive ? "#22c55e20" : "var(--bg-hover)",
          }}
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: isActive ? "#3b82f618" : "var(--bg-second)" }}
          >
            {isActive ? (
              <LuActivity size={14} style={{ color: "#3b82f6" }} />
            ) : (
              <LuCircleCheck size={14} style={{ color: "var(--text-muted)" }} />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className="font-semibold text-sm"
                style={{ color: "var(--text-default)" }}
              >
                X-otchet #{xreport.id}
              </span>
              <CusBadge
                colorPalette={isActive ? "blue" : isStopped ? "orange" : "gray"}
                variant="subtle"
                size="sm"
              >
                {isActive ? "Faol" : isStopped ? "To'xtatilgan" : "Yopilgan"}
              </CusBadge>
            </div>
            <div className="flex items-center justify-between gap-2 flex-wrap mt-0.5">
              <span className="bg-blue-500 text-xs text-white p-1 rounded-lg">
                {op} · Boshlandi: {fmtDateTime(xreport.opened_at)}
              </span>
              {xreport.closed_at && (
                <span className="bg-red-500 text-xs shrink-0 text-white p-1 rounded-lg">
                  Yopildi: {fmtDateTime(xreport.closed_at)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Stat cards */}
        <div
          className="overflow-x-auto px-4 pt-4 pb-4"
          style={{ background: "var(--bg-second)" }}
        >
          <div className="flex gap-3">
            <StatCard
              icon={LuPlay}
              label="Round"
              value={String(xreport.total_rounds)}
              color="#3b82f6"
              dim={dim}
            />
            <StatCard
              icon={LuUsers}
              label="Jami"
              value={String(xreport.total_people)}
              color="#22c55e"
              dim={dim}
            />
            <StatCard
              icon={LuWifiOff}
              label="Offline"
              value={String(xreport.total_offline)}
              color="#64748b"
              dim={dim}
            />
            <StatCard
              icon={LuWifi}
              label="Online"
              value={String(xreport.total_online)}
              color="#06b6d4"
              dim={dim}
            />
            <StatCard
              icon={LuStar}
              label="VIP"
              value={String(xreport.total_vip)}
              color="#8b5cf6"
              dim={dim}
            />
            <StatCard
              icon={LuUserPlus}
              label="Organization"
              value={String(xreport.total_organization)}
              color="#eab308"
              dim={dim}
            />
         
            <StatCard
              icon={LuBanknote}
              label="Summa"
              value={fmt(xreport.total_amount)}
              sub="so'm"
              color="#3b82f6"
              dim={dim}
            />
          </div>
        </div>

        {/* Action buttons */}
        {!isClosed && (
          <div
            className="px-4 py-3 flex items-center gap-2 border-t"
            style={{
              borderColor: "var(--border-default)",
              background: "var(--bg-second)",
            }}
          >
            {isStopped ? (
              <CusButton
                colorPalette="green"
                variant="solid"
                size="xs"
                onClick={() => onResume(xreport.id)}
              >
                <LuPlay size={13} /> Davom ettirish
              </CusButton>
            ) : (
              <>
                <CusButton
                  colorPalette="orange"
                  variant="solid"
                  size="xs"
                  onClick={() => setStopDialog(true)}
                >
                  <LuClock size={13} /> To'xtatish
                </CusButton>
                <CusButton
                  colorPalette="red"
                  variant="solid"
                  size="xs"
                  onClick={() => setCloseDialog(true)}
                >
                  <LuX size={13} /> Yopish
                </CusButton>
              </>
            )}
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
