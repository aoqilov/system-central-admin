import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useKassas, useDeleteKassas } from "../hooks/useApiKassa";
import {
  LuSearch,
  LuMapPin,
  LuPencil,
  LuTrash2,
  LuPlus,
  LuX,
  LuUser,
} from "react-icons/lu";
import {
  CashboxStatusLabel,
  CashboxStatusBadge,
  CashboxStatusTypes,
} from "@/const/constData";
import type { Cashbox, CashboxStatus } from "../types";
import { CusTable, type ColumnDef } from "@/components/ui/table/CusTable";
import { CusBadge } from "@/components/ui/badge/CusBadge";
import { CusInput } from "@/components/ui/inputs/CusInput";
import CusSelect from "@/components/ui/select/CusSelect";
import { CusPagination } from "@/components/ui/table/CusPagination";
import { CusButton } from "@/components/ui/buttons/CusButton";
import { CusImagePreview } from "@/components/ui/image/CusImagePreview";
import { CusDialogDelete } from "@/components/ui/dialog/CusDialogDelete";
import { ModalAddKassa } from "../modals/ModalAddKassa";
import { ModalEditKassa } from "../modals/ModalEditKassa";
import { getFileUrl } from "@/api/files/files.api";

const PAGE_SIZE = 10;

const STATUS_OPTIONS = [
  { label: "Все статусы", value: "" },
  ...Object.values(CashboxStatusTypes).map((v) => ({
    label: CashboxStatusLabel[v],
    value: v,
  })),
];

export function KassaTableCard() {

  const [search, setSearch] = useState("");
  const [statusFilter, setStatus] = useState<CashboxStatus | "">("");
  const [page, setPage] = useState(1);
  const [selectedRows, setSelected] = useState<number[]>([]);
  const [selectedKassas, setSelectedKassas] = useState<Cashbox[]>([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  // debounce search so API is not called on every keystroke
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedSearch(search), 400);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [search]);

  useEffect(() => {
    setPage(1);
    setSelected([]);
    setSelectedKassas([]);
  }, [debouncedSearch, statusFilter]);

  const { data, isLoading } = useKassas({
    search: debouncedSearch || undefined,
    statuses: statusFilter || undefined,
    page,
    limit: PAGE_SIZE,
  });

  const cashboxes = data?.cashboxes ?? [];
  const total = data?.pagination?.total ?? 0;

  const deleteMutation = useDeleteKassas();

  const editKassa = selectedKassas[0] ?? null;

  const columns: ColumnDef<Cashbox>[] = [
    {
      key: "name",
      header: "Касса",
      sortable: false,
      render: (row) => (
        <div>
          <Link
            to={`/kassa/${row.id}`}
            className="text-sm font-medium hover:underline"
            style={{ color: "var(--text-default)" }}
          >
            {row.name}
          </Link>
          <div className="flex items-center gap-1 mt-0.5">
            <LuMapPin size={10} style={{ color: "var(--text-muted)" }} />
            <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
              {row.place}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "device",
      header: "Девайс",
      sortable: false,
      render: (row) => (
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>
          {row.device}
        </span>
      ),
    },

    {
      key: "status",
      header: "Статус",
      sortable: false,
      render: (row) => (
        <CusBadge status={CashboxStatusBadge[row.status]} size="sm">
          {CashboxStatusLabel[row.status]}
        </CusBadge>
      ),
    },
    {
      key: "operator",
      header: "Кассир",
      sortable: false,
      render: (row) => {
        const ops = row.operators ?? [];
        if (ops.length === 0)
          return (
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>—</span>
          );
        const first = ops[0];
        const extra = ops.length - 1;
        const fullName = `${first.firstname} ${first.lastname}`;
        return (
          <div className="flex items-center gap-2">
            {first.file ? (
              <CusImagePreview
                src={getFileUrl(first.file)}
                alt={fullName}
                width={34}
                height={34}
                objectFit="cover"
                borderRadius="50%"
                preview={true}
              />
            ) : (
              <div
                className="w-[34px] h-[34px] rounded-full flex items-center justify-center shrink-0"
                style={{ background: "var(--bg-hover)" }}
              >
                <LuUser size={12} style={{ color: "var(--text-muted)" }} />
              </div>
            )}
            <span className="text-xs" style={{ color: "var(--text-2)" }}>
              {fullName}
            </span>
            {extra > 0 && (
              <span
                className="text-[10px] font-medium px-1.5 py-0.5 rounded-full"
                style={{
                  background: "var(--bg-hover)",
                  color: "var(--text-muted)",
                }}
              >
                +{extra}
              </span>
            )}
          </div>
        );
      },
    },
    {
      key: "description",
      header: "Примечание",
      sortable: false,
      render: (row) =>
        row.description ? (
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            {row.description}
          </span>
        ) : (
          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>—</span>
        ),
    },
  ];

  return (
    <>
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
              placeholder="Поиск по названию или местоположению..."
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
              placeholder="Статус"
              size="sm"
              value={statusFilter}
              onChange={(v) => setStatus(v as CashboxStatus | "")}
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
                Найдено {total} касс
              </span>
            ) : (
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: "var(--text-default)",
                }}
              >
                Выбрано {selectedRows.length}
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
                Сбросить фильтры
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
                onClick={() => setOpenAdd(true)}
              >
                Добавить
              </CusButton>
            )}
            {selectedRows.length === 1 && (
              <>
                <CusButton
                  size="xs"
                  variant="solid"
                  colorPalette="orange"
                  leftIcon={<LuPencil size={13} />}
                  onClick={() => setOpenEdit(true)}
                >
                  Редактировать
                </CusButton>
                <CusButton
                  size="xs"
                  variant="solid"
                  colorPalette="red"
                  leftIcon={<LuTrash2 size={13} />}
                  onClick={() => setOpenDelete(true)}
                >
                  Удалить
                </CusButton>
                <button
                  onClick={() => {
                    setSelected([]);
                    setSelectedKassas([]);
                  }}
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
                  onClick={() => setOpenDelete(true)}
                >
                  Удалить ({selectedRows.length})
                </CusButton>
                <button
                  onClick={() => {
                    setSelected([]);
                    setSelectedKassas([]);
                  }}
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
        <CusTable<Cashbox>
          data={cashboxes}
          columns={columns}
          showColumnBorder
          variant="outline"
          size="md"
          interactive
          selectable
          isLoading={isLoading}
          selectedRows={selectedRows}
          onSelectionChange={setSelected}
          onSelectionRowsChange={setSelectedKassas}
          emptyText="Кассы не найдены"
        />

        {/* Pagination */}
        <div
          className="px-4 py-3 border-t"
          style={{ borderColor: "var(--border-default)" }}
        >
          <CusPagination
            count={total}
            pageSize={PAGE_SIZE}
            page={page}
            onPageChange={setPage}
            showPageText
          />
        </div>
      </div>

      <ModalAddKassa open={openAdd} onClose={() => setOpenAdd(false)} />
      <ModalEditKassa
        open={openEdit}
        onClose={() => {
          setOpenEdit(false);
          setSelected([]);
          setSelectedKassas([]);
        }}
        kassa={editKassa}
      />
      <CusDialogDelete
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        title={
          selectedRows.length > 1
            ? `Удалить ${selectedRows.length} кассы`
            : "Удалить кассу"
        }
        description="Удалённая касса не восстанавливается. Продолжить?"
        onConfirm={() =>
          deleteMutation.mutate(selectedRows, {
            onSuccess: () => {
              setOpenDelete(false);
              setSelected([]);
              setSelectedKassas([]);
            },
          })
        }
        isLoading={deleteMutation.isPending}
      />
    </>
  );
}
