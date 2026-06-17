import { LuFerrisWheel } from "react-icons/lu";
import { CusCard, CusCardHeader } from "../../../../../../components/shared/card/CusCard";
import { BarListChart } from "../../../../../../components/charts/chakra/BarListChart";
import { attractions } from "../../../../../../data/attractions";

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

const topAttractions = attractions
  .map((a, i) => ({
    label: a.name,
    value: a.statsVisitors?.slice(-1)[0]?.count ?? 0,
    color: BAR_COLORS[i % BAR_COLORS.length],
  }))
  .sort((a, b) => b.value - a.value)
  .slice(0, 8);

export function TopAttractionsChart() {
  return (
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
  );
}
