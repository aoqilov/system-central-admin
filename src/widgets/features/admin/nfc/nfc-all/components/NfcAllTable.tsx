import { useMemo } from "react";
import { fmtDateTime } from "@/utils/dateUtils";
import { CusTable, type ColumnDef } from "@/components/ui/table/CusTable";
import { CusPagination } from "@/components/ui/table/CusPagination";
import { NfcTypeBadge } from "./NfcTypeBadge";
import { NfcStatusBadge } from "./NfcStatusBadge";
import type { Card } from "@/types/card.types";

interface Props {
  data: Card[];
  total: number;
  page: number;
  pageSize: number;
  isLoading?: boolean;
  onPageChange: (page: number) => void;
  onInfo: (card: Card) => void;
}

function buildColumns(onInfo: (card: Card) => void): ColumnDef<Card>[] {
  return [
    {
      key: "id",
      header: "ID",
      render: (r) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onInfo(r);
          }}
          className="font-mono text-xs font-semibold underline underline-offset-2 transition-opacity hover:opacity-70"
          style={{ color: "#3b82f6", cursor: "pointer" }}
        >
          #{r.id}
        </button>
      ),
    },
    {
      key: "type",
      header: "Тип",
      render: (r) =>
        r.type ? (
          <NfcTypeBadge type={r.type} />
        ) : (
          <span className="text-xs" style={{ color: "var(--text-dim)" }}>—</span>
        ),
    },
    {
      key: "batch",
      header: "Партия",
      render: (r) => (
        <span
          className="font-mono text-xs"
          style={{ color: "var(--text-muted)" }}
        >
          {r.batch}
        </span>
      ),
    },
    {
      key: "owner",
      header: "Владелец / Орг.",
      render: (r) => (
        <span
          className="text-xs"
          style={{ color: r.owner ? "var(--text-default)" : "var(--text-dim)" }}
        >
          {r.owner ?? "—"}
        </span>
      ),
    },
    {
      key: "card",
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
      key: "balance",
      header: "Баланс",
      render: (r) => (
        <span
          className="text-xs font-semibold tabular-nums"
          style={{ color: "#22c55e" }}
        >
          {r.balance.toLocaleString("ru-RU")} сум
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
    {
      key: "activated_at",
      header: "Активирован",
      render: (r) => (
        <span
          className="text-xs"
          style={{
            color: r.activated_at ? "var(--text-muted)" : "var(--text-dim)",
          }}
        >
          {r.activated_at ? fmtDateTime(r.activated_at) : "—"}
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
        <div style={{ minWidth: 900 }}>
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
