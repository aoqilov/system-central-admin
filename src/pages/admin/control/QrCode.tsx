import { useCallback, useEffect, useState, type ElementType } from "react";
import { LuQrCode } from "react-icons/lu";
import { IoQrCodeSharp } from "react-icons/io5";
import { useQrCodes } from "../../qr-code/hooks/useQrCodes";
import { PartyTabs } from "../../qr-code/components/PartyTabs";
import { QrFilters } from "../../qr-code/components/QrFilters";
import { QrTable } from "../../qr-code/components/QrTable";
import { GenerateBatchDialog } from "../../qr-code/modals/GenerateBatchDialog";
import { EditStatusDialog } from "../../qr-code/modals/EditStatusDialog";
import { DeleteConfirmDialog } from "../../qr-code/modals/DeleteConfirmDialog";
import type { QrCode as QrCodeType, QrStatus } from "../../qr-code/qr.types";

// ─── Stats ────────────────────────────────────────────────────────────────────

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: ElementType;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div
      className="rounded-xl p-4 flex items-center gap-3"
      style={{
        background: "var(--bg-second)",
        border: "1px solid var(--border-default)",
      }}
    >
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: `${color}18` }}
      >
        <Icon size={16} style={{ color }} />
      </div>
      <div>
        <p
          className="text-xl font-bold leading-none"
          style={{ color: "var(--text-default)" }}
        >
          {value}
        </p>
        <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
          {label}
        </p>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function QrCode() {
  const qr = useQrCodes();

  // Mock data'ni sahifa ochilganda yuklash va birinchi partiyani tanlash
  useEffect(() => {
    qr.refreshParties().then((list) => {
      if (list.length > 0) qr.selectParty(list[0].batchId);
    });
  }, []);

  // dialog state
  const [generateOpen, setGenerateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<QrCodeType | null>(null);
  const [deleteTargets, setDeleteTargets] = useState<QrCodeType[]>([]);

  // stats from all codes in active party
  const activeCount = qr.codes.filter((c) => c.status === "active").length;
  const insideCount = qr.codes.filter((c) => c.status === "user-active").length;
  const noActiveCount = qr.codes.filter((c) => c.status === "no-active").length;

  const handleGenerate = useCallback(
    async (dto: Parameters<typeof qr.generate>[0]) => {
      await qr.generate(dto);
    },
    [qr.generate],
  );

  const handleChangeStatus = useCallback(
    async (id: string, status: QrStatus) => {
      await qr.changeStatus(id, status);
    },
    [qr.changeStatus],
  );

  const handleDelete = useCallback(
    async (ids: string[]) => {
      await qr.removeMany(ids);
    },
    [qr.removeMany],
  );

  const handleEditOpen = useCallback(
    (codes: QrCodeType[]) => setEditTarget(codes[0] ?? null),
    [],
  );

  const handleDeleteOpen = useCallback(
    (codes: QrCodeType[]) => setDeleteTargets(codes),
    [],
  );

  return (
    <div className="p-4 tablet:p-6 space-y-5">
      {/* Header */}
      <div>
        <p className="text-xs mb-0.5" style={{ color: "var(--text-muted)" }}>
          Boshqaruv
        </p>
        <h1
          className="text-2xl font-semibold"
          style={{ color: "var(--text-default)" }}
        >
          QR Kod
        </h1>
        <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>
          Mehmonlar uchun kirish QR kodlarini yaratish va boshqarish.
        </p>
      </div>

      {/* Party tabs */}
      <div
        className="rounded-xl p-3"
        style={{
          background: "var(--bg-second)",
          border: "1px solid var(--border-default)",
        }}
      >
        <PartyTabs
          parties={qr.parties}
          activeBatchId={qr.activeBatchId}
          onSelect={qr.selectParty}
          onNewParty={() => setGenerateOpen(true)}
        />
      </div>

      {/* Stats — faqat partiya tanlanganda */}
      {qr.activeBatchId && (
        <div className="grid grid-cols-2 desktop:grid-cols-4 gap-3">
          <StatCard
            icon={IoQrCodeSharp}
            label="Jami"
            value={qr.codes.length}
            color="#64748b"
          />
          <StatCard
            icon={LuQrCode}
            label="Faolsiz"
            value={noActiveCount}
            color="#94a3b8"
          />
          <StatCard
            icon={LuQrCode}
            label="Faol"
            value={activeCount}
            color="#22c55e"
          />
          <StatCard
            icon={LuQrCode}
            label="Ichkarida"
            value={insideCount}
            color="#3b82f6"
          />
        </div>
      )}

      {/* Table area */}
      {qr.activeBatchId ? (
        <div
          className="rounded-xl"
          style={{
            background: "var(--bg-second)",
            border: "1px solid var(--border-default)",
          }}
        >
          {/* Filters */}
          <div
            className="p-4"
            style={{ borderBottom: "1px solid var(--border-default)" }}
          >
            <QrFilters filters={qr.filters} onChange={qr.setFilters} />
          </div>

          {/* Count info */}
          <div className="px-4 pt-3 pb-1 flex items-center justify-between">
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              {qr.total} ta kod
              {qr.filters.status !== "all" || qr.filters.search
                ? " (filtrlangan)"
                : ""}
            </p>
            <p className="text-xs" style={{ color: "var(--text-dim)" }}>
              Sahifada: {qr.pageSize}
            </p>
          </div>

          {/* Table */}
          <div className="px-4 pb-4">
            <QrTable
              data={qr.paged}
              total={qr.total}
              page={qr.page}
              pageSize={qr.pageSize}
              onPageChange={qr.setPage}
              onEdit={handleEditOpen}
              onDelete={handleDeleteOpen}
            />
          </div>
        </div>
      ) : (
        /* Empty state */
        <div
          className="rounded-xl flex flex-col items-center justify-center py-16 gap-3"
          style={{
            background: "var(--bg-second)",
            border: "1px solid var(--border-default)",
          }}
        >
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{ background: "var(--bg-hover)" }}
          >
            <IoQrCodeSharp size={28} style={{ color: "var(--text-dim)" }} />
          </div>
          <p
            className="text-sm font-medium"
            style={{ color: "var(--text-default)" }}
          >
            Hali partiya yaratilmagan
          </p>
          <p
            className="text-xs text-center max-w-xs"
            style={{ color: "var(--text-muted)" }}
          >
            "Yangi partiya" tugmasini bosib birinchi QR kodlar to'plamini
            yarating.
          </p>
        </div>
      )}

      {/* ── Dialogs ── */}
      <GenerateBatchDialog
        open={generateOpen}
        onClose={() => setGenerateOpen(false)}
        onGenerate={handleGenerate}
      />

      <EditStatusDialog
        open={editTarget !== null}
        onClose={() => setEditTarget(null)}
        code={editTarget}
        onSave={handleChangeStatus}
      />

      <DeleteConfirmDialog
        open={deleteTargets.length > 0}
        onClose={() => setDeleteTargets([])}
        codes={deleteTargets}
        onConfirm={handleDelete}
      />
    </div>
  );
}
