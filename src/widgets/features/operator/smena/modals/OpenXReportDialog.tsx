import { Dialog } from "@chakra-ui/react";
import { LuPlay, LuUser } from "react-icons/lu";
import { CusDialog } from "@/components/ui/dialog/CusDialog";
import { CusButton } from "@/components/ui/buttons/CusButton";
import { CusImagePreview } from "@/components/ui/image/CusImagePreview";
import { getFileUrl } from "@/widgets/api-global/files-route/filesApi";
import { fmtDate } from "@/utils/dateUtils";

interface Props {
  open: boolean;
  isPending: boolean;
  operatorName: string;
  operatorFile?: number | null;
  onClose: () => void;
  onConfirm: () => void;
}

export function OpenXReportDialog({
  open,
  isPending,
  operatorName,
  operatorFile,
  onClose,
  onConfirm,
}: Props) {
  const rows = [
    { label: "Sana", value: fmtDate(new Date()) },
    {
      label: "Boshlanish vaqti",
      value: new Date().toLocaleTimeString("uz-UZ", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
    },
  ];

  return (
    <CusDialog
      open={open}
      onClose={onClose}
      title="Yangi X-otchet ochish"
      description="Yangi ish sessiyasi boshlanadi."
      size="sm"
      footer={
        <>
          <Dialog.ActionTrigger asChild>
            <CusButton variant="outline" onClick={onClose} isDisabled={isPending}>
              Bekor qilish
            </CusButton>
          </Dialog.ActionTrigger>
          <CusButton colorPalette="green" onClick={onConfirm} isDisabled={isPending}>
            <LuPlay size={15} /> Ochish
          </CusButton>
        </>
      }
    >
      <div className="flex flex-col gap-0">
        {/* Operator card */}
        <div
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 mb-3"
          style={{ background: "var(--bg-hover)" }}
        >
          <div
            className="shrink-0 rounded-lg overflow-hidden flex items-center justify-center"
            style={{
              width: 44,
              height: 44,
              background: "var(--bg-input)",
            }}
          >
            {operatorFile ? (
              <CusImagePreview
                src={getFileUrl(operatorFile)}
                alt={operatorName}
                width={44}
                height={44}
                objectFit="cover"
                borderRadius={8}
                preview={false}
              />
            ) : (
              <LuUser size={20} style={{ color: "var(--text-muted)" }} />
            )}
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
              Ochayotgan xodim
            </span>
            <span className="text-sm font-semibold" style={{ color: "var(--text-default)" }}>
              {operatorName}
            </span>
          </div>
        </div>

        {/* Info rows */}
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
