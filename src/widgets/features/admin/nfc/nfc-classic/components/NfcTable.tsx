import { useEffect, useMemo, useState } from "react";
import { fmtDateTime } from "@/utils/dateUtils";
import { LuPencil, LuTrash2, LuX } from "react-icons/lu";
import { CusTable, type ColumnDef } from "@/components/ui/table/CusTable";
import { CusPagination } from "@/components/ui/table/CusPagination";
import { CusButton } from "@/components/ui/buttons/CusButton";
import { NfcStatusBadge } from "./NfcStatusBadge";
import { CusBadge } from "@/components/ui/badge/CusBadge";
import type { Card } from "../nfc.types";

interface Props {
  data: Card[];
  total: number;
  page: number;
  pageSize: number;
  isLoading?: boolean;
  onPageChange: (page: number) => void;
  onEdit: (cards: Card[]) => void;
  onDelete: (cards: Card[]) => void;
}

const COLUMNS: ColumnDef<Card>[] = [
  {
    key: "id",
    header: "ID",
    render: (r) => (
      <span
        className="font-mono text-xs font-semibold"
        style={{ color: "var(--text-default)" }}
      >
        #{r.id}
      </span>
    ),
  },
  {
    key: "type",
    header: "Тип",
    render: (r) => (
      <CusBadge colorPalette="blue" variant="subtle" size="sm">
        {r.type === "classic"
          ? "Classic"
          : r.type === "vip"
            ? "VIP"
            : r.type === "organization"
              ? "Organization"
              : "Неизвестно"}
      </CusBadge>
    ),
  },
  {
    key: "code",
    header: "Код карты",
    render: (r) => (
      <span
        className="font-mono text-xs"
        style={{ color: "var(--text-default)" }}
      >
        {r.card}
      </span>
    ),
  },
  {
    key: "batch",
    header: "Batch",
    render: (r) => (
      <span
        className="font-mono text-xs"
        style={{ color: "var(--text-default)" }}
      >
        {r.batch}
      </span>
    ),
  },
  {
    key: "nfc",
    header: "NFC код",
    render: (r) => (
      <span
        className="font-mono text-xs"
        style={{ color: "var(--text-default)" }}
      >
        {r.nfc}
      </span>
    ),
  },
  {
    key: "status",
    header: "Status",
    render: (r) => <NfcStatusBadge status={r.status} />,
  },
  {
    key: "balance",
    header: "Balans",
    render: (r) => (
      <span className="text-xs" style={{ color: "var(--text-default)" }}>
        {r.balance.toLocaleString("ru-RU")}
      </span>
    ),
  },

  {
    key: "imported_at",
    header: "Создан",
    render: (r) => (
      <span className="text-xs" style={{ color: "var(--text-muted)" }}>
        {fmtDateTime(r.imported_at)}
      </span>
    ),
  },
];

export function NfcTable({
  data,
  total,
  page,
  pageSize,
  isLoading = false,
  onPageChange,
  onEdit,
  onDelete,
}: Props) {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  useEffect(() => {
    setSelectedIds([]);
  }, [data]);

  const selectedCards = useMemo(
    () => data.filter((card) => selectedIds.includes(card.id)),
    [selectedIds, data],
  );

  function handlePageChange(p: number) {
    setSelectedIds([]);
    onPageChange(p);
  }

  const count = selectedIds.length;

  return (
    <div className="space-y-3">
      {count > 0 && (
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-lg"
          style={{
            background: "var(--bg-hover)",
            border: "1px solid var(--border-default)",
          }}
        >
          <span
            className="text-sm font-medium flex-1"
            style={{ color: "var(--text-default)" }}
          >
            {count} выбрано
          </span>
          <CusButton
            size="xs"
            variant="outline"
            colorPalette="blue"
            leftIcon={<LuPencil size={12} />}
            isDisabled={count !== 1}
            onClick={() => onEdit(selectedCards)}
          >
            Редактировать
          </CusButton>
          <CusButton
            size="xs"
            variant="outline"
            colorPalette="red"
            leftIcon={<LuTrash2 size={12} />}
            onClick={() => onDelete(selectedCards)}
          >
            Удалить
          </CusButton>
          <CusButton
            size="xs"
            variant="ghost"
            colorPalette="gray"
            leftIcon={<LuX size={12} />}
            onClick={() => setSelectedIds([])}
          >
            {""}
          </CusButton>
        </div>
      )}

      <div className="overflow-x-auto">
        <div style={{ minWidth: 560 }}>
          {isLoading ? (
            <div className="space-y-2 py-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-10 rounded-lg animate-pulse"
                  style={{ background: "var(--bg-hover)" }}
                />
              ))}
            </div>
          ) : (
            <CusTable<Card>
              data={data}
              columns={COLUMNS}
              variant="outline"
              interactive
              selectable
              selectedRows={selectedIds}
              onSelectionChange={setSelectedIds}
              emptyText="Карты не найдены"
            />
          )}
        </div>
      </div>

      {total > 0 && (
        <div className="flex justify-end">
          <CusPagination
            count={total}
            pageSize={pageSize}
            page={page}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}
