import { useRef, useState } from "react";
import { Dialog } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CusDialog } from "@/components/ui/dialog/CusDialog";
import { CusButton } from "@/components/ui/buttons/CusButton";
import CusSelect from "@/components/ui/select/CusSelect";
import { CARD_STATUS_META, type Card, type CardStatus } from "../nfc.types";
import { updateCard } from "../api/nfcApi";

const STATUS_OPTIONS = Object.entries(CARD_STATUS_META).map(([key, meta]) => ({
  value: key,
  label: meta.label,
}));

interface Props {
  open: boolean;
  onClose: () => void;
  card: Card | null;
}

export function EditNfcStatusDialog({ open, onClose, card }: Props) {
  const qc = useQueryClient();
  const [nextStatus, setNextStatus] = useState<CardStatus | "">("");

  const lastCard = useRef<Card | null>(null);
  if (card) lastCard.current = card;
  const c = lastCard.current;

  const selectedStatus = (nextStatus || c?.status || "") as CardStatus;

  const updateMut = useMutation({
    mutationFn: (status: CardStatus) => updateCard(c!.id, { status }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["nfc-cards"] });
      void qc.invalidateQueries({ queryKey: ["nfc-cards-stats"] });
      setNextStatus("");
      onClose();
    },
  });

  function handleSave() {
    if (!c || !selectedStatus) return;
    updateMut.mutate(selectedStatus);
  }

  function handleClose() {
    if (updateMut.isPending) return;
    setNextStatus("");
    onClose();
  }

  return (
    <CusDialog
      open={open}
      onClose={handleClose}
      title="Status o'zgartirish"
      size="sm"
      closeOnBackdrop={!updateMut.isPending}
      footer={
        <>
          <Dialog.ActionTrigger asChild>
            <CusButton
              variant="outline"
              colorPalette="gray"
              isDisabled={updateMut.isPending}
              onClick={handleClose}
            >
              Bekor qilish
            </CusButton>
          </Dialog.ActionTrigger>
          <CusButton
            colorPalette="blue"
            isLoading={updateMut.isPending}
            isDisabled={!c || !selectedStatus || updateMut.isPending}
            onClick={handleSave}
          >
            Saqlash
          </CusButton>
        </>
      }
    >
      {c && (
        <div className="space-y-4">
          <div
            className="rounded-lg p-3 space-y-2 text-sm"
            style={{
              background: "var(--bg-main)",
              border: "1px solid var(--border-default)",
            }}
          >
            <div className="flex justify-between">
              <span style={{ color: "var(--text-muted)" }}>Karta kodi</span>
              <span
                className="font-mono text-xs font-semibold"
                style={{ color: "var(--text-default)" }}
              >
                {c.code}
              </span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: "var(--text-muted)" }}>Joriy status</span>
              <span style={{ color: "var(--text-default)" }}>
                {CARD_STATUS_META[c.status].label}
              </span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: "var(--text-muted)" }}>Yaratilgan</span>
              <span style={{ color: "var(--text-default)" }}>
                {dayjs(c.createdAt).format("DD.MM.YYYY HH:mm")}
              </span>
            </div>
          </div>

          <CusSelect
            label="Yangi status"
            value={selectedStatus}
            onChange={(v) => setNextStatus(v as CardStatus)}
            options={STATUS_OPTIONS}
            disabled={updateMut.isPending}
          />
        </div>
      )}
    </CusDialog>
  );
}
