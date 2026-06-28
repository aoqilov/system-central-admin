import { useState } from "react";
import dayjs from "dayjs";
import {
  LuCircleCheck,
  LuClock,
  LuBanknote,
  LuCreditCard,
  LuSmartphone,
  LuWallet,
  LuDownload,
  LuChevronLeft,
  LuChevronRight,
} from "react-icons/lu";
import { CusButton } from "@/components/ui/buttons/CusButton";
import { CusBadge } from "@/components/ui/badge/CusBadge";
import { CusCalendar } from "@/components/ui/calendar/CusCalendar";
import { CusDialog } from "@/components/ui/dialog/CusDialog";
import { CusSegment } from "@/components/ui/segment/CusSegment";
import { CalendarDate } from "@internationalized/date";
import type { DateValue } from "@ark-ui/react/date-picker";
import { Dialog } from "@chakra-ui/react";
import PageHeader from "@/widgets/shared-ui/PageHeader";

// ─── Types ────────────────────────────────────────────────────────────────────

interface KassaRow {
  noDiscount: number | null;
  withDiscount: number | null;
}

interface PaymentRow {
  type: string;
  kassas: KassaRow[];
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const PARK_NAME = "Central Park";
const KASSAS = [
  "Kassa 1", "Kassa 2", "Kassa 3", "Kassa 4",
  "Kassa 5", "Kassa 6", "Kassa 7", "Kassa 8",
];

const MOCK_KARTA_SOLD: (number | null)[] = [54, 62, 91, 72, null, null, null, null];

const NULL_KASSA: KassaRow = { noDiscount: null, withDiscount: null };

const MOCK_SENT_AT = "28.06.2026 — 22:14";

const TYPE_CONFIG: Record<string, { icon: React.ElementType; color: string }> = {
  Наличные: { icon: LuBanknote,   color: "#22c55e" },
  UzCard:   { icon: LuCreditCard, color: "#3b82f6" },
  Humo:     { icon: LuCreditCard, color: "#8b5cf6" },
  Click:    { icon: LuSmartphone, color: "#f97316" },
  PayMe:    { icon: LuSmartphone, color: "#ef4444" },
  UZUM:     { icon: LuWallet,     color: "#06b6d4" },
};

const MOCK_ROWS: PaymentRow[] = [
  {
    type: "Наличные",
    kassas: [
      { noDiscount: 20_023_333.35, withDiscount: 21_223_399.99 },
      { noDiscount: 29_106_500,    withDiscount: 29_109_800    },
      { noDiscount: 26_273_333.34, withDiscount: 27_251_000.02 },
      { noDiscount: 25_571_666.67, withDiscount: 27_707_299.99 },
      NULL_KASSA, NULL_KASSA, NULL_KASSA, NULL_KASSA,
    ],
  },
  {
    type: "UzCard",
    kassas: [
      { noDiscount: 27_885_999.99, withDiscount: 29_913_200.01 },
      { noDiscount: 36_317_500,    withDiscount: 39_533_000    },
      { noDiscount: 17_900_000,    withDiscount: 18_990_199.99 },
      { noDiscount: 20_635_666.67, withDiscount: 22_567_600.01 },
      NULL_KASSA, NULL_KASSA, NULL_KASSA, NULL_KASSA,
    ],
  },
  {
    type: "Humo",
    kassas: [
      { noDiscount: 11_596_666.66, withDiscount: 11_911_000    },
      { noDiscount: 14_447_000,    withDiscount: 15_369_400    },
      { noDiscount: 26_759_166.66, withDiscount: 28_482_999.99 },
      { noDiscount: 10_403_666.66, withDiscount: 11_077_400    },
      NULL_KASSA, NULL_KASSA, NULL_KASSA, NULL_KASSA,
    ],
  },
  {
    type: "Click",
    kassas: [
      { noDiscount: 1_150_000, withDiscount: 1_150_000 },
      { noDiscount: 1_300_000, withDiscount: 1_300_000 },
      { noDiscount: 2_700_000, withDiscount: 2_700_000 },
      { noDiscount: 650_000,   withDiscount: 650_000   },
      NULL_KASSA, NULL_KASSA, NULL_KASSA, NULL_KASSA,
    ],
  },
  {
    type: "PayMe",
    kassas: [
      { noDiscount: 4_500_000, withDiscount: 4_500_000 },
      { noDiscount: 200_000,   withDiscount: 200_000   },
      { noDiscount: 3_050_000, withDiscount: 3_050_000 },
      { noDiscount: 1_875_000, withDiscount: 1_875_000 },
      NULL_KASSA, NULL_KASSA, NULL_KASSA, NULL_KASSA,
    ],
  },
  {
    type: "UZUM",
    kassas: [
      { noDiscount: 0, withDiscount: 0 },
      { noDiscount: 0, withDiscount: 0 },
      { noDiscount: 0, withDiscount: 0 },
      { noDiscount: 0, withDiscount: 0 },
      NULL_KASSA, NULL_KASSA, NULL_KASSA, NULL_KASSA,
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtNum(n: number | null): string {
  if (n === null) return "—";
  if (n === 0) return "0";
  return n.toLocaleString("ru-RU", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function colTotal(rows: PaymentRow[], ki: number, field: "noDiscount" | "withDiscount"): number {
  return rows.reduce((s, r) => s + (r.kassas[ki][field] ?? 0), 0);
}

function grandTotal(rows: PaymentRow[], field: "noDiscount" | "withDiscount"): number {
  return rows.reduce((s, r) => r.kassas.reduce((a, k) => a + (k[field] ?? 0), s), 0);
}

function fmtRange(from: string, to: string): string {
  const f = dayjs(from).format("DD.MM.YYYY");
  const t = dayjs(to).format("DD.MM.YYYY");
  return f === t ? f : `${f} — ${t}`;
}

function strToCalDate(s: string): CalendarDate {
  const [y, m, d] = s.split("-").map(Number);
  return new CalendarDate(y, m, d);
}

function calDateToStr(v: DateValue): string {
  return `${v.year}-${String(v.month).padStart(2, "0")}-${String(v.day).padStart(2, "0")}`;
}

// ─── Summary card ─────────────────────────────────────────────────────────────

function SummaryCard({
  icon: Icon, label, value, sub, color,
}: {
  icon: React.ElementType; label: string; value: string; sub?: string; color: string;
}) {
  return (
    <div
      className="rounded-2xl border p-3 flex flex-col gap-2"
      style={{ background: "var(--bg-second)", borderColor: "var(--border-default)" }}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>{label}</span>
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: `${color}18` }}
        >
          <Icon size={15} style={{ color }} />
        </div>
      </div>
      <p className="font-bold leading-none" style={{ fontSize: 22, color: "var(--text-default)" }}>
        {value}
      </p>
      {sub && <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>{sub}</p>}
    </div>
  );
}

// ─── Report table ─────────────────────────────────────────────────────────────

function ReportTable({ rows, dateLabel }: { rows: PaymentRow[]; dateLabel: string }) {
  const thStyle: React.CSSProperties = {
    background: "var(--bg-hover)",
    color: "var(--text-muted)",
    fontSize: 11,
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.04em",
    padding: "8px 12px",
    borderBottom: "1px solid var(--border-default)",
    borderRight: "1px solid var(--border-default)",
    whiteSpace: "nowrap",
    textAlign: "left",
  };

  const tdStyle: React.CSSProperties = {
    fontSize: 12.5,
    padding: "7px 12px",
    borderBottom: "1px solid var(--border-default)",
    borderRight: "1px solid var(--border-default)",
    whiteSpace: "nowrap",
    color: "var(--text-default)",
  };

  const tdNum: React.CSSProperties = {
    ...tdStyle,
    textAlign: "right",
    fontVariantNumeric: "tabular-nums",
  };

  const totalRowStyle: React.CSSProperties = { background: "var(--bg-hover)", fontWeight: 700 };

  const stickyFirst: React.CSSProperties = {
    position: "sticky",
    left: 0,
    zIndex: 1,
    boxShadow: "2px 0 6px rgba(0,0,0,0.12)",
    borderRight: "2px solid var(--border-2)",
  };

  return (
    <div className="rounded-xl border overflow-hidden" style={{ borderColor: "var(--border-default)" }}>
      <div
        className="px-5 py-3 border-b"
        style={{ borderColor: "var(--border-default)", background: "var(--bg-second)" }}
      >
        <p className="font-semibold text-sm" style={{ color: "var(--text-default)" }}>
          Выручка станций по дням
        </p>
        <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
          Название : {PARK_NAME} &nbsp;·&nbsp; Дата: {dateLabel}
        </p>
      </div>

      <div className="overflow-x-auto" style={{ background: "var(--bg-second)" }}>
        <table style={{ borderCollapse: "collapse", width: "100%", minWidth: 500 }}>
          <thead>
            <tr>
              <th style={{ ...thStyle, ...stickyFirst, width: 130, zIndex: 2 }}>Тип оплаты</th>
              {KASSAS.map((k) => (
                <th key={k} style={{ ...thStyle, textAlign: "center" }}>{k}</th>
              ))}
              <th style={{ ...thStyle, textAlign: "center", borderRight: "none" }}>Итого</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => {
              const rowTotal = row.kassas.reduce((s, k) => s + (k.noDiscount ?? 0), 0);
              return (
                <tr key={row.type} style={{ background: "var(--bg-second)" }}>
                  <td style={{ ...tdStyle, ...stickyFirst, background: "var(--bg-second)" }}>
                    {row.type}
                  </td>
                  {row.kassas.map((kassa, ki) => (
                    <td
                      key={ki}
                      style={{
                        ...tdNum,
                        color: kassa.noDiscount === null ? "var(--text-dim)" : "var(--text-default)",
                      }}
                    >
                      {fmtNum(kassa.noDiscount)}
                    </td>
                  ))}
                  <td style={{ ...tdNum, fontWeight: 600, borderRight: "none" }}>
                    {fmtNum(rowTotal)}
                  </td>
                </tr>
              );
            })}

            <tr style={totalRowStyle}>
              <td style={{ ...tdStyle, ...totalRowStyle, ...stickyFirst, background: "var(--bg-hover)" }}>
                Итого
              </td>
              {KASSAS.map((_, ki) => (
                <td key={ki} style={{ ...tdNum, ...totalRowStyle, color: "#60a5fa" }}>
                  {fmtNum(colTotal(rows, ki, "noDiscount"))}
                </td>
              ))}
              <td style={{ ...tdNum, ...totalRowStyle, color: "#22c55e", borderRight: "none" }}>
                {fmtNum(grandTotal(rows, "noDiscount"))}
              </td>
            </tr>

            <tr style={{ background: "var(--bg-main)" }}>
              <td style={{ ...tdStyle, ...stickyFirst, fontWeight: 600, color: "#eab308", background: "var(--bg-main)" }}>
                Продано карт
              </td>
              {MOCK_KARTA_SOLD.map((count, ki) => (
                <td key={ki} style={{ ...tdNum, color: "#eab308", fontWeight: 600 }}>
                  {count !== null ? `${count} шт.` : "—"}
                </td>
              ))}
              <td style={{ ...tdNum, fontWeight: 700, color: "#eab308", borderRight: "none" }}>
                {MOCK_KARTA_SOLD.reduce<number>((s, n) => s + (n ?? 0), 0)} шт.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const TODAY = dayjs().format("YYYY-MM-DD");

export default function RoleBuxMainIncomingKassa() {
  const [dateMode, setDateMode]         = useState<"kunlik" | "oraliq">("kunlik");
  const [date, setDate]                 = useState(TODAY);
  const [dateFrom, setDateFrom]         = useState(TODAY);
  const [dateTo, setDateTo]             = useState(TODAY);
  const [acceptDialog, setAcceptDialog] = useState(false);
  const [acceptedAt, setAcceptedAt]     = useState<string | null>(null);

  const dateLabel =
    dateMode === "kunlik"
      ? dayjs(date).format("DD.MM.YYYY")
      : fmtRange(dateFrom, dateTo);

  const totalNoDiscount   = grandTotal(MOCK_ROWS, "noDiscount");
  const totalWithDiscount = grandTotal(MOCK_ROWS, "withDiscount");

  function handleAccept() {
    setAcceptedAt(dayjs().format("DD.MM.YYYY — HH:mm"));
    setAcceptDialog(false);
  }

  async function exportToExcel() {
    const { Workbook } = await import("exceljs");
    const wb = new Workbook();
    wb.creator = "ParkOps";
    const ws = wb.addWorksheet("Z-Отчёт");

    const colCount = KASSAS.length + 2;
    ws.columns = [{ width: 22 }, ...KASSAS.map(() => ({ width: 18 })), { width: 18 }];

    const titleRow = ws.addRow(["Входящие кассовые отчёты"]);
    ws.mergeCells(titleRow.number, 1, titleRow.number, colCount);
    titleRow.height = 28;
    titleRow.getCell(1).font      = { name: "Calibri", size: 14, bold: true, color: { argb: "FF1F3864" } };
    titleRow.getCell(1).alignment = { horizontal: "left", vertical: "middle" };

    const parkRow = ws.addRow([`Парк: ${PARK_NAME}`]);
    ws.mergeCells(parkRow.number, 1, parkRow.number, colCount);
    parkRow.getCell(1).font      = { name: "Calibri", size: 11, color: { argb: "FF404040" } };
    parkRow.getCell(1).alignment = { horizontal: "left", vertical: "middle" };

    const dateInfoRow = ws.addRow([`Дата: ${dateLabel}`]);
    ws.mergeCells(dateInfoRow.number, 1, dateInfoRow.number, colCount);
    dateInfoRow.getCell(1).font      = { name: "Calibri", size: 11, color: { argb: "FF404040" } };
    dateInfoRow.getCell(1).alignment = { horizontal: "left", vertical: "middle" };

    if (acceptedAt) {
      const accRow = ws.addRow([`Принято: ${acceptedAt}`]);
      ws.mergeCells(accRow.number, 1, accRow.number, colCount);
      accRow.getCell(1).font      = { name: "Calibri", size: 11, bold: true, color: { argb: "FF22C55E" } };
      accRow.getCell(1).alignment = { horizontal: "left", vertical: "middle" };
    }

    const spacer = ws.addRow([]);
    spacer.height = 6;

    const hdr = ws.addRow(["Тип оплаты", ...KASSAS, "Итого"]);
    hdr.height = 28;
    hdr.eachCell({ includeEmpty: true }, (cell, col) => {
      cell.fill      = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1F3864" } };
      cell.font      = { name: "Calibri", size: 11, bold: true, color: { argb: "FFFFFFFF" } };
      cell.alignment = { horizontal: col === 1 ? "left" : "center", vertical: "middle" };
      cell.border    = {
        top: { style: "thin", color: { argb: "FF2D4E8A" } }, bottom: { style: "thin", color: { argb: "FF2D4E8A" } },
        left: { style: "thin", color: { argb: "FF2D4E8A" } }, right: { style: "thin", color: { argb: "FF2D4E8A" } },
      };
    });

    MOCK_ROWS.forEach((row, idx) => {
      const rowTotal = row.kassas.reduce((s, k) => s + (k.noDiscount ?? 0), 0);
      const eRow = ws.addRow([row.type, ...row.kassas.map((k) => k.noDiscount), rowTotal]);
      eRow.height = 20;
      const bg = idx % 2 === 0 ? "FFFFFFFF" : "FFEBF3FB";
      eRow.eachCell({ includeEmpty: true }, (cell, col) => {
        cell.fill   = { type: "pattern", pattern: "solid", fgColor: { argb: bg } };
        cell.font   = { name: "Calibri", size: 11, color: { argb: "FF1F1F1F" } };
        cell.border = {
          top: { style: "thin", color: { argb: "FFAEB9C8" } }, bottom: { style: "thin", color: { argb: "FFAEB9C8" } },
          left: { style: "thin", color: { argb: "FFAEB9C8" } }, right: { style: "thin", color: { argb: "FFAEB9C8" } },
        };
        if (col === 1) {
          cell.alignment = { horizontal: "left", vertical: "middle" };
        } else if (col === colCount) {
          cell.numFmt = "#,##0.00"; cell.alignment = { horizontal: "right", vertical: "middle" };
          cell.font   = { name: "Calibri", size: 11, bold: true, color: { argb: "FF1F1F1F" } };
        } else {
          if (cell.value === null || cell.value === undefined) {
            cell.value = "—"; cell.font = { name: "Calibri", size: 11, color: { argb: "FF9E9E9E" } };
            cell.alignment = { horizontal: "center", vertical: "middle" };
          } else {
            cell.numFmt = "#,##0.00"; cell.alignment = { horizontal: "right", vertical: "middle" };
          }
        }
      });
    });

    const totRow = ws.addRow([
      "Итого",
      ...KASSAS.map((_, ki) => colTotal(MOCK_ROWS, ki, "noDiscount")),
      grandTotal(MOCK_ROWS, "noDiscount"),
    ]);
    totRow.height = 24;
    totRow.eachCell({ includeEmpty: true }, (cell, col) => {
      cell.fill   = { type: "pattern", pattern: "solid", fgColor: { argb: "FFBDD7EE" } };
      cell.font   = { name: "Calibri", size: 11, bold: true, color: { argb: "FF1F3864" } };
      cell.border = {
        top: { style: "medium", color: { argb: "FF1F3864" } }, bottom: { style: "medium", color: { argb: "FF1F3864" } },
        left: { style: "thin", color: { argb: "FF1F3864" } }, right: { style: "thin", color: { argb: "FF1F3864" } },
      };
      cell.alignment = { horizontal: col === 1 ? "left" : "right", vertical: "middle" };
      if (col > 1) cell.numFmt = "#,##0.00";
    });

    const kartaSum = MOCK_KARTA_SOLD.reduce<number>((s, n) => s + (n ?? 0), 0);
    const kartaExRow = ws.addRow([
      "Продано карт",
      ...MOCK_KARTA_SOLD.map((n) => (n !== null ? `${n} шт.` : "—")),
      `${kartaSum} шт.`,
    ]);
    kartaExRow.height = 24;
    kartaExRow.eachCell({ includeEmpty: true }, (cell, col) => {
      cell.fill   = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFF2CC" } };
      cell.font   = { name: "Calibri", size: 11, bold: true, color: { argb: "FF7F6000" } };
      cell.border = {
        top: { style: "thin", color: { argb: "FFD6B656" } }, bottom: { style: "thin", color: { argb: "FFD6B656" } },
        left: { style: "thin", color: { argb: "FFD6B656" } }, right: { style: "thin", color: { argb: "FFD6B656" } },
      };
      cell.alignment = { horizontal: col === 1 ? "left" : "center", vertical: "middle" };
    });

    const buffer = await wb.xlsx.writeBuffer();
    const blob   = new Blob([buffer as ArrayBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);
    const a   = document.createElement("a");
    a.href = url; a.download = `Kassa-kiruvchi_${PARK_NAME}_${dateLabel}.xlsx`;
    document.body.appendChild(a); a.click();
    document.body.removeChild(a); URL.revokeObjectURL(url);
  }

  return (
    <div className="px-4 tablet:px-6 py-5 flex flex-col gap-5 pb-28">
      {/* ── Top bar ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <PageHeader
          title="Входящие отчёты: Касса"
          subtitle="Просмотр и принятие кассовых Z-отчётов"
        />
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <CusSegment
            layout="inline"
            size="sm"
            items={[
              { id: "kunlik", label: "Ежедневно" },
              { id: "oraliq", label: "Период" },
            ]}
            value={dateMode}
            onValueChange={(v) => setDateMode(v as "kunlik" | "oraliq")}
          />

          {dateMode === "kunlik" ? (
            <div
              className="flex items-center rounded-lg border overflow-hidden"
              style={{ background: "var(--bg-hover)", borderColor: "var(--border-default)" }}
            >
              <button
                onClick={() => { setDate(dayjs(date).subtract(1, "day").format("YYYY-MM-DD")); setAcceptedAt(null); }}
                className="flex items-center justify-center px-2.5 h-9 transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                style={{ color: "var(--text-muted)", borderRight: "1px solid var(--border-default)" }}
              >
                <LuChevronLeft size={15} />
              </button>
              <span
                className="text-sm font-semibold px-3"
                style={{ color: "var(--text-default)", minWidth: 96, textAlign: "center" }}
              >
                {dayjs(date).format("DD.MM.YYYY")}
              </span>
              <button
                onClick={() => { setDate(dayjs(date).add(1, "day").format("YYYY-MM-DD")); setAcceptedAt(null); }}
                className="flex items-center justify-center px-2.5 h-9 transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                style={{ color: "var(--text-muted)", borderLeft: "1px solid var(--border-default)" }}
              >
                <LuChevronRight size={15} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div style={{ width: 160 }}>
                <CusCalendar
                  selectionMode="single"
                  placeholder="С"
                  value={[strToCalDate(dateFrom)]}
                  onValueChange={({ value }) => {
                    if (value[0]) { setDateFrom(calDateToStr(value[0])); setAcceptedAt(null); }
                  }}
                  max={strToCalDate(dateTo)}
                />
              </div>
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>→</span>
              <div style={{ width: 160 }}>
                <CusCalendar
                  selectionMode="single"
                  placeholder="По"
                  value={[strToCalDate(dateTo)]}
                  onValueChange={({ value }) => {
                    if (value[0]) { setDateTo(calDateToStr(value[0])); setAcceptedAt(null); }
                  }}
                  min={strToCalDate(dateFrom)}
                />
              </div>
            </div>
          )}

          <CusButton variant="outline" size="sm" onClick={exportToExcel}>
            <LuDownload size={14} /> Скачать Excel
          </CusButton>
        </div>
      </div>

      {/* ── Summary cards ── */}
      <div className="grid grid-cols-4 tablet:grid-cols-7 gap-3">
        <SummaryCard
          icon={LuBanknote}
          label="Общая выручка"
          value={`${(totalNoDiscount / 1_000_000).toFixed(2)} млн`}
          sub="сум"
          color="#3b82f6"
        />
        {MOCK_ROWS.map((row) => {
          const total = row.kassas.reduce((s, k) => s + (k.noDiscount ?? 0), 0);
          const cfg = TYPE_CONFIG[row.type] ?? { icon: LuBanknote, color: "#6b7280" };
          return (
            <SummaryCard
              key={row.type}
              icon={cfg.icon}
              label={row.type}
              value={total >= 1_000_000 ? `${(total / 1_000_000).toFixed(2)} млн` : total.toLocaleString("ru-RU")}
              sub="сум"
              color={cfg.color}
            />
          );
        })}
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
              Отправлено кассой:{" "}
              <span className="font-semibold" style={{ color: "var(--text-default)" }}>
                {MOCK_SENT_AT}
              </span>
            </span>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
              Касс: <b style={{ color: "var(--text-default)" }}>{KASSAS.length}</b>
            </span>
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
              Продано карт:{" "}
              <b style={{ color: "#eab308" }}>
                {MOCK_KARTA_SOLD.reduce<number>((s, n) => s + (n ?? 0), 0)} шт.
              </b>
            </span>
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
              Выручка:{" "}
              <b style={{ color: "#22c55e" }}>
                {(totalWithDiscount / 1_000_000).toFixed(2)} млн сум
              </b>
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

      {/* ── Main table ── */}
      <ReportTable rows={MOCK_ROWS} dateLabel={dateLabel} />

      {/* ── Accept dialog ── */}
      <CusDialog
        open={acceptDialog}
        onClose={() => setAcceptDialog(false)}
        title="Принятие кассового отчёта"
        description={`Вы подтверждаете получение и проверку отчёта за ${dateLabel}?`}
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
            { label: "Парк",          value: PARK_NAME },
            { label: "Период",        value: dateLabel },
            { label: "Касс",          value: `${KASSAS.length} шт.` },
            { label: "Отправлено",    value: MOCK_SENT_AT },
            { label: "Продано карт",  value: `${MOCK_KARTA_SOLD.reduce<number>((s, n) => s + (n ?? 0), 0)} шт.` },
            { label: "Общая выручка", value: `${(totalWithDiscount / 1_000_000).toFixed(2)} млн сум`, bold: true },
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
