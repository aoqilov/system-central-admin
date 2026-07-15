import { useCallback, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCards, getCardsStats } from "@/api/cards/cards.api";
import type { CardStatus } from "../nfc.types";

interface Filters {
  status: CardStatus | "all";
  search: string;
  batch: number | null; // null = Все
}

export function useNfcVip() {
  const [filters, setFiltersState] = useState<Filters>({
    status: "all",
    search: "",
    batch: null,
  });
  const [page, setPageState] = useState(1);
  const [pageSize, setPageSizeState] = useState(20);

  const setFilters = useCallback((next: Partial<Filters>) => {
    setFiltersState((prev) => ({ ...prev, ...next }));
    setPageState(1);
  }, []);

  const setPage = useCallback((p: number) => setPageState(p), []);

  const setPageSize = useCallback((size: number) => {
    setPageSizeState(size);
    setPageState(1);
  }, []);

  const { data: statsData, isLoading: isStatsLoading } = useQuery({
    queryKey: ["nfc-cards-stats", "vip"],
    queryFn: () => getCardsStats({ type: "vip" }),
  });

  const batches = statsData?.batches ?? [];

  const { data: cardsData, isLoading } = useQuery({
    queryKey: ["nfc-vip-cards", filters, page, pageSize],
    queryFn: () =>
      getCards({
        type: "vip",
        page,
        limit: pageSize,
        search: filters.search || undefined,
        statuses: filters.status !== "all" ? filters.status : undefined,
        batch: filters.batch ?? undefined,
      }),
  });

  return {
    filters,
    stats: statsData,
    isStatsLoading,
    batches,
    cards: cardsData?.cards ?? [],
    total: cardsData?.pagination.total ?? 0,
    isLoading,
    page,
    pageSize,
    setFilters,
    setPage,
    setPageSize,
  };
}
