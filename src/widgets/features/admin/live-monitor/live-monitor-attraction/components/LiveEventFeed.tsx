import React from "react";
import {
  LuActivity,
  LuCircleCheck,
  LuClock,
  LuTriangleAlert,
} from "react-icons/lu";
import { CusCard, CusCardHeader } from "../../../../../../components/shared/card/CusCard";
import { CusTable, type ColumnDef } from "../../../../../../components/ui/table/CusTable";

type EventType = "round_start" | "round_end" | "stop" | "incident" | "resume";

interface LiveEvent {
  id: number;
  time: string;
  attractionName: string;
  operator: string;
  eventType: EventType;
  visitors: number;
  status: "ok" | "warning" | "error";
}

const EVENT_CFG: Record<EventType, { label: string; color: string; icon: React.ElementType }> = {
  round_start: { label: "Tur boshlandi", color: "var(--color-green)", icon: LuCircleCheck },
  round_end: { label: "Tur yakunlandi", color: "var(--color-cyan)", icon: LuCircleCheck },
  stop: { label: "To'xtatildi", color: "var(--color-yellow)", icon: LuClock },
  incident: { label: "Hodisa", color: "var(--color-red)", icon: LuTriangleAlert },
  resume: { label: "Qayta ishga", color: "var(--color-blue)", icon: LuActivity },
};

const STATUS_DOT: Record<"ok" | "warning" | "error", string> = {
  ok: "var(--color-green)",
  warning: "var(--color-yellow)",
  error: "var(--color-red)",
};

const liveEvents: LiveEvent[] = [
  { id: 1,  time: "17:45", attractionName: "Flying Tigers",  operator: "Jasur K.",   eventType: "round_start", visitors: 16, status: "ok" },
  { id: 2,  time: "17:44", attractionName: "Galleon",        operator: "Aziz N.",    eventType: "round_end",   visitors: 24, status: "ok" },
  { id: 3,  time: "17:43", attractionName: "Roller Coaster", operator: "Sherzod T.", eventType: "stop",        visitors: 0,  status: "warning" },
  { id: 4,  time: "17:42", attractionName: "Aqua Splash",    operator: "Feruza O.",  eventType: "round_start", visitors: 12, status: "ok" },
  { id: 5,  time: "17:41", attractionName: "Mini Train",     operator: "Dilnoza M.", eventType: "round_end",   visitors: 20, status: "ok" },
  { id: 6,  time: "17:40", attractionName: "Bumper Cars",    operator: "Kamol R.",   eventType: "incident",    visitors: 0,  status: "error" },
  { id: 7,  time: "17:39", attractionName: "Flying Tigers",  operator: "Jasur K.",   eventType: "round_end",   visitors: 16, status: "ok" },
  { id: 8,  time: "17:38", attractionName: "Galleon",        operator: "Aziz N.",    eventType: "round_start", visitors: 24, status: "ok" },
  { id: 9,  time: "17:37", attractionName: "Aqua Splash",    operator: "Feruza O.",  eventType: "round_end",   visitors: 12, status: "ok" },
  { id: 10, time: "17:36", attractionName: "Roller Coaster", operator: "Sherzod T.", eventType: "resume",      visitors: 30, status: "ok" },
  { id: 11, time: "17:35", attractionName: "Mini Train",     operator: "Dilnoza M.", eventType: "round_start", visitors: 18, status: "ok" },
  { id: 12, time: "17:34", attractionName: "Bumper Cars",    operator: "Kamol R.",   eventType: "round_end",   visitors: 22, status: "ok" },
  { id: 13, time: "17:33", attractionName: "Flying Tigers",  operator: "Jasur K.",   eventType: "round_start", visitors: 14, status: "ok" },
  { id: 14, time: "17:32", attractionName: "Aqua Splash",    operator: "Feruza O.",  eventType: "stop",        visitors: 0,  status: "warning" },
  { id: 15, time: "17:31", attractionName: "Galleon",        operator: "Aziz N.",    eventType: "round_end",   visitors: 24, status: "ok" },
];

const columns: ColumnDef<LiveEvent>[] = [
  {
    key: "time",
    header: "Vaqt",
    render: (ev) => (
      <span className="font-mono text-xs" style={{ color: "var(--text-muted)" }}>
        {ev.time}
      </span>
    ),
  },
  {
    key: "attractionName",
    header: "Attraksion",
    render: (ev) => (
      <span style={{ fontWeight: 500, color: "var(--text-2)" }}>{ev.attractionName}</span>
    ),
  },
  {
    key: "operator",
    header: "Operator",
    render: (ev) => <span style={{ color: "var(--text-3)" }}>{ev.operator}</span>,
  },
  {
    key: "eventType",
    header: "Hodisa",
    render: (ev) => {
      const cfg = EVENT_CFG[ev.eventType];
      const Icon = cfg.icon;
      return (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            fontSize: 12,
            color: cfg.color,
          }}
        >
          <Icon size={13} />
          {cfg.label}
        </span>
      );
    },
  },
  {
    key: "visitors",
    header: "Tashrif",
    align: "right",
    render: (ev) =>
      ev.visitors > 0 ? (
        <span style={{ fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>
          {ev.visitors}
        </span>
      ) : (
        <span style={{ color: "var(--text-dim)" }}>—</span>
      ),
  },
  {
    key: "status",
    header: "Holat",
    render: (ev) => (
      <span
        style={{
          display: "inline-block",
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: STATUS_DOT[ev.status],
          boxShadow: `0 0 6px ${STATUS_DOT[ev.status]}`,
        }}
      />
    ),
  },
];

export function LiveEventFeed() {
  return (
    <CusCard>
      <CusCardHeader
        icon={LuActivity}
        title="Jonli hodisalar"
        iconColor="var(--color-cyan)"
        action={
          <div className="flex items-center gap-1.5">
            <span
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ background: "var(--color-green)" }}
            />
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
              Live
            </span>
          </div>
        }
      />
      <CusTable<LiveEvent>
        data={liveEvents}
        maxH="400px"
        stickyHeader
        variant="outline"
        colorHeader="var(--bg-hover)"
        size="sm"
        columns={columns}
      />
    </CusCard>
  );
}
