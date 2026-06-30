import { useState } from "react";
import {
  LuPlay, LuUsers, LuWifiOff, LuWifi,
  LuStar, LuUserCheck, LuShield, LuBanknote,
} from "react-icons/lu";
import { AttractionStatCards } from "./components/AttractionStatCards";
import { LiveEventFeed } from "./components/LiveEventFeed";
import { TopAttractionsChart } from "./components/TopAttractionsChart";
import { HourlyVisitorsChart } from "./components/HourlyVisitorsChart";
import { CusSegment } from "@/components/ui/segment/CusSegment";
import { attractions } from "@/data/attractions";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function rng(seed: number) {
  return ((seed * 9301 + 49297) % 233280) / 233280;
}

function fmt(n: number) {
  return n.toLocaleString("ru-RU");
}

function getAttrRounds(id: number) {
  return Math.max(1, Math.round(rng(id * 3) * 8));
}

function getAttrStats(id: number, price: number) {
  const jami      = Math.max(2, Math.round(rng(id * 7) * 14));
  const online    = Math.max(0, Math.round(jami * rng(id * 13) * 0.4));
  const asosiy    = Math.max(0, Math.round((jami - online) * rng(id * 11) * 0.8));
  const vip       = Math.max(0, Math.round(jami * rng(id * 17) * 0.15));
  const mehmon    = Math.max(0, Math.round(jami * rng(id * 19) * 0.12));
  const parkXodim = Math.max(0, Math.round(jami * rng(id * 23) * 0.05));
  const total     = (asosiy + online) * price;
  return { jami, online, asosiy, vip, mehmon, parkXodim, total };
}

// ─── Config ───────────────────────────────────────────────────────────────────

const OPERATOR_NAMES = [
  "Алишер Т.", "Бобур К.", "Санжар М.",
  "Дилноза Р.", "Фарход Н.", "Мадина О.", "Умид Ю.",
];

const STATUS_CFG = {
  open:        { label: "Активен",      color: "#22c55e", bg: "#22c55e15" },
  maintenance: { label: "Остановлен",   color: "#f97316", bg: "#f9731615" },
  closed:      { label: "Неактивен",    color: "#6b7280", bg: "#6b728015" },
} as const;

type AttrStatus = keyof typeof STATUS_CFG;
type SortKey    = "name" | "rounds" | "total" | "status";

// ─── AttractionTabStatCards ───────────────────────────────────────────────────

function AttractionTabStatCards() {
  const totalRounds   = attractions.reduce((s, a) => s + getAttrRounds(a.id), 0);
  const totals        = attractions.reduce(
    (acc, a) => {
      const st = getAttrStats(a.id, a.price);
      acc.jami      += st.jami;
      acc.asosiy    += st.asosiy;
      acc.online    += st.online;
      acc.vip       += st.vip;
      acc.mehmon    += st.mehmon;
      acc.parkXodim += st.parkXodim;
      acc.total     += st.total;
      return acc;
    },
    { jami: 0, asosiy: 0, online: 0, vip: 0, mehmon: 0, parkXodim: 0, total: 0 },
  );

  const CARDS: { label: string; value: string; sub?: string; color: string; icon: React.ElementType }[] = [
    { label: "Раунды",     value: String(totalRounds),                                             color: "#60a5fa", icon: LuPlay       },
    { label: "Всего",      value: String(totals.jami),                                             color: "var(--text-default)", icon: LuUsers     },
    { label: "Офлайн",     value: String(totals.asosiy),                                           color: "#3b82f6", icon: LuWifiOff    },
    { label: "Онлайн",     value: String(totals.online),                                           color: "#8b5cf6", icon: LuWifi       },
    { label: "VIP",        value: String(totals.vip),                                              color: "#eab308", icon: LuStar       },
    { label: "Гость",      value: String(totals.mehmon),                                           color: "#06b6d4", icon: LuUserCheck  },
    { label: "Сотрудник",  value: String(totals.parkXodim),                                       color: "#22c55e", icon: LuShield     },
    { label: "Итого",      value: fmt(totals.total),                         sub: "сум",           color: "#22c55e", icon: LuBanknote   },
  ];

  return (
    <div className="grid grid-cols-4 tablet:grid-cols-8 gap-2">
      {CARDS.map((card) => {
        const Icon = card.icon;
        const isDefault = card.color === "var(--text-default)";
        const col = isDefault ? "#6b7280" : card.color;
        return (
          <div
            key={card.label}
            className="flex flex-col gap-1.5 rounded-xl border p-3"
            style={{ background: "var(--bg-second)", borderColor: "var(--border-default)" }}
          >
            <div className="flex items-center justify-between gap-1">
              <span className="text-[10px] font-semibold truncate" style={{ color: "var(--text-muted)" }}>
                {card.label}
              </span>
              <div
                className="w-5 h-5 rounded-md flex items-center justify-center shrink-0"
                style={{ background: `${col}18` }}
              >
                <Icon size={11} style={{ color: col }} />
              </div>
            </div>
            <p
              className="font-bold leading-none"
              style={{ fontSize: 20, color: isDefault ? "var(--text-default)" : card.color }}
            >
              {card.value}
            </p>
            {card.sub && (
              <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>{card.sub}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── AttrCard ─────────────────────────────────────────────────────────────────

function AttrCard({ a }: { a: (typeof attractions)[0] }) {
  const status    = (a.status ?? "open") as AttrStatus;
  const cfg       = STATUS_CFG[status] ?? STATUS_CFG.open;
  const roundCount = getAttrRounds(a.id);
  const { jami, online, asosiy, vip, mehmon, parkXodim, total } = getAttrStats(a.id, a.price);
  const operName  = OPERATOR_NAMES[a.id % OPERATOR_NAMES.length];

  const stats = [
    { label: "Раунд",  value: roundCount, color: "#60a5fa"               },
    { label: "Всего",  value: jami,       color: "var(--text-default)"   },
    { label: "Офлайн", value: asosiy,     color: "#3b82f6"               },
    { label: "Онлайн", value: online,     color: "#8b5cf6"               },
    { label: "VIP",    value: vip,        color: "#eab308"               },
    { label: "Гость",  value: mehmon,     color: "#06b6d4"               },
    { label: "Сотр.",  value: parkXodim,  color: "#22c55e"               },
  ];

  return (
    <div
      className="rounded-2xl border p-4 flex flex-col gap-3"
      style={{ background: "var(--bg-second)", borderColor: `${cfg.color}30` }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p
            className="font-semibold text-sm truncate"
            style={{ color: "var(--text-default)" }}
          >
            {a.name}
          </p>
          <p className="text-[11px] mt-0.5 truncate" style={{ color: "var(--text-muted)" }}>
            Оператор: {operName} · 09:00 – 22:00
          </p>
        </div>
        <span
          className="text-[11px] font-semibold px-2 py-0.5 rounded-lg shrink-0 whitespace-nowrap"
          style={{ background: cfg.bg, color: cfg.color }}
        >
          ● {cfg.label}
        </span>
      </div>

      {/* Stats row */}
      <div
        className="grid gap-1 py-2.5 border-y"
        style={{
          gridTemplateColumns: "repeat(7, 1fr)",
          borderColor: "var(--border-default)",
        }}
      >
        {stats.map((s) => (
          <div key={s.label} className="flex flex-col items-center gap-0.5">
            <span
              className="text-[9px] font-medium"
              style={{ color: "var(--text-muted)" }}
            >
              {s.label}
            </span>
            <span
              className="text-sm font-bold leading-none"
              style={{ color: s.value > 0 ? s.color : "var(--text-dim)" }}
            >
              {s.value > 0 ? s.value : "—"}
            </span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>
          Итого
        </span>
        <div>
          <span className="text-sm font-bold" style={{ color: "#22c55e" }}>
            {fmt(total)}
          </span>
          <span className="text-[10px] ml-1" style={{ color: "var(--text-muted)" }}>
            сум
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── AttractionsTabView ───────────────────────────────────────────────────────

function AttractionsTabView() {
  const [sortKey,      setSortKey]   = useState<SortKey>("name");
  const [filterStatus, setFilter]    = useState<AttrStatus | "all">("all");

  const FILTER_BTNS: { key: AttrStatus | "all"; label: string; color?: string }[] = [
    { key: "all",         label: "Все"            },
    { key: "open",        label: "Активные",      color: "#22c55e" },
    { key: "maintenance", label: "Остановленные", color: "#f97316" },
    { key: "closed",      label: "Неактивные",    color: "#6b7280" },
  ];

  const filtered = attractions
    .filter((a) => filterStatus === "all" || a.status === filterStatus)
    .sort((a, b) => {
      if (sortKey === "name")   return a.name.localeCompare(b.name);
      if (sortKey === "status") return a.status.localeCompare(b.status);
      if (sortKey === "rounds") return getAttrRounds(b.id) - getAttrRounds(a.id);
      return getAttrStats(b.id, b.price).total - getAttrStats(a.id, a.price).total;
    });

  return (
    <div className="flex flex-col gap-4">
      {/* Controls */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        {/* Filter pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {FILTER_BTNS.map((f) => {
            const isActive = filterStatus === f.key;
            const count =
              f.key === "all"
                ? attractions.length
                : attractions.filter((a) => a.status === f.key).length;
            return (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all"
                style={{
                  background:  isActive ? (f.color ? `${f.color}20` : "var(--bg-hover)") : "transparent",
                  borderColor: isActive ? (f.color ?? "var(--border-2)")       : "var(--border-default)",
                  color:       isActive ? (f.color ?? "var(--text-default)")   : "var(--text-muted)",
                }}
              >
                {f.label}
                <span className="ml-1.5 opacity-60">{count}</span>
              </button>
            );
          })}
        </div>

        {/* Sort */}
        <CusSegment
          layout="inline"
          size="sm"
          value={sortKey}
          onValueChange={(v) => setSortKey(v as SortKey)}
          items={[
            { id: "name",   label: "А–Я"    },
            { id: "rounds", label: "Раунды" },
            { id: "total",  label: "Сумма"  },
            { id: "status", label: "Статус" },
          ]}
        />
      </div>

      {/* Cards grid */}
      {filtered.length > 0 ? (
        <div
          className="grid gap-3"
          style={{ gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))" }}
        >
          {filtered.map((a) => (
            <AttrCard key={a.id} a={a} />
          ))}
        </div>
      ) : (
        <p
          className="text-center py-12 text-sm"
          style={{ color: "var(--text-muted)" }}
        >
          Нет данных для отображения
        </p>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const FeatureLiveMonitorAttraction = () => {
  const [tab, setTab] = useState("umumiy");

  return (
    <div className="p-4 tablet:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>
            Real-time
          </p>
          <h1
            className="text-2xl font-semibold"
            style={{ color: "var(--text-default)" }}
          >
            Live Monitor{" "}
            <span style={{ color: "var(--color-blue)" }}>Аттракцион</span>
          </h1>
        </div>
        <CusSegment
          layout="inline"
          size="sm"
          value={tab}
          onValueChange={setTab}
          items={[
            { id: "umumiy",        label: "Общая"       },
            { id: "attractionlar", label: "Аттракционы" },
          ]}
        />
      </div>

      {tab === "umumiy" ? <AttractionStatCards /> : <AttractionTabStatCards />}

      {tab === "umumiy" ? (
        <div className="grid grid-cols-1 desktop:grid-cols-[3fr_2fr] gap-4 items-start">
          <LiveEventFeed />
          <div className="flex flex-col gap-4">
            <TopAttractionsChart />
            <HourlyVisitorsChart />
          </div>
        </div>
      ) : (
        <AttractionsTabView />
      )}
    </div>
  );
};

export default FeatureLiveMonitorAttraction;
