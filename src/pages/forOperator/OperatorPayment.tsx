import { useState, useRef, useEffect } from "react";
import {
  LuQrCode,
  LuCheck,
  LuX,
  LuRefreshCw,
  LuUsers,
  LuChevronRight,
  LuArrowRight,
} from "react-icons/lu";
import { useOperatorRounds } from "../../context/OperatorRoundsContext";
import { employees, EmployeeRole } from "../../data/employees";
import { attractions } from "../../data/attractions";

const DEMO_OPERATOR = employees.find((e) => e.role === EmployeeRole.OPERATOR)!;
const DEMO_ATTRACTION =
  attractions.find(
    (a) => a.relationOperator.mainOperatorId === DEMO_OPERATOR?.id,
  ) ?? attractions[0];

function fmt(n: number) {
  return n.toLocaleString("uz-UZ");
}

function randomQrId(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "QR-";
  for (let i = 0; i < 4; i++)
    s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

type QrState = "idle" | "scanning" | "success" | "error";

interface RoundOrder {
  id: string;
  qrId: string;
  peopleCount: number;
  amount: number;
}

export default function OperatorPayment() {
  const { addRound } = useOperatorRounds();
  const att = DEMO_ATTRACTION;
  const maxSlots = att.rulesAttraction?.numberOfPlaceRound ?? 8;

  const [qrState, setQrState] = useState<QrState>("idle");
  const [qrId, setQrId] = useState("");
  const [peopleCount, setPeopleCount] = useState(1);
  const [pendingOrder, setPendingOrder] = useState<RoundOrder | null>(null);
  const [roundOrders, setRoundOrders] = useState<RoundOrder[]>([]);

  const scanRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const confirmRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (scanRef.current) clearTimeout(scanRef.current);
      if (confirmRef.current) clearTimeout(confirmRef.current);
    },
    [],
  );

  const usedSlots = roundOrders.reduce((s, o) => s + o.peopleCount, 0);
  const freeSlots = maxSlots - usedSlots;
  const roundFull = freeSlots <= 0;
  const canOrder = qrState === "success" && !pendingOrder && !roundFull;
  const orderAmount = att.price * peopleCount;

  function handleScan() {
    if (qrState !== "idle") return;
    setQrState("scanning");
    scanRef.current = setTimeout(() => {
      if (Math.random() > 0.15) {
        setQrId(randomQrId());
        setQrState("success");
      } else {
        setQrState("error");
      }
    }, 1200);
  }

  function handleReload() {
    if (scanRef.current) clearTimeout(scanRef.current);
    if (confirmRef.current) clearTimeout(confirmRef.current);
    setQrState("idle");
    setQrId("");
    setPeopleCount(1);
    setPendingOrder(null);
  }

  function handleCreateOrder() {
    if (!canOrder) return;
    setPendingOrder({
      id: `o-${Date.now()}`,
      qrId,
      peopleCount,
      amount: orderAmount,
    });
  }

  function handleConfirm() {
    if (!pendingOrder) return;
    const order = { ...pendingOrder };
    setPendingOrder(null);
    setQrState("idle");
    setQrId("");
    setPeopleCount(1);
    // 1 soniyadan keyin round tablega qo'shiladi
    confirmRef.current = setTimeout(() => {
      setRoundOrders((prev) => [...prev, order]);
    }, 1000);
  }

  function handleReject() {
    setPendingOrder(null);
    setQrState("idle");
    setQrId("");
    setPeopleCount(1);
  }

  function handleGo() {
    if (roundOrders.length === 0) return;
    addRound({
      paymentType: "cash",
      peopleCount: usedSlots,
      totalAmount: roundOrders.reduce((s, o) => s + o.amount, 0),
      attractionName: att.name,
    });
    setRoundOrders([]);
    setQrState("idle");
    setQrId("");
    setPeopleCount(1);
  }

  // ── QR button colors ───────────────────────────────────────────────────────
  const QR_STYLE = {
    idle: { bg: "#0ea5e918", border: "#0ea5e960", color: "#38bdf8" },
    scanning: { bg: "#eab30818", border: "#eab30860", color: "#eab308" },
    success: { bg: "#22c55e18", border: "#22c55e60", color: "#22c55e" },
    error: { bg: "#ef444418", border: "#ef444460", color: "#ef4444" },
  }[qrState];

  return (
    <>
      <div className="p-4 flex flex-col gap-3 pb-6">
        {/* ── QR Button ─────────────────────────────────────────────────── */}
        <div className="relative">
          {qrState !== "idle" && (
            <button
              onClick={handleReload}
              className="absolute top-3 right-3 z-10 w-9 h-9 rounded-xl flex items-center justify-center transition-all active:scale-90"
              style={{
                background: "var(--bg-hover)",
                color: "var(--text-muted)",
              }}
            >
              <LuRefreshCw size={15} />
            </button>
          )}

          <button
            onClick={handleScan}
            disabled={qrState !== "idle"}
            className="w-full rounded-2xl border flex flex-col items-center justify-center gap-3 transition-all active:scale-[0.98]"
            style={{
              height: 176,
              background: QR_STYLE.bg,
              borderColor: QR_STYLE.border,
              cursor: qrState === "idle" ? "pointer" : "default",
            }}
          >
            {qrState === "scanning" && (
              <div className="w-12 h-12 rounded-full border-[3px] border-yellow-400 border-t-transparent animate-spin" />
            )}

            {qrState === "success" && (
              <>
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{ background: "#22c55e22" }}
                >
                  <LuCheck size={26} style={{ color: "#22c55e" }} />
                </div>
                <p
                  className="font-mono font-bold tracking-widest"
                  style={{ fontSize: 22, color: "#22c55e" }}
                >
                  {qrId}
                </p>
              </>
            )}

            {qrState === "error" && (
              <>
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{ background: "#ef444422" }}
                >
                  <LuX size={24} style={{ color: "#ef4444" }} />
                </div>
                <p
                  className="text-sm font-semibold"
                  style={{ color: "#ef4444" }}
                >
                  QR noto'g'ri
                </p>
              </>
            )}

            {qrState === "idle" && (
              <>
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{ background: "#0ea5e918" }}
                >
                  <LuQrCode size={32} style={{ color: "#38bdf8" }} />
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold" style={{ color: "#38bdf8" }}>
                    QR-CHECK
                  </p>
                  <p
                    className="text-xs mt-1"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Bosib skanerlang
                  </p>
                </div>
              </>
            )}
          </button>
        </div>

        {/* ── Count + amount (only after success) ───────────────────────── */}
        {qrState === "success" && !pendingOrder && (
          <div
            className="w-full bg-red-200! rounded-2xl border flex items-center justify-between px-4 gap-4"
            style={{
              height: 130,
              background: "var(--bg-second)",
              borderColor: "var(--border-default)",
            }}
          >
            {/* left info */}
            <div className=" min-w-0 flex flex-col gap-1">
              <p className="text-[15px]" style={{ color: "var(--text-muted)" }}>
                1tasi narxi
              </p>
              <p
                className="font-semibold"
                style={{ fontSize: 20, color: "var(--text-2)" }}
              >
                {fmt(att.price)}
              </p>
            
            </div>
            {/* − count + */}
            <div className="flex items-center gap-4 shrink-0">
              <button
                onClick={() => setPeopleCount((p) => Math.max(p - 1, 1))}
                className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-3xl transition-all active:scale-90"
                style={{ background: "#ef4444", color: "#fff" }}
              >
                -
              </button>
              <p
                className="font-bold leading-none text-center"
                style={{
                  fontSize: 52,
                  color: "var(--text-default)",
                  minWidth: 52,
                }}
              >
                {peopleCount}
              </p>
              <button
                onClick={() =>
                  setPeopleCount((p) => Math.min(p + 1, freeSlots))
                }
                className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-4xl transition-all active:scale-90"
                style={{ background: "#3b82f6", color: "#fff" }}
              >
                +
              </button>
            </div>

            {/* total sum */}
            <div className="min-w-0 flex flex-col gap-1">
              <p className="text-[15px]" style={{ color: "var(--text-muted)" }}>
                Jami summa
              </p>
              <p
                className="font-bold leading-none truncate"
                style={{ fontSize: 22, color: "var(--text-default)" }}
              >
                {fmt(orderAmount)}{" "}
                <span
                  className="text-xs font-medium"
                  style={{ color: "var(--text-muted)" }}
                >
                  so'm
                </span>
              </p>
            </div>

            {/* divider */}
           
          </div>
        )}

        {/* ── Create order — 3 section ──────────────────────────────────── */}
        {canOrder && (
          <button
            onClick={handleCreateOrder}
            className="w-full rounded-2xl border overflow-hidden transition-all active:scale-[0.97]"
            style={{
              background: "var(--bg-second)",
              borderColor: "#3b82f660",
            }}
          >
            {/* 3 columns */}

            {/* Action bar */}
            <div
              className="flex items-center justify-center gap-2 py-3"
              style={{ background: "#3b82f6", color: "#fff" }}
            >
              <span className="text-sm font-bold">Buyurtma yaratish</span>
              <LuArrowRight size={16} />
            </div>
          </button>
        )}

        {/* ── Round table ────────────────────────────────────────────────── */}
        <div
          className="rounded-2xl border overflow-hidden"
          style={{
            background: "var(--bg-second)",
            borderColor: "var(--border-default)",
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-5 py-3.5 border-b"
            style={{ borderColor: "var(--border-default)" }}
          >
            <div className="flex items-center gap-2">
              <p
                className="text-sm font-semibold"
                style={{ color: "var(--text-default)" }}
              >
                Round
              </p>
              <span
                className="px-2 py-0.5 rounded-lg text-xs font-bold"
                style={{
                  background: roundFull ? "#22c55e18" : "#3b82f618",
                  color: roundFull ? "#22c55e" : "#60a5fa",
                }}
              >
                {usedSlots} / {maxSlots}
              </span>
            </div>
            {/* Progress bar */}
            <div
              className="w-24 h-2 rounded-full overflow-hidden"
              style={{ background: "var(--bg-hover)" }}
            >
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min((usedSlots / maxSlots) * 100, 100)}%`,
                  background: roundFull ? "#22c55e" : "#3b82f6",
                }}
              />
            </div>
          </div>

          {/* Rows */}
          {roundOrders.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                Hali buyurtmalar yo'q
              </p>
            </div>
          ) : (
            <div className="px-5">
              {roundOrders.map((order, i) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between py-3 gap-3"
                  style={
                    i < roundOrders.length - 1
                      ? { borderBottom: "1px solid var(--border-default)" }
                      : undefined
                  }
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: "#22c55e18" }}
                    >
                      <LuCheck size={14} style={{ color: "#22c55e" }} />
                    </div>
                    <div>
                      <p
                        className="text-sm font-mono font-semibold"
                        style={{ color: "var(--text-default)" }}
                      >
                        {order.qrId}
                      </p>
                      <p
                        className="text-xs mt-0.5"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {order.peopleCount} ta odam
                      </p>
                    </div>
                  </div>
                  <p
                    className="font-semibold text-sm shrink-0"
                    style={{ color: "var(--text-default)" }}
                  >
                    {fmt(order.amount)} so'm
                  </p>
                </div>
              ))}

              {/* Totals */}
              <div
                className="flex items-center justify-between py-3 border-t"
                style={{ borderColor: "var(--border-default)" }}
              >
                <div className="flex items-center gap-1.5">
                  <LuUsers size={13} style={{ color: "var(--text-muted)" }} />
                  <p
                    className="text-sm font-semibold"
                    style={{ color: "var(--text-2)" }}
                  >
                    {usedSlots} ta odam
                  </p>
                </div>
                <p
                  className="font-bold"
                  style={{ fontSize: 16, color: "var(--text-default)" }}
                >
                  {fmt(roundOrders.reduce((s, o) => s + o.amount, 0))} so'm
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ── GO button ─────────────────────────────────────────────────── */}
        <button
          onClick={handleGo}
          disabled={roundOrders.length === 0}
          className="w-full rounded-2xl flex items-center justify-center gap-3 font-bold transition-all active:scale-[0.97]"
          style={{
            height: 64,
            fontSize: 20,
            letterSpacing: "0.08em",
            background: roundOrders.length > 0 ? "#3b82f6" : "var(--bg-hover)",
            color: roundOrders.length > 0 ? "#ffffff" : "var(--text-muted)",
            border: "none",
            cursor: roundOrders.length > 0 ? "pointer" : "not-allowed",
            opacity: roundOrders.length > 0 ? 1 : 0.5,
          }}
        >
          GO
          <LuChevronRight size={22} />
        </button>
      </div>

      {/* ── Client confirmation modal ──────────────────────────────────────── */}
      {pendingOrder && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center"
          style={{ background: "rgba(0,0,0,0.55)" }}
          onClick={handleReject}
        >
          <div
            className="w-full rounded-t-3xl p-6 space-y-4"
            style={{
              maxWidth: 768,
              background: "var(--bg-main)",
              borderTop: "1px solid var(--border-default)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between">
              <p
                className="text-base font-bold"
                style={{ color: "var(--text-default)" }}
              >
                Buyurtmani tasdiqlang
              </p>
              <span
                className="px-2.5 py-1 rounded-lg text-[11px] font-bold tracking-wide"
                style={{ background: "#eab30818", color: "#eab308" }}
              >
                PENDING
              </span>
            </div>

            {/* Order details */}
            <div
              className="rounded-2xl border overflow-hidden"
              style={{
                background: "var(--bg-second)",
                borderColor: "var(--border-default)",
              }}
            >
              <div
                className="flex items-center justify-between px-4 py-3 border-b"
                style={{ borderColor: "var(--border-default)" }}
              >
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  QR-ID
                </p>
                <p
                  className="font-mono font-bold tracking-wider"
                  style={{ color: "var(--text-default)" }}
                >
                  {pendingOrder.qrId}
                </p>
              </div>
              <div
                className="flex items-center justify-between px-4 py-3 border-b"
                style={{ borderColor: "var(--border-default)" }}
              >
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  Odamlar
                </p>
                <p
                  className="font-bold"
                  style={{ color: "var(--text-default)" }}
                >
                  {pendingOrder.peopleCount} ta
                </p>
              </div>
              <div className="flex items-center justify-between px-4 py-4">
                <p
                  className="text-xs font-bold"
                  style={{ color: "var(--text-muted)" }}
                >
                  Jami to'lov
                </p>
                <p
                  className="font-bold"
                  style={{ fontSize: 22, color: "var(--text-default)" }}
                >
                  {fmt(pendingOrder.amount)}{" "}
                  <span
                    className="text-sm font-medium"
                    style={{ color: "var(--text-muted)" }}
                  >
                    so'm
                  </span>
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleReject}
                className="rounded-2xl font-semibold transition-all active:scale-95"
                style={{
                  height: 56,
                  fontSize: 15,
                  background: "#ef444420",
                  color: "#f87171",
                  border: "1px solid #ef444430",
                }}
              >
                Bekor qilish
              </button>
              <button
                onClick={handleConfirm}
                className="rounded-2xl font-bold transition-all active:scale-95"
                style={{
                  height: 56,
                  fontSize: 15,
                  background: "#22c55e",
                  color: "#ffffff",
                  border: "none",
                }}
              >
                Tasdiqlash
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
