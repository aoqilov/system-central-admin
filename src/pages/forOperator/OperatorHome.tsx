import React, { useMemo } from "react";
import {
  LuPlay,
  LuUsers,
  LuBanknote,
  LuCreditCard,
  LuArrowRightLeft,
  LuTrash2,
  LuInbox,
} from "react-icons/lu";
import {
  useOperatorRounds,
  type Round,
} from "../../context/OperatorRoundsContext";
import { employees, EmployeeRole } from "../../data/employees";
import { attractions } from "../../data/attractions";
import dayjs from "dayjs";

const DEMO_OPERATOR = employees.find((e) => e.role === EmployeeRole.OPERATOR)!;
const DEMO_ATTRACTION =
  attractions.find(
    (a) => a.relationOperator.mainOperatorId === DEMO_OPERATOR?.id,
  ) ?? attractions[0];

function fmt(n: number) {
  return n.toLocaleString("uz-UZ");
}

const PAYMENT_INFO = {
  cash:     { label: "Naqd",     color: "#22c55e", Icon: LuBanknote },
  card:     { label: "Karta",    color: "#3b82f6", Icon: LuCreditCard },
  transfer: { label: "O'tkazma", color: "#8b5cf6", Icon: LuArrowRightLeft },
};

function RoundRow({ round, last }: { round: Round; last: boolean }) {
  const pi = PAYMENT_INFO[round.paymentType];
  const time = dayjs(round.startedAt).format("HH:mm");

  return (
    <div
      className="flex items-center gap-3 py-3"
      style={last ? undefined : { borderBottom: "1px solid var(--border-default)" }}
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 font-mono font-bold text-xs"
        style={{ background: "var(--bg-hover)", color: "var(--text-2)" }}
      >
        {time}
      </div>

      <div className="flex-1 min-w-0">
        <p
          className="text-sm font-semibold truncate"
          style={{ color: "var(--text-default)" }}
        >
          {round.attractionName}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <span
            className="flex items-center gap-1 text-[11px] font-medium"
            style={{ color: pi.color }}
          >
            <pi.Icon size={10} />
            {pi.label}
          </span>
          <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>
            · {round.peopleCount} ta odam
          </span>
        </div>
      </div>

      <div className="text-right shrink-0">
        <p
          className="font-bold"
          style={{ fontSize: 16, color: "var(--text-default)" }}
        >
          {fmt(round.totalAmount)}
        </p>
        <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>
          so'm
        </p>
      </div>
    </div>
  );
}

export default function OperatorHome() {
  const { rounds, clearRounds } = useOperatorRounds();
  const att = DEMO_ATTRACTION;

  const today = dayjs().format("YYYY-MM-DD");

  const todayRounds = useMemo(
    () => rounds.filter((r) => r.startedAt.startsWith(today)),
    [rounds, today],
  );

  const stats = useMemo(
    () => ({
      roundCount: todayRounds.length,
      peopleCount: todayRounds.reduce((s, r) => s + r.peopleCount, 0),
      revenue: todayRounds.reduce((s, r) => s + r.totalAmount, 0),
    }),
    [todayRounds],
  );

  return (
    <div className="p-4 space-y-4 pb-6">

      {/* ── Attraction card ───────────────────────────────────────────── */}
      <div
        className="rounded-2xl border flex items-center gap-3 px-4 py-3"
        style={{ background: "var(--bg-second)", borderColor: "var(--border-default)" }}
      >
        <img
          src={
            att.images.imageAttractionMain ??
            `https://picsum.photos/seed/${att.id}/200/200`
          }
          alt={att.name}
          className="w-11 h-11 rounded-xl object-cover shrink-0"
        />
        <div className="min-w-0">
          <p
            className="font-bold truncate"
            style={{ fontSize: 16, color: "var(--text-default)" }}
          >
            {att.name}
          </p>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
            {dayjs().format("DD.MM.YYYY")} — bugungi natijalar
          </p>
        </div>
      </div>

      {/* ── Stats ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-3">
        {(
          [
            { label: "Roundlar", value: String(stats.roundCount),  Icon: LuPlay     as React.ElementType, color: "#3b82f6", vSize: 28 },
            { label: "Odamlar",  value: String(stats.peopleCount), Icon: LuUsers    as React.ElementType, color: "#8b5cf6", vSize: 28 },
            { label: "so'm",     value: fmt(stats.revenue),        Icon: LuBanknote as React.ElementType, color: "#22c55e", vSize: 16 },
          ]
        ).map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border flex flex-col items-center justify-center gap-1.5 py-4"
            style={{ background: "var(--bg-second)", borderColor: "var(--border-default)" }}
          >
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: `${s.color}18` }}
            >
              <s.Icon size={15} style={{ color: s.color }} />
            </div>
            <p
              className="font-bold leading-none text-center break-all"
              style={{ fontSize: s.vSize, color: "var(--text-default)" }}
            >
              {s.value}
            </p>
            <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
              {s.label}
            </p>
          </div>
        ))}
      </div>

      {/* ── Rounds list ───────────────────────────────────────────────── */}
      <div
        className="rounded-2xl border overflow-hidden"
        style={{ background: "var(--bg-second)", borderColor: "var(--border-default)" }}
      >
        <div
          className="flex items-center justify-between px-5 py-3.5 border-b"
          style={{ borderColor: "var(--border-default)" }}
        >
          <p
            className="text-sm font-semibold"
            style={{ color: "var(--text-default)" }}
          >
            Bugungi roundlar
          </p>
          {todayRounds.length > 0 && (
            <button
              onClick={clearRounds}
              className="flex items-center gap-1.5 text-xs font-medium transition-all active:scale-95"
              style={{ color: "#ef4444" }}
            >
              <LuTrash2 size={13} />
              Tozalash
            </button>
          )}
        </div>

        {todayRounds.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-12">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ background: "var(--bg-hover)" }}
            >
              <LuInbox size={22} style={{ color: "var(--text-muted)" }} />
            </div>
            <p className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>
              Hali roundlar yo'q
            </p>
            <p className="text-xs" style={{ color: "var(--text-dim)" }}>
              To'lov sahifasidan round boshlang
            </p>
          </div>
        ) : (
          <div className="px-5">
            {todayRounds.map((r, i) => (
              <RoundRow
                key={r.id}
                round={r}
                last={i === todayRounds.length - 1}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
