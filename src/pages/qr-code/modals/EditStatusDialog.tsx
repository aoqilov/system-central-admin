import { useRef, useState } from "react";
import { Dialog } from "@chakra-ui/react";
import dayjs from "dayjs";
import { CusDialog } from "../../../components/ui/dialog/CusDialog";
import { CusButton } from "../../../components/ui/buttons/CusButton";
import CusSelect from "../../../components/ui/select/CusSelect";
import { QR_STATUS_META, TRANSITIONS, type QrCode, type QrStatus } from "../qr.types";

interface Props {
  open: boolean;
  onClose: () => void;
  code: QrCode | null;
  onSave: (id: string, status: QrStatus) => Promise<void>;
}

export function EditStatusDialog({ open, onClose, code, onSave }: Props) {
  const [nextStatus, setNextStatus] = useState<QrStatus | "">("");
  const [loading, setLoading] = useState(false);

  // Close animatsiyasi paytida kontent yo'qolib ketmasin
  const lastCode = useRef<QrCode | null>(null);
  if (code) lastCode.current = code;
  const c = lastCode.current;

  const allowed = c ? TRANSITIONS[c.status] : ([] as QrStatus[]);
  const options = allowed.map((s) => ({
    value: s,
    label: QR_STATUS_META[s].label,
  }));
  const selectedStatus = (nextStatus || (allowed[0] ?? "")) as QrStatus;

  async function handleSave() {
    if (!c) return;
    setLoading(true);
    try {
      await onSave(c.id, selectedStatus);
      setNextStatus("");
      onClose();
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    if (loading) return;
    setNextStatus("");
    onClose();
  }

  return (
    <CusDialog
      open={open}
      onClose={handleClose}
      title="Status o'zgartirish"
      size="sm"
      footer={
        <>
          <Dialog.ActionTrigger asChild>
            <CusButton
              variant="outline"
              colorPalette="gray"
              isDisabled={loading}
              onClick={handleClose}
            >
              Bekor qilish
            </CusButton>
          </Dialog.ActionTrigger>
          <CusButton
            colorPalette="blue"
            isLoading={loading}
            isDisabled={!c || allowed.length === 0}
            onClick={handleSave}
          >
            Saqlash
          </CusButton>
        </>
      }
    >
      {c && (
        <div className="space-y-4">
          {/* Read-only info */}
          <div
            className="rounded-lg p-3 space-y-2 text-sm"
            style={{ background: "var(--bg-main)", border: "1px solid var(--border-default)" }}
          >
            <div className="flex justify-between">
              <span style={{ color: "var(--text-muted)" }}>Raqam</span>
              <span className="font-mono text-xs font-semibold" style={{ color: "var(--text-default)" }}>
                {c.token.slice(0, 8)}…
              </span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: "var(--text-muted)" }}>Partiya</span>
              <span style={{ color: "var(--text-default)" }}>{c.partia}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: "var(--text-muted)" }}>Joriy status</span>
              <span style={{ color: "var(--text-default)" }}>
                {QR_STATUS_META[c.status].label}
              </span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: "var(--text-muted)" }}>Yaratilgan</span>
              <span style={{ color: "var(--text-default)" }}>
                {dayjs(c.createdAt).format("DD.MM.YYYY HH:mm")}
              </span>
            </div>
          </div>

          {/* Status selector */}
          {options.length > 0 ? (
            <CusSelect
              label="Yangi status"
              value={nextStatus || (allowed[0] ?? "")}
              onChange={(v) => setNextStatus(v as QrStatus)}
              options={options}
              disabled={loading}
            />
          ) : (
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Bu status uchun o'tish mavjud emas.
            </p>
          )}
        </div>
      )}
    </CusDialog>
  );
}
