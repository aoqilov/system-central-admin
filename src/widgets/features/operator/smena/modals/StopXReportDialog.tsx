import { Dialog } from "@chakra-ui/react";
import { LuPause } from "react-icons/lu";
import { CusDialog } from "@/components/ui/dialog/CusDialog";
import { CusButton } from "@/components/ui/buttons/CusButton";
import type { AttractionReport } from "../types";

interface Props {
  open: boolean;
  xreport: AttractionReport;
  index: number;
  onClose: () => void;
  onConfirm: () => void;
}

export function StopXReportDialog({ open, xreport, index, onClose, onConfirm }: Props) {
  const startTime = xreport.opened_at?.slice(11, 16) ?? "—";

  const rows = [
    { label: "Boshlanish vaqti", value: startTime },
    { label: "Jami aylanishlar", value: String(xreport.total_rounds) },
    { label: "Jami yo'lovchilar", value: String(xreport.total_people) },
  ];

  return (
    <CusDialog
      open={open}
      onClose={onClose}
      title={`X-otchet #${index} ni to'xtatish`}
      description="To'xtatilgandan so'ng davom ettirish mumkin."
      size="sm"
      footer={
        <>
          <Dialog.ActionTrigger asChild>
            <CusButton variant="outline" onClick={onClose}>
              Bekor qilish
            </CusButton>
          </Dialog.ActionTrigger>
          <CusButton colorPalette="yellow" onClick={onConfirm}>
            <LuPause size={15} /> To'xtatish
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
