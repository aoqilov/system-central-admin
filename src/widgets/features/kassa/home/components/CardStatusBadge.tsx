import type React from "react";
import type { CardScanStatus } from "../types";
import {
  LuCircleCheck,
  LuCircleX,
  LuClock,
  LuScanBarcode,
  LuTriangleAlert,
} from "react-icons/lu";

interface Cfg {
  label: string;
  bg: string;
  border: string;
  color: string;
  Icon: React.ElementType;
}

const STATUS: Record<CardScanStatus, Cfg> = {
  empty: {
    label: "Karta skanerlanmagan",
    bg: "rgba(28,37,50,0.5)",
    border: "#1c2532",
    color: "#4a6580",
    Icon: LuScanBarcode,
  },
  scanning: {
    label: "Skanerlanmoqda...",
    bg: "rgba(31,116,214,0.08)",
    border: "rgba(31,116,214,0.3)",
    color: "#1f74d6",
    Icon: LuScanBarcode,
  },
  active: {
    label: "Aktiv",
    bg: "rgba(46,163,107,0.10)",
    border: "rgba(46,163,107,0.3)",
    color: "#2ea36b",
    Icon: LuCircleCheck,
  },
  blocked: {
    label: "Bloklangan",
    bg: "rgba(229,62,62,0.08)",
    border: "rgba(229,62,62,0.3)",
    color: "#e53e3e",
    Icon: LuTriangleAlert,
  },
  expired: {
    label: "Muddati o'tgan",
    bg: "rgba(217,119,6,0.08)",
    border: "rgba(217,119,6,0.3)",
    color: "#d97706",
    Icon: LuClock,
  },
  error: {
    label: "Xatolik yuz berdi",
    bg: "rgba(229,62,62,0.08)",
    border: "rgba(229,62,62,0.3)",
    color: "#e53e3e",
    Icon: LuCircleX,
  },
};

export function CardStatusBadge({ status }: { status: CardScanStatus }) {
  const cfg = STATUS[status];
  const { Icon } = cfg;
  return (
    <div
      className="flex items-center gap-3 px-5 rounded-xl"
      style={{
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
        height: 56,
        minHeight: 56,
      }}
    >
      <Icon size={22} style={{ color: cfg.color, flexShrink: 0 }} />
      <span
        className="font-bold text-lg"
        style={{ color: cfg.color, letterSpacing: "0.01em" }}
      >
        {cfg.label}
      </span>
      {status === "scanning" && (
        <span
          className="ml-auto rounded-full border-2 animate-spin"
          style={{
            width: 18,
            height: 18,
            borderColor: `${cfg.color}50`,
            borderTopColor: cfg.color,
          }}
        />
      )}
    </div>
  );
}
