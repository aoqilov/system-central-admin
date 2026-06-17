import { KassaRevenueCharts } from "./components/KassaRevenueCharts";
import { KassaStatCards } from "./components/KassaStatCards";
import { KassaTransactionFeed } from "./components/KassaTransactionFeed";

const FeatureLiveMonitorKassa = () => {
  return (
    <div className="p-4 tablet:p-6 space-y-6">
      <div>
        <p className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>
          Real-time
        </p>
        <h1
          className="text-2xl font-semibold"
          style={{ color: "var(--text-default)" }}
        >
          Live Monitor <span style={{ color: "var(--color-blue)" }}>Kassa</span>
        </h1>
      </div>

      <KassaStatCards />

      <div className="grid grid-cols-1 desktop:grid-cols-[3fr_2fr] gap-4 items-start">
        <KassaTransactionFeed />

        <div className="flex flex-col gap-4">
          <KassaRevenueCharts />
        </div>
      </div>
    </div>
  );
};

export default FeatureLiveMonitorKassa;
