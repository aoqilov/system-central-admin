import { AttractionStatCards } from "./components/AttractionStatCards";
import { LiveEventFeed } from "./components/LiveEventFeed";
import { TopAttractionsChart } from "./components/TopAttractionsChart";
import { HourlyVisitorsChart } from "./components/HourlyVisitorsChart";

const FeatureLiveMonitorAttraction = () => {
  return (
    <div className="p-4 tablet:p-6 space-y-6">
      <div>
        <p className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>
          Real-time
        </p>
        <h1 className="text-2xl font-semibold" style={{ color: "var(--text-default)" }}>
          Live Monitor{" "}
          <span style={{ color: "var(--color-blue)" }}>Attraksion</span>
        </h1>
      </div>

      <AttractionStatCards />

      <div className="grid grid-cols-1 desktop:grid-cols-[3fr_2fr] gap-4 items-start">
        <LiveEventFeed />

        <div className="flex flex-col gap-4">
          <TopAttractionsChart />
          <HourlyVisitorsChart />
        </div>
      </div>
    </div>
  );
};

export default FeatureLiveMonitorAttraction;
