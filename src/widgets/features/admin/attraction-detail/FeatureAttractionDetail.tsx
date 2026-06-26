import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { LuArrowLeft } from "react-icons/lu";
import { CusButton } from "@/components/ui/buttons/CusButton";
import { fetchAttractionDetail } from "./api/apiAttractionDetail";
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
  const [historyOpen, setHistoryOpen] = useState(false);

  const {
    data: attraction,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["attraction-detail", id],
    queryFn: () => fetchAttractionDetail(Number(id)),
    enabled: !!id,
  });

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

  const operator = attraction.operator ?? null;
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
            operator={operator}
            onAssignOperator={() => setAssignOpen(true)}
            onAssignHelper={() => {}}
          />
        </div>
      </div>

      <HistoryDrawer
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        operator={operator}
      />

      <AssignOperatorModal
        open={assignOpen}
        attractionId={Number(id)}
        onClose={() => setAssignOpen(false)}
      />
    </div>
  );
}
