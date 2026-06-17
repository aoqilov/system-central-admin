import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LuSearch,
  LuPhone,
  LuSend,
  LuTrash2,
  LuX,
  LuPencil,
  LuPlus,
} from "react-icons/lu";
import dayjs from "dayjs";
import { CusButton } from "@/components/ui/buttons/CusButton";
import { CusTable, type ColumnDef } from "@/components/ui/table/CusTable";
import {
  CusBadge,
  type BadgeStatus,
  type BadgeRole,
} from "@/components/ui/badge/CusBadge";
import { CusInput } from "@/components/ui/inputs/CusInput";
import CusSelect from "@/components/ui/select/CusSelect";
import { CusPagination } from "@/components/ui/table/CusPagination";
import CusDialogDelete from "@/components/ui/dialog/childs/CusDialogDelete";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchEmployees,
  fetchRoles,
  deleteEmployees,
} from "../api/employeesApi";
import type { ApiEmployee } from "../types";
import ModalAddEmploye from "../modals/ModalAddEmploye";
import ModalEditEmploye from "../modals/ModalEditEmploye";

const STATUS_OPTIONS = [
  { label: "Все статусы", value: "" },
  { label: "Активный", value: "active" },
  { label: "Неактивный", value: "inactive" },
  { label: "В отпуске", value: "vacation" },
  { label: "Уволен", value: "fired" },
];

export default function EmployeeTableCard() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  const qc = useQueryClient();

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [roleFilter, setRole] = useState("");
  const [statusFilter, setStatus] = useState("");
  const [selectedRows, setSelected] = useState<number[]>([]);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editEmployee, setEditEmployee] = useState<ApiEmployee | undefined>();
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
      setSelected([]);
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

  const { data, isPending, isError } = useQuery({
    queryKey: [
      "employees",
      page,
      PAGE_SIZE,
      debouncedSearch,
      roleFilter,
      statusFilter,
    ],
    queryFn: () =>
      fetchEmployees({
        page,
        limit: PAGE_SIZE,
        search: debouncedSearch || undefined,
        roles: roleFilter ? [Number(roleFilter)] : undefined,
        statuses: statusFilter
          ? ([statusFilter] as Array<
              "active" | "inactive" | "vacation" | "fired"
            >)
          : undefined,
      }),
  });

  const employees = data?.employees ?? [];
  const pagination = data?.pagination;

  const { data: roles = [] } = useQuery({
    queryKey: ["roles"],
    queryFn: fetchRoles,
  });

  const deleteMut = useMutation({
    mutationFn: (ids: number[]) => deleteEmployees(ids),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["employees"] }),
  });

  const roleMap = useMemo(
    () => new Map(roles.map((r) => [r.id, r.name])),
    [roles],
  );

  const roleOptions = useMemo(
    () => [
      { label: "Все роли", value: "" },
      ...roles.map((r) => ({ label: r.name, value: String(r.id) })),
    ],
    [roles],
  );

  function openCreate() {
    setAddOpen(true);
  }

  function openEdit() {
    const emp = employees[selectedRows[0]];
    console.log("Selected employee for edit:", emp);
    if (!emp) return;
    setEditEmployee(emp);
    setEditOpen(true);
  }

  function handleDelete() {
    const ids = selectedRows.map((idx) => employees[idx].id);
    deleteMut.mutate(ids, {
      onSuccess: () => {
        setSelected([]);
        setDeleteConfirmOpen(false);
      },
    });
  }

  const columns: ColumnDef<ApiEmployee>[] = [
    {
      key: "fullname",
      header: "Сотрудник",
      sortable: false,
      render: (row) => {
        const age = row.date_of_birth
          ? dayjs().diff(dayjs(row.date_of_birth), "year")
          : null;
        return (
          <div className="flex items-center gap-3">
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: "var(--bg-hover)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                fontSize: 13,
                fontWeight: 600,
                color: "var(--text-muted)",
              }}
            >
              {row.firstname?.[0]?.toUpperCase() ?? "?"}
            </div>
            <div>
              <p
                style={{
                  fontWeight: 500,
                  color: "var(--text-default)",
                  fontSize: 13,
                }}
              >
                {row.lastname} {row.firstname}
              </p>
              {age !== null && (
                <p style={{ fontSize: 11, color: "var(--text-muted)" }}>
                  {age} лет
                </p>
              )}
            </div>
          </div>
        );
      },
    },
    {
      key: "role",
      header: "Роль",
      sortable: false,
      render: (row) => {
        const name = roleMap.get(row.role);
        if (!name)
          return (
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>—</span>
          );
        const knownRoles: BadgeRole[] = [
          "SUPER_ADMIN",
          "OPERATOR_ATTRACTION",
          "CASHIER",
          "SECURITY",
          "CLEANER",
        ];
        if (knownRoles.includes(name as BadgeRole)) {
          return <CusBadge role={name as BadgeRole} />;
        }
        return (
          <span
            style={{
              fontSize: 12,
              color: "var(--text-2)",
              textTransform: "capitalize",
            }}
          >
            {name}
          </span>
        );
      },
    },
    {
      key: "status",
      header: "Статус",
      sortable: false,
      render: (row) => <CusBadge status={row.status as BadgeStatus} />,
    },
    {
      key: "phone_number",
      header: "Контакт",
      render: (row) => (
        <div className="flex flex-col gap-0.5">
          {row.phone_number && (
            <span
              className="flex items-center gap-1.5"
              style={{ fontSize: 12, color: "var(--text-2)" }}
            >
              <LuPhone size={11} style={{ color: "var(--text-muted)" }} />
              {row.phone_number}
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
      header: "Оклад",
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
            <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
              UZS
            </span>
          </span>
        ) : (
          <span style={{ color: "var(--text-muted)" }}>—</span>
        ),
    },
  ];

  // ─── Table ─────────────────────────────────────────────────────────────────
  return (
    <>
      <div
        className="rounded-xl border overflow-hidden"
        style={{
          background: "var(--bg-second)",
          borderColor: "var(--border-default)",
        }}
      >
        {/* Search + filters */}
        <div
          className="px-4 py-3 border-b flex flex-col tablet:flex-row gap-3"
          style={{ borderColor: "var(--border-default)" }}
        >
          <div className="flex-1">
            <CusInput
              placeholder="Поиск по имени, телефону, telegram..."
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
                options={roleOptions}
                placeholder="Роль"
                size="sm"
                value={roleFilter}
                onChange={(v) => {
                  setRole(v as string);
                  setPage(1);
                  setSelected([]);
                }}
              />
            </div>
            <div style={{ width: 180 }}>
              <CusSelect
                options={STATUS_OPTIONS}
                placeholder="Статус"
                size="sm"
                value={statusFilter}
                onChange={(v) => {
                  setStatus(v as string);
                  setPage(1);
                  setSelected([]);
                }}
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
            Найдено: {pagination?.total ?? 0}
          </span>
          {(search || roleFilter || statusFilter) && (
            <button
              onClick={() => {
                setSearch("");
                setRole("");
                setStatus("");
                setPage(1);
                setSelected([]);
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
              Сбросить фильтры
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
              Выберите строку для действий
            </span>
          ) : (
            <span
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: "var(--text-default)",
              }}
            >
              Выбрано: {selectedRows.length}
            </span>
          )}

          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {selectedRows.length === 0 && (
              <CusButton
                size="xs"
                variant="solid"
                colorPalette="blue"
                leftIcon={<LuPlus size={13} />}
                onClick={openCreate}
              >
                Добавить
              </CusButton>
            )}

            {selectedRows.length === 1 && (
              <div className="relative flex gap-2">
                <CusButton
                  size="xs"
                  variant="solid"
                  colorPalette="orange"
                  leftIcon={<LuPencil size={13} />}
                  onClick={openEdit}
                >
                  Изменить
                </CusButton>
                <CusButton
                  size="xs"
                  variant="solid"
                  colorPalette="red"
                  leftIcon={<LuTrash2 size={13} />}
                  isDisabled={deleteMut.isPending}
                  onClick={() => setDeleteConfirmOpen(true)}
                >
                  Удалить
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
              </div>
            )}

            {selectedRows.length > 1 && (
              <>
                <CusButton
                  size="xs"
                  variant="outline"
                  colorPalette="red"
                  leftIcon={<LuTrash2 size={13} />}
                  isDisabled={deleteMut.isPending}
                  onClick={() => setDeleteConfirmOpen(true)}
                >
                  Удалить ({selectedRows.length})
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
        {isPending ? (
          <div
            style={{
              minHeight: 180,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                border: "3px solid var(--border-default)",
                borderTopColor: "#3b82f6",
                animation: "spin 0.7s linear infinite",
              }}
            />
          </div>
        ) : isError ? (
          <div
            style={{
              minHeight: 180,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <p style={{ fontSize: 13, color: "#ef4444" }}>
              Ошибка загрузки. Обновите страницу.
            </p>
          </div>
        ) : (
          <CusTable<ApiEmployee>
            data={employees}
            columns={columns}
            showColumnBorder
            variant="outline"
            size="md"
            interactive
            selectable
            selectedRows={selectedRows}
            onSelectionChange={setSelected}
            onRowClick={(row) => navigate(`/employee/${row.id}`)}
            emptyText="Сотрудники не найдены"
          />
        )}

        {/* Pagination */}
        <div
          className="px-4 py-3 border-t"
          style={{ borderColor: "var(--border-default)" }}
        >
          <CusPagination
            count={pagination?.total ?? 0}
            pageSize={PAGE_SIZE}
            page={page}
            onPageChange={setPage}
            showPageText
          />
        </div>
      </div>
      {/* Modals */}
      <ModalAddEmploye open={addOpen} onClose={() => setAddOpen(false)} />
      {editEmployee && (
        <ModalEditEmploye
          open={editOpen}
          onClose={() => {
            setEditOpen(false);
            setEditEmployee(undefined);
          }}
          employee={editEmployee}
        />
      )}
      <CusDialogDelete
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        title={`Удалить ${selectedRows.length > 1 ? `${selectedRows.length} сотрудников` : "сотрудника"}?`}
        description="Это действие нельзя отменить."
        isLoading={deleteMut.isPending}
      />
    </>
  );
}
