import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import QRCode from "qrcode";
import {
  LuSearch,
  LuTrash2,
  LuX,
  LuPencil,
  LuPlus,
  LuEye,
  LuQrCode,
} from "react-icons/lu";
import {
  useAttractions,
  useDeleteAttractions,
} from "../hooks/useApiAttractions";
import { CusButton } from "@/components/ui/buttons/CusButton";
import { CusDialog } from "@/components/ui/dialog/CusDialog";
import { CusDialogDelete } from "@/components/ui/dialog/CusDialogDelete";
import { CusTable, type ColumnDef } from "@/components/ui/table/CusTable";
import { CusBadge } from "@/components/ui/badge/CusBadge";
import { CusInput } from "@/components/ui/inputs/CusInput";
import CusSelect from "@/components/ui/select/CusSelect";
import { CusPagination } from "@/components/ui/table/CusPagination";
import { useTranslation } from "@/i18n/languageConfig";
import ModalAddAttraction from "../modals/ModalAddAttraction";
import ModalEditAttraction from "../modals/ModalEditAttraction";
import ModalQrCode from "../modals/ModalQrCode";
import { getFileUrl } from "@/api/files/files.api";
import { CusImagePreview } from "@/components/ui/image/CusImagePreview";
import type { Attraction } from "../types";

const PAGE_SIZE = 20;

function QrCodeCell({
  attraction,
  onClick,
}: {
  attraction: Attraction;
  onClick: (a: Attraction) => void;
}) {
  const [dataUrl, setDataUrl] = useState("");
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    QRCode.toDataURL(JSON.stringify({ type: "attraction", id: attraction.id }), {
      width: 40,
      margin: 1,
      color: { dark: "#111827", light: "#ffffff" },
    }).then(setDataUrl);
  }, [attraction.id]);

  return (
    <div
      style={{ position: "relative", width: 40, height: 40, flexShrink: 0, cursor: "pointer" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={(e) => { e.stopPropagation(); onClick(attraction); }}
    >
      {dataUrl && (
        <img
          src={dataUrl}
          alt="qr"
          style={{ width: 40, height: 40, borderRadius: 4, display: "block" }}
        />
      )}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 4,
          background: hovered ? "rgba(0,0,0,0.45)" : "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "background 0.15s",
          opacity: hovered ? 1 : 0,
        }}
      >
        <LuQrCode size={16} color="white" />
      </div>
    </div>
  );
}

function ImagePreviewCell({ src, alt }: { src: string; alt: string }) {
  const [hovered, setHovered] = useState(false);
  const [open, setOpen] = useState(false);
  return (
    <>
      <div
        style={{ position: "relative", width: 54, height: 44, flexShrink: 0 }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <img
          src={src}
          alt={alt}
          style={{
            width: 54,
            height: 44,
            borderRadius: 6,
            objectFit: "cover",
            display: "block",
          }}
        />
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setOpen(true);
          }}
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 6,
            border: "none",
            background: hovered ? "rgba(0,0,0,0.45)" : "transparent",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "background 0.15s",
            opacity: hovered ? 1 : 0,
          }}
        >
          <LuEye size={18} color="white" />
        </button>
      </div>
      <CusDialog
        open={open}
        onClose={() => setOpen(false)}
        size="lg"
        closeOnBackdrop
      >
        <img
          src={src}
          alt={alt}
          style={{
            maxWidth: "100%",
            maxHeight: "60vh",
            borderRadius: 10,
            objectFit: "contain",
            display: "block",
            margin: "0 auto",
          }}
        />
      </CusDialog>
    </>
  );
}

const STATUS_BADGE: Record<string, "active" | "pending" | "fired"> = {
  active: "active",
  inactive: "fired",
  maintenance: "pending",
  closed: "fired",
};

const STATUS_VALUES = ["active", "inactive", "maintenance", "closed"];

export default function AttractionTableCard() {
  const navigate = useNavigate();
  const { t } = useTranslation("attractions.");

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebounced] = useState("");
  const [statusFilter, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [selectedAttractions, setSelectedAttractions] = useState<Attraction[]>(
    [],
  );
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openQr, setOpenQr] = useState(false);
  const [qrAttraction, setQrAttraction] = useState<Attraction | null>(null);

  // debounce search
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setDebounced(search);
      setPage(1);
    }, 400);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [search]);

  useEffect(() => {
    setPage(1);
    setSelectedRows([]);
    setSelectedAttractions([]);
  }, [statusFilter]);

  // --- Queries
  const { data, isLoading } = useAttractions({
    search: debouncedSearch || undefined,
    statuses: statusFilter || undefined,
    page,
    limit: PAGE_SIZE,
  });

  const deleteMutation = useDeleteAttractions();

  // --- Derived
  const rows = data?.attractions ?? [];
  const total = data?.pagination?.total ?? 0;
  const editAttraction = selectedAttractions[0];

  const STATUS_OPTIONS = [
    { label: t("statuses.all"), value: "" },
    ...STATUS_VALUES.map((s) => ({ label: t(`statuses.${s}`), value: s })),
  ];

  // --- Columns
  const columns: ColumnDef<Attraction>[] = [
    {
      key: "qr",
      header: "QR",
      sortable: false,
      render: (row) => (
        <QrCodeCell
          attraction={row}
          onClick={(a) => { setQrAttraction(a); setOpenQr(true); }}
        />
      ),
    },
    {
      key: "name",
      header: t("columns.name"),
      sortable: false,
      render: (row) => (
        <div className="flex items-center gap-3">
          <ImagePreviewCell
            src={row.dashboard_file ? getFileUrl(row.dashboard_file) : ""}
            alt={row.name}
          />
          <div>
            <p
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/attraction/${row.id}`);
              }}
              style={{
                fontWeight: 500,
                color: "var(--text-default)",
                fontSize: 13,
                cursor: "pointer",
                textDecoration: "none",
                display: "inline",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.textDecoration =
                  "underline";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.textDecoration = "none";
              }}
            >
              {row.name}
            </p>
            {row.manufacturer && (
              <p style={{ fontSize: 11, color: "var(--text-muted)" }}>
                {row.manufacturer}
              </p>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "device",
      header: "девайс",
      sortable: false,
      render: (row) => (
        <span style={{ fontSize: 12, color: "var(--text-2)" }}>
          {row.device ?? <span style={{ color: "var(--text-muted)" }}>—</span>}
        </span>
      ),
    },
    {
      key: "age_limit",
      header: t("columns.minAge"),
      sortable: false,
      render: (row) =>
        row.age_limit ? (
          <span style={{ fontSize: 12, color: "var(--text-2)" }}>
            {row.age_limit}{" "}
            <span style={{ color: "var(--text-muted)" }}>{t("ageSuffix")}</span>
          </span>
        ) : (
          <span style={{ color: "var(--text-muted)" }}>—</span>
        ),
    },
    {
      key: "status",
      header: t("columns.status"),
      sortable: false,
      render: (row) => (
        <CusBadge status={STATUS_BADGE[row.status] ?? "fired"}>
          {t(`statuses.${row.status}`)}
        </CusBadge>
      ),
    },
    {
      key: "price",
      header: t("columns.price"),
      align: "right",
      sortable: true,
      render: (row) => (
        <span
          style={{
            fontWeight: 500,
            color: "var(--text-default)",
            fontSize: 13,
          }}
        >
          {row.price.toLocaleString()}{" "}
          <span style={{ fontSize: 11, color: "var(--text-muted)" }}>UZS</span>
        </span>
      ),
    },
    {
      key: "operator",
      header: t("columns.mainOperator"),
      sortable: false,
      render: (row) => {
        const mains = (row.operators ?? []).filter((o) => o.type === "main");
        if (mains.length === 0)
          return <span style={{ color: "var(--text-muted)" }}>—</span>;
        const first = mains[0];
        const extra = mains.length - 1;
        return (
          <div className="flex items-center gap-2">
            {first.file ? (
              <CusImagePreview
                src={getFileUrl(first.file)}
                alt={first.firstname}
                width={22}
                height={22}
                borderRadius="50%"
                objectFit="cover"
                preview={false}
              />
            ) : (
              <div
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  flexShrink: 0,
                  background: "var(--bg-hover)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 10,
                  fontWeight: 600,
                  color: "var(--text-muted)",
                }}
              >
                {first.firstname?.charAt(0)?.toUpperCase() ?? "?"}
              </div>
            )}
            <span style={{ fontSize: 12, color: "var(--text-2)" }}>
              {first.firstname} {first.lastname}
            </span>
            {extra > 0 && (
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  color: "var(--text-muted)",
                  background: "var(--bg-hover)",
                  borderRadius: 4,
                  padding: "1px 5px",
                  flexShrink: 0,
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
      render: (row) => (
        <span style={{ fontSize: 12, color: "var(--text-2)" }}>
          {row.description ?? (
            <span style={{ color: "var(--text-muted)" }}>—</span>
          )}
        </span>
      ),
    },
  ];

  console.log(selectedRows);
  return (
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
          {t("found", { count: total })}
        </span>
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

        <div className="flex gap-2 items-center">
          {selectedRows.length === 0 && (
            <CusButton
              size="xs"
              variant="solid"
              colorPalette="blue"
              onClick={() => setOpenAdd(true)}
            >
              <LuPlus size={13} /> {t("addNew")}
            </CusButton>
          )}
          {selectedRows.length === 1 && (
            <>
              <CusButton
                size="xs"
                variant="solid"
                colorPalette="orange"
                onClick={() => setOpenEdit(true)}
              >
                <LuPencil size={13} /> {t("edit")}
              </CusButton>
              <CusButton
                size="xs"
                variant="solid"
                colorPalette="red"
                onClick={() => setOpenDelete(true)}
              >
                <LuTrash2 size={13} /> {t("delete")}
              </CusButton>
              <button
                onClick={() => {
                  setSelectedRows([]);
                  setSelectedAttractions([]);
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
                onClick={() => setOpenDelete(true)}
              >
                <LuTrash2 size={13} /> {t("delete")} ({selectedRows.length})
              </CusButton>
              <button
                onClick={() => {
                  setSelectedRows([]);
                  setSelectedAttractions([]);
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
      <CusTable<Attraction>
        data={rows}
        columns={columns}
        showColumnBorder
        variant="outline"
        size="md"
        interactive
        selectable
        isLoading={isLoading}
        selectedRows={selectedRows}
        onSelectionChange={setSelectedRows}
        onSelectionRowsChange={setSelectedAttractions}
        emptyText={t("notFound")}
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

      <ModalQrCode
        open={openQr}
        onClose={() => setOpenQr(false)}
        attraction={qrAttraction}
      />
      <ModalAddAttraction open={openAdd} onClose={() => setOpenAdd(false)} />
      <CusDialogDelete
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        isLoading={deleteMutation.isPending}
        title={`${selectedRows.length > 1 ? selectedRows.length + " ta attraksion" : "Attraksion"}ni o'chirish`}
        description="O'chirilgan attraksion tiklanmaydi. Davom etasizmi?"
        onConfirm={() =>
          deleteMutation.mutate(selectedRows, {
            onSuccess: () => {
              setOpenDelete(false);
              setSelectedRows([]);
              setSelectedAttractions([]);
            },
          })
        }
      />
      {editAttraction && (
        <ModalEditAttraction
          open={openEdit}
          onClose={() => {
            setOpenEdit(false);
            setSelectedRows([]);
            setSelectedAttractions([]);
          }}
          attraction={editAttraction}
        />
      )}
    </div>
  );
}
