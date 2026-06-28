import { useState } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import {
  LuBanknote,
  LuWallet,
  LuCreditCard,
  LuSmartphone,
  LuTrendingUp,
  LuUserCheck,
  LuCheck,
  LuX,
  LuSend,
  LuFileText,
  LuCircleCheck,
  LuCircleX,
  LuClock,
  LuLayoutGrid,
  LuTable2,
  LuTriangleAlert,
  LuChevronDown,
  LuChevronUp,
  LuCalendar,
} from "react-icons/lu";
import { CusButton } from "@/components/ui/buttons/CusButton";
import { CusBadge } from "@/components/ui/badge/CusBadge";
import { CusSegment } from "@/components/ui/segment/CusSegment";
import { CusTable, type ColumnDef } from "@/components/ui/table/CusTable";
import PageHeader from "@/widgets/shared-ui/PageHeader";

// ─── Types ────────────────────────────────────────────────────────────────────

interface KassaReport {
  id: number;
  name: string;
  kassir: string;
  startTime: string;
  endTime: string;
  naqd: number;
  uzcard: number;
  humo: number;
  uzumbank: number;
  click: number;
  payme: number;
  tx: number;
  kartaSotildi: number;
  kartaReg: number;
}

type ReportStatus = "pending" | "confirmed" | "rejected";

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_KASSAS: KassaReport[] = [
  { id: 1, name: "Kassa #1", kassir: "Abdullayev Jasur",  startTime: "09:00", endTime: "18:45", naqd: 265_000, uzcard: 180_000, humo: 110_000, uzumbank: 75_000,  click: 65_000,  payme: 80_000,  tx: 12, kartaSotildi: 54, kartaReg: 31 },
  { id: 2, name: "Kassa #2", kassir: "Toshmatov Sardor", startTime: "08:30", endTime: "18:30", naqd: 312_000, uzcard: 220_000, humo: 95_000,  uzumbank: 60_000,  click: 45_000,  payme: 70_000,  tx: 15, kartaSotildi: 62, kartaReg: 28 },
  { id: 3, name: "Kassa #3", kassir: "Nazarova Dilnoza", startTime: "09:00", endTime: "19:00", naqd: 198_000, uzcard: 145_000, humo: 88_000,  uzumbank: 55_000,  click: 38_000,  payme: 62_000,  tx: 9,  kartaSotildi: 41, kartaReg: 22 },
  { id: 4, name: "Kassa #4", kassir: "Karimov Alisher",  startTime: "08:45", endTime: "18:50", naqd: 445_000, uzcard: 310_000, humo: 125_000, uzumbank: 90_000,  click: 72_000,  payme: 95_000,  tx: 18, kartaSotildi: 78, kartaReg: 35 },
  { id: 5, name: "Kassa #5", kassir: "Yusupova Malika",  startTime: "09:15", endTime: "18:15", naqd: 175_000, uzcard: 130_000, humo: 72_000,  uzumbank: 48_000,  click: 32_000,  payme: 55_000,  tx: 8,  kartaSotildi: 36, kartaReg: 19 },
  { id: 6, name: "Kassa #6", kassir: "Rahimov Bobur",    startTime: "08:00", endTime: "19:30", naqd: 520_000, uzcard: 385_000, humo: 145_000, uzumbank: 105_000, click: 88_000,  payme: 112_000, tx: 22, kartaSotildi: 91, kartaReg: 44 },
  { id: 7, name: "Kassa #7", kassir: "Xasanova Zulfiya", startTime: "09:30", endTime: "18:00", naqd: 142_000, uzcard: 98_000,  humo: 65_000,  uzumbank: 40_000,  click: 28_000,  payme: 45_000,  tx: 7,  kartaSotildi: 29, kartaReg: 15 },
  { id: 8, name: "Kassa #8", kassir: "Mirzayev Sherzod", startTime: "08:15", endTime: "19:15", naqd: 388_000, uzcard: 275_000, humo: 118_000, uzumbank: 82_000,  click: 68_000,  payme: 88_000,  tx: 17, kartaSotildi: 72, kartaReg: 38 },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(n: number) {
  return n.toLocaleString();
}

function total(k: KassaReport) {
  return k.naqd + k.uzcard + k.humo + k.uzumbank + k.click + k.payme;
}

// ─── StatCard ─────────────────────────────────────────────────────────────────

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
  color: string;
}) {
  return (
    <div
      className="rounded-2xl border p-3 flex flex-col gap-2 shrink-0"
      style={{ background: "var(--bg-main)", borderColor: "var(--border-default)", minWidth: 176 }}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>{label}</span>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `${color}18` }}>
          <Icon size={15} style={{ color }} />
        </div>
      </div>
      <p className="font-bold leading-none" style={{ fontSize: 22, color: "var(--text-default)" }}>{value}</p>
      {sub && <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>{sub}</p>}
    </div>
  );
}

// ─── KassaCard ────────────────────────────────────────────────────────────────

function KassaCard({
  kassa,
  status,
  smenaYopildi,
  onSmenaToggle,
  onConfirm,
  onReject,
}: {
  kassa: KassaReport;
  status: ReportStatus;
  smenaYopildi: boolean;
  onSmenaToggle: () => void;
  onConfirm: () => void;
  onReject: () => void;
}) {
  const tot = total(kassa);
  const isConfirmed = status === "confirmed";
  const isRejected = status === "rejected";
  const isPending = status === "pending";

  return (
    <div
      className="rounded-2xl border overflow-hidden"
      style={{
        background: "var(--bg-second)",
        borderColor: isConfirmed ? "#22c55e50" : isRejected ? "#ef444450" : "var(--border-default)",
      }}
    >
      {/* ── Header ── */}
      <div
        className="flex items-center gap-3 px-5 py-3.5 border-b"
        style={{
          borderColor: isConfirmed ? "#22c55e30" : isRejected ? "#ef444430" : "var(--border-default)",
          background: isConfirmed ? "#22c55e08" : isRejected ? "#ef444408" : "transparent",
        }}
      >
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: isConfirmed ? "#22c55e18" : isRejected ? "#ef444418" : "var(--bg-hover)" }}
        >
          {isConfirmed ? (
            <LuCircleCheck size={16} style={{ color: "#22c55e" }} />
          ) : isRejected ? (
            <LuCircleX size={16} style={{ color: "#ef4444" }} />
          ) : (
            <LuFileText size={16} style={{ color: "var(--text-muted)" }} />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-sm" style={{ color: "var(--text-default)" }}>
              {kassa.name}
            </span>
            <CusBadge colorPalette={isConfirmed ? "green" : isRejected ? "red" : "gray"} variant="subtle" size="sm">
              {isConfirmed ? "Подтверждено" : isRejected ? "Отказ" : "Ожидание"}
            </CusBadge>
          </div>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
            {kassa.kassir} · {kassa.startTime} → {kassa.endTime} · {kassa.tx} транзакции
          </p>
        </div>

        <div className="shrink-0 text-right">
          <p className="font-bold text-sm" style={{ color: "var(--text-default)" }}>{fmt(tot)} сум</p>
          <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>итого</p>
        </div>
      </div>

      {/* ── Stat cards ── */}
      <div className="overflow-x-auto px-4 py-4">
        <div className="flex gap-3">
          <StatCard icon={LuBanknote}  label="Выручка за день" value={fmt(tot)}             sub="сум"     color="#3b82f6" />
          <StatCard icon={LuWallet}    label="Наличные"        value={fmt(kassa.naqd)}      sub="сум"     color="#22c55e" />
          <StatCard icon={LuCreditCard} label="UzCard"         value={fmt(kassa.uzcard)}    sub="сум"     color="#3b82f6" />
          <StatCard icon={LuCreditCard} label="Humo"           value={fmt(kassa.humo)}      sub="сум"     color="#8b5cf6" />
          <StatCard icon={LuSmartphone} label="UzumBank"       value={fmt(kassa.uzumbank)}  sub="сум"     color="#06b6d4" />
          <StatCard icon={LuSmartphone} label="Click"          value={fmt(kassa.click)}     sub="сум"     color="#f97316" />
          <StatCard icon={LuSmartphone} label="Payme"          value={fmt(kassa.payme)}     sub="сум"     color="#ef4444" />
          <StatCard icon={LuTrendingUp} label="Продано карт"   value={String(kassa.kartaSotildi)} sub="сегодня" color="#eab308" />
          <StatCard icon={LuUserCheck}  label="Рег. карт"      value={String(kassa.kartaReg)}     sub="сегодня" color="#06b6d4" />
        </div>
      </div>

      {/* ── Footer actions ── */}
      <div className="flex items-center justify-end gap-2 px-4 py-3 border-t" style={{ borderColor: "var(--border-default)" }}>
        {isPending ? (
          <>
            <CusButton size="xs" colorPalette={smenaYopildi ? "green" : "gray"} variant={smenaYopildi ? "surface" : "outline"} onClick={onSmenaToggle}>
              {smenaYopildi ? <LuCheck size={13} /> : <LuClock size={13} />}
              Смена закрыта?
            </CusButton>
            <CusButton size="xs" colorPalette="green" variant="outline" onClick={onConfirm}>
              <LuCheck size={13} /> Проверил
            </CusButton>
            <CusButton size="xs" colorPalette="red" variant="outline" onClick={onReject}>
              <LuX size={13} /> Отказ
            </CusButton>
          </>
        ) : isConfirmed ? (
          <div className="flex items-center gap-1.5 text-sm font-medium py-1" style={{ color: "#22c55e" }}>
            <LuCircleCheck size={15} /> Подтверждено
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-sm font-medium py-1" style={{ color: "#ef4444" }}>
            <LuCircleX size={15} /> Отклонено
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Unsent days mock ─────────────────────────────────────────────────────────

const UNSENT_DAYS = [
  { date: "27.06.2026", kassaCount: 8 },
  { date: "26.06.2026", kassaCount: 6 },
  { date: "24.06.2026", kassaCount: 8 },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function RoleKassaMainIncoming() {
  const navigate = useNavigate();
  const date = dayjs().format("DD.MM.YYYY");

  const [view, setView] = useState<"card" | "table">("card");
  const [alertOpen, setAlertOpen] = useState(true);

  const [statuses, setStatuses] = useState<Record<number, ReportStatus>>(() =>
    Object.fromEntries(MOCK_KASSAS.map((k) => [k.id, "pending" as ReportStatus])),
  );
  const [smenaYopildi, setSmenaYopildi] = useState<Record<number, boolean>>(
    () => Object.fromEntries(MOCK_KASSAS.map((k) => [k.id, false])),
  );

  const confirmedCount = Object.values(statuses).filter((s) => s === "confirmed").length;
  const rejectedCount  = Object.values(statuses).filter((s) => s === "rejected").length;
  const pendingCount   = Object.values(statuses).filter((s) => s === "pending").length;

  function setStatus(id: number, status: ReportStatus) {
    setStatuses((prev) => ({ ...prev, [id]: status }));
  }

  function toggleSmena(id: number) {
    setSmenaYopildi((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  // ─── Table columns ──────────────────────────────────────────────────────────

  const tableColumns: ColumnDef<KassaReport>[] = [
    {
      key: "name",
      header: "Касса",
      width: 160,
      render: (row) => (
        <div>
          <p className="font-semibold text-xs" style={{ color: "var(--text-default)" }}>{row.name}</p>
          <p className="text-[11px] mt-0.5" style={{ color: "var(--text-muted)" }}>
            {row.kassir} · {row.startTime}→{row.endTime}
          </p>
        </div>
      ),
    },
    {
      key: "payments",
      header: "Тип оплаты",
      children: [
        { key: "naqd",     header: "Нал",      width: 90, align: "right", render: (r) => <span className="text-xs">{fmt(r.naqd)}</span> },
        { key: "uzcard",   header: "UzCard",   width: 90, align: "right", render: (r) => <span className="text-xs">{fmt(r.uzcard)}</span> },
        { key: "humo",     header: "Humo",     width: 90, align: "right", render: (r) => <span className="text-xs">{fmt(r.humo)}</span> },
        { key: "uzumbank", header: "Uzum",     width: 80, align: "right", render: (r) => <span className="text-xs">{fmt(r.uzumbank)}</span> },
        { key: "click",    header: "Click",    width: 80, align: "right", render: (r) => <span className="text-xs">{fmt(r.click)}</span> },
        { key: "payme",    header: "Payme",    width: 80, align: "right", render: (r) => <span className="text-xs">{fmt(r.payme)}</span> },
      ],
    },
    {
      key: "total",
      header: "Итого",
      width: 110,
      align: "right",
      render: (row) => (
        <span className="font-semibold text-xs" style={{ color: "var(--text-default)" }}>
          {fmt(total(row))}
        </span>
      ),
    },
    {
      key: "status",
      header: "Статус",
      width: 110,
      align: "center",
      render: (row) => {
        const s = statuses[row.id];
        return (
          <CusBadge
            colorPalette={s === "confirmed" ? "green" : s === "rejected" ? "red" : "gray"}
            variant="subtle"
            size="sm"
          >
            {s === "confirmed" ? "Подтверждено" : s === "rejected" ? "Отказ" : "Ожидание"}
          </CusBadge>
        );
      },
    },
    {
      key: "actions",
      header: "Действия",
      width: 220,
      align: "center",
      render: (row) => {
        const s = statuses[row.id];
        if (s === "confirmed") {
          return (
            <div className="flex items-center justify-center gap-1 text-xs font-medium" style={{ color: "#22c55e" }}>
              <LuCircleCheck size={13} /> Подтверждено
            </div>
          );
        }
        if (s === "rejected") {
          return (
            <div className="flex items-center justify-center gap-1 text-xs font-medium" style={{ color: "#ef4444" }}>
              <LuCircleX size={13} /> Отклонено
            </div>
          );
        }
        return (
          <div className="flex items-center justify-center gap-1.5">
            <CusButton
              size="xs"
              colorPalette={smenaYopildi[row.id] ? "green" : "gray"}
              variant={smenaYopildi[row.id] ? "surface" : "outline"}
              onClick={() => toggleSmena(row.id)}
            >
              {smenaYopildi[row.id] ? <LuCheck size={12} /> : <LuClock size={12} />}
              Смена
            </CusButton>
            <CusButton size="xs" colorPalette="green" variant="outline" onClick={() => setStatus(row.id, "confirmed")}>
              <LuCheck size={12} /> Проверил
            </CusButton>
            <CusButton size="xs" colorPalette="red" variant="outline" onClick={() => setStatus(row.id, "rejected")}>
              <LuX size={12} /> Отказ
            </CusButton>
          </div>
        );
      },
    },
  ];

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="px-4 tablet:px-6 py-5 flex flex-col gap-5">
      {/* ── Top bar ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <PageHeader
          title="Приём Z-отчётов"
          subtitle={`${date} · Ежедневные Z-отчёты всех касс`}
        />
        <CusSegment
          layout="inline"
          size="sm"
          value={view}
          onValueChange={(v) => setView(v as "card" | "table")}
          items={[
            { id: "card",  label: "Карточки", icon: <LuLayoutGrid size={13} /> },
            { id: "table", label: "Таблица",  icon: <LuTable2 size={13} /> },
          ]}
        />
      </div>

      {/* ── Summary bar ── */}
      <div
        className="rounded-xl border px-5 py-4 flex items-center gap-5 flex-wrap"
        style={{ background: "var(--bg-second)", borderColor: "var(--border-default)" }}
      >
        <div>
          <p className="text-xs mb-0.5" style={{ color: "var(--text-muted)" }}>Всего касс</p>
          <p className="text-2xl font-bold" style={{ color: "var(--text-default)" }}>8</p>
        </div>
        <div className="w-px h-8 shrink-0" style={{ background: "var(--border-default)" }} />
        <div>
          <p className="text-xs mb-0.5" style={{ color: "var(--text-muted)" }}>Подтверждено</p>
          <p className="text-2xl font-bold" style={{ color: "#22c55e" }}>{confirmedCount}</p>
        </div>
        <div className="w-px h-8 shrink-0" style={{ background: "var(--border-default)" }} />
        <div>
          <p className="text-xs mb-0.5" style={{ color: "var(--text-muted)" }}>Отказ</p>
          <p className="text-2xl font-bold" style={{ color: "#ef4444" }}>{rejectedCount}</p>
        </div>
        <div className="w-px h-8 shrink-0" style={{ background: "var(--border-default)" }} />
        <div>
          <p className="text-xs mb-0.5" style={{ color: "var(--text-muted)" }}>Ожидание</p>
          <p className="text-2xl font-bold" style={{ color: "var(--text-3)" }}>{pendingCount}</p>
        </div>
        <div className="ml-auto">
          <CusButton
            colorPalette="blue"
            isDisabled={confirmedCount === 0}
            onClick={() => navigate("/rolekassa-main/export")}
          >
            <LuSend size={15} />
            Отправить в бухгалтерию
          </CusButton>
        </div>
      </div>

      {/* ── Unsent days alert ── */}
      {UNSENT_DAYS.length > 0 && (
        <div
          className="rounded-xl border overflow-hidden"
          style={{ borderColor: "#f97316", background: "#f9731608" }}
        >
          <button
            className="w-full flex items-center gap-3 px-5 py-3 text-left"
            style={{ background: "transparent" }}
            onClick={() => setAlertOpen((p) => !p)}
          >
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: "#f9731620" }}
            >
              <LuTriangleAlert size={14} style={{ color: "#f97316" }} />
            </div>
            <div className="flex-1">
              <span className="text-sm font-semibold" style={{ color: "#f97316" }}>
                {UNSENT_DAYS.length} kun uchun hisobot buxgalteriyaga yuborilmagan
              </span>
            </div>
            {alertOpen
              ? <LuChevronUp size={15} style={{ color: "#f97316" }} />
              : <LuChevronDown size={15} style={{ color: "#f97316" }} />
            }
          </button>

          {alertOpen && (
            <div
              className="border-t px-5 py-3 flex flex-col gap-2"
              style={{ borderColor: "#f9731630" }}
            >
              {UNSENT_DAYS.map((day) => (
                <div key={day.date} className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <LuCalendar size={13} style={{ color: "#f97316" }} />
                    <span className="text-sm font-medium" style={{ color: "var(--text-default)" }}>
                      {day.date}
                    </span>
                    <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                      · {day.kassaCount} ta kassa
                    </span>
                  </div>
                  <CusButton
                    size="xs"
                    colorPalette="orange"
                    variant="outline"
                    onClick={() => navigate(`/rolekassa-main/incoming?date=${day.date}`)}
                  >
                    Ko'rish
                  </CusButton>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Card view ── */}
      {view === "card" && (
        <div className="flex flex-col gap-4">
          {MOCK_KASSAS.map((kassa) => (
            <KassaCard
              key={kassa.id}
              kassa={kassa}
              status={statuses[kassa.id]}
              smenaYopildi={smenaYopildi[kassa.id]}
              onSmenaToggle={() => toggleSmena(kassa.id)}
              onConfirm={() => setStatus(kassa.id, "confirmed")}
              onReject={() => setStatus(kassa.id, "rejected")}
            />
          ))}
        </div>
      )}

      {/* ── Table view ── */}
      {view === "table" && (
        <div
          className="rounded-2xl border overflow-hidden"
          style={{ background: "var(--bg-second)", borderColor: "var(--border-default)" }}
        >
          <div className="overflow-x-auto">
            <CusTable
              data={MOCK_KASSAS}
              columns={tableColumns}
              variant="outline"
              size="sm"
              interactive
              stickyHeader
              showColumnBorder
              maxH="calc(100vh - 280px)"
            />
          </div>
        </div>
      )}
    </div>
  );
}
