import { Dialog } from "@chakra-ui/react";
import { LuPower } from "react-icons/lu";
import { CusDialog } from "@/components/ui/dialog/CusDialog";
import { CusButton } from "@/components/ui/buttons/CusButton";
import type { AttractionReport } from "../types";
import { fmt } from "../types";

interface Props {
  open: boolean;
  zreport: AttractionReport;
  onClose: () => void;
  onConfirm: () => void;
}

export function CloseSmenaDialog({ open, zreport, onClose, onConfirm }: Props) {
  const rows = [
    { label: "Jami aylanishlar", value: String(zreport.total_rounds) },
    { label: "Jami yo'lovchilar", value: String(zreport.total_people) },
    { label: "Jami summa", value: `${fmt(zreport.total_amount)} сум` },
  ];

  return (
    <CusDialog
      open={open}
      onClose={onClose}
      title="Smenani yopish"
      description="Smenani yopishni tasdiqlang. Barcha ma'lumotlar saqlanadi."
      size="sm"
      footer={
        <>
          <Dialog.ActionTrigger asChild>
            <CusButton variant="outline" onClick={onClose}>
              Bekor qilish
            </CusButton>
          </Dialog.ActionTrigger>
          <CusButton colorPalette="red" onClick={onConfirm}>
            <LuPower size={15} /> Yopish
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
