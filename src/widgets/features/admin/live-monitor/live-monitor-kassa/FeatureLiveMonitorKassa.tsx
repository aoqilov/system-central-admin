import PageHeader from "@/widgets/shared-ui/PageHeader";
import { KassaRevenueCharts } from "./components/KassaRevenueCharts";
import { KassaStatCards } from "./components/KassaStatCards";
import { KassaTransactionFeed } from "./components/KassaTransactionFeed";
import { KassaCardDailyList } from "./components/KassaCardDaily";
import { useZReports } from "./hooks/useZReports";

const FeatureLiveMonitorKassa = () => {
  const { totals, cashboxes, isLoading } = useZReports();

  return (
    <div className="p-4 tablet:p-6 space-y-6">
      <PageHeader
        title="Live monitor"
        subtitle="Мониторинг транзакций кассы в реальном времени"
        highlight="Касса"
      />

      <KassaStatCards totals={totals} isLoading={isLoading} />

      <KassaCardDailyList cashboxes={cashboxes} isLoading={isLoading} />

      <div className="grid grid-cols-1 desktop:grid-cols-[3fr_2fr] gap-4 items-start">
        <KassaTransactionFeed cashboxes={cashboxes ?? []} />

        <div className="flex flex-col gap-4">
          {/* <KassaRevenueCharts /> */}
        </div>
      </div>
    </div>
  );
};

export default FeatureLiveMonitorKassa;
