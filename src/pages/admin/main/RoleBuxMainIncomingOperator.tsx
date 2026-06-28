import React, { useState } from "react";
import dayjs from "dayjs";
import {
  LuDownload,
  LuPlay,
  LuUsers,
  LuWifi,
  LuWifiOff,
  LuStar,
  LuUserCheck,
  LuShield,
  LuBanknote,
  LuChevronLeft,
  LuChevronRight,
  LuCircleCheck,
  LuClock,
} from "react-icons/lu";
import { CalendarDate } from "@internationalized/date";
import type { DateValue } from "@ark-ui/react/date-picker";
import PageHeader from "@/widgets/shared-ui/PageHeader";
import { CusSegment } from "@/components/ui/segment/CusSegment";
import { CusCalendar } from "@/components/ui/calendar/CusCalendar";
import { CusButton } from "@/components/ui/buttons/CusButton";
import { CusBadge } from "@/components/ui/badge/CusBadge";
import { CusDialog } from "@/components/ui/dialog/CusDialog";
import { Dialog } from "@chakra-ui/react";
import { attractions } from "@/data/attractions";

const MOCK_SENT_AT = "28.06.2026 — 22:47";

// ─── Types ────────────────────────────────────────────────────────────────────

interface CardCounts {
  jami: number;
  asosiy: number;
  online: number;
  vip: number;
  mehmon: number;
  parkXodim: number;
}

interface AttractionRow {
  id: number;
  name: string;
  price: number;
  roundCount: number;
  cards: CardCounts;
  paid: number;
  total: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(n: number) {
  return n.toLocaleString("uz-UZ");
}

function rng(seed: number) {
  return ((seed * 9301 + 49297) % 233280) / 233280;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

function genRow(id: number, name: string, price: number): AttractionRow {
  const roundCount = Math.max(1, Math.round(rng(id * 3) * 8));
  const jami = Math.max(2, Math.round(rng(id * 7) * 14));
  const online = Math.max(0, Math.round(jami * rng(id * 13) * 0.4));
  const asosiy = Math.max(0, Math.round((jami - online) * rng(id * 11) * 0.8));
  const vip = Math.max(0, Math.round(jami * rng(id * 17) * 0.15));
  const mehmon = Math.max(0, Math.round(jami * rng(id * 19) * 0.12));
  const parkXodim = Math.max(0, Math.round(jami * rng(id * 23) * 0.05));
  const realJami = asosiy + online + vip + mehmon + parkXodim;
  const paid = (asosiy + online) * price;
  return {
    id,
    name,
    price,
    roundCount,
    cards: { jami: realJami, asosiy, online, vip, mehmon, parkXodim },
    paid,
    total: paid,
  };
}

const ROWS: AttractionRow[] = attractions.map((a) =>
  genRow(a.id, a.name, a.price),
);

// ─── Config ───────────────────────────────────────────────────────────────────

const STAT_COLS: {
  key: keyof CardCounts;
  label: string;
  color: string;
  icon: React.ElementType;
}[] = [
  { key: "jami", label: "Jami", color: "var(--text-default)", icon: LuUsers },
  { key: "asosiy", label: "Offline", color: "#3b82f6", icon: LuWifiOff },
  { key: "online", label: "Online", color: "#8b5cf6", icon: LuWifi },
  { key: "vip", label: "VIP", color: "#eab308", icon: LuStar },
  { key: "mehmon", label: "Mehmon", color: "#06b6d4", icon: LuUserCheck },
  { key: "parkXodim", label: "Park xodim", color: "#22c55e", icon: LuShield },
];

const TABLE_COLS: { key: keyof CardCounts; label: string; color: string }[] = [
  { key: "jami", label: "Jami", color: "var(--text-default)" },
  { key: "asosiy", label: "Offline", color: "#3b82f6" },
  { key: "online", label: "Online", color: "#8b5cf6" },
  { key: "vip", label: "VIP", color: "#eab308" },
  { key: "mehmon", label: "Mehmon", color: "#06b6d4" },
  { key: "parkXodim", label: "Park xodim", color: "#22c55e" },
];

const thBase: React.CSSProperties = {
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

const tdBase: React.CSSProperties = {
  fontSize: 13,
  padding: "10px 10px",
  borderBottom: "1px solid var(--border-default)",
  borderRight: "1px solid var(--border-default)",
  whiteSpace: "nowrap",
  color: "var(--text-default)",
};

// ─── Component ────────────────────────────────────────────────────────────────

const today = dayjs();
const todayCalendar = new CalendarDate(
  today.year(),
  today.month() + 1,
  today.date(),
);

export default function RoleBuxMainIncomingOperator() {
  const [tab, setTab] = useState("daily");
  const [selectedDay, setSelectedDay] = useState(today);
  const [dateFrom, setDateFrom] = useState<DateValue[]>([todayCalendar]);
  const [dateTo, setDateTo] = useState<DateValue[]>([todayCalendar]);
  const [acceptDialog, setAcceptDialog] = useState(false);
  const [acceptedAt, setAcceptedAt]     = useState<string | null>(null);

  // ── Aggregates ──
  const totalRounds = ROWS.reduce((s, r) => s + r.roundCount, 0);
  const totalRevenue = ROWS.reduce((s, r) => s + r.total, 0);
  const totalPaid = ROWS.reduce((s, r) => s + r.paid, 0);
  const totalCards: CardCounts = {
    jami: ROWS.reduce((s, r) => s + r.cards.jami, 0),
    asosiy: ROWS.reduce((s, r) => s + r.cards.asosiy, 0),
    online: ROWS.reduce((s, r) => s + r.cards.online, 0),
    vip: ROWS.reduce((s, r) => s + r.cards.vip, 0),
    mehmon: ROWS.reduce((s, r) => s + r.cards.mehmon, 0),
    parkXodim: ROWS.reduce((s, r) => s + r.cards.parkXodim, 0),
  };

  function handleAccept() {
    setAcceptedAt(dayjs().format("DD.MM.YYYY — HH:mm"));
    setAcceptDialog(false);
  }

  // ── Date range handlers ──
  function handleFromChange({ value }: { value: DateValue[] }) {
    setDateFrom(value);
    setAcceptedAt(null);
    if (value[0] && dateTo[0] && value[0].compare(dateTo[0]) > 0) {
      setDateTo(value);
    }
  }

  function handleToChange({ value }: { value: DateValue[] }) {
    setDateTo(value);
    setAcceptedAt(null);
    if (value[0] && dateFrom[0] && value[0].compare(dateFrom[0]) < 0) {
      setDateFrom(value);
    }
  }

  function handleExport() {
    const B = "1px solid #cbd5e1";
    const th = (text: string, align = "center") =>
      `<th style="background:#1e3a5f;color:#fff;font-weight:bold;text-align:${align};padding:8px 10px;border:${B};white-space:nowrap;font-size:11pt">${text}</th>`;
    const td = (
      text: string | number,
      align = "center",
      color = "#1e293b",
      bold = false,
    ) =>
      `<td style="padding:6px 10px;border:${B};text-align:${align};color:${color};${bold ? "font-weight:bold;" : ""}font-size:11pt">${text}</td>`;

    const bodyRows = ROWS.map((r, i) => {
      const bg = i % 2 === 0 ? "#ffffff" : "#f1f5f9";
      return `<tr style="background:${bg}">
        ${td(i + 1)}
        ${td(r.name, "left", "#1e293b", true)}
        ${td(r.roundCount, "center", "#3b82f6", true)}
        ${td(r.cards.jami > 0 ? r.cards.jami : "—", "right", "#374151", true)}
        ${td(r.cards.asosiy > 0 ? r.cards.asosiy : "—", "right", "#3b82f6")}
        ${td(r.cards.online > 0 ? r.cards.online : "—", "right", "#8b5cf6")}
        ${td(r.cards.vip > 0 ? r.cards.vip : "—", "right", "#eab308")}
        ${td(r.cards.mehmon > 0 ? r.cards.mehmon : "—", "right", "#06b6d4")}
        ${td(r.cards.parkXodim > 0 ? r.cards.parkXodim : "—", "right", "#22c55e")}
        ${td(fmt(r.paid), "right", "#374151", true)}
        ${td(fmt(r.total), "right", "#22c55e", true)}
      </tr>`;
    }).join("");

    const footerCols = TABLE_COLS.map((c) => {
      const total = ROWS.reduce((s, r) => s + r.cards[c.key], 0);
      const color = c.color === "var(--text-default)" ? "#374151" : c.color;
      return td(total > 0 ? total : "—", "right", color, true);
    }).join("");

    const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel">
<head><meta charset="UTF-8">
<style>body{font-family:Calibri,Arial,sans-serif}table{border-collapse:collapse}</style>
</head><body><table>
<thead><tr>
  ${th("#")}${th("Привлечение", "left")}${th("Round")}
  ${th("Jami")}${th("Offline")}${th("Online")}${th("VIP")}${th("Mehmon")}${th("Park xodim")}
  ${th("Haq to'langan", "right")}${th("Jami summa", "right")}
</tr></thead>
<tbody>${bodyRows}</tbody>
<tfoot><tr style="background:#f1f5f9">
  <td colspan="3" style="padding:6px 10px;border:${B};font-weight:bold;color:#64748b;font-size:11pt">Итого</td>
  ${footerCols}
  ${td(fmt(totalPaid), "right", "#374151", true)}
  ${td(fmt(totalRevenue) + " сум", "right", "#22c55e", true)}
</tr></tfoot>
</table></body></html>`;

    const blob = new Blob(["﻿" + html], {
      type: "application/vnd.ms-excel;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `operator-export-${today.format("YYYY-MM-DD")}.xls`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="p-4 desktop:p-6 space-y-4 pb-8">
      {/* ── Header ── */}
      <div className="flex flex-col gap-3 tablet:flex-row tablet:items-start tablet:justify-between">
        <PageHeader
          title="Экспорт отчёта"
          highlight="операторов"
          subtitle={`${today.format("DD.MM.YYYY")} — все привлечения`}
        />

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <CusSegment
            layout="inline"
            size="sm"
            value={tab}
            onValueChange={setTab}
            items={[
              { id: "daily", label: "Ежедневно" },
              { id: "range", label: "Период" },
            ]}
          />

          {tab === "daily" ? (
            <div
              className="flex items-center rounded-lg border overflow-hidden"
              style={{
                background: "var(--bg-hover)",
                borderColor: "var(--border-default)",
              }}
            >
              <button
                onClick={() => { setSelectedDay((d) => d.subtract(1, "day")); setAcceptedAt(null); }}
                className="flex items-center justify-center px-2.5 h-9 transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                style={{
                  color: "var(--text-muted)",
                  borderRight: "1px solid var(--border-default)",
                }}
              >
                <LuChevronLeft size={15} />
              </button>
              <span
                className="text-sm font-semibold px-3"
                style={{
                  color: "var(--text-default)",
                  minWidth: 96,
                  textAlign: "center",
                }}
              >
                {selectedDay.format("DD.MM.YYYY")}
              </span>
              <button
                onClick={() => { setSelectedDay((d) => d.add(1, "day")); setAcceptedAt(null); }}
                className="flex items-center justify-center px-2.5 h-9 transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                style={{
                  color: "var(--text-muted)",
                  borderLeft: "1px solid var(--border-default)",
                }}
              >
                <LuChevronRight size={15} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div style={{ width: 150 }}>
                <CusCalendar
                  placeholder="С"
                  value={dateFrom}
                  onValueChange={handleFromChange}
                />
              </div>
              <span className="text-sm" style={{ color: "var(--text-muted)" }}>
                —
              </span>
              <div style={{ width: 150 }}>
                <CusCalendar
                  placeholder="По"
                  value={dateTo}
                  min={dateFrom[0]}
                  onValueChange={handleToChange}
                />
              </div>
            </div>
          )}

          <CusButton size="sm" onClick={handleExport}>
            <LuDownload size={14} /> Скачать Excel
          </CusButton>
        </div>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-4 tablet:grid-cols-8 gap-2">
        {/* Round */}
        <div
          className="flex flex-col gap-1.5 rounded-xl border p-3"
          style={{
            background: "var(--bg-second)",
            borderColor: "var(--border-default)",
          }}
        >
          <div className="flex items-center justify-between gap-1">
            <span
              className="text-[10px] font-semibold"
              style={{ color: "var(--text-muted)" }}
            >
              Round
            </span>
            <div
              className="w-5 h-5 rounded-md flex items-center justify-center"
              style={{ background: "#60a5fa18" }}
            >
              <LuPlay size={11} style={{ color: "#60a5fa" }} />
            </div>
          </div>
          <p
            className="font-bold leading-none"
            style={{ fontSize: 20, color: "#60a5fa" }}
          >
            {totalRounds}
          </p>
        </div>

        {/* Card-type cols */}
        {STAT_COLS.map((c) => {
          const val = totalCards[c.key];
          const isDefault = c.color === "var(--text-default)";
          const col = isDefault ? "#6b7280" : c.color;
          return (
            <div
              key={c.key}
              className="flex flex-col gap-1.5 rounded-xl border p-3"
              style={{
                background: "var(--bg-second)",
                borderColor: "var(--border-default)",
              }}
            >
              <div className="flex items-center justify-between gap-1">
                <span
                  className="text-[10px] font-semibold truncate"
                  style={{ color: "var(--text-muted)" }}
                >
                  {c.label}
                </span>
                <div
                  className="w-5 h-5 rounded-md flex items-center justify-center shrink-0"
                  style={{ background: `${col}18` }}
                >
                  <c.icon size={11} style={{ color: col }} />
                </div>
              </div>
              <p
                className="font-bold leading-none"
                style={{
                  fontSize: 20,
                  color: isDefault ? "var(--text-default)" : c.color,
                }}
              >
                {val > 0 ? val : "—"}
              </p>
            </div>
          );
        })}

        {/* Jami summa */}
        <div
          className="flex flex-col gap-1.5 rounded-xl border p-3"
          style={{ background: "var(--bg-second)", borderColor: "#22c55e40" }}
        >
          <div className="flex items-center justify-between gap-1">
            <span
              className="text-[10px] font-semibold truncate"
              style={{ color: "var(--text-muted)" }}
            >
              Jami summa
            </span>
            <div
              className="w-5 h-5 rounded-md flex items-center justify-center shrink-0"
              style={{ background: "#22c55e18" }}
            >
              <LuBanknote size={11} style={{ color: "#22c55e" }} />
            </div>
          </div>
          <p
            className="font-bold leading-none"
            style={{ fontSize: 18, color: "#22c55e" }}
          >
            {fmt(totalRevenue)}
          </p>
          <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>
            сум
          </p>
        </div>
      </div>

      {/* ── Qabul qilish qutisi ── */}
      <div
        className="rounded-2xl border p-4 flex flex-col tablet:flex-row tablet:items-center gap-4"
        style={{
          background: acceptedAt ? "#22c55e0a" : "var(--bg-second)",
          borderColor: acceptedAt ? "#22c55e40" : "var(--border-default)",
        }}
      >
        <div className="flex-1 flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <LuClock size={14} style={{ color: "var(--text-muted)" }} />
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
              Отправлено оператором:{" "}
              <span className="font-semibold" style={{ color: "var(--text-default)" }}>
                {MOCK_SENT_AT}
              </span>
            </span>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
              Attraksiyalar: <b style={{ color: "var(--text-default)" }}>{ROWS.length}</b>
            </span>
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
              Jami round: <b style={{ color: "#60a5fa" }}>{totalRounds}</b>
            </span>
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
              Jami summa: <b style={{ color: "#22c55e" }}>{fmt(totalRevenue)} сум</b>
            </span>
          </div>
        </div>

        {acceptedAt ? (
          <div className="flex items-center gap-2 shrink-0">
            <LuCircleCheck size={16} color="#22c55e" />
            <span className="text-sm font-semibold" style={{ color: "#22c55e" }}>
              Принято
            </span>
            <CusBadge colorPalette="green" variant="subtle" size="sm">
              {acceptedAt}
            </CusBadge>
          </div>
        ) : (
          <CusButton
            colorPalette="green"
            size="sm"
            className="shrink-0"
            onClick={() => setAcceptDialog(true)}
          >
            <LuCircleCheck size={14} /> Принять отчёт
          </CusButton>
        )}
      </div>

      {/* ── Table ── */}
      <div
        className="rounded-2xl border overflow-hidden"
        style={{
          background: "var(--bg-second)",
          borderColor: "var(--border-default)",
        }}
      >
        <div
          className="px-5 py-3.5 border-b"
          style={{ borderColor: "var(--border-default)" }}
        >
          <p
            className="text-sm font-semibold"
            style={{ color: "var(--text-default)" }}
          >
            Все привлечения — экспорт отчёта
          </p>
        </div>

        <div className="overflow-x-auto">
          <table
            style={{
              borderCollapse: "collapse",
              width: "100%",
              minWidth: 1000,
            }}
          >
            <thead>
              {/* Row 1 */}
              <tr>
                <th
                  rowSpan={2}
                  style={{
                    ...thBase,
                    textAlign: "center",
                    paddingLeft: 12,
                    paddingRight: 12,
                    width: 40,
                  }}
                >
                  #
                </th>
                <th
                  rowSpan={2}
                  style={{
                    ...thBase,
                    textAlign: "left",
                    paddingLeft: 16,
                    minWidth: 180,
                  }}
                >
                  Привлечение
                </th>
                <th rowSpan={2} style={{ ...thBase, textAlign: "center" }}>
                  Round
                </th>
                <th
                  colSpan={TABLE_COLS.length}
                  style={{ ...thBase, textAlign: "center", paddingBottom: 16 }}
                >
                  Karta turi
                </th>
                <th
                  rowSpan={2}
                  style={{ ...thBase, textAlign: "right", lineHeight: 1.4 }}
                >
                  <span style={{ display: "block" }}>Haq to'langan</span>
                  <span
                    style={{
                      display: "block",
                      fontWeight: 400,
                      fontSize: 10,
                      color: "var(--text-dim)",
                      textTransform: "none",
                      letterSpacing: 0,
                    }}
                  >
                    (online+offline) × narx
                  </span>
                </th>
                <th
                  rowSpan={2}
                  style={{ ...thBase, textAlign: "right", borderRight: "none" }}
                >
                  Jami summa
                </th>
              </tr>

              {/* Row 2 — card sub-columns */}
              <tr>
                {TABLE_COLS.map((c) => (
                  <th
                    key={c.key}
                    style={{
                      ...thBase,
                      textAlign: "right",
                      color: c.color,
                      paddingTop: 3,
                    }}
                  >
                    {c.label}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {ROWS.map((row, ri) => (
                <tr key={row.id}>
                  {/* # */}
                  <td
                    style={{
                      ...tdBase,
                      textAlign: "center",
                      color: "var(--text-dim)",
                      fontSize: 12,
                    }}
                  >
                    {ri + 1}
                  </td>

                  {/* Attraksiya nomi */}
                  <td style={{ ...tdBase, paddingLeft: 16, fontWeight: 600 }}>
                    {row.name}
                  </td>

                  {/* Round */}
                  <td style={{ ...tdBase, textAlign: "center" }}>
                    <span
                      className="inline-block px-2 py-0.5 rounded-lg text-sm font-bold"
                      style={{ background: "#3b82f618", color: "#60a5fa" }}
                    >
                      {row.roundCount}
                    </span>
                  </td>

                  {/* Card type columns */}
                  {TABLE_COLS.map((c, i) => {
                    const val = row.cards[c.key];
                    const isDefault = c.color === "var(--text-default)";
                    return (
                      <td
                        key={c.key}
                        style={{
                          ...tdBase,
                          textAlign: "right",
                          fontWeight: val > 0 ? (i === 0 ? 700 : 600) : 400,
                          color:
                            val > 0
                              ? isDefault
                                ? "var(--text-default)"
                                : c.color
                              : "var(--text-dim)",
                        }}
                      >
                        {val > 0 ? val : "—"}
                      </td>
                    );
                  })}

                  {/* Haq to'langan */}
                  <td
                    style={{ ...tdBase, textAlign: "right", fontWeight: 600 }}
                  >
                    {fmt(row.paid)}
                  </td>

                  {/* Jami summa */}
                  <td
                    style={{
                      ...tdBase,
                      textAlign: "right",
                      borderRight: "none",
                    }}
                  >
                    <p
                      className="font-bold text-sm"
                      style={{ color: "var(--text-default)" }}
                    >
                      {fmt(row.total)}
                    </p>
                    <p
                      className="text-[10px]"
                      style={{ color: "var(--text-muted)" }}
                    >
                      сум
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>

            {/* Footer */}
            <tfoot>
              <tr
                style={{
                  borderTop: "2px solid var(--border-default)",
                  background: "var(--bg-hover)",
                }}
              >
                <td
                  colSpan={3}
                  style={{
                    ...tdBase,
                    paddingLeft: 16,
                    fontWeight: 700,
                    color: "var(--text-muted)",
                    fontSize: 12,
                  }}
                >
                  Итого
                </td>
                {TABLE_COLS.map((c) => {
                  const total = ROWS.reduce((s, r) => s + r.cards[c.key], 0);
                  const isDefault = c.color === "var(--text-default)";
                  return (
                    <td
                      key={c.key}
                      style={{
                        ...tdBase,
                        textAlign: "right",
                        fontWeight: 700,
                        fontSize: 13,
                        color: isDefault ? "var(--text-default)" : c.color,
                      }}
                    >
                      {total > 0 ? total : "—"}
                    </td>
                  );
                })}
                <td
                  style={{
                    ...tdBase,
                    textAlign: "right",
                    fontWeight: 700,
                    fontSize: 13,
                  }}
                >
                  {fmt(totalPaid)}
                </td>
                <td
                  style={{
                    ...tdBase,
                    textAlign: "right",
                    fontWeight: 700,
                    fontSize: 13,
                    color: "#22c55e",
                    borderRight: "none",
                  }}
                >
                  {fmt(totalRevenue)}
                  <span
                    className="block text-[10px] font-normal"
                    style={{ color: "var(--text-muted)" }}
                  >
                    сум
                  </span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* ── Accept dialog ── */}
      <CusDialog
        open={acceptDialog}
        onClose={() => setAcceptDialog(false)}
        title="Принятие отчёта операторов"
        description={`Вы подтверждаете получение и проверку отчёта за ${selectedDay.format("DD.MM.YYYY")}?`}
        size="sm"
        footer={
          <>
            <Dialog.ActionTrigger asChild>
              <CusButton variant="outline">Отмена</CusButton>
            </Dialog.ActionTrigger>
            <CusButton colorPalette="green" onClick={handleAccept}>
              <LuCircleCheck size={14} /> Принять
            </CusButton>
          </>
        }
      >
        <div className="flex flex-col gap-0">
          {[
            { label: "Дата",          value: selectedDay.format("DD.MM.YYYY") },
            { label: "Отправлено",    value: MOCK_SENT_AT },
            { label: "Attraksiyalar", value: `${ROWS.length} та` },
            { label: "Jami round",    value: `${totalRounds}` },
            { label: "Jami summa",    value: `${fmt(totalRevenue)} сум`, bold: true },
          ].map((row) => (
            <div
              key={row.label}
              className="flex justify-between py-2.5 border-b last:border-0"
              style={{ borderColor: "var(--border-default)" }}
            >
              <span className="text-sm" style={{ color: "var(--text-muted)" }}>{row.label}</span>
              <span
                className="text-sm"
                style={{ color: "var(--text-default)", fontWeight: row.bold ? 700 : 500 }}
              >
                {row.value}
              </span>
            </div>
          ))}
        </div>
      </CusDialog>
    </div>
  );
}
