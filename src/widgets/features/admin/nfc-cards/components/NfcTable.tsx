import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import { LuPencil, LuTrash2, LuX } from "react-icons/lu";
import { CusTable, type ColumnDef } from "@/components/ui/table/CusTable";
import { CusPagination } from "@/components/ui/table/CusPagination";
import { CusButton } from "@/components/ui/buttons/CusButton";
import { NfcStatusBadge } from "./NfcStatusBadge";
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
    width: 80,
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
    key: "code",
    header: "Karta kodi",
    render: (r) => (
      <span
        className="font-mono text-xs"
        style={{ color: "var(--text-default)" }}
      >
        {r.code}
      </span>
    ),
  },
  {
    key: "status",
    header: "Status",
    render: (r) => <NfcStatusBadge status={r.status} />,
  },
  {
    key: "createdAt",
    header: "Yaratilgan",
    render: (r) => (
      <span className="text-xs" style={{ color: "var(--text-muted)" }}>
        {dayjs(r.createdAt).format("DD.MM.YYYY HH:mm")}
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
            {count} ta tanlandi
          </span>
          <CusButton
            size="xs"
            variant="outline"
            colorPalette="blue"
            leftIcon={<LuPencil size={12} />}
            isDisabled={count !== 1}
            onClick={() => onEdit(selectedCards)}
          >
            Tahrirlash
          </CusButton>
          <CusButton
            size="xs"
            variant="outline"
            colorPalette="red"
            leftIcon={<LuTrash2 size={12} />}
            onClick={() => onDelete(selectedCards)}
          >
            O'chirish
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
              emptyText="Kartalar topilmadi"
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
