import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LuLayoutGrid,
  LuCheck,
  LuWrench,
  LuBan,
  LuSearch,
  LuTrash2,
  LuX,
  LuPencil,
  LuPlus,
} from "react-icons/lu";
import { CusButton } from "../components/ui/buttons/CusButton";
import {
  attractions,
  type Attraction,
  type AttractionCategory,
  type AttractionStatus,
} from "../data/attractions";
import { CusTable, type ColumnDef } from "../components/ui/table/CusTable";
import { CusBadge } from "../components/ui/badge/CusBadge";
import { CusInput } from "../components/ui/inputs/CusInput";
import CusSelect from "../components/ui/select/CusSelect";
import { CusPagination } from "../components/ui/table/CusPagination";
import { useTranslation } from "../i18n/languageConfig";

// ─── Stat card ────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <div
      className="rounded-xl p-4 border flex items-center gap-4"
      style={{
        background: "var(--bg-second)",
        borderColor: "var(--border-default)",
      }}
    >
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: `${color}18` }}
      >
        <Icon size={18} style={{ color }} />
      </div>
      <div>
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          {label}
        </p>
        <p
          className="text-2xl font-semibold"
          style={{ color: "var(--text-default)" }}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

// ─── Maps ─────────────────────────────────────────────────────────────────────

type CP =
  | "gray" | "red" | "orange" | "yellow" | "green"
  | "teal" | "blue" | "cyan"  | "purple" | "pink";

const STATUS_TO_BADGE: Record<AttractionStatus, "active" | "pending" | "fired"> = {
  open:        "active",
  maintenance: "pending",
  closed:      "fired",
};

const CATEGORY_COLOR: Record<AttractionCategory, CP> = {
  thrill:        "red",
  family:        "blue",
  kids:          "green",
  water:         "cyan",
  playground:    "orange",
  entertainment: "purple",
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Attractions() {
  const navigate = useNavigate();
  const { t } = useTranslation("attractions.");
  const [search, setSearch]             = useState("");
  const [categoryFilter, setCategory]   = useState("");
  const [statusFilter, setStatus]       = useState("");
  const [page, setPage]                 = useState(1);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const PAGE_SIZE = 10;

  const columns: ColumnDef<Attraction>[] = [
    {
      key: "name",
      header: t("columns.name"),
      sortable: false,
      render: (row) => (
        <div className="flex items-center gap-3">
          <img
            src={row.imageAttractionMain ?? `https://picsum.photos/seed/${row.id}/64/40`}
            alt={row.name}
            style={{
              width: 44,
              height: 34,
              borderRadius: 6,
              objectFit: "cover",
              flexShrink: 0,
            }}
          />
          <div>
            <p
              style={{
                fontWeight: 500,
                color: "var(--text-default)",
                fontSize: 13,
              }}
            >
              {row.name}
            </p>
            {row.manufacturer && (
              <p style={{ fontSize: 11, color: "var(--text-muted)" }}>
                {row.manufacturer}
              </p>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "category",
      header: t("columns.category"),
      sortable: false,
      render: (row) => (
        <CusBadge colorPalette={CATEGORY_COLOR[row.category]} variant="surface">
          {t(`categories.${row.category}`)}
        </CusBadge>
      ),
    },
    {
      key: "status",
      header: t("columns.status"),
      sortable: false,
      render: (row) => (
        <CusBadge status={STATUS_TO_BADGE[row.status]}>
          {t(`statuses.${row.status}`)}
        </CusBadge>
      ),
    },
    {
      key: "price",
      header: t("columns.price"),
      align: "right",
      sortable: true,
      render: (row) => (
        <span
          style={{
            fontWeight: 500,
            color: "var(--text-default)",
            fontSize: 13,
          }}
        >
          {row.price.toLocaleString()}{" "}
          <span style={{ fontSize: 11, color: "var(--text-muted)" }}>UZS</span>
        </span>
      ),
    },
    {
      key: "waitTime",
      header: t("columns.waitTime"),
      align: "right",
      sortable: true,
      render: (row) =>
        row.waitTime > 0 ? (
          <span style={{ fontSize: 12, color: "var(--text-2)" }}>
            {row.waitTime}{" "}
            <span style={{ color: "var(--text-muted)" }}>{t("minSuffix")}</span>
          </span>
        ) : (
          <span style={{ color: "var(--text-muted)" }}>—</span>
        ),
    },
    {
      key: "visitors",
      header: t("columns.visitors"),
      align: "right",
      sortable: true,
      render: (row) => (
        <span style={{ fontSize: 12, color: "var(--text-2)" }}>
          {row.visitors.toLocaleString()}
        </span>
      ),
    },
  ];

  const CATEGORY_OPTIONS = [
    { label: t("categories.all"),           value: "" },
    { label: t("categories.thrill"),        value: "thrill" },
    { label: t("categories.family"),        value: "family" },
    { label: t("categories.kids"),          value: "kids" },
    { label: t("categories.water"),         value: "water" },
    { label: t("categories.playground"),    value: "playground" },
    { label: t("categories.entertainment"), value: "entertainment" },
  ];

  const STATUS_OPTIONS = [
    { label: t("statuses.all"),         value: "" },
    { label: t("statuses.open"),        value: "open" },
    { label: t("statuses.maintenance"), value: "maintenance" },
    { label: t("statuses.closed"),      value: "closed" },
  ];

  const filtered = useMemo(() => {
    setPage(1);
    setSelectedRows([]);
    const q = search.toLowerCase();
    return attractions.filter((a) => {
      const matchSearch =
        !q ||
        a.name.toLowerCase().includes(q) ||
        (a.manufacturer ?? "").toLowerCase().includes(q);
      const matchCategory = !categoryFilter || a.category === categoryFilter;
      const matchStatus   = !statusFilter   || a.status   === statusFilter;
      return matchSearch && matchCategory && matchStatus;
    });
  }, [search, categoryFilter, statusFilter]);

  const paginated = useMemo(
    () => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filtered, page],
  );

  const total            = attractions.length;
  const openCount        = attractions.filter((a) => a.status === "open").length;
  const maintenanceCount = attractions.filter((a) => a.status === "maintenance").length;
  const closedCount      = attractions.filter((a) => a.status === "closed").length;

  return (
    <div className="p-4 tablet:p-6 space-y-6">
      {/* Header */}
      <div>
        <p className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>
          {t("breadcrumb")}
        </p>
        <h1
          className="text-2xl font-semibold"
          style={{ color: "var(--text-default)" }}
        >
          {t("title")}
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
          {t("subtitle")}
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 desktop:grid-cols-4 gap-3">
        <StatCard label={t("total")}       value={total}            icon={LuLayoutGrid}   color="#3b82f6" />
        <StatCard label={t("open")}        value={openCount}        icon={LuCheck}        color="#22c55e" />
        <StatCard label={t("maintenance")} value={maintenanceCount} icon={LuWrench}       color="#f59e0b" />
        <StatCard label={t("closed")}      value={closedCount}      icon={LuBan}          color="#ef4444" />
      </div>

      {/* Table card */}
      <div
        className="rounded-xl border overflow-hidden"
        style={{
          background: "var(--bg-second)",
          borderColor: "var(--border-default)",
        }}
      >
        {/* Toolbar */}
        <div
          className="px-4 py-3 border-b flex flex-col tablet:flex-row gap-3"
          style={{ borderColor: "var(--border-default)" }}
        >
          <div className="flex-1">
            <CusInput
              placeholder={t("searchPlaceholder")}
              leftElement={<LuSearch size={14} />}
              clearable
              inputSize="sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClear={() => setSearch("")}
              style={{ maxWidth: 500 }}
            />
          </div>
          <div className="flex gap-2">
            <div style={{ width: 180 }}>
              <CusSelect
                options={CATEGORY_OPTIONS}
                placeholder={t("columns.category")}
                size="sm"
                value={categoryFilter}
                onChange={(v) => setCategory(v as string)}
              />
            </div>
            <div style={{ width: 180 }}>
              <CusSelect
                options={STATUS_OPTIONS}
                placeholder={t("columns.status")}
                size="sm"
                value={statusFilter}
                onChange={(v) => setStatus(v as string)}
              />
            </div>
          </div>
        </div>

        {/* Result count */}
        <div
          className="px-4 py-2 border-b flex items-center gap-2"
          style={{ borderColor: "var(--border-default)" }}
        >
          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
            {t("found", { count: filtered.length })}
          </span>
          {(search || categoryFilter || statusFilter) && (
            <button
              onClick={() => {
                setSearch("");
                setCategory("");
                setStatus("");
              }}
              style={{
                fontSize: 11,
                color: "var(--text-3)",
                cursor: "pointer",
                textDecoration: "underline",
                background: "none",
                border: "none",
                padding: 0,
              }}
            >
              {t("clearFilter")}
            </button>
          )}
        </div>

        {/* Action toolbar */}
        <div
          className="px-4 py-2 border-b flex items-center justify-between gap-3"
          style={{ borderColor: "var(--border-default)" }}
        >
          {selectedRows.length === 0 ? (
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
              {t("selectRow")}
            </span>
          ) : (
            <span
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: "var(--text-default)",
              }}
            >
              {t("selected", { count: selectedRows.length })}
            </span>
          )}

          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {selectedRows.length === 0 && (
              <CusButton
                size="xs"
                variant="solid"
                colorPalette="blue"
                leftIcon={<LuPlus size={13} />}
                onClick={() => alert(t("addNew"))}
              >
                {t("addNew")}
              </CusButton>
            )}

            {selectedRows.length === 1 && (
              <>
                <CusButton
                  size="xs"
                  variant="solid"
                  colorPalette="orange"
                  leftIcon={<LuPencil size={13} />}
                  onClick={() => alert(t("edit"))}
                >
                  {t("edit")}
                </CusButton>
                <CusButton
                  size="xs"
                  variant="solid"
                  colorPalette="red"
                  leftIcon={<LuTrash2 size={13} />}
                  onClick={() => {
                    alert(t("delete"));
                    setSelectedRows([]);
                  }}
                >
                  {t("delete")}
                </CusButton>
                <button
                  onClick={() => setSelectedRows([])}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: 4,
                    borderRadius: 4,
                    cursor: "pointer",
                    background: "none",
                    border: "none",
                    color: "var(--text-muted)",
                  }}
                >
                  <LuX size={14} />
                </button>
              </>
            )}

            {selectedRows.length > 1 && (
              <>
                <CusButton
                  size="xs"
                  variant="outline"
                  colorPalette="red"
                  leftIcon={<LuTrash2 size={13} />}
                  onClick={() => {
                    alert(t("deleteCount", { count: selectedRows.length }));
                    setSelectedRows([]);
                  }}
                >
                  {t("delete")} ({selectedRows.length})
                </CusButton>
                <button
                  onClick={() => setSelectedRows([])}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: 4,
                    borderRadius: 4,
                    cursor: "pointer",
                    background: "none",
                    border: "none",
                    color: "var(--text-muted)",
                  }}
                >
                  <LuX size={14} />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Table */}
        <CusTable<Attraction>
          data={paginated}
          columns={columns}
          showColumnBorder
          variant="outline"
          size="md"
          interactive
          selectable
          selectedRows={selectedRows}
          onSelectionChange={setSelectedRows}
          onRowClick={(row) => navigate(`/attraction/${row.id}`)}
          emptyText={t("notFound")}
        />

        {/* Pagination */}
        <div
          className="px-4 py-3 border-t"
          style={{ borderColor: "var(--border-default)" }}
        >
          <CusPagination
            count={filtered.length}
            pageSize={PAGE_SIZE}
            page={page}
            onPageChange={setPage}
            showPageText
          />
        </div>
      </div>
    </div>
  );
}
