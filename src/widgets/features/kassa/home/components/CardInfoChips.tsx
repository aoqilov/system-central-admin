import type React from "react";
import type { QrInfo } from "../types";
import { LuHash, LuQrCode, LuLayers, LuBanknote } from "react-icons/lu";

function fmt(raw: string): string {
  if (!raw) return "";
  return Number(raw).toLocaleString("uz-UZ") + " so'm";
}

function Chip({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  const empty = !value;
  return (
    <div
      className="flex flex-col gap-1.5 p-3 rounded-xl"
      style={{ background: "#0e1521", border: "1px solid #1c2532" }}
    >
      <div className="flex items-center gap-1.5">
        <Icon size={12} style={{ color: "#4a6580" }} />
        <span
          className="text-xs font-semibold uppercase tracking-wider"
          style={{ color: "#4a6580" }}
        >
          {label}
        </span>
      </div>
      <span
        className="text-sm font-semibold font-mono truncate"
        style={{
          color: empty ? "#2a3a4e" : "#e8edf5",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {value || "—"}
      </span>
    </div>
  );
}

export function CardInfoChips({ qrInfo }: { qrInfo: QrInfo }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <Chip icon={LuHash} label="Raqam" value={qrInfo.raqam} />
      <Chip icon={LuQrCode} label="Token" value={qrInfo.token} />
      <Chip icon={LuLayers} label="Partiya" value={qrInfo.partiya} />
      <Chip icon={LuBanknote} label="Karta summasi" value={fmt(qrInfo.amount)} />
    </div>
  );
}
