import {
  LuUsers,
  LuFerrisWheel,
  LuWrench,
  LuCircleX,
  LuTrendingUp,
  LuBanknote,
} from "react-icons/lu";
import { attractions } from "../../../../../../data/attractions";
import { StatCard } from "./StatCard";

const openCount = attractions.filter((a) => a.status === "open").length;
const maintenanceCount = attractions.filter((a) => a.status === "maintenance").length;
const closedCount = attractions.filter((a) => a.status === "closed").length;

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

export function AttractionStatCards() {
  return (
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
  );
}
