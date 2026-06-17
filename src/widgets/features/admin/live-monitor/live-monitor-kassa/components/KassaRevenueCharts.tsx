import { LuBanknote, LuTrendingUp } from "react-icons/lu";
import {
  CusCard,
  CusCardHeader,
} from "../../../../../../components/shared/card/CusCard";
import { BarListChart } from "../../../../../../components/charts/chakra/BarListChart";

const fmtFull = (v: number) => `${v.toLocaleString()} so'm`;

const kassaRevenue = [
  { label: "Bosh Kassa", value: 4_850_000, color: "var(--color-blue)" },
  { label: "Kassa #7", value: 3_780_000, color: "var(--color-purple)" },
  { label: "Kassa #2", value: 3_210_000, color: "var(--color-cyan)" },
  { label: "Kassa #4", value: 2_640_000, color: "var(--color-green)" },
  { label: "Kassa #5", value: 1_920_000, color: "var(--color-yellow)" },
];

const selfPayBreakdown = [
  { label: "Payme", value: 5_870_000, color: "#1fce6b" },
  { label: "Click", value: 4_350_000, color: "#1a73e8" },
  { label: "Uzumbank", value: 3_120_000, color: "#f97316" },
];

export function KassaRevenueCharts() {
  return (
    <>
      <CusCard>
        <CusCardHeader
          icon={LuBanknote}
          title="Kassalar daromadi"
          iconColor="var(--color-blue)"
          action={
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
              Bugun
            </span>
          }
        />
        <div className="p-4">
          <BarListChart
            data={kassaRevenue}
            valueFormatter={fmtFull}
            sort="desc"
            barHeight={34}
            gap={10}
            labelWidth="38%"
          />
        </div>
      </CusCard>

      <CusCard>
        <CusCardHeader
          icon={LuTrendingUp}
          title="Mijoz o'z-hisobini toldirgan to'lovi"
          iconColor="var(--color-cyan)"
          action={
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
              Bugun
            </span>
          }
        />
        <div className="p-4">
          <BarListChart
            data={selfPayBreakdown}
            valueFormatter={fmtFull}
            sort="desc"
            barHeight={34}
            gap={10}
            labelWidth="38%"
          />
        </div>
      </CusCard>
    </>
  );
}
