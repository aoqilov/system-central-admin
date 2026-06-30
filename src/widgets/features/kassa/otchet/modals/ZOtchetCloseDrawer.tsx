import { LuPrinter, LuX } from "react-icons/lu";
import { CusDrawer } from "@/components/ui/dialog/CusDrawer";
import { CusButton } from "@/components/ui/buttons/CusButton";
import { fmt, type PaySummary } from "../otchet.helpers";

interface Props {
  open: boolean;
  isPending: boolean;
  onClose: () => void;
  date: string;
  summary: PaySummary;
  onPrint: () => void;
  onConfirm: () => void;
}

export function ZOtchetCloseDrawer({
  open,
  isPending,
  onClose,
  date,
  summary,
  onPrint,
  onConfirm,
}: Props) {
  const rows = [
    { label: "Jami daromad",        value: `${fmt(summary.total)} so'm`,          bold: true },
    { label: "Naqd",                value: `${fmt(summary.naqd)} so'm` },
    { label: "UzCard",              value: `${fmt(summary.uzcard)} so'm` },
    { label: "Humo",                value: `${fmt(summary.humo)} so'm` },
    { label: "UzumBank",            value: `${fmt(summary.uzumbank)} so'm` },
    { label: "Click",               value: `${fmt(summary.click)} so'm` },
    { label: "Payme",               value: `${fmt(summary.payme)} so'm` },
    { label: "Tranzaksiyalar",      value: `${summary.txCount} ta` },
    { label: "Karta sotildi",       value: `${summary.kartaSotildi} ta` },
    { label: "Karta registratsiya", value: `${summary.kartaReg} ta` },
  ];

  return (
    <CusDrawer
      open={open}
      onClose={onClose}
      title={`Z-otchet yakunlash · ${date}`}
      placement="bottom"
      size="md"
      closeOnBackdrop={false}
      footer={
        <>
          <CusButton variant="outline" isDisabled={isPending} onClick={onPrint}>
            <LuPrinter size={15} /> Chop etish
          </CusButton>
          <CusButton colorPalette="red" isLoading={isPending} onClick={onConfirm}>
            <LuX size={15} /> Yakunlash
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
              style={{ color: "var(--text-default)", fontWeight: row.bold ? 700 : 600 }}
            >
              {row.value}
            </span>
          </div>
        ))}
      </div>
    </CusDrawer>
  );
}
