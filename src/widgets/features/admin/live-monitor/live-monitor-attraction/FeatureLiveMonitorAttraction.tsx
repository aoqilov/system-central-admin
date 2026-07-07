import PageHeader from "@/widgets/shared-ui/PageHeader";
import { AttractionTabStatCards } from "./components/AttractionTabStatCards";
import { AttractionsTabView } from "./components/AttractionsTabView";
import { useAttractionZReports } from "./hooks/useAttractionZReports";

const FeatureLiveMonitorAttraction = () => {
  const { totals, attractions, isLoading } = useAttractionZReports();

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
