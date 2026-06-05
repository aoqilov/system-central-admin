import { useRef, useState } from "react";
import { Dialog } from "@chakra-ui/react";
import { LuTriangleAlert } from "react-icons/lu";
import { CusDialog } from "../../../components/ui/dialog/CusDialog";
import { CusButton } from "../../../components/ui/buttons/CusButton";
import type { QrCode } from "../qr.types";

interface Props {
  open: boolean;
  onClose: () => void;
  codes: QrCode[];
  onConfirm: (ids: string[]) => Promise<void>;
}

export function DeleteConfirmDialog({ open, onClose, codes, onConfirm }: Props) {
  const [loading, setLoading] = useState(false);

  const lastCodes = useRef<QrCode[]>([]);
  if (codes.length > 0) lastCodes.current = codes;
  const list = lastCodes.current;

  const isBulk = list.length > 1;

  async function handleConfirm() {
    if (list.length === 0) return;
    setLoading(true);
    try {
      await onConfirm(list.map((c) => c.id));
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
      title={isBulk ? `${list.length} ta kodni o'chirish` : "Kodni o'chirish"}
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
      {list.length > 0 && (
        <div className="flex items-start gap-3">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
            style={{ background: "#ef444420" }}
          >
            <LuTriangleAlert size={16} style={{ color: "#ef4444" }} />
          </div>
          <div>
            {isBulk ? (
              <>
                <p className="text-sm font-medium" style={{ color: "var(--text-default)" }}>
                  {list.length} ta kodni o'chirasizmi?
                </p>
                <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                  Tanlangan barcha kodlar o'chirib tashlanadi.
                </p>
              </>
            ) : (
              <>
                <p className="text-sm font-medium" style={{ color: "var(--text-default)" }}>
                  Ushbu kodni o'chirasizmi?
                </p>
                <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                  Token:{" "}
                  <span className="font-mono">{list[0].token.slice(0, 8)}…</span>
                  {" · "}
                  Partiya: <strong>{list[0].partia}</strong>
                </p>
              </>
            )}
            <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
              Bu amalni ortga qaytarib bo'lmaydi.
            </p>
          </div>
        </div>
      )}
    </CusDialog>
  );
}
