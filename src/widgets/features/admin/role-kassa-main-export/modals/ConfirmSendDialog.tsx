import { Dialog } from "@chakra-ui/react";
import { LuSend } from "react-icons/lu";
import { CusDialog } from "@/components/ui/dialog/CusDialog";
import { CusButton } from "@/components/ui/buttons/CusButton";

interface Props {
  open: boolean;
  isPending?: boolean;
  dateLabel: string;
  parkName: string;
  kassaCount: number;
  kartaSold: number;
  totalAmount: number;
  onClose: () => void;
  onConfirm: () => void;
}

export function ConfirmSendDialog({
  open,
  isPending,
  dateLabel,
  parkName,
  kassaCount,
  kartaSold,
  totalAmount,
  onClose,
  onConfirm,
}: Props) {
  const rows = [
    { label: "Парк",           value: parkName },
    { label: "Период",         value: dateLabel },
    { label: "Касс",           value: `${kassaCount} шт.` },
    { label: "Продано карт",   value: `${kartaSold} шт.` },
    {
      label: "Общая выручка",
      value: `${(totalAmount / 1_000_000).toFixed(2)} млн сум`,
      bold: true,
    },
  ];

  return (
    <CusDialog
      open={open}
      onClose={onClose}
      title="Отправка в бухгалтерию"
      description={`Данные за ${dateLabel} будут отправлены в бухгалтерию. Подтверждаете?`}
      size="sm"
      closeOnBackdrop={!isPending}
      footer={
        <>
          <Dialog.ActionTrigger asChild>
            <CusButton
              variant="outline"
              isDisabled={isPending}
              onClick={onClose}
            >
              Отмена
            </CusButton>
          </Dialog.ActionTrigger>
          <CusButton
            colorPalette="blue"
            isLoading={isPending}
            onClick={onConfirm}
          >
            <LuSend size={14} /> Отправить
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
            <span
              className="text-sm"
              style={{
                color: "var(--text-default)",
                fontWeight: row.bold ? 700 : 500,
              }}
            >
              {row.value}
            </span>
          </div>
        ))}
      </div>
    </CusDialog>
  );
}
