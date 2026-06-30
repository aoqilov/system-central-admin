import { Dialog } from "@chakra-ui/react";
import { fmtDate } from "@/utils/dateUtils";
import { LuPower } from "react-icons/lu";
import { CusDialog } from "@/components/ui/dialog/CusDialog";
import { CusButton } from "@/components/ui/buttons/CusButton";

interface Props {
  open: boolean;
  isPending: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function OpenXOtchetDialog({ open, isPending, onClose, onConfirm }: Props) {
  const rows = [
    { label: "Sana",            value: fmtDate(new Date()) },
    { label: "Boshlanish vaqti", value: new Date().toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit", second: "2-digit" }) },
  ];

  return (
    <CusDialog
      open={open}
      onClose={onClose}
      title="Yangi X-otchet ochish"
      description="Quyidagi ma'lumotlar bilan yangi X-otchet boshlanadi."
      size="sm"
      closeOnBackdrop={!isPending}
      footer={
        <>
          <Dialog.ActionTrigger asChild>
            <CusButton variant="outline" isDisabled={isPending} onClick={onClose}>
              Bekor qilish
            </CusButton>
          </Dialog.ActionTrigger>
          <CusButton colorPalette="green" isLoading={isPending} onClick={onConfirm}>
            <LuPower size={15} /> Ochish
          </CusButton>
        </>
      }
    >
      <div className="flex flex-col gap-0">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex justify-between py-2.5 border-b last:border-0"
            style={{ borderColor: "var(--border-default)" }}
          >
            <span className="text-sm" style={{ color: "var(--text-muted)" }}>
              {row.label}
            </span>
            <span className="text-sm font-medium" style={{ color: "var(--text-default)" }}>
              {row.value}
            </span>
          </div>
        ))}
      </div>
    </CusDialog>
  );
}
