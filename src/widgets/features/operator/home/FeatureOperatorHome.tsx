import { LuFerrisWheel } from "react-icons/lu";
import { fmtDate } from "@/utils/dateUtils";
import PageHeader from "@/widgets/shared-ui/PageHeader";
import { useOperatorAttraction } from "../hooks/useOperatorAttraction";
import { useOperatorHome } from "./hooks";
import { RoundStatsRow } from "./components/RoundStatsRow";
import { RoundsTable } from "./components/RoundsTable";

export default function FeatureOperatorHome() {
  const { attraction } = useOperatorAttraction();
  const { rounds, totals, activeXreport, isLoading } = useOperatorHome(attraction?.id);

  const date = fmtDate(new Date());

  if (isLoading) {
    return (
      <div className="p-4 flex flex-col gap-5 pb-6">
        <PageHeader title={attraction?.name ?? "Bosh sahifa"} subtitle={date} />
        <div
          className="rounded-2xl border px-5 py-10 flex items-center justify-center gap-3"
          style={{ background: "var(--bg-second)", borderColor: "var(--border-default)" }}
        >
          <LuFerrisWheel size={20} className="animate-spin" style={{ color: "var(--text-muted)" }} />
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 flex flex-col gap-5 pb-6">
      <PageHeader
        title={attraction?.name ?? "Bosh sahifa"}
        subtitle={`${date} · Bugungi aylanishlar`}
      />

      <RoundStatsRow activeXreport={activeXreport} />

      <RoundsTable rounds={rounds} totals={totals} />
    </div>
  );
}
