import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { LuPlus } from "react-icons/lu";
import { CusButton } from "@/components/ui/buttons/CusButton";
import PageHeader from "@/widgets/shared-ui/PageHeader";
import { getNews } from "./api/marketingNewsApi";
import { NewsCard } from "./components/NewsCard";
import { NewsFilters, type NewsSortKey } from "./components/NewsFilters";
import { NewsSectionHeader } from "./components/NewsSectionHeader";
import { AddNewsDrawer } from "./modals/AddNewsDrawer";
import { EditNewsDrawer } from "./modals/EditNewsDrawer";
import { DeleteNewsDialog } from "./modals/DeleteNewsDialog";
import type { NewsItem } from "./marketing-news.types";

const GRID = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 340px))",
  gap: 16,
} as const;

function sortNews(list: NewsItem[], sort: NewsSortKey): NewsItem[] {
  return [...list].sort((a, b) => {
    if (sort === "newest")
      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    if (sort === "oldest")
      return (
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
    if (sort === "likes") return b.likes - a.likes;
    if (sort === "views") return b.views - a.views;
    return 0;
  });
}

function filterAndSort(
  list: NewsItem[],
  search: string,
  sort: NewsSortKey,
): NewsItem[] {
  const q = search.toLowerCase();
  const filtered = q
    ? list.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.paragraph.toLowerCase().includes(q),
      )
    : list;
  return sortNews(filtered, sort);
}

export default function FeatureMarketingNews() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<NewsSortKey>("newest");

  const [showPlanned, setShowPlanned] = useState(true);
  const [showActive, setShowActive] = useState(true);
  const [showArchived, setShowArchived] = useState(true);

  const [addOpen, setAddOpen] = useState(false);
  const [editItem, setEditItem] = useState<NewsItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<NewsItem | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["marketing-news"],
    queryFn: getNews,
  });

  const planned = useMemo(
    () => filterAndSort(data?.planned ?? [], search, sort),
    [data?.planned, search, sort],
  );
  const active = useMemo(
    () => filterAndSort(data?.active ?? [], search, sort),
    [data?.active, search, sort],
  );
  const archived = useMemo(
    () => filterAndSort(data?.archived ?? [], search, sort),
    [data?.archived, search, sort],
  );

  return (
    <div className="p-4 tablet:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <PageHeader
          title="Маркетинг:"
          highlight="Новости"
          subtitle="Управление маркетинговыми новостями"
        />
        <CusButton
          colorPalette="blue"
          leftIcon={<LuPlus size={14} />}
          onClick={() => setAddOpen(true)}
          isDisabled={(data?.active.length ?? 0) >= 3}
        >
          Добавить
        </CusButton>
      </div>

      {/* Filters */}
      <NewsFilters
        search={search}
        sort={sort}
        onSearchChange={setSearch}
        onSortChange={setSort}
      />

      {/* Skeleton */}
      {isLoading && (
        <div style={GRID}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl animate-pulse"
              style={{ height: 340, background: "var(--bg-second)" }}
            />
          ))}
        </div>
      )}

      {!isLoading && (
        <div className="space-y-6">
          {/* ── Active ──────────────────────────────── */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <NewsSectionHeader
                label="Активные"
                count={active.length}
                color="#22c55e"
                open={showActive}
                onToggle={() => setShowActive((p) => !p)}
              />
              {(data?.active.length ?? 0) >= 3 && (
                <span
                  className="text-xs px-2 py-0.5 rounded-full shrink-0"
                  style={{ background: "#fef9c3", color: "#854d0e" }}
                >
                  Лимит 3/3
                </span>
              )}
            </div>
            {showActive &&
              (active.length === 0 ? (
                <p
                  className="text-sm py-2"
                  style={{ color: "var(--text-muted)" }}
                >
                  {search ? "Ничего не найдено" : "Нет активных новостей"}
                </p>
              ) : (
                <div style={GRID}>
                  {active.slice(0, 3).map((item) => (
                    <NewsCard
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
          {/* ── Planned ─────────────────────────────── */}
          <div className="space-y-4">
            <NewsSectionHeader
              label="Планируемые"
              count={planned.length}
              color="#6366f1"
              open={showPlanned}
              onToggle={() => setShowPlanned((p) => !p)}
            />
            {showPlanned &&
              (planned.length === 0 ? (
                <p
                  className="text-sm py-2"
                  style={{ color: "var(--text-muted)" }}
                >
                  {search ? "Ничего не найдено" : "Нет планируемых новостей"}
                </p>
              ) : (
                <div style={GRID}>
                  {planned.map((item) => (
                    <NewsCard
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

          {/* ── Archived ────────────────────────────── */}
          <div className="space-y-4">
            <NewsSectionHeader
              label="Архив"
              count={archived.length}
              color="var(--text-muted)"
              open={showArchived}
              onToggle={() => setShowArchived((p) => !p)}
            />
            {showArchived &&
              (archived.length === 0 ? (
                <p
                  className="text-sm py-2"
                  style={{ color: "var(--text-muted)" }}
                >
                  {search ? "Ничего не найдено" : "Архив пуст"}
                </p>
              ) : (
                <div style={GRID}>
                  {archived.map((item) => (
                    <NewsCard
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

      <AddNewsDrawer open={addOpen} onClose={() => setAddOpen(false)} />
      <EditNewsDrawer
        open={editItem !== null}
        onClose={() => setEditItem(null)}
        item={editItem}
      />
      <DeleteNewsDialog
        open={deleteItem !== null}
        onClose={() => setDeleteItem(null)}
        item={deleteItem}
      />
    </div>
  );
}
