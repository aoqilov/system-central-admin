import { Dialog } from "@chakra-ui/react";
import { LuPower } from "react-icons/lu";
import { CusDialog } from "@/components/ui/dialog/CusDialog";
import { CusButton } from "@/components/ui/buttons/CusButton";
import { fmtDate } from "@/utils/dateUtils";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function OpenSmenaDialog({ open, onClose, onConfirm }: Props) {
  const rows = [
    { label: "Sana", value: fmtDate(new Date()) },
    {
      label: "Boshlanish vaqti",
      value: new Date().toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" }),
    },
  ];

  return (
    <CusDialog
      open={open}
      onClose={onClose}
      title="Yangi smena ochish"
      description="Quyidagi ma'lumotlar bilan yangi smena boshlanadi."
      size="sm"
      footer={
        <>
          <Dialog.ActionTrigger asChild>
            <CusButton variant="outline" onClick={onClose}>
              Bekor qilish
            </CusButton>
          </Dialog.ActionTrigger>
          <CusButton colorPalette="green" onClick={onConfirm}>
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
