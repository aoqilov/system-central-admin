import { useState } from "react";
import { LuSend } from "react-icons/lu";
import { Dialog } from "@chakra-ui/react";
import { CusDialog } from "@/components/ui/dialog/CusDialog";
import { CusButton } from "@/components/ui/buttons/CusButton";
import { CusTextArea } from "@/components/ui/inputs/CusTextArea";
import { fmt } from "../types";

interface Props {
  open: boolean;
  date: string;
  attractionCount: number;
  totalRounds: number;
  totalCards: number;
  totalRevenue: number;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function SendToAccountingDialog({
  open, date, attractionCount, totalRounds, totalCards, totalRevenue, loading, onClose, onConfirm,
}: Props) {
  const [note, setNote] = useState("");

  function handleSend() {
    onConfirm();
    setNote("");
  }

  const rows = [
    { label: "Дата",         value: date },
    { label: "Привлечений",  value: `${attractionCount}` },
    { label: "Раундов",      value: `${totalRounds}` },
    { label: "Карт",         value: `${totalCards}` },
    { label: "Итого",        value: `${fmt(totalRevenue)} сум`, bold: true },
  ];

  return (
    <CusDialog
      open={open}
      onClose={onClose}
      title="Отправить в бухгалтерию"
      size="sm"
      footer={
        <>
          <Dialog.ActionTrigger asChild>
            <CusButton variant="outline">Отмена</CusButton>
          </Dialog.ActionTrigger>
          <CusButton colorPalette="blue" onClick={handleSend} isLoading={loading}>
            <LuSend size={14} /> Отправить
          </CusButton>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <div>
          {rows.map((row) => (
            <div
              key={row.label}
              className="flex justify-between py-2.5 border-b last:border-0"
              style={{ borderColor: "var(--border-default)" }}
            >
              <span className="text-sm" style={{ color: "var(--text-muted)" }}>{row.label}</span>
              <span className="text-sm" style={{ color: "var(--text-default)", fontWeight: row.bold ? 700 : 500 }}>
                {row.value}
              </span>
            </div>
          ))}
        </div>
        <CusTextArea
          label="Примечание (необязательно)"
          placeholder="Дополнительная информация..."
          autoresize
          maxH="120px"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>
    </CusDialog>
  );
}
