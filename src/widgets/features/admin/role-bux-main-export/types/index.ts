import React from "react";
import {
  LuUsers, LuWifiOff, LuWifi, LuStar, LuUserCheck, LuShield,
} from "react-icons/lu";

// ─── API Types ────────────────────────────────────────────────────────────────

export type ZReportStatus   = "active" | "open" | "stopped" | "waiting" | "confirmed";
export type UpdateStatusValue = "open" | "stopped" | "closed";

export interface ZReport {
  id:           number;
  attraction:   number;
  operator:     number;
  report_type:  "zreport";
  zreport:      number | null;
  status:       ZReportStatus;
  opened_at:    string;
  stopped_at:   string | null;
  closed_at:    string | null;
  confirmed_at: string | null;
  confirmed_by: number | null;
  total_rounds:     number;
  total_people:     number;
  total_offline:    number;
  total_online:     number;
  total_vip:        number;
  total_guest:      number;
  total_park_staff: number;
  paid_amount:      number;
  total_amount:     number;
  created_at:   string;
}

export interface ZReportStats {
  total:     number;
  open:      number;
  stopped:   number;
  waiting:   number;
  confirmed: number;
}

export interface ZReportTotals {
  total_rounds:     number;
  total_people:     number;
  total_offline:    number;
  total_online:     number;
  total_vip:        number;
  total_guest:      number;
  total_park_staff: number;
  paid_amount:      number;
  total_amount:     number;
}

export interface AttractionWithZReports {
  id:              number;
  name:            string;
  manufacturer:    string;
  category:        number;
  status:          string;
  dashboard_file:  number;
  main_file:       number;
  files:           number[];
  price:           number;
  duration:        number;
  seats:           number;
  age_limit:       number;
  min_height:      number;
  max_weight:      number;
  description:     string;
  zreports:        ZReport[];
}

export interface GetZReportsData {
  stats:       ZReportStats;
  totals:      ZReportTotals;
  attractions: AttractionWithZReports[];
}

export interface ConfirmZReportItem {
  id:     number;
  status: "confirmed";
}

export interface CardCounts {
  jami: number;
  asosiy: number;
  online: number;
  vip: number;
  mehmon: number;
  parkXodim: number;
}

export type RowStatus = "active" | "stopped" | "closed" | "confirmed";

export interface AttractionRow {
  id: number;
  reportId: number;
  name: string;
  price: number;
  roundCount: number;
  cards: CardCounts;
  paid: number;
  total: number;
  status: RowStatus;
}

// ─── Config ───────────────────────────────────────────────────────────────────

export const STAT_COLS: { key: keyof CardCounts; label: string; color: string; icon: React.ElementType }[] = [
  { key: "jami",      label: "Всего",     color: "var(--text-default)", icon: LuUsers },
  { key: "asosiy",   label: "Offline",   color: "#3b82f6",             icon: LuWifiOff },
  { key: "online",   label: "Online",    color: "#8b5cf6",             icon: LuWifi },
  { key: "vip",      label: "VIP",       color: "#eab308",             icon: LuStar },
  { key: "mehmon",   label: "Гость",     color: "#06b6d4",             icon: LuUserCheck },
  { key: "parkXodim",label: "Сотрудник", color: "#22c55e",             icon: LuShield },
];

export const TABLE_COLS: { key: keyof CardCounts; label: string; color: string }[] = [
  { key: "jami",      label: "Всего",     color: "var(--text-default)" },
  { key: "asosiy",   label: "Offline",   color: "#3b82f6" },
  { key: "online",   label: "Online",    color: "#8b5cf6" },
  { key: "vip",      label: "VIP",       color: "#eab308" },
  { key: "mehmon",   label: "Гость",     color: "#06b6d4" },
  { key: "parkXodim",label: "Сотрудник", color: "#22c55e" },
];

export const STATUS_CONFIG: Record<RowStatus, { label: string; colorPalette: "gray" | "green" | "red" | "blue" }> = {
  active:    { label: "Активна",      colorPalette: "green" },
  stopped:   { label: "Stopped",      colorPalette: "gray"  },
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
  return n.toLocaleString("uz-UZ");
}

// ─── Mock data ────────────────────────────────────────────────────────────────

function rng(seed: number) {
  return ((seed * 9301 + 49297) % 233280) / 233280;
}

export function genMockRow(id: number, name: string, price: number): AttractionRow {
  const roundCount = Math.max(1, Math.round(rng(id * 3) * 8));
  const jami       = Math.max(2, Math.round(rng(id * 7) * 14));
  const online     = Math.max(0, Math.round(jami * rng(id * 13) * 0.4));
  const asosiy     = Math.max(0, Math.round((jami - online) * rng(id * 11) * 0.8));
  const vip        = Math.max(0, Math.round(jami * rng(id * 17) * 0.15));
  const mehmon     = Math.max(0, Math.round(jami * rng(id * 19) * 0.12));
  const parkXodim  = Math.max(0, Math.round(jami * rng(id * 23) * 0.05));
  const realJami   = asosiy + online + vip + mehmon + parkXodim;
  const paid       = (asosiy + online) * price;
  return {
    id, reportId: 0, name, price, roundCount,
    cards: { jami: realJami, asosiy, online, vip, mehmon, parkXodim },
    paid, total: paid, status: "closed",
  };
}
