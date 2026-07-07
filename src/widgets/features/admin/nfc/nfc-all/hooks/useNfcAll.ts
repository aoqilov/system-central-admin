import { useState } from "react";
import type { NfcType, CardStatus } from "../nfc-all.types";

interface Filters {
  search: string;
  type: NfcType | "all";
  status: CardStatus | "all";
}

const DEFAULT_FILTERS: Filters = {
  search: "",
  type:   "all",
  status: "all",
};

export function useNfcAll() {
  const [filters, setFiltersState] = useState<Filters>(DEFAULT_FILTERS);
  const [page, setPage]           = useState(1);
  const [pageSize, setPageSize]   = useState(20);

  function setFilters(partial: Partial<Filters>) {
    setFiltersState((prev) => ({ ...prev, ...partial }));
    setPage(1);
  }

  return { filters, page, pageSize, setFilters, setPage, setPageSize };
}
