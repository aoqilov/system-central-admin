import { useState } from "react";
import dayjs from "dayjs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  LuBanknote,
  LuArrowUpDown,
  LuWallet,
  LuCreditCard,
  LuCircleCheck,
  LuClock,
  LuActivity,
  LuScanLine,
  LuLink,
  LuPower,
  LuPrinter,
} from "react-icons/lu";
import { Dialog } from "@chakra-ui/react";
import { CusTable, type ColumnDef } from "../../components/ui/table/CusTable";
import { CusBadge } from "../../components/ui/badge/CusBadge";
import { CusDialog } from "../../components/ui/dialog/CusDialog";
import { CusButton } from "../../components/ui/buttons/CusButton";
import { CusInput } from "../../components/ui/inputs/CusInput";
import { useKassa, type SmenaInfo } from "../../context/KassaContext";

// ─── Constants ────────────────────────────────────────────────────────────────

const KASSIR_NAME = "Kassir Abdullayev";
const KASSA_RAQAMI = 5;

// ─── Mock data ────────────────────────────────────────────────────────────────

const HOURLY = [
  { hour: "08:00", amount: 120_000 },
  { hour: "09:00", amount: 280_000 },
  { hour: "10:00", amount: 350_000 },
  { hour: "11:00", amount: 420_000 },
  { hour: "12:00", amount: 510_000 },
  { hour: "13:00", amount: 390_000 },
  { hour: "14:00", amount: 460_000 },
  { hour: "15:00", amount: 320_000 },
  { hour: "16:00", amount: 290_000 },
  { hour: "17:00", amount: 500_000 },
];

const EMPTY_HOURLY = HOURLY.map((h) => ({ ...h, amount: 0 }));

interface TxRow {
  id: number;
  time: string;
  token: string;
  partiya: string;
  type: "Naqd" | "UzCard" | "Karta";
  amount: number;
  status: "success" | "pending";
}

const TRANSACTIONS: TxRow[] = [
  {
    id: 1,
    time: "17:51",
    token: "TKN-8F3D-A12C",
    partiya: "B2-007",
    type: "Naqd",
    amount: 45_000,
    status: "success",
  },
  {
    id: 2,
    time: "17:48",
    token: "TKN-2C1A-F09E",
    partiya: "B2-006",
    type: "UzCard",
    amount: 120_000,
    status: "success",
  },
  {
    id: 3,
    time: "17:43",
    token: "TKN-7D4B-C33F",
    partiya: "B3-001",
    type: "Karta",
    amount: 60_000,
    status: "pending",
  },
  {
    id: 4,
    time: "17:39",
    token: "TKN-1E5C-D80A",
    partiya: "B2-005",
    type: "Naqd",
    amount: 90_000,
    status: "success",
  },
  {
    id: 5,
    time: "17:34",
    token: "TKN-9A2D-E41B",
    partiya: "B1-012",
    type: "UzCard",
    amount: 30_000,
    status: "success",
  },
  {
    id: 6,
    time: "17:29",
    token: "TKN-4F6E-B72C",
    partiya: "B3-002",
    type: "Karta",
    amount: 75_000,
    status: "success",
  },
  {
    id: 7,
    time: "17:21",
    token: "TKN-3C8A-A55D",
    partiya: "B2-004",
    type: "Naqd",
    amount: 50_000,
    status: "success",
  },
  {
    id: 8,
    time: "17:15",
    token: "TKN-0B1F-C94E",
    partiya: "B1-011",
    type: "UzCard",
    amount: 200_000,
    status: "success",
  },
  {
    id: 9,
    time: "17:08",
    token: "TKN-6D3C-F18A",
    partiya: "B3-003",
    type: "Naqd",
    amount: 45_000,
    status: "pending",
  },
  {
    id: 10,
    time: "17:01",
    token: "TKN-5E7B-D26F",
    partiya: "B2-003",
    type: "Karta",
    amount: 150_000,
    status: "success",
  },
  {
    id: 11,
    time: "16:54",
    token: "TKN-2A4D-E03C",
    partiya: "B1-010",
    type: "UzCard",
    amount: 80_000,
    status: "success",
  },
  {
    id: 12,
    time: "16:47",
    token: "TKN-8C6E-B91A",
    partiya: "B2-002",
    type: "Naqd",
    amount: 35_000,
    status: "success",
  },
];

const TYPE_COLOR: Record<string, string> = {
  Naqd: "#22c55e",
  UzCard: "#3b82f6",
  Karta: "#8b5cf6",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)} mln`;
  return n.toLocaleString();
}

// ─── Stat card ────────────────────────────────────────────────────────────────

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
  dim,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
  color: string;
  dim?: boolean;
}) {
  return (
    <div
      className="rounded-2xl border p-4 flex flex-col gap-2 flex-1 transition-opacity"
      style={{
        background: "var(--bg-second)",
        borderColor: "var(--border-default)",
        opacity: dim ? 0.5 : 1,
      }}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>
          {label}
        </span>
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center"
          style={{ background: `${color}18` }}
        >
          <Icon size={15} style={{ color }} />
        </div>
      </div>
      <p
        className="font-bold leading-none"
        style={{ fontSize: 22, color: "var(--text-default)" }}
      >
        {value}
      </p>
      {sub && (
        <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
          {sub}
        </p>
      )}
    </div>
  );
}

// ─── Tooltip ──────────────────────────────────────────────────────────────────

interface TipProps {
  active?: boolean;
  payload?: Array<{ value?: number }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: TipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-xl border px-3 py-2"
      style={{
        background: "var(--bg-second)",
        borderColor: "var(--border-default)",
        fontSize: 12,
      }}
    >
      <p style={{ color: "var(--text-muted)", marginBottom: 2 }}>{label}</p>
      <p className="font-bold" style={{ color: "var(--text-default)" }}>
        {(payload[0].value ?? 0).toLocaleString()} so'm
      </p>
    </div>
  );
}

// ─── Table columns ────────────────────────────────────────────────────────────

const COLUMNS: ColumnDef<TxRow>[] = [
  {
    key: "time",
    header: "Vaqt",
    width: 70,
    render: (row) => (
      <span
        className="font-mono text-xs"
        style={{ color: "var(--text-muted)" }}
      >
        {row.time}
      </span>
    ),
  },
  {
    key: "token",
    header: "Token",
    render: (row) => (
      <span
        className="font-mono text-xs"
        style={{ color: "var(--text-default)" }}
      >
        {row.token}
      </span>
    ),
  },
  {
    key: "partiya",
    header: "Partiya",
    render: (row) => (
      <span
        className="text-xs font-medium"
        style={{ color: "var(--text-muted)" }}
      >
        {row.partiya}
      </span>
    ),
  },
  {
    key: "type",
    header: "To'lov turi",
    render: (row) => (
      <span
        className="text-[11px] font-bold px-2 py-0.5 rounded-lg"
        style={{
          background: `${TYPE_COLOR[row.type]}18`,
          color: TYPE_COLOR[row.type],
        }}
      >
        {row.type}
      </span>
    ),
  },
  {
    key: "amount",
    header: "Summa",
    align: "right",
    render: (row) => (
      <span
        className="font-semibold text-sm"
        style={{ color: "var(--text-default)" }}
      >
        {row.amount.toLocaleString()} so'm
      </span>
    ),
  },
  {
    key: "status",
    header: "Status",
    align: "center",
    render: (row) => (
      <CusBadge
        colorPalette={row.status === "success" ? "green" : "yellow"}
        variant="subtle"
        size="sm"
      >
        {row.status === "success" ? (
          <>
            <LuCircleCheck size={11} /> Bajarildi
          </>
        ) : (
          <>
            <LuClock size={11} /> Kutilmoqda
          </>
        )}
      </CusBadge>
    ),
  },
];

// ─── Z-Report receipt ─────────────────────────────────────────────────────────

function ReceiptRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-xs mb-1 last:mb-0">
      <span style={{ color: "#4b5563" }}>{label}</span>
      <span className="font-medium" style={{ color: "#111827" }}>
        {value}
      </span>
    </div>
  );
}

function ZReportReceipt({
  smena,
  closeTime,
  cashTotal,
  cardTotal,
}: {
  smena: SmenaInfo;
  closeTime: string;
  cashTotal: number;
  cardTotal: number;
}) {
  const total = cashTotal + cardTotal;
  const sep = { borderBottom: "1.5px dashed #d1d5db" };

  return (
    <div
      className="mx-auto rounded-2xl overflow-hidden"
      style={{
        maxWidth: 320,
        background: "#ffffff",
        color: "#111827",
        fontFamily: "'JetBrains Mono', monospace",
        boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
      }}
    >
      {/* Header */}
      <div className="text-center px-5 pt-5 pb-4" style={sep}>
        <p
          className="font-bold text-base tracking-widest"
          style={{ color: "#111827" }}
        >
          KASSA Z-OTCHET
        </p>
        <p className="text-xs mt-1" style={{ color: "#6b7280" }}>
          KASSA RAQAMI: {KASSA_RAQAMI}
        </p>
        <p className="text-xs mt-0.5" style={{ color: "#6b7280" }}>
          {smena.date}
        </p>
      </div>

      {/* Smena info */}
      <div className="px-5 py-4" style={sep}>
        <ReceiptRow label="SMENA" value={`${smena.date} | ${smena.name}`} />
        <ReceiptRow label="Xodim" value={smena.kassir} />
        <ReceiptRow label="Boshlandi" value={smena.startTime} />
        <ReceiptRow label="Yopildi" value={closeTime} />
      </div>

      {/* Payment types */}
      <div className="px-5 py-4" style={sep}>
        <p
          className="font-bold text-[11px] mb-2 tracking-widest"
          style={{ color: "#111827" }}
        >
          TO'LOV TURLARI
        </p>
        <ReceiptRow label="Naqd" value={`${cashTotal.toLocaleString()} so'm`} />
        <ReceiptRow
          label="Karta"
          value={`${cardTotal.toLocaleString()} so'm`}
        />
      </div>

      {/* Total */}
      <div className="px-5 py-4" style={sep}>
        <div
          className="flex justify-between font-bold text-sm"
          style={{ color: "#111827" }}
        >
          <span>JAMI</span>
          <span>{total.toLocaleString()} so'm</span>
        </div>
      </div>

      {/* Footer timestamp */}
      <div
        className="text-center px-5 py-3 text-[11px]"
        style={{ color: "#9ca3af" }}
      >
        {smena.date} {closeTime}
      </div>
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptySmena({ onOpen }: { onOpen: () => void }) {
  return (
    <div
      className="flex flex-col items-center justify-center py-16 gap-4"
      style={{ color: "var(--text-muted)" }}
    >
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center"
        style={{ background: "var(--bg-hover)" }}
      >
        <LuPower size={28} style={{ color: "var(--text-dim)" }} />
      </div>
      <div className="text-center">
        <p className="font-semibold" style={{ color: "var(--text-3)" }}>
          Smena ochilmagan
        </p>
        <p className="text-sm mt-0.5">
          Tranzaksiyalar ko'rsatish uchun smena oching
        </p>
      </div>
      <CusButton
        colorPalette="green"
        variant="outline"
        size="sm"
        onClick={onOpen}
      >
        <LuPower size={15} /> Smena ochish
      </CusButton>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function KassaStats() {
  const { smena, nextSmenaNum, openSmena, closeSmena } = useKassa();

  const [openDialog, setOpenDialog] = useState(false);
  const [closeDialog, setCloseDialog] = useState(false);
  const [dialogTime, setDialogTime] = useState("");
  const [smenaCloseTime, setSmenaCloseTime] = useState("");

  // Computed stats from active transactions
  const activeTx = smena ? TRANSACTIONS : [];
  const cashTotal = activeTx
    .filter((t) => t.type === "Naqd")
    .reduce((s, t) => s + t.amount, 0);
  const cardTotal = activeTx
    .filter((t) => t.type !== "Naqd")
    .reduce((s, t) => s + t.amount, 0);
  const totalRev = cashTotal + cardTotal;
  const hourlyData = smena ? HOURLY : EMPTY_HOURLY;

  const smenaLabel = `${dayjs().format("DD.MM.YYYY")} | Smena #${nextSmenaNum}`;

  function handleOpenClick() {
    setDialogTime(dayjs().format("HH:mm:ss"));
    setOpenDialog(true);
  }

  function handleConfirmOpen() {
    openSmena(KASSIR_NAME, dialogTime);
    setOpenDialog(false);
  }

  function handleCloseClick() {
    setSmenaCloseTime(dayjs().format("HH:mm:ss"));
    setCloseDialog(true);
  }

  function handleConfirmClose() {
    closeSmena();
    setCloseDialog(false);
  }

  function handlePrint() {
    if (!smena) return;
    const total = cashTotal + cardTotal;

    const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Z-Otchet</title>
<style>
  @page {
    size: 58mm auto;
    margin: 0;
  }
  html, body {
    width: 58mm;
    margin: 0;
    padding: 3mm 3mm;
    font-family: 'Courier New', Courier, monospace;
    font-size: 9pt;
    color: #000;
    background: #fff;
  }
  .c  { text-align: center; }
  .b  { font-weight: bold; }
  .row {
    display: flex;
    justify-content: space-between;
    font-size: 8pt;
    margin: 2px 0;
  }
  .sep {
    border: none;
    border-top: 1px dashed #000;
    margin: 5px 0;
  }
  .section-title {
    font-size: 8pt;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 3px;
  }
</style>
</head>
<body>
  <div class="c b" style="font-size:11pt;letter-spacing:2px">KASSA Z-OTCHET</div>
  <div class="c" style="font-size:8pt;margin-top:2px">KASSA RAQAMI: ${KASSA_RAQAMI}</div>
  <div class="c" style="font-size:8pt">${smena.date}</div>
  <hr class="sep">

  <div class="row"><span>SMENA</span><span>${smena.date} | ${smena.name}</span></div>
  <div class="row"><span>Xodim</span><span>${smena.kassir}</span></div>
  <div class="row"><span>Boshlandi</span><span>${smena.startTime}</span></div>
  <div class="row"><span>Yopildi</span><span>${smenaCloseTime}</span></div>
  <hr class="sep">

  <div class="section-title">TO'LOV TURLARI</div>
  <div class="row"><span>Naqd</span><span>${cashTotal.toLocaleString()} so'm</span></div>
  <div class="row"><span>Karta</span><span>${cardTotal.toLocaleString()} so'm</span></div>
  <hr class="sep">

  <div class="row b" style="font-size:9pt"><span>JAMI</span><span>${total.toLocaleString()} so'm</span></div>
  <hr class="sep">

  <div class="c" style="font-size:8pt;color:#555;margin-top:6px">${smena.date} ${smenaCloseTime}</div>
</body>
</html>`;

    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, "_blank", "width=400,height=600");
    if (!win) { URL.revokeObjectURL(url); return; }
    win.focus();
    setTimeout(() => {
      win.print();
      win.close();
      URL.revokeObjectURL(url);
    }, 300);
  }

  return (
    <div className="p-4 tablet:p-6 flex flex-col gap-5 pb-6">
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1
              className="text-xl font-bold"
              style={{ color: "var(--text-default)" }}
            >
              Kassa smena kunlik
            </h1>
            {smena ? (
              <span
                className="text-xs font-mono px-2 py-0.5 rounded-lg"
                style={{
                  background: "#3b82f618",
                  color: "#60a5fa",
                  border: "1px solid #3b82f630",
                }}
              >
                {smena.name}
              </span>
            ) : (
              <span
                className="text-xs px-2 py-0.5 rounded-lg"
                style={{
                  background: "#f9731618",
                  color: "#fb923c",
                  border: "1px solid #f9731630",
                }}
              >
                Smena yopiq
              </span>
            )}
          </div>
          <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>
            {smena
              ? `${smena.kassir} · ${smena.date} — ${smena.startTime}dan beri`
              : "Smena ochilmagan. Boshlash uchun smena oching."}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {!smena ? (
            <button
              onClick={handleOpenClick}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-semibold border transition-all active:scale-95"
              style={{
                color: "#22c55e",
                borderColor: "#22c55e60",
                background: "#22c55e10",
              }}
            >
              <LuPower size={14} />
              SMENA OCHISH
            </button>
          ) : (
            <button
              onClick={handleCloseClick}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-semibold border transition-all active:scale-95"
              style={{
                color: "#ef4444",
                borderColor: "#ef444460",
                background: "#ef444410",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <LuActivity size={13} />
              SMENA YOPISH
            </button>
          )}
        </div>
      </div>

      {/* ── Stat cards ─────────────────────────────────────── */}
      <div className="grid grid-cols-2 tablet:grid-cols-3 desktop:grid-cols-6 gap-3">
        <StatCard
          icon={LuBanknote}
          label="Jami daromad"
          value={smena ? fmt(totalRev) : "0"}
          sub="so'm"
          color="#3b82f6"
          dim={!smena}
        />
        <StatCard
          icon={LuArrowUpDown}
          label="Tranzaksiyalar"
          value={String(activeTx.length)}
          sub="bugun"
          color="#8b5cf6"
          dim={!smena}
        />
        <StatCard
          icon={LuWallet}
          label="Naqd"
          value={smena ? fmt(cashTotal) : "0"}
          sub="so'm"
          color="#22c55e"
          dim={!smena}
        />
        <StatCard
          icon={LuCreditCard}
          label="Karta / UzCard"
          value={smena ? fmt(cardTotal) : "0"}
          sub="so'm"
          color="#f97316"
          dim={!smena}
        />
        <StatCard
          icon={LuScanLine}
          label="Aktivatsiya"
          value={smena ? "54" : "0"}
          sub="bugun"
          color="#06b6d4"
          dim={!smena}
        />
        <StatCard
          icon={LuLink}
          label="Relation"
          value={smena ? "31" : "0"}
          sub="bugun"
          color="#ec4899"
          dim={!smena}
        />
      </div>

      {/* ── Transactions table ─────────────────────────────── */}
      <div
        className="rounded-2xl border overflow-hidden"
        style={{
          background: "var(--bg-second)",
          borderColor: "var(--border-default)",
        }}
      >
        <div
          className="px-4 py-3 border-b flex items-center justify-between"
          style={{ borderColor: "var(--border-default)" }}
        >
          <p
            className="text-sm font-semibold"
            style={{ color: "var(--text-default)" }}
          >
            Tranzaksiyalar
          </p>
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            {activeTx.length} ta yozuv
          </span>
        </div>

        {!smena ? (
          <EmptySmena onOpen={handleOpenClick} />
        ) : (
          <div className="overflow-x-auto">
            <CusTable
              data={activeTx}
              columns={COLUMNS}
              size="md"
              interactive
              stickyHeader
              maxH="340px"
              variant="outline"
            />
          </div>
        )}
      </div>

      {/* ── Hourly chart ───────────────────────────────────── */}
      <div
        className="rounded-2xl border overflow-hidden"
        style={{
          background: "var(--bg-second)",
          borderColor: "var(--border-default)",
        }}
      >
        <div
          className="px-4 py-3 border-b flex items-center justify-between"
          style={{ borderColor: "var(--border-default)" }}
        >
          <p
            className="text-sm font-semibold"
            style={{ color: "var(--text-default)" }}
          >
            Soatlik daromad
          </p>
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            bugun
          </span>
        </div>
        <div className="p-4">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={hourlyData} barSize={28}>
              <CartesianGrid
                vertical={false}
                stroke="var(--border-default)"
                strokeDasharray="3 3"
              />
              <XAxis
                dataKey="hour"
                tick={{ fontSize: 11, fill: "var(--text-muted)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tickFormatter={(v) => fmt(v)}
                tick={{ fontSize: 10, fill: "var(--text-muted)" }}
                axisLine={false}
                tickLine={false}
                width={52}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "var(--bg-hover)", radius: 4 }}
              />
              <Bar
                dataKey="amount"
                fill="#3b82f6"
                radius={[6, 6, 0, 0]}
                fillOpacity={smena ? 0.85 : 0.25}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Smena Ochish Dialog ────────────────────────────── */}
      <CusDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        title="Yangi smena ochish"
        description="Ma'lumotlarni tekshiring va tasdiqlang."
        size="sm"
        footer={
          <>
            <Dialog.ActionTrigger asChild>
              <CusButton variant="outline">Bekor qilish</CusButton>
            </Dialog.ActionTrigger>
            <CusButton colorPalette="green" onClick={handleConfirmOpen}>
              <LuPower size={15} /> Smena ochish
            </CusButton>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <CusInput
            label="Sana | Smena"
            value={smenaLabel}
            readOnly
            helperText="Avtomatik tayinlangan"
          />
          <CusInput label="Kassir" value={KASSIR_NAME} readOnly />
          <CusInput label="Boshlanish vaqti" value={dialogTime} readOnly />
        </div>
      </CusDialog>

      {/* ── Z-Report (Smena Yopish) Dialog ────────────────── */}
      <CusDialog
        open={closeDialog}
        onClose={() => setCloseDialog(false)}
        size="sm"
        closeOnBackdrop={false}
        footer={
          <>
            <CusButton variant="outline" onClick={handlePrint}>
              <LuPrinter size={15} /> Chop etish
            </CusButton>
            <CusButton colorPalette="red" onClick={handleConfirmClose}>
              <LuPower size={15} /> Smenani yopish
            </CusButton>
          </>
        }
      >
        {smena && (
          <ZReportReceipt
            smena={smena}
            closeTime={smenaCloseTime}
            cashTotal={cashTotal}
            cardTotal={cardTotal}
          />
        )}
      </CusDialog>
    </div>
  );
}
