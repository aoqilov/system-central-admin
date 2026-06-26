import React from "react";
import {
  LuPlay,
  LuUsers,
  LuBanknote,
  LuPower,
  LuPowerOff,
} from "react-icons/lu";
import dayjs from "dayjs";
import { fmt, type Round, type SmenaInfo } from "../types";

interface Props {
  attractionName: string;
  smenaOpen: boolean;
  smenaInfo: SmenaInfo;
  rounds: Round[];
  onOpen: () => void;
  onClose: () => void;
}

export function AttractionSmenaCard({
  attractionName,
  smenaOpen,
  smenaInfo,
  rounds,
  onOpen,
  onClose,
}: Props) {
  const totalPeople  = rounds.reduce((s, r) => s + r.clientCount, 0);
  const totalRevenue = rounds.reduce((s, r) => s + r.total, 0);

  return (
    <div
      className="rounded-2xl border overflow-hidden"
      style={{ background: "var(--bg-second)", borderColor: "var(--border-default)" }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-4 pb-3">
        <div
          className="w-11 h-11 rounded-xl shrink-0 flex items-center justify-center"
          style={{ background: "#3b82f618" }}
        >
          <LuPlay size={18} style={{ color: "#3b82f6" }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold truncate" style={{ fontSize: 16, color: "var(--text-default)" }}>
            {attractionName}
          </p>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
            {dayjs().format("DD.MM.YYYY")} — сегодняшние результаты
          </p>
        </div>

        {smenaOpen ? (
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl font-semibold text-xs transition-all active:scale-95 shrink-0"
            style={{ background: "#ef444418", color: "#ef4444", border: "1px solid #ef444440" }}
          >
            <LuPowerOff size={13} />
            Закрыть
          </button>
        ) : (
          <button
            onClick={onOpen}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl font-semibold text-xs transition-all active:scale-95 shrink-0"
            style={{ background: "#22c55e18", color: "#22c55e", border: "1px solid #22c55e40" }}
          >
            <LuPower size={13} />
            Открыть
          </button>
        )}
      </div>

      {/* Smena open state */}
      {smenaOpen ? (
        <>
          {/* Smena info row */}
          <div
            className="mx-4 mb-3 px-3 py-2.5 rounded-xl flex items-center gap-4"
            style={{ background: "var(--bg-hover)" }}
          >
            <div>
              <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>Смена</p>
              <p className="text-sm font-bold" style={{ color: "var(--text-default)" }}>
                #{smenaInfo.number}
              </p>
            </div>
            <div className="w-px h-6 shrink-0" style={{ background: "var(--border-default)" }} />
            <div>
              <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>Открыта</p>
              <p className="text-sm font-bold font-mono" style={{ color: "var(--text-default)" }}>
                {smenaInfo.openedAt}
              </p>
            </div>
            <div className="w-px h-6 shrink-0" style={{ background: "var(--border-default)" }} />
            <div className="min-w-0">
              <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>Оператор</p>
              <p className="text-sm font-semibold truncate" style={{ color: "var(--text-default)" }}>
                {smenaInfo.operatorName}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div
            className="grid grid-cols-3 border-t"
            style={{ borderColor: "var(--border-default)" }}
          >
            {(
              [
                { label: "Раундов",   value: String(rounds.length), Icon: LuPlay as React.ElementType,     color: "#3b82f6", big: true  },
                { label: "Клиентов",  value: String(totalPeople),   Icon: LuUsers as React.ElementType,    color: "#8b5cf6", big: true  },
                { label: "Итого сум", value: fmt(totalRevenue),     Icon: LuBanknote as React.ElementType, color: "#22c55e", big: false },
              ] as const
            ).map((s, i) => (
              <div
                key={s.label}
                className="flex flex-col items-center justify-center gap-1 py-4"
                style={i < 2 ? { borderRight: "1px solid var(--border-default)" } : undefined}
              >
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: `${s.color}18` }}
                >
                  <s.Icon size={14} style={{ color: s.color }} />
                </div>
                <p
                  className="font-bold text-center break-all px-1 leading-tight"
                  style={{ fontSize: s.big ? 22 : 14, color: "var(--text-default)" }}
                >
                  {s.value}
                </p>
                <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </>
      ) : (
        /* No smena placeholder */
        <div
          className="mx-4 mb-4 px-4 py-4 rounded-xl flex items-center justify-center"
          style={{ background: "var(--bg-hover)" }}
        >
          <p className="text-sm text-center" style={{ color: "var(--text-muted)" }}>
            Смена не открыта. Нажмите «Открыть» чтобы начать.
          </p>
        </div>
      )}
    </div>
  );
}
