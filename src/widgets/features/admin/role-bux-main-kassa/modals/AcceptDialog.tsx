import { Dialog } from "@chakra-ui/react";
import { LuCircleCheck } from "react-icons/lu";
import { CusDialog } from "@/components/ui/dialog/CusDialog";
import { CusButton } from "@/components/ui/buttons/CusButton";

interface Props {
  open: boolean;
  isPending?: boolean;
  parkName: string;
  dateLabel: string;
  kassaCount: number;
  kartaSum: number;
  totalWithDiscount: number;
  sentAt: string | null;
  onClose: () => void;
  onConfirm: () => void;
}

export function AcceptDialog({
  open,
  isPending,
  parkName,
  dateLabel,
  kassaCount,
  kartaSum,
  totalWithDiscount,
  sentAt,
  onClose,
  onConfirm,
}: Props) {
  const rows = [
    { label: "Парк",           value: parkName },
    { label: "Период",         value: dateLabel },
    { label: "Касс",           value: `${kassaCount} шт.` },
    ...(sentAt ? [{ label: "Отправлено", value: sentAt }] : []),
    { label: "Продано карт",   value: `${kartaSum} шт.` },
    {
      label: "Общая выручка",
      value: `${(totalWithDiscount / 1_000_000).toFixed(2)} млн сум`,
      bold: true,
    },
  ];

  return (
    <CusDialog
      open={open}
      onClose={onClose}
      title="Принятие кассового отчёта"
      description={`Вы подтверждаете получение и проверку отчёта за ${dateLabel}?`}
      size="sm"
      closeOnBackdrop={!isPending}
      footer={
        <>
          <Dialog.ActionTrigger asChild>
            <CusButton variant="outline" isDisabled={isPending} onClick={onClose}>
              Отмена
            </CusButton>
          </Dialog.ActionTrigger>
          <CusButton colorPalette="green" isLoading={isPending} onClick={onConfirm}>
            <LuCircleCheck size={14} /> Принять
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
              style={{ color: "var(--text-default)", fontWeight: row.bold ? 700 : 500 }}
            >
              {row.value}
            </span>
          </div>
        ))}
      </div>
    </CusDialog>
  );
}
