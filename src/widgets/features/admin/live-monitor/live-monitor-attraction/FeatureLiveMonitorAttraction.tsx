import PageHeader from "@/widgets/shared-ui/PageHeader";
import { AttractionTabStatCards } from "./components/AttractionTabStatCards";
import { AttractionsTabView } from "./components/AttractionsTabView";
import { useApiLiveMonitorAttraction } from "./hooks/useApiLiveMonitorAttraction";

const FeatureLiveMonitorAttraction = () => {
  const { totals, attractions, isLoading } = useApiLiveMonitorAttraction();

  return (
    <div className="p-4 tablet:p-6 space-y-6">
      <PageHeader
        title="Live monitor"
        subtitle="Мониторинг аттракционов в реальном времени"
        highlight="Аттракцион"
      />

      <AttractionTabStatCards totals={totals} isLoading={isLoading} />

      <AttractionsTabView attractions={attractions} isLoading={isLoading} />
    </div>
  );
};

export default FeatureLiveMonitorAttraction;
