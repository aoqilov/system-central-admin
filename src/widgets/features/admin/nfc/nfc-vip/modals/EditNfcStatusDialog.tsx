import { useRef, useState } from "react";
import { Dialog } from "@chakra-ui/react";
import { fmtDateTime } from "@/utils/dateUtils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CusDialog } from "@/components/ui/dialog/CusDialog";
import { CusButton } from "@/components/ui/buttons/CusButton";
import CusSelect from "@/components/ui/select/CusSelect";
import { NfcStatusBadge } from "../components/NfcStatusBadge";
import { CARD_STATUS_META, type Card, type CardStatus } from "../nfc.types";
import { updateCard } from "@/api/cards/cards.api";

const STATUS_OPTIONS = Object.entries(CARD_STATUS_META).map(([key, meta]) => ({
  value: key,
  label: meta.label,
}));

interface Props {
  open: boolean;
  onClose: () => void;
  card: Card | null;
  batchName?: string;
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div
      className="flex items-center justify-between py-2.5"
      style={{ borderBottom: "1px solid var(--border-default)" }}
    >
      <span className="text-xs" style={{ color: "var(--text-muted)" }}>
        {label}
      </span>
      <span className="text-xs font-medium text-right" style={{ color: "var(--text-default)" }}>
        {value}
      </span>
    </div>
  );
}

export function EditNfcStatusDialog({ open, onClose, card, batchName }: Props) {
  const qc = useQueryClient();
  const [nextStatus, setNextStatus] = useState<CardStatus | "">("");

  const lastCard = useRef<Card | null>(null);
  if (card) lastCard.current = card;
  const c = lastCard.current;

  const selectedStatus = (nextStatus || c?.status || "") as CardStatus;

  const updateMut = useMutation({
    mutationFn: (status: CardStatus) => updateCard(c!.id, { status }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["nfc-vip-cards"] });
      void qc.invalidateQueries({ queryKey: ["nfc-vip-cards-stats"] });
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
      title="Изменить статус"
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
              Отмена
            </CusButton>
          </Dialog.ActionTrigger>
          <CusButton
            colorPalette="blue"
            isLoading={updateMut.isPending}
            isDisabled={!c || !selectedStatus || updateMut.isPending}
            onClick={handleSave}
          >
            Сохранить
          </CusButton>
        </>
      }
    >
      {c && (
        <div className="space-y-4">
          {/* Status select — top */}
          <CusSelect
            label="Новый статус"
            value={selectedStatus}
            onChange={(v) => setNextStatus(v as CardStatus)}
            options={STATUS_OPTIONS}
            disabled={updateMut.isPending}
          />

          {/* All card info */}
          <div
            className="rounded-xl overflow-hidden"
            style={{ border: "1px solid var(--border-default)" }}
          >
            {/* Card header */}
            <div
              className="flex items-center justify-between px-4 py-3"
              style={{ background: "var(--bg-hover)" }}
            >
              <div>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  VIP карта
                </p>
                <p
                  className="text-base font-bold font-mono"
                  style={{ color: "var(--text-default)" }}
                >
                  #{c.id}
                </p>
              </div>
              <NfcStatusBadge status={c.status} />
            </div>

            {/* Info rows */}
            <div className="px-4 [&>div:last-child]:border-0">
              {c.owner && (
                <InfoRow
                  label="Кому выдана"
                  value={c.owner}
                />
              )}
              <InfoRow
                label="Код карты"
                value={<span className="font-mono">{c.card}</span>}
              />
              <InfoRow
                label="NFC код"
                value={<span className="font-mono tracking-wider">{c.nfc}</span>}
              />
              <InfoRow
                label="Партия"
                value={
                  <span>
                    {batchName ?? `Batch ${c.batch}`}
                    <span
                      className="ml-1.5 font-mono"
                      style={{ color: "var(--text-muted)" }}
                    >
                      #{c.batch}
                    </span>
                  </span>
                }
              />
              <InfoRow
                label="Создан"
                value={fmtDateTime(c.imported_at)}
              />
              <InfoRow
                label="Активирован"
                value={
                  c.activated_at ? (
                    fmtDateTime(c.activated_at)
                  ) : (
                    <span style={{ color: "var(--text-muted)" }}>Не активирована</span>
                  )
                }
              />
            </div>
          </div>
        </div>
      )}
    </CusDialog>
  );
}
