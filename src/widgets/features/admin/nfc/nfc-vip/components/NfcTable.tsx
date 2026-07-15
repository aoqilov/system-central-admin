import { useEffect, useMemo, useState } from "react";
import { fmtDateTime } from "@/utils/dateUtils";
import { LuPencil, LuTrash2, LuX, LuPlus, LuUserCheck } from "react-icons/lu";
import { CusTable, type ColumnDef } from "@/components/ui/table/CusTable";
import { CusPagination } from "@/components/ui/table/CusPagination";
import { CusButton } from "@/components/ui/buttons/CusButton";
import { NfcStatusBadge } from "./NfcStatusBadge";
import { CusBadge } from "@/components/ui/badge/CusBadge";
import { AssignOwnerDialog, type OwnerInfo } from "../modals/AssignOwnerDialog";
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
  onInfo: (card: Card) => void;
}

function buildColumns(
  owners: Record<number, OwnerInfo>,
  onAssign: (card: Card) => void,
  onInfo: (card: Card) => void,
): ColumnDef<Card>[] {
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
      render: (r) => (
        <CusBadge colorPalette="purple" variant="subtle" size="sm">
          {r.type === "classic"
            ? "Classic"
            : r.type === "vip"
              ? "VIP"
              : r.type === "organization"
                ? "Организация"
                : "Неизвестно"}
        </CusBadge>
      ),
    },
    {
      key: "name",
      header: "Кому выдана",
      render: (r) => {
        const owner =
          owners[r.id] ??
          (r.owner ? { firstName: r.owner, lastName: "", phone: "" } : null);
        if (owner) {
          return (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAssign(r);
              }}
              className="flex items-center gap-1 transition-opacity hover:opacity-70"
            >
              <LuUserCheck
                size={12}
                style={{ color: "#22c55e", flexShrink: 0 }}
              />
              <span
                className="text-xs"
                style={{ color: "var(--text-default)" }}
              >
                {owner.firstName} {owner.lastName}
              </span>
            </button>
          );
        }
        return (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAssign(r);
            }}
            className="flex items-center gap-1 px-2 py-0.5 rounded-md transition-colors hover:opacity-80"
            style={{ background: "#22c55e18", border: "1px solid #22c55e40" }}
          >
            <LuPlus size={11} style={{ color: "#22c55e" }} />
            <span className="text-xs font-medium" style={{ color: "#22c55e" }}>
              Добавить
            </span>
          </button>
        );
      },
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

export function NfcTable({
  data,
  total,
  page,
  pageSize,
  isLoading = false,
  onPageChange,
  onEdit,
  onDelete,
  onInfo,
}: Props) {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [owners, setOwners] = useState<Record<number, OwnerInfo>>({});
  const [assignTarget, setAssignTarget] = useState<Card | null>(null);

  useEffect(() => {
    setSelectedIds([]);
  }, [data]);

  const selectedCards = useMemo(
    () => data.filter((card) => selectedIds.includes(card.id)),
    [selectedIds, data],
  );

  const columns = useMemo(
    () => buildColumns(owners, setAssignTarget, onInfo),
    [owners, onInfo],
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
            Выбрано: {count}
          </span>
          <CusButton
            size="xs"
            variant="outline"
            colorPalette="blue"
            leftIcon={<LuPencil size={12} />}
            isDisabled={count !== 1}
            onClick={() => onEdit(selectedCards)}
          >
            Изменить
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
        <div style={{ minWidth: 700 }}>
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

      <AssignOwnerDialog
        open={assignTarget !== null}
        onClose={() => setAssignTarget(null)}
        initial={assignTarget ? owners[assignTarget.id] : undefined}
        onSave={(info) => {
          if (!assignTarget) return;
          setOwners((prev) => ({ ...prev, [assignTarget.id]: info }));
        }}
      />
    </div>
  );
}
