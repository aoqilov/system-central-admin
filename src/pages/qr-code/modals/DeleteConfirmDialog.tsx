import { useRef, useState } from "react";
import { Dialog } from "@chakra-ui/react";
import { LuTriangleAlert } from "react-icons/lu";
import { CusDialog } from "../../../components/ui/dialog/CusDialog";
import { CusButton } from "../../../components/ui/buttons/CusButton";
import type { QrCode } from "../qr.types";

interface Props {
  open: boolean;
  onClose: () => void;
  code: QrCode | null;
  onConfirm: (id: string) => Promise<void>;
}

export function DeleteConfirmDialog({ open, onClose, code, onConfirm }: Props) {
  const [loading, setLoading] = useState(false);

  // Close animatsiyasi paytida kontent yo'qolib ketmasin
  const lastCode = useRef<QrCode | null>(null);
  if (code) lastCode.current = code;
  const c = lastCode.current;

  async function handleConfirm() {
    if (!c) return;
    setLoading(true);
    try {
      await onConfirm(c.id);
      onClose();
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    if (loading) return;
    onClose();
  }

  return (
    <CusDialog
      open={open}
      onClose={handleClose}
      title="Kodni o'chirish"
      size="sm"
      closeOnBackdrop={!loading}
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
            colorPalette="red"
            isLoading={loading}
            onClick={handleConfirm}
          >
            O'chirish
          </CusButton>
        </>
      }
    >
      {c && (
        <div className="flex items-start gap-3">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
            style={{ background: "#ef444420" }}
          >
            <LuTriangleAlert size={16} style={{ color: "#ef4444" }} />
          </div>
          <div>
            <p className="text-sm font-medium" style={{ color: "var(--text-default)" }}>
              Ushbu kodni o'chirasizmi?
            </p>
            <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
              Token:{" "}
              <span className="font-mono">{c.token.slice(0, 8)}…</span>
              {" · "}
              Partiya: <strong>{c.partia}</strong>
            </p>
            <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
              Bu amalni ortga qaytarib bo'lmaydi.
            </p>
          </div>
        </div>
      )}
    </CusDialog>
  );
}
