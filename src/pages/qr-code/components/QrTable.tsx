import React, { useMemo } from "react";
import dayjs from "dayjs";
import { LuPencil, LuTrash2 } from "react-icons/lu";
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
  onEdit: (code: QrCode) => void;
  onDelete: (code: QrCode) => void;
}

const QrRowActions = React.memo(function QrRowActions({
  code,
  onEdit,
  onDelete,
}: {
  code: QrCode;
  onEdit: (c: QrCode) => void;
  onDelete: (c: QrCode) => void;
}) {
  return (
    <div
      className="flex items-center gap-1"
      onClick={(e) => e.stopPropagation()}
    >
      <CusButton
        size="xs"
        variant="ghost"
        colorPalette="blue"
        leftIcon={<LuPencil size={12} />}
        onClick={() => onEdit(code)}
      >
        {""}
      </CusButton>
      <CusButton
        size="xs"
        variant="ghost"
        colorPalette="red"
        leftIcon={<LuTrash2 size={12} />}
        onClick={() => onDelete(code)}
      >
        {""}
      </CusButton>
    </div>
  );
});

export function QrTable({
  data,
  total,
  page,
  pageSize,
  onPageChange,
  onEdit,
  onDelete,
}: Props) {
  const columns: ColumnDef<QrCode>[] = useMemo(() => [
    {
      key: "order",
      header: "Raqam",
      width: 140,
      render: (r) => (
        <span
          className="font-mono text-xs font-semibold"
          style={{ color: "var(--text-default)" }}
        >
          {formatQrRef(r.batchSerial, r.order)}
        </span>
      ),
    },
    {
      key: "token",
      header: "Token",
      render: (r) => (
        <span
          className="font-mono text-xs"
          style={{ color: "var(--text-default)" }}
        >
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
    {
      key: "id",
      header: "Amallar",
      align: "right",
      render: (r) => (
        <QrRowActions code={r} onEdit={onEdit} onDelete={onDelete} />
      ),
    },
  ], [onEdit, onDelete]);

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto">
        <div style={{ minWidth: 800 }}>
          <CusTable<QrCode>
            data={data}
            columns={columns}
            variant="outline"
            interactive
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
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
}
