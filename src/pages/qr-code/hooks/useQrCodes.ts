import { useCallback, useMemo, useState } from "react";
import type { GenerateQrBatchDto, Party, QrCode, QrStatus } from "../qr.types";
import * as api from "../api/qrApi";

interface Filters {
  status: QrStatus | "all";
  search: string;
}

const PAGE_SIZE = 20;

export function useQrCodes() {
  const [parties, setParties] = useState<Party[]>([]);
  const [activeBatchId, setActiveBatchId] = useState<string | null>(null);
  const [codes, setCodes] = useState<QrCode[]>([]);
  const [filters, setFiltersState] = useState<Filters>({ status: "all", search: "" });
  const [page, setPageState] = useState(1);

  // ── derived ───────────────────────────────────────────────────────────────

  const filtered = useMemo(() => {
    return codes.filter((c) => {
      if (filters.status !== "all" && c.status !== filters.status) return false;
      if (filters.search) {
        const q = filters.search.toLowerCase();
        if (
          !c.token.toLowerCase().includes(q) &&
          !c.partia.toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });
  }, [codes, filters]);

  const paged = useMemo(
    () => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filtered, page],
  );

  const total = filtered.length;

  // ── helpers ───────────────────────────────────────────────────────────────

  const refreshParties = useCallback(async (): Promise<Party[]> => {
    const list = await api.listParties();
    setParties(list);
    return list;
  }, []);

  // ── actions ───────────────────────────────────────────────────────────────

  const selectParty = useCallback(async (batchId: string) => {
    setActiveBatchId(batchId);
    const list = await api.listCodes(batchId);
    setCodes(list);
    setPageState(1);
  }, []);

  const generate = useCallback(
    async (dto: GenerateQrBatchDto) => {
      await api.generateQrBatch(dto);
      const list = await refreshParties();
      const newest = list[0];
      if (newest) await selectParty(newest.batchId);
    },
    [refreshParties, selectParty],
  );

  const remove = useCallback(
    async (id: string) => {
      await api.deleteCode(id);
      if (activeBatchId) {
        const list = await api.listCodes(activeBatchId);
        setCodes(list);
        await refreshParties();
      }
    },
    [activeBatchId, refreshParties],
  );

  const removeMany = useCallback(
    async (ids: string[]) => {
      await api.deleteCodes(ids);
      if (activeBatchId) {
        const list = await api.listCodes(activeBatchId);
        setCodes(list);
        await refreshParties();
      }
    },
    [activeBatchId, refreshParties],
  );

  const changeStatus = useCallback(async (id: string, status: QrStatus) => {
    const updated = await api.updateStatus(id, status);
    setCodes((prev) => prev.map((c) => (c.id === id ? updated : c)));
  }, []);

  const setFilters = useCallback((next: Partial<Filters>) => {
    setFiltersState((prev) => ({ ...prev, ...next }));
    setPageState(1);
  }, []);

  const setPage = useCallback((p: number) => setPageState(p), []);

  return {
    parties,
    activeBatchId,
    codes,
    filters,
    page,
    pageSize: PAGE_SIZE,
    filtered,
    paged,
    total,
    generate,
    selectParty,
    remove,
    removeMany,
    changeStatus,
    setFilters,
    setPage,
    refreshParties,
  };
}
