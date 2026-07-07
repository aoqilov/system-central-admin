import { useRef } from "react";
import { Dialog } from "@chakra-ui/react";
import { LuTriangleAlert } from "react-icons/lu";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CusDialog } from "@/components/ui/dialog/CusDialog";
import { CusButton } from "@/components/ui/buttons/CusButton";
import { deleteCards } from "../api/nfcApi";
import type { Card } from "../nfc.types";

interface Props {
  open: boolean;
  onClose: () => void;
  cards: Card[];
}

export function DeleteNfcDialog({ open, onClose, cards }: Props) {
  const qc = useQueryClient();

  const lastCards = useRef<Card[]>([]);
  if (cards.length > 0) lastCards.current = cards;
  const list = lastCards.current;

  const isBulk = list.length > 1;

  const deleteMut = useMutation({
    mutationFn: (ids: number[]) => deleteCards({ cardIDs: ids }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["nfc-cards"] });
      void qc.invalidateQueries({ queryKey: ["nfc-cards-stats"] });
      onClose();
    },
  });

  function handleConfirm() {
    if (list.length === 0) return;
    deleteMut.mutate(list.map((c) => c.id));
  }

  function handleClose() {
    if (deleteMut.isPending) return;
    onClose();
  }

  return (
    <CusDialog
      open={open}
      onClose={handleClose}
      title={isBulk ? `${list.length} ta kartani o'chirish` : "Kartani o'chirish"}
      size="sm"
      closeOnBackdrop={!deleteMut.isPending}
      footer={
        <>
          <Dialog.ActionTrigger asChild>
            <CusButton
              variant="outline"
              colorPalette="gray"
              isDisabled={deleteMut.isPending}
              onClick={handleClose}
            >
              Bekor qilish
            </CusButton>
          </Dialog.ActionTrigger>
          <CusButton
            colorPalette="red"
            isLoading={deleteMut.isPending}
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
                  {list.length} ta kartani o'chirasizmi?
                </p>
                <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                  Tanlangan barcha kartalar o'chirib tashlanadi.
                </p>
              </>
            ) : (
              <>
                <p className="text-sm font-medium" style={{ color: "var(--text-default)" }}>
                  Ushbu kartani o'chirasizmi?
                </p>
                <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                  Kod: <span className="font-mono">{list[0].card}</span>
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
