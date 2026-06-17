import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LuSearch,
  LuCheck,
  LuWrench,
  LuBan,
  LuLayoutGrid,
  LuMapPin,
  LuPencil,
  LuTrash2,
  LuPlus,
  LuX,
} from "react-icons/lu";
import { kassaList, type Kassa, type KassaStatus } from "../../../data/kassa";
import { employees } from "../../../data/employees";
import {
  CusTable,
  type ColumnDef,
} from "../../../components/ui/table/CusTable";
import { CusBadge } from "../../../components/ui/badge/CusBadge";
import { CusInput } from "../../../components/ui/inputs/CusInput";
import CusSelect from "../../../components/ui/select/CusSelect";
import { CusPagination } from "../../../components/ui/table/CusPagination";
import { CusButton } from "../../../components/ui/buttons/CusButton";

// ─── Configs ──────────────────────────────────────────────────────────────────

const STATUS_BADGE: Record<KassaStatus, "active" | "pending" | "fired"> = {
  active: "active",
  maintenance: "pending",
  inactive: "fired",
};

const STATUS_LABEL: Record<KassaStatus, string> = {
  active: "Faol",
  maintenance: "Ta'mirda",
  inactive: "Yopiq",
};

// ─── Stat card ────────────────────────────────────────────────────────────────

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
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

// ─── Page ─────────────────────────────────────────────────────────────────────

const PAGE_SIZE = 10;

export default function KassaPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [selectedRows, setSelected] = useState<number[]>([]);

  const filtered = useMemo(() => {
    setPage(1);
    setSelected([]);
    const q = search.toLowerCase();
    return kassaList.filter((k) => {
      const matchSearch =
        !q ||
        k.name.toLowerCase().includes(q) ||
        k.location.toLowerCase().includes(q);
      const matchStatus = !statusFilter || k.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [search, statusFilter]);

  const paginated = useMemo(
    () => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filtered, page],
  );

  const total = kassaList.length;
  const activeCount = kassaList.filter((k) => k.status === "active").length;
  const maintCount = kassaList.filter((k) => k.status === "maintenance").length;
  const inactCount = kassaList.filter((k) => k.status === "inactive").length;

  const columns: ColumnDef<Kassa>[] = [
    {
      key: "name",
      header: "Kassa",
      sortable: false,
      render: (row) => (
        <div>
          <p
            className="text-sm font-medium"
            style={{ color: "var(--text-default)" }}
          >
            {row.name}
          </p>
          <div className="flex items-center gap-1 mt-0.5">
            <LuMapPin size={10} style={{ color: "var(--text-muted)" }} />
            <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
              {row.location}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: false,
      render: (row) => (
        <CusBadge status={STATUS_BADGE[row.status]} size="sm">
          {STATUS_LABEL[row.status]}
        </CusBadge>
      ),
    },
    {
      key: "cashierId",
      header: "Kassir",
      sortable: false,
      render: (row) => {
        if (!row.cashierId)
          return (
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>—</span>
          );
        const emp = employees.find((e) => e.id === row.cashierId);
        if (!emp)
          return (
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>—</span>
          );
        return (
          <div className="flex items-center gap-2">
            <img
              src={emp.avatarUrl ?? `https://i.pravatar.cc/150?u=${emp.id}`}
              alt={emp.fullName ?? emp.firstName}
              style={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                objectFit: "cover",
                flexShrink: 0,
              }}
            />
            <span className="text-xs" style={{ color: "var(--text-2)" }}>
              {emp.fullName ?? `${emp.firstName} ${emp.lastName}`}
            </span>
          </div>
        );
      },
    },
    {
      key: "note",
      header: "Izoh",
      sortable: false,
      render: (row) =>
        row.note ? (
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            {row.note}
          </span>
        ) : (
          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>—</span>
        ),
    },
  ];

  const STATUS_OPTIONS = [
    { label: "Barcha statuslar", value: "" },
    { label: "Faol", value: "active" },
    { label: "Ta'mirda", value: "maintenance" },
    { label: "Yopiq", value: "inactive" },
  ];

  return (
    <div className="p-4 tablet:p-6 space-y-6">
      {/* Header */}
      <div>
        <p className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>
          Moliya
        </p>
        <h1
          className="text-2xl font-semibold"
          style={{ color: "var(--text-default)" }}
        >
          Kassalar
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
          Park kassa butkalari va holatini boshqarish.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 desktop:grid-cols-4 gap-3">
        <StatCard
          icon={LuLayoutGrid}
          label="Jami kassalar"
          value={total}
          color="#3b82f6"
        />
        <StatCard
          icon={LuCheck}
          label="Faol"
          value={activeCount}
          color="#22c55e"
        />
        <StatCard
          icon={LuWrench}
          label="Ta'mirda"
          value={maintCount}
          color="#f59e0b"
        />
        <StatCard
          icon={LuBan}
          label="Yopiq"
          value={inactCount}
          color="#ef4444"
        />
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
              placeholder="Kassa nomi yoki joylashuv bo'yicha qidirish..."
              leftElement={<LuSearch size={14} />}
              clearable
              inputSize="sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClear={() => setSearch("")}
              style={{ maxWidth: 420 }}
            />
          </div>
          <div style={{ width: 180 }}>
            <CusSelect
              options={STATUS_OPTIONS}
              placeholder="Status"
              size="sm"
              value={statusFilter}
              onChange={(v) => setStatus(v as string)}
            />
          </div>
        </div>

        {/* Count + action row */}
        <div
          className="px-4 py-2 border-b flex items-center justify-between gap-3"
          style={{ borderColor: "var(--border-default)" }}
        >
          <div className="flex items-center gap-2">
            {selectedRows.length === 0 ? (
              <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                {filtered.length} ta kassa topildi
              </span>
            ) : (
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: "var(--text-default)",
                }}
              >
                {selectedRows.length} ta tanlandi
              </span>
            )}
            {(search || statusFilter) && (
              <button
                onClick={() => {
                  setSearch("");
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
                Filterni tozalash
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {selectedRows.length === 0 && (
              <CusButton
                size="xs"
                variant="solid"
                colorPalette="blue"
                leftIcon={<LuPlus size={13} />}
                onClick={() => alert("Yangi kassa qo'shish")}
              >
                Qo'shish
              </CusButton>
            )}
            {selectedRows.length === 1 && (
              <>
                <CusButton
                  size="xs"
                  variant="solid"
                  colorPalette="orange"
                  leftIcon={<LuPencil size={13} />}
                  onClick={() => alert("Tahrirlash")}
                >
                  Tahrirlash
                </CusButton>
                <CusButton
                  size="xs"
                  variant="solid"
                  colorPalette="red"
                  leftIcon={<LuTrash2 size={13} />}
                  onClick={() => {
                    alert("O'chirish");
                    setSelected([]);
                  }}
                >
                  O'chirish
                </CusButton>
                <button
                  onClick={() => setSelected([])}
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
                    alert(`${selectedRows.length} ta o'chirildi`);
                    setSelected([]);
                  }}
                >
                  O'chirish ({selectedRows.length})
                </CusButton>
                <button
                  onClick={() => setSelected([])}
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
        <CusTable<Kassa>
          data={paginated}
          columns={columns}
          showColumnBorder
          variant="outline"
          size="md"
          interactive
          selectable
          selectedRows={selectedRows}
          onSelectionChange={setSelected}
          onRowClick={(row) => navigate(`/kassa/${row.id}`)}
          emptyText="Kassalar topilmadi"
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
