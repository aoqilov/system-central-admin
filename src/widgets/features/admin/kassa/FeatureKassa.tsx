import PageHeader from "@/widgets/shared-ui/PageHeader";
import { KassaStatCards } from "./components/KassaStatCards";
import { KassaTableCard } from "./components/KassaTableCard";

export default function FeatureKassa() {
  return (
    <div className="p-4 tablet:p-6 space-y-6">
      <PageHeader
        label="Финансы"
        title="Кассы"
        subtitle="Управляйте кассовыми точками парка."
      />
      <KassaStatCards />
      <KassaTableCard />
    </div>
  );
}
