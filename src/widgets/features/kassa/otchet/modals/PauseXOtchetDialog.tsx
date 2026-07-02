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
  onConfirm: () => void;
}

export function PauseXOtchetDialog({ open, isPending, onClose, onConfirm }: Props) {
  const [reason, setReason] = useState("");

  function handleClose() {
    setReason("");
    onClose();
  }

  function handleConfirm() {
    setReason("");
    onConfirm();
  }

  return (
    <CusDialog
      open={open}
      onClose={handleClose}
      title="X-otchetni to'xtatish"
      description="X-otchetni to'xtatib turmoqchimisiz? To'xtatilgan vaqtda to'lovlar qabul qilinmaydi."
      size="sm"
      footer={
        <>
          <Dialog.ActionTrigger asChild>
            <CusButton variant="outline" isDisabled={isPending} onClick={handleClose}>
              Bekor qilish
            </CusButton>
          </Dialog.ActionTrigger>
          <CusButton colorPalette="orange" isLoading={isPending} onClick={handleConfirm}>
            <LuClock size={15} /> To'xtatish
          </CusButton>
        </>
      }
    >
      <div className="flex flex-col gap-3">
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          To'xtatilgan X-otchetni Otchet sahifasidan qayta davom ettirishingiz
          mumkin. Tolov qilish va Smena bo'limlari o'chiriladi.
        </p>
      </div>
    </CusDialog>
  );
}
