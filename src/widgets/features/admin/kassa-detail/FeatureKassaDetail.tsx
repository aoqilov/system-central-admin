import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { LuArrowLeft } from "react-icons/lu";
import { CusButton } from "@/components/ui/buttons/CusButton";
import { fetchCashbox, deleteOperatorFromCashbox } from "./api/apiKassaDetail";
import { KassaInfoCard } from "./components/KassaInfoCard";
import { KassaOperatorSection } from "./components/KassaOperatorSection";
import { KassaInfoSection } from "./components/KassaInfoSection";
import { AssignCashierModal } from "./modals/AssignCashierModal";

export default function FeatureKassaDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [assignOpen, setAssignOpen] = useState(false);

  const { data: kassa, isLoading, isError } = useQuery({
    queryKey: ["cashbox-detail", id],
    queryFn: () => fetchCashbox(Number(id)),
    enabled: !!id,
  });

  const [removingIds, setRemovingIds] = useState<number[]>([]);

  const removeMutation = useMutation({
    mutationFn: (operatorId: number) =>
      deleteOperatorFromCashbox(Number(id), operatorId),
    onMutate: (operatorId) =>
      setRemovingIds((prev) => [...prev, operatorId]),
    onSettled: (_, __, operatorId) =>
      setRemovingIds((prev) => prev.filter((x) => x !== operatorId)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cashbox-detail", id] });
    },
  });

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center" style={{ minHeight: 400 }}>
        <span style={{ fontSize: 13, color: "var(--text-muted)" }}>Загрузка...</span>
      </div>
    );
  }

  if (isError || !kassa) {
    return (
      <div className="p-6 flex flex-col items-center justify-center gap-3" style={{ minHeight: 400 }}>
        <p className="text-base font-semibold" style={{ color: "var(--text-default)" }}>
          Касса не найдена
        </p>
        <CusButton
          size="sm"
          variant="outline"
          leftIcon={<LuArrowLeft size={14} />}
          onClick={() => {
            queryClient.invalidateQueries({ queryKey: ["cashboxes"] });
            navigate("/kassa");
          }}
        >
          Вернуться к кассам
        </CusButton>
      </div>
    );
  }

  function goBack() {
    queryClient.invalidateQueries({ queryKey: ["cashboxes"] });
    navigate("/kassa");
  }

  return (
    <div className="p-4 tablet:p-6 space-y-4">
      <CusButton
        variant="outline"
        colorPalette="gray"
        size="xs"
        onClick={goBack}
      >
        <LuArrowLeft size={14} />
        Вернуться к кассам
      </CusButton>

      <div className="grid grid-cols-1 desktop:grid-cols-[3fr_2fr] gap-4 items-start">
        <KassaInfoCard kassa={kassa} />
        <KassaOperatorSection
          operators={kassa.operators}
          onAssign={() => setAssignOpen(true)}
          onRemove={(operatorId) => removeMutation.mutate(operatorId)}
          removingIds={removingIds}
        />
      </div>

      <KassaInfoSection kassa={kassa} />

      <AssignCashierModal
        open={assignOpen}
        cashboxId={kassa.id}
        assignedId={kassa.operators.map((o) => o.id)}
        onClose={() => setAssignOpen(false)}
      />
    </div>
  );
}
