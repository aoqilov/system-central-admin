import React from "react";
import {
  LuUsers, LuWifiOff, LuWifi, LuStar, LuUserCheck,
} from "react-icons/lu";

// ─── UI Types ─────────────────────────────────────────────────────────────────

export interface CardCounts {
  jami:         number;
  asosiy:       number;
  online:       number;
  vip:          number;
  organization: number;
}

export type RowStatus = "active" | "stopped" | "closed" | "confirmed";

export interface AttractionRow {
  id:         number;
  reportId:   number;
  name:       string;
  price:      number;
  roundCount: number;
  cards:      CardCounts;
  paid:       number;
  total:      number;
  status:     RowStatus;
}

// ─── Config ───────────────────────────────────────────────────────────────────

export const STAT_COLS: { key: keyof CardCounts; label: string; color: string; icon: React.ElementType }[] = [
  { key: "jami",         label: "Всего",       color: "var(--text-default)", icon: LuUsers },
  { key: "asosiy",       label: "Offline",     color: "#3b82f6",             icon: LuWifiOff },
  { key: "online",       label: "Online",      color: "#8b5cf6",             icon: LuWifi },
  { key: "vip",          label: "VIP",         color: "#eab308",             icon: LuStar },
  { key: "organization", label: "Организация", color: "#06b6d4",             icon: LuUserCheck },
];

export const TABLE_COLS: { key: keyof CardCounts; label: string; color: string }[] = [
  { key: "jami",         label: "Всего",       color: "var(--text-default)" },
  { key: "asosiy",       label: "Offline",     color: "#3b82f6" },
  { key: "online",       label: "Online",      color: "#8b5cf6" },
  { key: "vip",          label: "VIP",         color: "#eab308" },
  { key: "organization", label: "Организация", color: "#06b6d4" },
];

export const STATUS_CONFIG: Record<RowStatus, { label: string; colorPalette: "gray" | "green" | "red" | "blue" }> = {
  active:    { label: "Активна",      colorPalette: "green" },
  stopped:   { label: "Остановлена",  colorPalette: "gray"  },
  closed:    { label: "Закрыта",      colorPalette: "blue"  },
  confirmed: { label: "Подтверждена", colorPalette: "green" },
};

export const thBase: React.CSSProperties = {
  color: "var(--text-muted)",
  fontSize: 11,
  fontWeight: 600,
  padding: "6px 10px",
  whiteSpace: "nowrap",
  borderBottom: "1px solid var(--border-default)",
  borderRight: "1px solid var(--border-default)",
  background: "var(--bg-hover)",
  textTransform: "uppercase",
  letterSpacing: "0.04em",
};

export const tdBase: React.CSSProperties = {
  fontSize: 13,
  padding: "10px 10px",
  borderBottom: "1px solid var(--border-default)",
  borderRight: "1px solid var(--border-default)",
  whiteSpace: "nowrap",
  color: "var(--text-default)",
};

export function fmt(n: number) {
  return n.toLocaleString("ru-RU");
}
