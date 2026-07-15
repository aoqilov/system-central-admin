import { useCallback, useState } from "react";
import { LuPlus } from "react-icons/lu";
import { useNfcCards } from "./hooks/useNfcCards";
import { NfcFilters } from "./components/NfcFilters";
import { NfcTable } from "./components/NfcTable";
import NfcStatusCards from "./components/NfcStatusCards";
import { EditNfcStatusDialog } from "./modals/EditNfcStatusDialog";
import { DeleteNfcDialog } from "./modals/DeleteNfcDialog";
import { GenerateNfcDialog } from "./modals/GenerateNfcDialog";
import { CusButton } from "@/components/ui/buttons/CusButton";
import type { Card } from "@/types/card.types";
import PageHeader from "@/widgets/shared-ui/PageHeader";

export default function FeatureNfcClassic() {
  const {
    filters, stats, isStatsLoading, batches, cards, total,
    isLoading, page, pageSize,
    setFilters, setPage, setPageSize,
  } = useNfcCards();

  const [generateOpen, setGenerateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Card | null>(null);
  const [deleteTargets, setDeleteTargets] = useState<Card[]>([]);

  const handleEditOpen = useCallback(
    (selected: Card[]) => setEditTarget(selected[0] ?? null),
    [],
  );
  const handleDeleteOpen = useCallback(
    (selected: Card[]) => setDeleteTargets(selected),
    [],
  );

  return (
    <div className="p-4 tablet:p-6 space-y-5">
      <PageHeader
        title="NFC карты:"
        highlight="Classic"
        subtitle="Управление классическими NFC картами"
      />

      <NfcStatusCards stats={stats} isLoading={isStatsLoading} />

      {batches.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilters({ batch: null })}
            className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
            style={{
              background: filters.batch === null ? "var(--text-default)" : "var(--bg-second)",
              color: filters.batch === null ? "var(--bg-main)" : "var(--text-muted)",
              border: "1px solid var(--border-default)",
            }}
          >
            Все
          </button>
          {batches.map((b) => (
            <button
              key={b.id}
              onClick={() => setFilters({ batch: b.id })}
              className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
              style={{
                background: filters.batch === b.id ? "var(--text-default)" : "var(--bg-second)",
                color: filters.batch === b.id ? "var(--bg-main)" : "var(--text-muted)",
                border: "1px solid var(--border-default)",
              }}
            >
              {b.name}
              <span
                className="ml-1.5 px-1.5 py-0.5 rounded text-xs font-semibold"
                style={{
                  background: filters.batch === b.id ? "#2563eb" : "#dbeafe",
                  color: filters.batch === b.id ? "#fff" : "#1d4ed8",
                }}
              >
                {b.total}
              </span>
            </button>
          ))}
        </div>
      )}

      <div
        className="rounded-xl"
        style={{
          background: "var(--bg-second)",
          border: "1px solid var(--border-default)",
        }}
      >
        <div
          className="p-4 flex flex-wrap items-end gap-2"
          style={{ borderBottom: "1px solid var(--border-default)" }}
        >
          <div className="flex-1">
            <NfcFilters
              filters={filters}
              onChange={setFilters}
              pageSize={pageSize}
              onPageSizeChange={setPageSize}
            />
          </div>
          <CusButton
            colorPalette="blue"
            leftIcon={<LuPlus size={14} />}
            onClick={() => setGenerateOpen(true)}
          >
            Добавить
          </CusButton>
        </div>

        <div className="px-4 pt-3 pb-1">
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            {total} карт
            {filters.status !== "all" ||
            filters.search ||
            filters.batch !== null
              ? " (фильтр применён)"
              : ""}
          </p>
        </div>

        <div className="px-4 pb-4">
          <NfcTable
            data={cards}
            total={total}
            page={page}
            pageSize={pageSize}
            onPageChange={setPage}
            onEdit={handleEditOpen}
            onDelete={handleDeleteOpen}
            isLoading={isLoading}
          />
        </div>
      </div>

      <GenerateNfcDialog
        open={generateOpen}
        onClose={() => setGenerateOpen(false)}
      />

      <EditNfcStatusDialog
        open={editTarget !== null}
        onClose={() => setEditTarget(null)}
        card={editTarget}
      />

      <DeleteNfcDialog
        open={deleteTargets.length > 0}
        onClose={() => setDeleteTargets([])}
        cards={deleteTargets}
      />
    </div>
  );
}
