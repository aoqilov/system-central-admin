import React from "react";
import {
  LuUsers,
  LuWifiOff,
  LuWifi,
  LuStar,
  LuUserCheck,
  LuShield,
} from "react-icons/lu";

// ─── API Types ────────────────────────────────────────────────────────────────

export interface AccountingTotals {
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

export interface AccountingAttraction {
  id:             number;
  name:           string;
  manufacturer:   string;
  category:       number;
  status:         string;
  dashboard_file: number;
  main_file:      number;
  files:          number[];
  price:          number;
  duration:       number;
  seats:          number;
  age_limit:      number;
  min_height:     number;
  max_weight:     number;
  description:    string;
}

export interface AccountingAttractionEntry {
  attraction: AccountingAttraction;
  zreport:    AccountingTotals;
}

export interface AccountingReportData {
  start_date:  string;
  end_date:    string;
  totals:      AccountingTotals;
  attractions: AccountingAttractionEntry[];
}

export interface GetAccountingParams {
  date?:       string;
  start_date?: string;
  end_date?:   string;
}

// ─── UI Types ─────────────────────────────────────────────────────────────────

export interface CardCounts {
  jami:      number;
  asosiy:    number;
  online:    number;
  vip:       number;
  mehmon:    number;
  parkXodim: number;
}

export interface AttractionRow {
  id:         number;
  name:       string;
  price:      number;
  roundCount: number;
  cards:      CardCounts;
  paid:       number;
  total:      number;
}

export function fmt(n: number) {
  return n.toLocaleString("uz-UZ");
}

function rng(seed: number) {
  return ((seed * 9301 + 49297) % 233280) / 233280;
}

export function genRow(id: number, name: string, price: number): AttractionRow {
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
    id, name, price, roundCount,
    cards: { jami: realJami, asosiy, online, vip, mehmon, parkXodim },
    paid, total: paid,
  };
}

export const STAT_COLS: {
  key: keyof CardCounts;
  label: string;
  color: string;
  icon: React.ElementType;
}[] = [
  { key: "jami",      label: "Всего",     color: "var(--text-default)", icon: LuUsers },
  { key: "asosiy",    label: "Offline",   color: "#3b82f6",             icon: LuWifiOff },
  { key: "online",    label: "Online",    color: "#8b5cf6",             icon: LuWifi },
  { key: "vip",       label: "VIP",       color: "#eab308",             icon: LuStar },
  { key: "mehmon",    label: "Гость",     color: "#06b6d4",             icon: LuUserCheck },
  { key: "parkXodim", label: "Сотрудник", color: "#22c55e",             icon: LuShield },
];

export const TABLE_COLS: { key: keyof CardCounts; label: string; color: string }[] = [
  { key: "jami",      label: "Всего",     color: "var(--text-default)" },
  { key: "asosiy",    label: "Offline",   color: "#3b82f6" },
  { key: "online",    label: "Online",    color: "#8b5cf6" },
  { key: "vip",       label: "VIP",       color: "#eab308" },
  { key: "mehmon",    label: "Гость",     color: "#06b6d4" },
  { key: "parkXodim", label: "Сотрудник", color: "#22c55e" },
];

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
