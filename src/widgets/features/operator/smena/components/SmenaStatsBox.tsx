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
  LuPower,
  LuCopy,
  LuCheck,
} from "react-icons/lu";
import { StatCard } from "@/widgets/features/kassa/otchet/components/StatCard";
import { CusButton } from "@/components/ui/buttons/CusButton";
import type { AttractionReport } from "../types";
import { fmt } from "../types";
import { fmtDate } from "@/utils/dateUtils";

interface Props {
  zreport: AttractionReport;
  smenaNumber: number;
  operatorName: string;
  canClose: boolean;
  onClose: () => void;
}

export function SmenaStatsBox({
  zreport,
  smenaNumber,
  operatorName,
  canClose,
  onClose,
}: Props) {
  const [copied, setCopied] = useState(false);

  const smenaOpen = zreport.status === "open";
  const dim = !smenaOpen;

  function handleCopy() {
    const text = [
      `Smena #${smenaNumber} · ${fmtDate(new Date())}`,
      `Operator: ${operatorName}`,
      `Roundlar: ${zreport.total_rounds}`,
      `Jami: ${zreport.total_people} kishi`,
      `Offline: ${zreport.total_offline} | Online: ${zreport.total_online} | VIP: ${zreport.total_vip}`,
      `Mehmon: ${zreport.total_guest} | Park xodim: ${zreport.total_park_staff}`,
      `Summa: ${fmt(zreport.total_amount)} сум`,
    ].join("\n");

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div
      className="rounded-2xl border overflow-hidden mb-10"
      style={{
        background: "var(--bg-second)",
        borderColor: "var(--border-default)",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-4 border-b"
        style={{ borderColor: "var(--border-default)" }}
      >
        <div>
          <p
            className="font-semibold text-sm"
            style={{ color: "var(--text-default)" }}
          >
            Z-otchet #{smenaNumber}{" "}
            <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>
              ({fmtDate(new Date())})
            </span>
          </p>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
            {operatorName}
          </p>
        </div>

        {canClose && (
          <CusButton
            colorPalette="red"
            variant="solid"
            size="sm"
            onClick={onClose}
          >
            <LuPower size={14} /> Smena yopish
          </CusButton>
        )}
      </div>

      {/* Copy row */}
      <div
        className="flex items-center px-5 py-2.5 border-b"
        style={{ borderColor: "var(--border-default)" }}
      >
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs transition-all active:scale-95"
          style={{ color: copied ? "#22c55e" : "var(--text-muted)" }}
        >
          {copied ? <LuCheck size={13} /> : <LuCopy size={13} />}
          {copied ? "Nusxa olindi" : "Nusxa olish"}
        </button>
      </div>

      {/* Stats */}
      <div className="overflow-x-auto px-4 py-4">
        <div className="flex gap-3">
          <StatCard
            icon={LuPlay}
            label="Round"
            value={String(zreport.total_rounds)}
            color="#3b82f6"
            dim={dim}
          />
          <StatCard
            icon={LuUsers}
            label="Jami"
            value={String(zreport.total_people)}
            color="#22c55e"
            dim={dim}
          />
          <StatCard
            icon={LuWifiOff}
            label="Offline"
            value={String(zreport.total_offline)}
            color="#64748b"
            dim={dim}
          />
          <StatCard
            icon={LuWifi}
            label="Online"
            value={String(zreport.total_online)}
            color="#06b6d4"
            dim={dim}
          />
          <StatCard
            icon={LuStar}
            label="VIP"
            value={String(zreport.total_vip)}
            color="#8b5cf6"
            dim={dim}
          />
          <StatCard
            icon={LuUserPlus}
            label="Organization"
            value={String(zreport.total_organization)}
            color="#eab308"
            dim={dim}
          />

          <StatCard
            icon={LuBanknote}
            label="Jami summa"
            value={fmt(zreport.total_amount)}
            sub="сум"
            color="#3b82f6"
            dim={dim}
          />
        </div>
      </div>
    </div>
  );
}
