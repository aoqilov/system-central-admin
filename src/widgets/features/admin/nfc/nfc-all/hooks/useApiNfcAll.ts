import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCards, getCardsStats } from "@/api/cards/cards.api";
import type { Card, CardType, CardStatus, CardStats } from "@/types/card.types";
import type { NfcAllStats } from "../nfc-all.types";

interface Filters {
  search: string;
  type: CardType | "all";
  status: CardStatus | "all";
  batch: number | null;
}

const DEFAULT_FILTERS: Filters = {
  search: "",
  type: "all",
  status: "all",
  batch: null,
};

function buildNfcAllStats(s: CardStats): NfcAllStats {
  return {
    total: {
      total: s.total,
      active: s.active,
      inactive: s.inactive,
      blocked: s.blocked,
      lost: s.lost,
      frozen: s.frozen,
    },
    totalBalance: s.totalBalance,
    byType: {
      classic: {
        total: s.types.classic,
        active: 0,
        inactive: 0,
        blocked: 0,
        lost: 0,
        frozen: 0,
      },
      vip: {
        total: s.types.vip,
        active: 0,
        inactive: 0,
        blocked: 0,
        lost: 0,
        frozen: 0,
      },
      organization: {
        total: s.types.organization,
        active: 0,
        inactive: 0,
        blocked: 0,
        lost: 0,
        frozen: 0,
      },
    },
    batches: s.batches.map((b) => ({
      batchId: b.id,
      batchName: b.name,
      type: b.type,
      total: b.total,
      active: 0,
      inactive: 0,
      blocked: 0,
      lost: 0,
      frozen: 0,
    })),
  };
}

export function useApiNfcAll() {
  const [filters, setFiltersState] = useState<Filters>(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [infoCard, setInfoCard] = useState<Card | null>(null);

  function setFilters(partial: Partial<Filters>) {
    setFiltersState((prev) => ({ ...prev, ...partial }));
    setPage(1);
  }

  const { data: rawStats, isLoading: statsLoading } = useQuery({
    queryKey: ["nfc-cards-stats", "all"],
    queryFn: () => getCardsStats(),
  });

  const stats = rawStats ? buildNfcAllStats(rawStats) : null;

  const { data: cardsData, isLoading: cardsLoading } = useQuery({
    queryKey: ["nfc-all-cards", filters, page, pageSize],
    queryFn: () =>
      getCards({
        page,
        limit: pageSize,
        search: filters.search || undefined,
        statuses: filters.status !== "all" ? filters.status : undefined,
        batch: filters.batch ?? undefined,
      }),
  });

  const cards = cardsData?.cards ?? [];
  const total = cardsData?.pagination.total ?? 0;

  return {
    filters,
    page,
    pageSize,
    setFilters,
    setPage,
    setPageSize,
    stats,
    statsLoading,
    cards,
    total,
    cardsLoading,
    infoCard,
    setInfoCard,
  };
}
