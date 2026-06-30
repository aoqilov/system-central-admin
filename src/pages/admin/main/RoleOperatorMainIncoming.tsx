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
  LuCheck,
  LuX,
  LuChevronLeft,
  LuChevronRight,
  LuSend,
  LuCircleCheck,
  LuClock,
  LuFerrisWheel,
} from "react-icons/lu";
import { CalendarDate } from "@internationalized/date";
import type { DateValue } from "@ark-ui/react/date-picker";
import PageHeader from "@/widgets/shared-ui/PageHeader";
import { CusSegment } from "@/components/ui/segment/CusSegment";
import { CusCalendar } from "@/components/ui/calendar/CusCalendar";
import { CusButton } from "@/components/ui/buttons/CusButton";
import { CusBadge } from "@/components/ui/badge/CusBadge";
import { CusDialog } from "@/components/ui/dialog/CusDialog";
import { CusTextArea } from "@/components/ui/inputs/CusTextArea";
import { Dialog } from "@chakra-ui/react";
import { attractions } from "@/data/attractions";

// ─── Types ────────────────────────────────────────────────────────────────────

interface CardCounts {
  jami: number;
  asosiy: number;
  online: number;
  vip: number;
  mehmon: number;
  parkXodim: number;
}

type RowStatus = "pending" | "confirmed" | "rejected";

interface AttractionRow {
  id: number;
  name: string;
  price: number;
  roundCount: number;
  cards: CardCounts;
  paid: number;
  total: number;
  smenaClose: boolean;
  status: RowStatus;
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
    smenaClose: false,
    status: "pending",
  };
}

const INITIAL_ROWS: AttractionRow[] = attractions.map((a) =>
  genRow(a.id, a.name, a.price),
);

// ─── Config ───────────────────────────────────────────────────────────────────

const STAT_COLS: {
  key: keyof CardCounts;
  label: string;
  color: string;
  icon: React.ElementType;
}[] = [
  { key: "jami", label: "Всего", color: "var(--text-default)", icon: LuUsers },
  { key: "asosiy", label: "Offline", color: "#3b82f6", icon: LuWifiOff },
  { key: "online", label: "Online", color: "#8b5cf6", icon: LuWifi },
  { key: "vip", label: "VIP", color: "#eab308", icon: LuStar },
  { key: "mehmon", label: "Гость", color: "#06b6d4", icon: LuUserCheck },
  { key: "parkXodim", label: "Сотрудник", color: "#22c55e", icon: LuShield },
];

const TABLE_COLS: { key: keyof CardCounts; label: string; color: string }[] = [
  { key: "jami", label: "Всего", color: "var(--text-default)" },
  { key: "asosiy", label: "Offline", color: "#3b82f6" },
  { key: "online", label: "Online", color: "#8b5cf6" },
  { key: "vip", label: "VIP", color: "#eab308" },
  { key: "mehmon", label: "Гость", color: "#06b6d4" },
  { key: "parkXodim", label: "Сотрудник", color: "#22c55e" },
];

const STATUS_CONFIG: Record<
  RowStatus,
  { label: string; colorPalette: "gray" | "green" | "red" }
> = {
  pending: { label: "Ожидание", colorPalette: "gray" },
  confirmed: { label: "Подтверждено", colorPalette: "green" },
  rejected: { label: "Отклонено", colorPalette: "red" },
};

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

// ─── Toggle ───────────────────────────────────────────────────────────────────

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      style={{
        width: 32,
        height: 18,
        borderRadius: 9,
        background: on ? "#22c55e" : "var(--border-default)",
        position: "relative",
        border: "none",
        cursor: "pointer",
        flexShrink: 0,
        padding: 0,
        transition: "background 0.15s",
      }}
    >
      <span
        style={{
          display: "block",
          width: 12,
          height: 12,
          borderRadius: "50%",
          background: "#fff",
          position: "absolute",
          top: 3,
          left: on ? 17 : 3,
          transition: "left 0.15s",
        }}
      />
    </button>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

const today = dayjs();
const todayCalendar = new CalendarDate(
  today.year(),
  today.month() + 1,
  today.date(),
);

export default function RoleOperatorMainIncoming() {
  const [tab, setTab] = useState("daily");
  const [selectedDay, setSelectedDay] = useState(today);
  const [dateFrom, setDateFrom] = useState<DateValue[]>([todayCalendar]);
  const [dateTo, setDateTo] = useState<DateValue[]>([todayCalendar]);
  const [rows, setRows] = useState<AttractionRow[]>(INITIAL_ROWS);
  const [sendDialog, setSendDialog] = useState(false);
  const [note, setNote] = useState("");
  const [sentAt, setSentAt] = useState<string | null>(null);

  // ── Aggregates ──
  const totalRounds = rows.reduce((s, r) => s + r.roundCount, 0);
  const totalRevenue = rows.reduce((s, r) => s + r.total, 0);
  const totalPaid = rows.reduce((s, r) => s + r.paid, 0);
  const totalCards: CardCounts = {
    jami: rows.reduce((s, r) => s + r.cards.jami, 0),
    asosiy: rows.reduce((s, r) => s + r.cards.asosiy, 0),
    online: rows.reduce((s, r) => s + r.cards.online, 0),
    vip: rows.reduce((s, r) => s + r.cards.vip, 0),
    mehmon: rows.reduce((s, r) => s + r.cards.mehmon, 0),
    parkXodim: rows.reduce((s, r) => s + r.cards.parkXodim, 0),
  };

  // ── Date range handlers ──
  function handleFromChange({ value }: { value: DateValue[] }) {
    setDateFrom(value);
    if (value[0] && dateTo[0] && value[0].compare(dateTo[0]) > 0) {
      setDateTo(value);
    }
  }

  function handleToChange({ value }: { value: DateValue[] }) {
    setDateTo(value);
    if (value[0] && dateFrom[0] && value[0].compare(dateFrom[0]) < 0) {
      setDateFrom(value);
    }
  }

  // ── Handlers ──
  function toggleSmena(id: number) {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, smenaClose: !r.smenaClose } : r)),
    );
  }

  function setStatus(id: number, status: RowStatus) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
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

    const statusColor: Record<RowStatus, string> = {
      pending: "#6b7280",
      confirmed: "#16a34a",
      rejected: "#dc2626",
    };

    const bodyRows = rows
      .map((r, i) => {
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
        ${td(STATUS_CONFIG[r.status].label, "center", statusColor[r.status], true)}
      </tr>`;
      })
      .join("");

    const footerCols = TABLE_COLS.map((c) => {
      const total = rows.reduce((s, r) => s + r.cards[c.key], 0);
      const color = c.color === "var(--text-default)" ? "#374151" : c.color;
      return td(total > 0 ? total : "—", "right", color, true);
    }).join("");

    const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel">
<head><meta charset="UTF-8">
<style>body{font-family:Calibri,Arial,sans-serif}table{border-collapse:collapse}</style>
</head><body><table>
<thead><tr>
  ${th("#")}${th("Привлечение", "left")}${th("Round")}
  ${th("Всего")}${th("Offline")}${th("Online")}${th("VIP")}${th("Гость")}${th("Сотрудник")}
  ${th("Оплачено", "right")}${th("Итого", "right")}${th("Статус")}
</tr></thead>
<tbody>${bodyRows}</tbody>
<tfoot><tr style="background:#f1f5f9">
  <td colspan="3" style="padding:6px 10px;border:${B};font-weight:bold;color:#64748b;font-size:11pt">Итого</td>
  ${footerCols}
  ${td(fmt(totalPaid), "right", "#374151", true)}
  ${td(fmt(totalRevenue) + " сум", "right", "#22c55e", true)}
  <td style="border:${B}"></td>
</tr></tfoot>
</table></body></html>`;

    const blob = new Blob(["﻿" + html], {
      type: "application/vnd.ms-excel;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `operator-report-${today.format("YYYY-MM-DD")}.xls`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <div className="p-4 desktop:p-6 space-y-4 pb-8">
        {/* ── Header ── */}
        <div className="flex flex-col gap-3 tablet:flex-row tablet:items-start tablet:justify-between">
          <PageHeader
            title="Ежедневный отчёт"
            highlight="операторов"
            subtitle={`${today.format("DD.MM.YYYY")} — все привлечения`}
          />
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
                Итого
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

        {/* ── Send to accounting box ── */}
        <div
          className="rounded-2xl border p-4 flex flex-col tablet:flex-row tablet:items-center gap-4"
          style={{
            background: sentAt ? "#22c55e0a" : "var(--bg-second)",
            borderColor: sentAt ? "#22c55e40" : "var(--border-default)",
          }}
        >
          {/* Left: info */}
          <div className="flex-1 flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              {sentAt ? (
                <LuCircleCheck size={16} style={{ color: "#22c55e" }} />
              ) : (
                <LuSend size={16} style={{ color: "#3b82f6" }} />
              )}
              <p
                className="font-semibold text-sm"
                style={{ color: sentAt ? "#22c55e" : "var(--text-default)" }}
              >
                {sentAt ? "Отправлено в бухгалтерию" : "Отправить в бухгалтерию"}
              </p>
              {sentAt && (
                <span
                  className="text-xs"
                  style={{ color: "var(--text-muted)" }}
                >
                  <LuClock
                    size={11}
                    style={{ display: "inline", marginRight: 3 }}
                  />
                  {sentAt}
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-x-5 gap-y-1">
              {[
                { icon: LuFerrisWheel, label: `${rows.length} привл.` },
                { icon: LuPlay, label: `${totalRounds} round` },
                { icon: LuUsers, label: `${totalCards.jami} карт` },
                { icon: LuBanknote, label: `${fmt(totalRevenue)} сум` },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-1.5">
                  <Icon size={12} style={{ color: "var(--text-muted)" }} />
                  <span
                    className="text-xs"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: button */}
          {sentAt ? (
            <CusBadge colorPalette="green" dot size="md">
              Отправлено
            </CusBadge>
          ) : (
            <CusButton
              colorPalette="blue"
              size="sm"
              onClick={() => {
                setNote("");
                setSendDialog(true);
              }}
            >
              <LuSend size={14} /> Отправить в бухгалтерию
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
              Все привлечения — ежедневный отчёт
            </p>
          </div>

          <div className="overflow-x-auto">
            <table
              style={{
                borderCollapse: "collapse",
                width: "100%",
                minWidth: 1280,
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
                    style={{
                      ...thBase,
                      textAlign: "center",
                      paddingBottom: 16,
                    }}
                  >
                    Тип карты
                  </th>
                  <th
                    rowSpan={2}
                    style={{ ...thBase, textAlign: "right", lineHeight: 1.4 }}
                  >
                    <span style={{ display: "block" }}>Оплачено</span>
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
                      (онлайн+офлайн) × цена
                    </span>
                  </th>
                  <th rowSpan={2} style={{ ...thBase, textAlign: "right" }}>
                    Итого
                  </th>
                  <th
                    rowSpan={2}
                    style={{
                      ...thBase,
                      textAlign: "center",
                      borderRight: "none",
                      minWidth: 280,
                    }}
                  >
                    Действие
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
                {rows.map((row, ri) => (
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
                    <td style={{ ...tdBase, textAlign: "right" }}>
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

                    {/* Action */}
                    <td style={{ ...tdBase, borderRight: "none" }}>
                      {row.status === "pending" ? (
                        <div className="flex items-center gap-2 flex-wrap">
                          {/* <label className="flex items-center gap-1.5 cursor-pointer">
                          <Toggle on={row.smenaClose} onToggle={() => toggleSmena(row.id)} />
                          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                            Smenani yopdi
                          </span>
                        </label> */}
                          <CusButton
                            size="xs"
                            colorPalette="green"
                            isDisabled={!row.smenaClose}
                            onClick={() => setStatus(row.id, "confirmed")}
                          >
                            <LuCheck size={11} /> Проверено
                          </CusButton>
                          {/* <CusButton
                          size="xs"
                          colorPalette="red"
                          onClick={() => setStatus(row.id, "rejected")}
                        >
                          <LuX size={11} /> Otkaz
                        </CusButton> */}
                        </div>
                      ) : (
                        <CusBadge
                          colorPalette={STATUS_CONFIG[row.status].colorPalette}
                          dot
                        >
                          {STATUS_CONFIG[row.status].label}
                        </CusBadge>
                      )}
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
                    const total = rows.reduce((s, r) => s + r.cards[c.key], 0);
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
                  <td style={{ ...tdBase, borderRight: "none" }} />
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>

      {/* ── Send dialog ── */}
      <CusDialog
        open={sendDialog}
        onClose={() => setSendDialog(false)}
        title="Отправить в бухгалтерию"
        size="sm"
        footer={
          <>
            <Dialog.ActionTrigger asChild>
              <CusButton variant="outline">Отмена</CusButton>
            </Dialog.ActionTrigger>
            <CusButton
              colorPalette="blue"
              onClick={() => {
                setSentAt(dayjs().format("HH:mm, DD.MM.YYYY"));
                setSendDialog(false);
              }}
            >
              <LuSend size={14} /> Отправить
            </CusButton>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          {/* Summary rows */}
          <div>
            {[
              {
                label: "Дата",
                value:
                  tab === "daily"
                    ? selectedDay.format("DD.MM.YYYY")
                    : `${dateFrom[0] ?? "—"} — ${dateTo[0] ?? "—"}`,
              },
              { label: "Привлечений", value: `${rows.length}` },
              { label: "Раундов", value: `${totalRounds}` },
              { label: "Карт", value: `${totalCards.jami}` },
              {
                label: "Итого",
                value: `${fmt(totalRevenue)} сум`,
                bold: true,
              },
            ].map((row) => (
              <div
                key={row.label}
                className="flex justify-between py-2.5 border-b last:border-0"
                style={{ borderColor: "var(--border-default)" }}
              >
                <span
                  className="text-sm"
                  style={{ color: "var(--text-muted)" }}
                >
                  {row.label}
                </span>
                <span
                  className="text-sm"
                  style={{
                    color: "var(--text-default)",
                    fontWeight: row.bold ? 700 : 500,
                  }}
                >
                  {row.value}
                </span>
              </div>
            ))}
          </div>

          {/* Note */}
          <CusTextArea
            label="Примечание (необязательно)"
            placeholder="Дополнительная информация..."
            autoresize
            maxH="120px"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
      </CusDialog>
    </>
  );
}
