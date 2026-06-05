import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import { LuPencil, LuTrash2, LuX } from "react-icons/lu";
import {
  CusTable,
  type ColumnDef,
} from "../../../components/ui/table/CusTable";
import { CusPagination } from "../../../components/ui/table/CusPagination";
import { CusButton } from "../../../components/ui/buttons/CusButton";
import { QrStatusBadge } from "./QrStatusBadge";
import { formatQrRef, type QrCode } from "../qr.types";

interface Props {
  data: QrCode[];
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onEdit: (codes: QrCode[]) => void;
  onDelete: (codes: QrCode[]) => void;
}

const COLUMNS: ColumnDef<QrCode>[] = [
  {
    key: "order",
    header: "Raqam",
    width: 140,
    render: (r) => (
      <span className="font-mono text-xs font-semibold" style={{ color: "var(--text-default)" }}>
        {formatQrRef(r.batchSerial, r.order)}
      </span>
    ),
  },
  {
    key: "token",
    header: "Token",
    render: (r) => (
      <span className="font-mono text-xs" style={{ color: "var(--text-default)" }}>
        {r.token}
      </span>
    ),
  },
  {
    key: "status",
    header: "Status",
    render: (r) => <QrStatusBadge status={r.status} />,
  },
  {
    key: "partia",
    header: "Partiya",
    render: (r) => <span style={{ color: "var(--text-2)" }}>{r.partia}</span>,
  },
  {
    key: "amount",
    header: "Summa",
    align: "right",
    render: (r) =>
      r.amount > 0 ? (
        <div className="text-right">
          <p className="text-sm font-semibold tabular-nums" style={{ color: "var(--text-default)" }}>
            {r.amount.toLocaleString()}
          </p>
          <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>so'm</p>
        </div>
      ) : (
        <span style={{ fontSize: 12, color: "var(--text-muted)" }}>—</span>
      ),
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
  {
    key: "userId",
    header: "Foydalanuvchi",
    render: (r) => (
      <span className="text-xs" style={{ color: "var(--text-muted)" }}>
        {r.userId ?? "—"}
      </span>
    ),
  },
];

export function QrTable({
  data,
  total,
  page,
  pageSize,
  onPageChange,
  onEdit,
  onDelete,
}: Props) {
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);

  // Reset selection when data slice changes (filter / page change)
  useEffect(() => {
    setSelectedIndices([]);
  }, [data]);

  const selectedCodes = useMemo(
    () => selectedIndices.map((i) => data[i]).filter(Boolean),
    [selectedIndices, data],
  );

  function handlePageChange(p: number) {
    setSelectedIndices([]);
    onPageChange(p);
  }

  const count = selectedIndices.length;

  return (
    <div className="space-y-3">

      {/* ── Selection action bar ── */}
      {count > 0 && (
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-lg"
          style={{
            background: "var(--bg-hover)",
            border: "1px solid var(--border-default)",
          }}
        >
          <span className="text-sm font-medium flex-1" style={{ color: "var(--text-default)" }}>
            {count} ta tanlandi
          </span>
          <CusButton
            size="xs"
            variant="outline"
            colorPalette="blue"
            leftIcon={<LuPencil size={12} />}
            isDisabled={count !== 1}
            onClick={() => onEdit(selectedCodes)}
          >
            Tahrirlash
          </CusButton>
          <CusButton
            size="xs"
            variant="outline"
            colorPalette="red"
            leftIcon={<LuTrash2 size={12} />}
            onClick={() => onDelete(selectedCodes)}
          >
            O'chirish
          </CusButton>
          <CusButton
            size="xs"
            variant="ghost"
            colorPalette="gray"
            leftIcon={<LuX size={12} />}
            onClick={() => setSelectedIndices([])}
          >
            {""}
          </CusButton>
        </div>
      )}

      {/* ── Table ── */}
      <div className="overflow-x-auto">
        <div style={{ minWidth: 700 }}>
          <CusTable<QrCode>
            data={data}
            columns={COLUMNS}
            variant="outline"
            interactive
            selectable
            selectedRows={selectedIndices}
            onSelectionChange={setSelectedIndices}
            emptyText="Bu partiyada kod yo'q"
          />
        </div>
      </div>

      {total > pageSize && (
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
