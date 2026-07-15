import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { LuArrowLeft } from "react-icons/lu";
import { CusButton } from "@/components/ui/buttons/CusButton";
import { useAttractionDetail, useRemoveAttractionOperator } from "./hooks/useApiAttractionDetail";
import { AttractionCard } from "./components/AttractionCard";
import { VisitorsChart } from "./components/VisitorsChart";
import { RevenueChart } from "./components/RevenueChart";
import { AssignOperatorModal } from "./modals/AssignOperatorModal";
import { HistoryDrawer } from "./modals/HistoryDrawer";
import { OperatorSection } from "./components/OperatorSection";

export default function FeatureAttractionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [assignOpen, setAssignOpen] = useState(false);
  const [assignHelperOpen, setAssignHelperOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [removingHelperIds, setRemovingHelperIds] = useState<number[]>([]);

  const removeMutation = useRemoveAttractionOperator(Number(id));

  const { data: attraction, isLoading, isError } = useAttractionDetail(id);

  if (isLoading) {
    return (
      <div
        className="p-6 flex items-center justify-center"
        style={{ minHeight: 400 }}
      >
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Загрузка...
        </p>
      </div>
    );
  }

  if (isError || !attraction) {
    return (
      <div
        className="p-6 flex flex-col items-center justify-center gap-3"
        style={{ minHeight: 400 }}
      >
        <p
          className="text-base font-semibold"
          style={{ color: "var(--text-default)" }}
        >
          Аттракцион не найден
        </p>
        <CusButton
          size="sm"
          variant="outline"
          leftIcon={<LuArrowLeft size={14} />}
          onClick={() => navigate("/attractions")}
        >
          Назад
        </CusButton>
      </div>
    );
  }

  const mainOperators = attraction.operators.filter((o) => o.type === "main");
  const helpers = attraction.operators.filter((o) => o.type === "assistant");
  const assignedOperatorIds = attraction.operators.map((o) => o.id);
  const visitorChartData: { day: string; visitors: number }[] = [];
  const revenueChartData: { day: string; revenue: number }[] = [];

  return (
    <div className="p-4 tablet:p-6 space-y-4">
      <CusButton
        variant="outline"
        onClick={() => navigate("/attractions")}
        colorPalette="gray"
        size="xs"
      >
        <LuArrowLeft size={14} />
        Назад к аттракционам
      </CusButton>

      {/* Hero card */}
      <AttractionCard
        attraction={attraction}
        onHistoryOpen={() => setHistoryOpen(true)}
      />

      {/* Body: Charts + Aside */}
      <div className="grid grid-cols-1 desktop:grid-cols-[3fr_1.2fr] gap-4 items-start">
        <div className="space-y-4"></div>
        <div>
          <OperatorSection
            mainOperators={mainOperators}
            helpers={helpers}
            onAssignOperator={() => setAssignOpen(true)}
            onAssignHelper={() => setAssignHelperOpen(true)}
            onRemoveOperator={(operatorId) => {
              setRemovingHelperIds((prev) => [...prev, operatorId]);
              removeMutation.mutate(operatorId, {
                onSettled: () =>
                  setRemovingHelperIds((prev) => prev.filter((i) => i !== operatorId)),
              });
            }}
            onRemoveHelper={(operatorId) => {
              setRemovingHelperIds((prev) => [...prev, operatorId]);
              removeMutation.mutate(operatorId, {
                onSettled: () =>
                  setRemovingHelperIds((prev) => prev.filter((i) => i !== operatorId)),
              });
            }}
            removingIds={removingHelperIds}
          />
        </div>
      </div>

      <HistoryDrawer
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        mainOperators={mainOperators}
        helpers={helpers}
      />

      <AssignOperatorModal
        open={assignOpen}
        attractionId={Number(id)}
        assignedIds={assignedOperatorIds}
        onClose={() => setAssignOpen(false)}
      />
      <AssignOperatorModal
        open={assignHelperOpen}
        attractionId={Number(id)}
        type="assistant"
        assignedIds={assignedOperatorIds}
        onClose={() => setAssignHelperOpen(false)}
      />
    </div>
  );
}
