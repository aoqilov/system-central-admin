import React from "react";
import {
  LuUsers,
  LuFerrisWheel,
  LuWrench,
  LuCircleX,
  LuTrendingUp,
  LuBanknote,
} from "react-icons/lu";
import { attractions } from "../../../../../../data/attractions";

const openCount        = attractions.filter((a) => a.status === "open").length;
const maintenanceCount = attractions.filter((a) => a.status === "maintenance").length;
const closedCount      = attractions.filter((a) => a.status === "closed").length;

const totalVisitors = attractions.reduce(
  (sum, a) => sum + (a.statsVisitors?.slice(-1)[0]?.count ?? 0),
  0,
);

const totalRevenue = attractions.reduce(
  (sum, a) => sum + (a.statsRevenue?.slice(-1)[0]?.amount ?? 0),
  0,
);

const totalRounds = attractions
  .filter((a) => a.status === "open")
  .reduce((sum, a) => {
    const todayVisitors = a.statsVisitors?.slice(-1)[0]?.count ?? 0;
    const places = a.rulesAttraction?.numberOfPlaceRound ?? 1;
    return sum + Math.ceil(todayVisitors / places);
  }, 0);

const CARDS: {
  label: string;
  value: string;
  sub?: string;
  color: string;
  icon: React.ElementType;
}[] = [
  { label: "Bugungi tashrifchilar", value: totalVisitors.toLocaleString(), sub: "kishi",   color: "#3b82f6", icon: LuUsers      },
  { label: "Faol attraksionlar",    value: String(openCount),              sub: `${openCount + maintenanceCount + closedCount} ta jami`, color: "#22c55e", icon: LuFerrisWheel },
  { label: "Ta'mirlashda",          value: String(maintenanceCount),       sub: "attraksion", color: "#eab308", icon: LuWrench    },
  { label: "Yopiq",                 value: String(closedCount),            sub: "attraksion", color: "#6b7280", icon: LuCircleX   },
  { label: "Jami turlar",           value: totalRounds.toLocaleString(),   sub: "bugun",   color: "#06b6d4", icon: LuTrendingUp  },
  { label: "Bugungi daromad",       value: `${(totalRevenue / 1_000_000).toFixed(2)} mln`, sub: "so'm", color: "#8b5cf6", icon: LuBanknote },
];

export function AttractionStatCards() {
  return (
    <div className="grid grid-cols-2 tablet:grid-cols-3 desktop:grid-cols-6 gap-3">
      {CARDS.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className="flex flex-col gap-1.5 rounded-xl border p-3"
            style={{ background: "var(--bg-second)", borderColor: "var(--border-default)" }}
          >
            <div className="flex items-center justify-between gap-1">
              <span
                className="text-[10px] font-semibold truncate"
                style={{ color: "var(--text-muted)" }}
              >
                {card.label}
              </span>
              <div
                className="w-5 h-5 rounded-md flex items-center justify-center shrink-0"
                style={{ background: `${card.color}18` }}
              >
                <Icon size={11} style={{ color: card.color }} />
              </div>
            </div>
            <p
              className="font-bold leading-none"
              style={{ fontSize: 20, color: card.color }}
            >
              {card.value}
            </p>
            {card.sub && (
              <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                {card.sub}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
