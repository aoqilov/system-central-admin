import { useCallback, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { LuPlus } from "react-icons/lu";
import { useNfcCards } from "./hooks/useNfcCards";
import { NfcFilters } from "./components/NfcFilters";
import { NfcTable } from "./components/NfcTable";
import NfcStatusCards from "./components/NfcStatusCards";
import { EditNfcStatusDialog } from "./modals/EditNfcStatusDialog";
import { DeleteNfcDialog } from "./modals/DeleteNfcDialog";
import { GenerateNfcDialog } from "./modals/GenerateNfcDialog";
import { CusButton } from "@/components/ui/buttons/CusButton";
import { getCards, getCardsStats } from "./api/nfcApi";
import type { Card } from "./nfc.types";

export default function FeatureNfcCards() {
  const { filters, page, pageSize, setFilters, setPage, setPageSize } =
    useNfcCards();


  const [generateOpen, setGenerateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Card | null>(null);
  const [deleteTargets, setDeleteTargets] = useState<Card[]>([]);

  const { data: statsData } = useQuery({
    queryKey: ["nfc-cards-stats"],
    queryFn: getCardsStats,
  });

  const batches = statsData?.data.card_stats ?? [];

  useEffect(() => {
    if (batches.length > 0 && filters.batch === null) {
      setFilters({ batch: batches[0].batch });
    }
  }, [batches]);

  const { data: cardsData, isLoading } = useQuery({
    queryKey: ["nfc-cards", filters, page, pageSize],
    queryFn: () =>
      getCards({
        page,
        limit: pageSize,
        search: filters.search || undefined,
        statuses: filters.status !== "all" ? filters.status : undefined,
        batch: filters.batch || undefined,
      }),
  });

  const cards = cardsData?.data.cards ?? [];
  const total = cardsData?.data.pagination.total ?? 0;

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
      {/* Header */}
      <div>
        <p className="text-xs mb-0.5" style={{ color: "var(--text-muted)" }}>
          Boshqaruv
        </p>
        <h1
          className="text-2xl font-semibold"
          style={{ color: "var(--text-default)" }}
        >
          NFC Kartalar
        </h1>
        <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>
          Mehmonlar uchun NFC kirish kartalarini boshqarish.
        </p>
      </div>

      {/* Stats — o'zi fetch qiladi */}
      <NfcStatusCards />

      {/* Batch filter toggles */}
      {batches.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {batches.map((b) => (
            <button
              key={b.batch}
              onClick={() => setFilters({ batch: b.batch })}
              className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
              style={{
                background: filters.batch === b.batch ? "var(--text-default)" : "var(--bg-second)",
                color: filters.batch === b.batch ? "var(--bg-main)" : "var(--text-muted)",
                border: "1px solid var(--border-default)",
              }}
            >
              {b.batchName}
            </button>
          ))}
        </div>
      )}

      {/* Table area */}
      <div
        className="rounded-xl"
        style={{
          background: "var(--bg-second)",
          border: "1px solid var(--border-default)",
        }}
      >
        {/* Filters + Add button */}
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
            Qo'shish
          </CusButton>
        </div>

        {/* Count info */}
        <div className="px-4 pt-3 pb-1">
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            {total} ta karta
            {filters.status !== "all" || filters.search || filters.batch !== null ? " (filtrlangan)" : ""}
          </p>
        </div>

        {/* Table */}
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

      {/* Dialogs */}
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
