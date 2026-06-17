import { LuArrowLeft } from "react-icons/lu";
import { CusButton } from "../../../../components/ui/buttons/CusButton";
import { useTranslation } from "../../../../i18n/languageConfig";
import { useAttractionDetail } from "./hooks/useAttractionDetail";
import { AttractionCard } from "./components/AttractionCard";
import { OperatorCard } from "./components/OperatorCard";
import { VisitorsChart } from "./components/VisitorsChart";
import { RevenueChart } from "./components/RevenueChart";
import { AsideInfoCard } from "./components/AsideInfoCard";
import { AssignOperatorModal } from "./modals/AssignOperatorModal";
import { HistoryDrawer } from "./modals/HistoryDrawer";

export default function FeatureAttractionDetail() {
  const { t } = useTranslation("attractionDetail.");
  const {
    attraction,
    operator,
    helpers,
    visitorChartData,
    revenueChartData,
    connectedDate,
    connectedDays,
    assignCandidates,
    assignOpen,
    setAssignOpen,
    historyOpen,
    setHistoryOpen,
    selectedEmp,
    setSelectedEmp,
    handleAssign,
    navigate,
  } = useAttractionDetail();

  if (!attraction) {
    return (
      <div className="p-6 flex flex-col items-center justify-center gap-3" style={{ minHeight: 400 }}>
        <p className="text-base font-semibold" style={{ color: "var(--text-default)" }}>
          {t("notFound")}
        </p>
        <CusButton
          size="sm"
          variant="outline"
          leftIcon={<LuArrowLeft size={14} />}
          onClick={() => navigate("/attractions")}
        >
          {t("backTo")}
        </CusButton>
      </div>
    );
  }

  return (
    <div className="p-4 tablet:p-6 space-y-4">
      <CusButton
        variant="outline"
        onClick={() => navigate("/attractions")}
        colorPalette="gray"
        size="xs"
      >
        <LuArrowLeft size={14} />
        {t("backTo")}
      </CusButton>

      {/* Row 1: Attraction + Operator */}
      <div className="grid grid-cols-1 desktop:grid-cols-[3fr_2fr] gap-4 items-stretch">
        <AttractionCard
          attraction={attraction}
          onHistoryOpen={() => setHistoryOpen(true)}
        />
        <OperatorCard
          operator={operator}
          helpers={helpers}
          connectedDate={connectedDate}
          connectedDays={connectedDays}
          onAssignOpen={() => setAssignOpen(true)}
        />
      </div>

      {/* Body: Charts + Aside */}
      <div className="grid grid-cols-1 desktop:grid-cols-[3fr_1.2fr] gap-4 items-start">
        <div className="space-y-4">
          <VisitorsChart data={visitorChartData} />
          <RevenueChart data={revenueChartData} />
        </div>
        <AsideInfoCard attraction={attraction} />
      </div>

      <HistoryDrawer
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        attraction={attraction}
        operator={operator}
        helpers={helpers}
        connectedDate={connectedDate}
      />

      <AssignOperatorModal
        open={assignOpen}
        onClose={() => {
          setAssignOpen(false);
          setSelectedEmp(null);
        }}
        candidates={assignCandidates}
        selectedEmp={selectedEmp}
        onSelect={setSelectedEmp}
        onConfirm={handleAssign}
      />
    </div>
  );
}
