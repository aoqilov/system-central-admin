import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { LuPlus } from "react-icons/lu";
import { CusButton } from "@/components/ui/buttons/CusButton";
import PageHeader from "@/widgets/shared-ui/PageHeader";
import { getAksiyalar } from "./api/marketingAksiyaApi";
import { AksiyaCard } from "./components/AksiyaCard";
import { AksiyaSectionHeader } from "./components/AksiyaSectionHeader";
import { PackageBuilderView } from "./components/PackageBuilderView";
import type { AksiyaItem } from "./marketing-aksiya.types";

const GRID = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 340px))",
  gap: 16,
} as const;

export default function FeatureMarketingAksiya() {
  const [builderOpen, setBuilderOpen] = useState(false);

  const [showActive, setShowActive] = useState(true);
  const [showPlan, setShowPlan] = useState(true);
  const [showArchive, setShowArchive] = useState(true);

  const [editItem, setEditItem] = useState<AksiyaItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<AksiyaItem | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["marketing-aksiya"],
    queryFn: getAksiyalar,
  });

  const active = data?.active ?? [];
  const plan = data?.plan ?? [];
  const archive = data?.archive ?? [];

  const activeLimit = 1;
  const isActiveFull = active.length >= activeLimit;

  if (builderOpen) {
    return <PackageBuilderView onClose={() => setBuilderOpen(false)} />;
  }

  return (
    <div className="p-4 tablet:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <PageHeader
          title="Маркетинг:"
          highlight="Акции"
          subtitle="Пакетные предложения на аттракционы"
        />
        <CusButton
          colorPalette="blue"
          leftIcon={<LuPlus size={14} />}
          onClick={() => setBuilderOpen(true)}
        >
          Добавить
        </CusButton>
      </div>

      {/* Skeleton */}
      {isLoading && (
        <div style={GRID}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl animate-pulse"
              style={{ height: 480, background: "var(--bg-second)" }}
            />
          ))}
        </div>
      )}

      {!isLoading && (
        <div className="space-y-6">
          {/* ── Активные ─────────────────────────────── */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <AksiyaSectionHeader
                label="Активные"
                count={active.length}
                color="var(--color-green)"
                open={showActive}
                onToggle={() => setShowActive((p) => !p)}
              />
              {isActiveFull && (
                <span
                  className="shrink-0 text-xs px-2 py-0.5 rounded-full"
                  style={{ background: "#fef9c3", color: "#854d0e" }}
                >
                  Лимит {active.length}/{activeLimit}
                </span>
              )}
            </div>
            {showActive &&
              (active.length === 0 ? (
                <p className="text-sm py-2" style={{ color: "var(--text-muted)" }}>
                  Нет активных акций
                </p>
              ) : (
                <div style={GRID}>
                  {active.map((item) => (
                    <AksiyaCard
                      key={item.id}
                      item={item}
                      onEdit={setEditItem}
                      onDelete={setDeleteItem}
                    />
                  ))}
                </div>
              ))}
          </div>

          <div style={{ borderTop: "1.5px dashed var(--border-default)" }} />

          {/* ── Планируемые ──────────────────────────── */}
          <div className="space-y-4">
            <AksiyaSectionHeader
              label="Планируемые"
              count={plan.length}
              color="#6366f1"
              open={showPlan}
              onToggle={() => setShowPlan((p) => !p)}
            />
            {showPlan &&
              (plan.length === 0 ? (
                <p className="text-sm py-2" style={{ color: "var(--text-muted)" }}>
                  Нет планируемых акций
                </p>
              ) : (
                <div style={GRID}>
                  {plan.map((item) => (
                    <AksiyaCard
                      key={item.id}
                      item={item}
                      onEdit={setEditItem}
                      onDelete={setDeleteItem}
                    />
                  ))}
                </div>
              ))}
          </div>

          <div style={{ borderTop: "1.5px dashed var(--border-default)" }} />

          {/* ── Архив ────────────────────────────────── */}
          <div className="space-y-4">
            <AksiyaSectionHeader
              label="Архив"
              count={archive.length}
              color="var(--text-muted)"
              open={showArchive}
              onToggle={() => setShowArchive((p) => !p)}
            />
            {showArchive &&
              (archive.length === 0 ? (
                <p className="text-sm py-2" style={{ color: "var(--text-muted)" }}>
                  Архив пуст
                </p>
              ) : (
                <div style={GRID}>
                  {archive.map((item) => (
                    <AksiyaCard
                      key={item.id}
                      item={item}
                      onEdit={setEditItem}
                      onDelete={setDeleteItem}
                    />
                  ))}
                </div>
              ))}
          </div>
        </div>
      )}

      {/* TODO: EditAksiyaDrawer, DeleteAksiyaDialog */}
      {editItem && null}
      {deleteItem && null}
    </div>
  );
}
