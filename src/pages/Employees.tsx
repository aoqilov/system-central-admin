import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LuUsers,
  LuUserCheck,
  LuUserX,
  LuSunMedium,
  LuSearch,
  LuPhone,
  LuSend,
  LuTrash2,
  LuX,
  LuPencil,
  LuPlus,
} from "react-icons/lu";
import { CusButton } from "../components/ui/buttons/CusButton";
import {
  employees,
  EmployeeRole,
  EmployeeStatus,
  type Employee,
} from "../data/employees";
import { CusTable, type ColumnDef } from "../components/ui/table/CusTable";
import { CusBadge } from "../components/ui/badge/CusBadge";
import { CusInput } from "../components/ui/inputs/CusInput";
import CusSelect from "../components/ui/select/CusSelect";
import dayjs from "dayjs";
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

// ─── Column definitions ───────────────────────────────────────────────────────

const STATUS_TO_BADGE: Record<
  EmployeeStatus,
  "active" | "inactive" | "fired" | "vacation"
> = {
  [EmployeeStatus.ACTIVE]: "active",
  [EmployeeStatus.INACTIVE]: "inactive",
  [EmployeeStatus.FIRED]: "fired",
  [EmployeeStatus.VACATION]: "vacation",
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Employees() {
  const navigate = useNavigate();
  const { t } = useTranslation("employees.");
  const [search, setSearch] = useState("");
  const [roleFilter, setRole] = useState("");
  const [statusFilter, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const PAGE_SIZE = 10;

  const columns: ColumnDef<Employee>[] = [
    {
      key: "fullName",
      header: t("columns.name"),
      sortable: false,
      render: (row) => (
        <div className="flex items-center gap-3">
          <img
            src={row.avatarUrl ?? `https://i.pravatar.cc/150?u=${row.id}`}
            alt={row.fullName}
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
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
              {row.fullName}
            </p>
            <p style={{ fontSize: 11, color: "var(--text-muted)" }}>
              {row.age} {t("ageSuffix")}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      header: t("columns.role"),
      sortable: false,
      render: (row) => <CusBadge role={row.role} />,
    },
    {
      key: "status",
      header: t("columns.status"),
      sortable: false,
      render: (row) => <CusBadge status={STATUS_TO_BADGE[row.status]} />,
    },
    {
      key: "phone",
      header: t("columns.contact"),
      render: (row) => (
        <div className="flex flex-col gap-0.5">
          {row.phone && (
            <span
              className="flex items-center gap-1.5"
              style={{ fontSize: 12, color: "var(--text-2)" }}
            >
              <LuPhone size={11} style={{ color: "var(--text-muted)" }} />
              {row.phone}
            </span>
          )}
          {row.telegram_username && (
            <span
              className="flex items-center gap-1.5"
              style={{ fontSize: 12, color: "var(--text-2)" }}
            >
              <LuSend size={11} style={{ color: "var(--border-input)" }} />
              {row.telegram_username}
            </span>
          )}
        </div>
      ),
    },
    {
      key: "salary",
      header: t("columns.salary"),
      align: "right",
      sortable: true,
      render: (row) =>
        row.salary ? (
          <span
            style={{
              fontWeight: 500,
              color: "var(--text-default)",
              fontSize: 13,
            }}
          >
            {row.salary.toLocaleString()}{" "}
            <span style={{ fontSize: 11, color: "var(--text-muted)" }}>UZS</span>
          </span>
        ) : (
          <span style={{ color: "var(--text-muted)" }}>—</span>
        ),
    },
    {
      key: "createdAt",
      header: t("columns.joined"),
      sortable: true,
      render: (row) => {
        const days = dayjs().diff(dayjs(row.createdAt), "day");
        return (
          <div>
            <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
              {dayjs(row.createdAt).format("DD.MM.YYYY")}
            </p>
            <p style={{ fontSize: 11, color: "var(--text-3)" }}>
              {days} {t("daysSuffix")}
            </p>
          </div>
        );
      },
    },
  ];

  const ROLE_OPTIONS = [
    { label: t("roles.all"),      value: "" },
    { label: t("roles.admin"),    value: EmployeeRole.ADMIN },
    { label: t("roles.cashier"),  value: EmployeeRole.CASHIER },
    { label: t("roles.operator"), value: EmployeeRole.OPERATOR },
    { label: t("roles.security"), value: EmployeeRole.SECURITY },
    { label: t("roles.cleaner"),  value: EmployeeRole.CLEANER },
  ];

  const STATUS_OPTIONS = [
    { label: t("statuses.all"),      value: "" },
    { label: t("statuses.active"),   value: EmployeeStatus.ACTIVE },
    { label: t("statuses.inactive"), value: EmployeeStatus.INACTIVE },
    { label: t("statuses.vacation"), value: EmployeeStatus.VACATION },
    { label: t("statuses.fired"),    value: EmployeeStatus.FIRED },
  ];

  const filtered = useMemo(() => {
    setPage(1);
    setSelectedRows([]);
    const q = search.toLowerCase();
    return employees.filter((e) => {
      const matchName =
        !q ||
        (e.fullName ?? "").toLowerCase().includes(q) ||
        e.phone?.includes(q) ||
        e.age?.toString().includes(q) ||
        e.telegram_username?.toLowerCase().includes(q);
      const matchRole = !roleFilter || e.role === roleFilter;
      const matchStatus = !statusFilter || e.status === statusFilter;
      return matchName && matchRole && matchStatus;
    });
  }, [search, roleFilter, statusFilter]);

  const paginated = useMemo(
    () => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filtered, page],
  );

  const total    = employees.length;
  const active   = employees.filter((e) => e.status === EmployeeStatus.ACTIVE).length;
  const vacation = employees.filter((e) => e.status === EmployeeStatus.VACATION).length;
  const inactive = employees.filter(
    (e) => e.status === EmployeeStatus.INACTIVE || e.status === EmployeeStatus.FIRED,
  ).length;

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
        <StatCard label={t("total")}    value={total}    icon={LuUsers}     color="#3b82f6" />
        <StatCard label={t("active")}   value={active}   icon={LuUserCheck} color="#22c55e" />
        <StatCard label={t("vacation")} value={vacation} icon={LuSunMedium} color="#f59e0b" />
        <StatCard label={t("inactive")} value={inactive} icon={LuUserX}     color="#ef4444" />
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
                options={ROLE_OPTIONS}
                placeholder={t("columns.role")}
                size="sm"
                value={roleFilter}
                onChange={(v) => setRole(v as string)}
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
          {(search || roleFilter || statusFilter) && (
            <button
              onClick={() => {
                setSearch("");
                setRole("");
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
        <CusTable<Employee>
          data={paginated}
          columns={columns}
          showColumnBorder
          variant="outline"
          size="md"
          interactive
          selectable
          selectedRows={selectedRows}
          onSelectionChange={setSelectedRows}
          onRowClick={(row) => navigate(`/employee/${row.id}`)}
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
