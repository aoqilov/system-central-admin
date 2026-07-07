import { useMemo } from "react";
import { fmtDateTime } from "@/utils/dateUtils";
import { CusTable, type ColumnDef } from "@/components/ui/table/CusTable";
import { CusPagination } from "@/components/ui/table/CusPagination";
import { NfcTypeBadge } from "./NfcTypeBadge";
import { NfcStatusBadge } from "./NfcStatusBadge";
import type { UnifiedCard } from "../nfc-all.types";

interface Props {
  data: UnifiedCard[];
  total: number;
  page: number;
  pageSize: number;
  isLoading?: boolean;
  onPageChange: (page: number) => void;
  onInfo: (card: UnifiedCard) => void;
}

function buildColumns(onInfo: (card: UnifiedCard) => void): ColumnDef<UnifiedCard>[] {
  return [
    {
      key: "id",
      header: "ID",
      render: (r) => (
        <button
          onClick={(e) => { e.stopPropagation(); onInfo(r); }}
          className="font-mono text-xs font-semibold underline underline-offset-2 transition-opacity hover:opacity-70"
          style={{ color: "var(--color-blue, #3b82f6)", cursor: "pointer" }}
        >
          #{r.id}
        </button>
      ),
    },
    {
      key: "type",
      header: "Тип",
      render: (r) => <NfcTypeBadge type={r.type} />,
    },
    {
      key: "owner",
      header: "Владелец / Орг.",
      render: (r) => (
        <span
          className="text-xs"
          style={{ color: r.owner ? "var(--text-default)" : "var(--text-muted)" }}
        >
          {r.owner ?? "—"}
        </span>
      ),
    },
    {
      key: "card",
      header: "Код карты",
      render: (r) => (
        <span className="font-mono text-xs" style={{ color: "var(--text-default)" }}>
          {r.card}
        </span>
      ),
    },
    {
      key: "nfc",
      header: "NFC код",
      render: (r) => (
        <span className="font-mono text-xs" style={{ color: "var(--text-default)" }}>
          {r.nfc}
        </span>
      ),
    },
    {
      key: "status",
      header: "Статус",
      render: (r) => <NfcStatusBadge status={r.status} />,
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
}

export function NfcAllTable({
  data,
  total,
  page,
  pageSize,
  isLoading = false,
  onPageChange,
  onInfo,
}: Props) {
  const columns = useMemo(() => buildColumns(onInfo), [onInfo]);

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto">
        <div style={{ minWidth: 640 }}>
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
            <CusTable<UnifiedCard>
              data={data}
              columns={columns}
              variant="outline"
              interactive
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
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
}
