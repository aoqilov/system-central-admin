import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { LuPlus } from "react-icons/lu";
import dayjs from "dayjs";
import { CusButton } from "@/components/ui/buttons/CusButton";
import PageHeader from "@/widgets/shared-ui/PageHeader";
import { getMemories } from "./api/marketingMemoryApi";
import { MemoryFilters, getWeekStart } from "./components/MemoryFilters";
import type { TopFilter, DateRange } from "./components/MemoryFilters";
import { MemoryRow } from "./components/MemoryRow";
import { AddMemoryDrawer } from "./modals/AddMemoryDrawer";
import { EditMemoryDrawer } from "./modals/EditMemoryDrawer";
import { DeleteMemoryDialog } from "./modals/DeleteMemoryDialog";
import type { MemoryItem } from "./marketing-memory.types";

export default function FeatureMarketingMemory() {
  const [search, setSearch] = useState("");
  const [top, setTop] = useState<TopFilter>(10);
  const [dateRange, setDateRange] = useState<DateRange>(() => {
    const ws = getWeekStart();
    return { from: ws.format("YYYY-MM-DD"), to: ws.add(6, "day").format("YYYY-MM-DD") };
  });

  const [addOpen, setAddOpen] = useState(false);
  const [editItem, setEditItem] = useState<MemoryItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<MemoryItem | null>(null);

  const { data = [], isLoading } = useQuery({
    queryKey: ["marketing-memory"],
    queryFn: getMemories,
  });

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    const from = dayjs(dateRange.from);
    const to = dayjs(dateRange.to).endOf("day");
    const pool = data.filter((m) => {
      const d = dayjs(m.date);
      const inRange = !d.isBefore(from) && !d.isAfter(to);
      const matchSearch = !q || m.title.toLowerCase().includes(q) || m.description.toLowerCase().includes(q);
      return inRange && matchSearch;
    });
    return pool.sort((a, b) => b.like_count - a.like_count).slice(0, top);
  }, [data, dateRange, search, top]);

  return (
    <div className="p-4 tablet:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <PageHeader
          title="Маркетинг:"
          highlight="Воспоминания"
          subtitle="Фотографии и моменты из жизни парка"
        />
        <CusButton
          colorPalette="blue"
          leftIcon={<LuPlus size={14} />}
          onClick={() => setAddOpen(true)}
        >
          Добавить
        </CusButton>
      </div>

      {/* Filters */}
      <MemoryFilters
        search={search}
        dateRange={dateRange}
        top={top}
        onSearchChange={setSearch}
        onDateRangeChange={setDateRange}
        onTopChange={setTop}
      />

      {/* Skeleton */}
      {isLoading && (
        <div className="flex flex-wrap gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl animate-pulse"
              style={{ width: 150, height: 190, background: "var(--bg-second)" }}
            />
          ))}
        </div>
      )}

      {/* List */}
      {!isLoading && (
        <div>
          {filtered.length === 0 ? (
            <p className="text-sm py-4" style={{ color: "var(--text-muted)" }}>
              {search ? "Ничего не найдено" : "За этот период воспоминаний нет"}
            </p>
          ) : (
            <div className="flex flex-wrap gap-3">
              {filtered.map((item) => (
                <MemoryRow
                  key={item.id}
                  item={item}
                  onEdit={setEditItem}
                  onDelete={setDeleteItem}
                />
              ))}
            </div>
          )}
        </div>
      )}

      <AddMemoryDrawer open={addOpen} onClose={() => setAddOpen(false)} />
      <EditMemoryDrawer
        open={editItem !== null}
        onClose={() => setEditItem(null)}
        item={editItem}
      />
      <DeleteMemoryDialog
        open={deleteItem !== null}
        onClose={() => setDeleteItem(null)}
        item={deleteItem}
      />
    </div>
  );
}
