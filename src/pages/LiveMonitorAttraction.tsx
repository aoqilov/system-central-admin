import React from "react";
import {
  LuFerrisWheel,
  LuUsers,
  LuWrench,
  LuCircleX,
  LuActivity,
  LuCircleCheck,
  LuClock,
  LuTriangleAlert,
  LuTrendingUp,
  LuBanknote,
} from "react-icons/lu";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { CusCard, CusCardHeader } from "../components/shared/card/CusCard";
import { BarListChart } from "../components/charts/chakra/BarListChart";
import { CusTable, type ColumnDef } from "../components/ui/table/CusTable";
import { attractions } from "../data/attractions";

// ─── Types ────────────────────────────────────────────────────────────────────

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

interface HourlyPoint {
  hour: string;
  visitors: number;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const liveEvents: LiveEvent[] = [
  { id: 1,  time: "17:45", attractionName: "Flying Tigers",  operator: "Jasur K.",   eventType: "round_start", visitors: 16, status: "ok"      },
  { id: 2,  time: "17:44", attractionName: "Galleon",        operator: "Aziz N.",    eventType: "round_end",   visitors: 24, status: "ok"      },
  { id: 3,  time: "17:43", attractionName: "Roller Coaster", operator: "Sherzod T.", eventType: "stop",        visitors: 0,  status: "warning" },
  { id: 4,  time: "17:42", attractionName: "Aqua Splash",    operator: "Feruza O.",  eventType: "round_start", visitors: 12, status: "ok"      },
  { id: 5,  time: "17:41", attractionName: "Mini Train",     operator: "Dilnoza M.", eventType: "round_end",   visitors: 20, status: "ok"      },
  { id: 6,  time: "17:40", attractionName: "Bumper Cars",    operator: "Kamol R.",   eventType: "incident",    visitors: 0,  status: "error"   },
  { id: 7,  time: "17:39", attractionName: "Flying Tigers",  operator: "Jasur K.",   eventType: "round_end",   visitors: 16, status: "ok"      },
  { id: 8,  time: "17:38", attractionName: "Galleon",        operator: "Aziz N.",    eventType: "round_start", visitors: 24, status: "ok"      },
  { id: 9,  time: "17:37", attractionName: "Aqua Splash",    operator: "Feruza O.",  eventType: "round_end",   visitors: 12, status: "ok"      },
  { id: 10, time: "17:36", attractionName: "Roller Coaster", operator: "Sherzod T.", eventType: "resume",      visitors: 30, status: "ok"      },
  { id: 11, time: "17:35", attractionName: "Mini Train",     operator: "Dilnoza M.", eventType: "round_start", visitors: 18, status: "ok"      },
  { id: 12, time: "17:34", attractionName: "Bumper Cars",    operator: "Kamol R.",   eventType: "round_end",   visitors: 22, status: "ok"      },
  { id: 13, time: "17:33", attractionName: "Flying Tigers",  operator: "Jasur K.",   eventType: "round_start", visitors: 14, status: "ok"      },
  { id: 14, time: "17:32", attractionName: "Aqua Splash",    operator: "Feruza O.",  eventType: "stop",        visitors: 0,  status: "warning" },
  { id: 15, time: "17:31", attractionName: "Galleon",        operator: "Aziz N.",    eventType: "round_end",   visitors: 24, status: "ok"      },
];

// ─── Derived from real attractions data ──────────────────────────────────────

const BAR_COLORS = [
  "var(--color-blue)",
  "var(--color-cyan)",
  "var(--color-purple)",
  "var(--color-green)",
  "var(--color-yellow)",
  "var(--color-pink)",
  "var(--color-red)",
  "var(--color-gray)",
];

const openCount        = attractions.filter((a) => a.status === "open").length;
const maintenanceCount = attractions.filter((a) => a.status === "maintenance").length;
const closedCount      = attractions.filter((a) => a.status === "closed").length;

const totalVisitors = attractions.reduce(
  (sum, a) => sum + (a.statsVisitors?.slice(-1)[0]?.count ?? 0), 0,
);

const totalRevenue = attractions.reduce(
  (sum, a) => sum + (a.statsRevenue?.slice(-1)[0]?.amount ?? 0), 0,
);

const totalRounds = attractions
  .filter((a) => a.status === "open")
  .reduce((sum, a) => {
    const todayVisitors = a.statsVisitors?.slice(-1)[0]?.count ?? 0;
    const places        = a.rulesAttraction?.numberOfPlaceRound ?? 1;
    return sum + Math.ceil(todayVisitors / places);
  }, 0);

const topAttractions = attractions
  .map((a, i) => ({
    label: a.name,
    value: a.statsVisitors?.slice(-1)[0]?.count ?? 0,
    color: BAR_COLORS[i % BAR_COLORS.length],
  }))
  .sort((a, b) => b.value - a.value)
  .slice(0, 8);

const hourlyVisitors: HourlyPoint[] = [
  { hour: "09:00", visitors: 42  },
  { hour: "10:00", visitors: 118 },
  { hour: "11:00", visitors: 196 },
  { hour: "12:00", visitors: 244 },
  { hour: "13:00", visitors: 210 },
  { hour: "14:00", visitors: 278 },
  { hour: "15:00", visitors: 312 },
  { hour: "16:00", visitors: 290 },
  { hour: "17:00", visitors: 268 },
  { hour: "17:45", visitors: 152 },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const EVENT_CFG: Record<EventType, { label: string; color: string; icon: React.ElementType }> = {
  round_start: { label: "Tur boshlandi",  color: "var(--color-green)",  icon: LuCircleCheck  },
  round_end:   { label: "Tur yakunlandi", color: "var(--color-cyan)",   icon: LuCircleCheck  },
  stop:        { label: "To'xtatildi",    color: "var(--color-yellow)", icon: LuClock        },
  incident:    { label: "Hodisa",         color: "var(--color-red)",    icon: LuTriangleAlert },
  resume:      { label: "Qayta ishga",    color: "var(--color-blue)",   icon: LuActivity     },
};

const STATUS_DOT: Record<"ok" | "warning" | "error", string> = {
  ok:      "var(--color-green)",
  warning: "var(--color-yellow)",
  error:   "var(--color-red)",
};

// ─── Stat card ────────────────────────────────────────────────────────────────

function StatCard({
  label, value, sub, color, icon: Icon,
}: {
  label: string; value: string; sub?: string; color: string; icon: React.ElementType;
}) {
  return (
    <CusCard className="p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
          {label}
        </span>
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: `${color}18` }}
        >
          <Icon size={15} style={{ color }} />
        </div>
      </div>
      <div>
        <p className="text-xl font-bold" style={{ color: "var(--text-default)" }}>
          {value}
        </p>
        {sub && (
          <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
            {sub}
          </p>
        )}
      </div>
    </CusCard>
  );
}

// ─── Recharts tooltip ─────────────────────────────────────────────────────────

interface TipProps {
  active?: boolean;
  payload?: Array<{ value?: number }>;
  label?: string;
}

function HourlyTooltip({ active, payload, label }: TipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-lg px-3 py-2 text-sm border shadow-xl"
      style={{
        background: "var(--bg-tooltip)",
        borderColor: "var(--border-2)",
        color: "var(--text-4)",
      }}
    >
      <p className="mb-1">{label}</p>
      <p className="font-semibold" style={{ color: "var(--text-default)" }}>
        {payload[0].value?.toLocaleString()}{" "}
        <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>kishi</span>
      </p>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

const LiveMonitorAttraction = () => {

  return (
    <div className="space-y-4">

      {/* ── Row 1: stat cards ──────────────────────────────── */}
      <div className="grid grid-cols-2 tablet:grid-cols-3 desktop:grid-cols-6 gap-4">
        <StatCard
          label="Bugungi tashrifchilar"
          value={totalVisitors.toLocaleString()}
          sub="kishi"
          color="var(--color-blue)"
          icon={LuUsers}
        />
        <StatCard
          label="Faol attraksionlar"
          value={String(openCount)}
          sub={`${openCount + maintenanceCount + closedCount} ta jami`}
          color="var(--color-green)"
          icon={LuFerrisWheel}
        />
        <StatCard
          label="Ta'mirlashda"
          value={String(maintenanceCount)}
          sub="attraksion"
          color="var(--color-yellow)"
          icon={LuWrench}
        />
        <StatCard
          label="Yopiq"
          value={String(closedCount)}
          sub="attraksion"
          color="var(--color-gray)"
          icon={LuCircleX}
        />
        <StatCard
          label="Jami turlar"
          value={totalRounds.toLocaleString()}
          sub="bugun"
          color="var(--color-cyan)"
          icon={LuTrendingUp}
        />
        <StatCard
          label="Bugungi daromad"
          value={`${(totalRevenue / 1_000_000).toFixed(2)} mln`}
          sub="so'm"
          color="var(--color-purple)"
          icon={LuBanknote}
        />
      </div>

      {/* ── Row 2: main body ───────────────────────────────── */}
      <div className="grid grid-cols-1 desktop:grid-cols-[3fr_2fr] gap-4 items-start">

        {/* Left — live event feed */}
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
            columns={[
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
                  <span style={{ fontWeight: 500, color: "var(--text-2)" }}>
                    {ev.attractionName}
                  </span>
                ),
              },
              {
                key: "operator",
                header: "Operator",
                render: (ev) => (
                  <span style={{ color: "var(--text-3)" }}>{ev.operator}</span>
                ),
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
            ] satisfies ColumnDef<LiveEvent>[]}
          />
        </CusCard>

        {/* Right — charts */}
        <div className="flex flex-col gap-4">

          {/* Top attraksionlar */}
          <CusCard>
            <CusCardHeader
              icon={LuFerrisWheel}
              title="Top attraksionlar"
              iconColor="var(--color-blue)"
              action={
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                  Tashrifchilar
                </span>
              }
            />
            <div className="p-4">
              <BarListChart
                data={topAttractions}
                valueFormatter={(v) => `${v} kishi`}
                sort="desc"
                barHeight={32}
                gap={8}
                labelWidth="42%"
              />
            </div>
          </CusCard>

          {/* Soatlik tashrifchilar — AreaChart */}
          <CusCard>
            <CusCardHeader
              icon={LuTrendingUp}
              title="Soatlik tashrifchilar"
              iconColor="var(--color-cyan)"
              action={
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                  Bugun
                </span>
              }
            />
            <div className="px-2 pt-2 pb-3">
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart
                  data={hourlyVisitors}
                  margin={{ top: 8, right: 12, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="attrGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%"   stopColor="#06b6d4" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="#06b6d4" stopOpacity={0}    />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--chart-grid)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="hour"
                    tick={{ fill: "var(--chart-tick)", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    interval={1}
                  />
                  <YAxis
                    tick={{ fill: "var(--chart-tick)", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    content={<HourlyTooltip />}
                    cursor={{ stroke: "var(--border-2)" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="visitors"
                    stroke="#06b6d4"
                    strokeWidth={2.5}
                    fill="url(#attrGrad)"
                    dot={{ fill: "#06b6d4", strokeWidth: 0, r: 3 }}
                    activeDot={{ r: 5, fill: "#06b6d4", stroke: "var(--bg-main)", strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CusCard>

        </div>
      </div>
    </div>
  );
};

export default LiveMonitorAttraction;
