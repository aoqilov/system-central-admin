import { useState } from "react";
import { Dialog } from "@chakra-ui/react";
import { LuClock } from "react-icons/lu";
import { CusDialog } from "@/components/ui/dialog/CusDialog";
import { CusButton } from "@/components/ui/buttons/CusButton";
import { CusTextArea } from "@/components/ui/inputs/CusTextArea";

interface Props {
  open: boolean;
  isPending: boolean;
  onClose: () => void;
  onConfirm: (description: string) => void;
}

export function PauseXOtchetDialog({ open, isPending, onClose, onConfirm }: Props) {
  const [description, setDescription] = useState("");

  function handleClose() {
    setDescription("");
    onClose();
  }

  function handleConfirm() {
    onConfirm(description.trim());
    setDescription("");
  }

  return (
    <CusDialog
      open={open}
      onClose={handleClose}
      title="Приостановить X-отчёт"
      description="Во время паузы приём платежей будет недоступен."
      size="sm"
      footer={
        <>
          <Dialog.ActionTrigger asChild>
            <CusButton variant="outline" colorPalette="gray" isDisabled={isPending} onClick={handleClose}>
              Отмена
            </CusButton>
          </Dialog.ActionTrigger>
          <CusButton colorPalette="orange" leftIcon={<LuClock size={14} />} isLoading={isPending} onClick={handleConfirm}>
            Приостановить
          </CusButton>
        </>
      }
    >
      <CusTextArea
        label="Причина (необязательно)"
        placeholder="Укажите причину паузы..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={3}
        disabled={isPending}
      />
    </CusDialog>
  );
}
