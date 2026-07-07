import { useState } from "react";
import dayjs from "dayjs";
import { CusSegment } from "@/components/ui/segment/CusSegment";
import { fmt, STATUS_CFG, type ZReportStatus, type SortKey } from "../helpers";
import type { AttractionZReport, AttrZReport } from "../types";

function AttrCard({ attr }: { attr: AttractionZReport }) {
  const zr: AttrZReport | undefined = attr.zreports[0];
  const statusKey: ZReportStatus = zr?.status ?? "inactive";
  const cfg = STATUS_CFG[statusKey] ?? STATUS_CFG.inactive;

  const stats = [
    { label: "Раунд",  value: zr?.total_rounds     ?? 0, color: "#60a5fa"             },
    { label: "Всего",  value: zr?.total_people     ?? 0, color: "var(--text-default)" },
    { label: "Офлайн", value: zr?.total_offline    ?? 0, color: "#3b82f6"             },
    { label: "Онлайн", value: zr?.total_online     ?? 0, color: "#8b5cf6"             },
    { label: "VIP",    value: zr?.total_vip        ?? 0, color: "#eab308"             },
    { label: "Гость",  value: zr?.total_guest      ?? 0, color: "#06b6d4"             },
    { label: "Сотр.",  value: zr?.total_park_staff ?? 0, color: "#22c55e"             },
  ];

  return (
    <div
      className="rounded-2xl border p-4 flex flex-col gap-3"
      style={{ background: "var(--bg-second)", borderColor: `${cfg.color}30` }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm truncate" style={{ color: "var(--text-default)" }}>
            {attr.name}
          </p>
          <p className="text-[11px] mt-0.5 truncate" style={{ color: "var(--text-muted)" }}>
            {zr?.opened_at ? dayjs(zr.opened_at).format("HH:mm") + " – " + (zr.closed_at ? dayjs(zr.closed_at).format("HH:mm") : "...") : "—"}
          </p>
        </div>
        <span
          className="text-[11px] font-semibold px-2 py-0.5 rounded-lg shrink-0 whitespace-nowrap"
          style={{ background: cfg.bg, color: cfg.color }}
        >
          ● {cfg.label}
        </span>
      </div>

      <div
        className="grid gap-1 py-2.5 border-y"
        style={{ gridTemplateColumns: "repeat(7, 1fr)", borderColor: "var(--border-default)" }}
      >
        {stats.map((s) => (
          <div key={s.label} className="flex flex-col items-center gap-0.5">
            <span className="text-[9px] font-medium" style={{ color: "var(--text-muted)" }}>
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

      <div className="flex items-center justify-between">
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>Итого</span>
        <div>
          <span className="text-sm font-bold" style={{ color: "#22c55e" }}>
            {fmt(zr?.total_amount ?? 0)}
          </span>
          <span className="text-[10px] ml-1" style={{ color: "var(--text-muted)" }}>сум</span>
        </div>
      </div>
    </div>
  );
}

const FILTER_BTNS: { key: ZReportStatus | "all"; label: string; color?: string }[] = [
  { key: "all",      label: "Все"           },
  { key: "open",     label: "Активные",     color: "#22c55e" },
  { key: "stopped",  label: "Остановлен",   color: "#f97316" },
  { key: "waiting",  label: "Ожидание",     color: "#eab308" },
  { key: "inactive", label: "Неактивные",   color: "#6b7280" },
];

function getAttrStatus(attr: AttractionZReport): ZReportStatus {
  return attr.zreports[0]?.status ?? "inactive";
}

interface Props {
  attractions: AttractionZReport[] | undefined;
  isLoading: boolean;
}

export function AttractionsTabView({ attractions = [], isLoading }: Props) {
  const [sortKey,      setSortKey] = useState<SortKey>("name");
  const [filterStatus, setFilter]  = useState<ZReportStatus | "all">("all");

  const filtered = attractions
    .filter((a) => filterStatus === "all" || getAttrStatus(a) === filterStatus)
    .sort((a, b) => {
      if (sortKey === "name")   return a.name.localeCompare(b.name);
      if (sortKey === "status") return getAttrStatus(a).localeCompare(getAttrStatus(b));
      if (sortKey === "rounds") return (b.zreports[0]?.total_rounds ?? 0) - (a.zreports[0]?.total_rounds ?? 0);
      return (b.zreports[0]?.total_amount ?? 0) - (a.zreports[0]?.total_amount ?? 0);
    });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 flex-wrap">
          {FILTER_BTNS.map((f) => {
            const isActive = filterStatus === f.key;
            const count =
              f.key === "all"
                ? attractions.length
                : attractions.filter((a) => getAttrStatus(a) === f.key).length;
            return (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all"
                style={{
                  background:  isActive ? (f.color ? `${f.color}20` : "var(--bg-hover)") : "transparent",
                  borderColor: isActive ? (f.color ?? "var(--border-2)")     : "var(--border-default)",
                  color:       isActive ? (f.color ?? "var(--text-default)") : "var(--text-muted)",
                }}
              >
                {f.label}
                <span className="ml-1.5 opacity-60">{count}</span>
              </button>
            );
          })}
        </div>

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

      {isLoading ? (
        <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))" }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-[200px] rounded-2xl animate-pulse"
              style={{ background: "var(--bg-second)", border: "1px solid var(--border-default)" }}
            />
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))" }}>
          {filtered.map((a) => (
            <AttrCard key={a.id} attr={a} />
          ))}
        </div>
      ) : (
        <p className="text-center py-12 text-sm" style={{ color: "var(--text-muted)" }}>
          Нет данных для отображения
        </p>
      )}
    </div>
  );
}
