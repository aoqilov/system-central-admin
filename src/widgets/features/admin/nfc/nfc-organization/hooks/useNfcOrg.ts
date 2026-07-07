import { useCallback, useState } from "react";
import type { CardStatus } from "../nfc.types";

interface Filters {
  status: CardStatus | "all";
  search: string;
  batch: number | null;
}

export function useNfcOrg() {
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

  return { filters, page, pageSize, setFilters, setPage, setPageSize };
}
